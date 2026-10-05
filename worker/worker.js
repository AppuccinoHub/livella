// Livella Worker: the go-between that holds the Anthropic API key.
// Settings (Cloudflare dashboard → this Worker → Settings → Variables and Secrets):
//   ANTHROPIC_API_KEY  (Secret)  your Anthropic API key
//   PASSCODE           (Secret)  the teacher passcode you hand out
//   ALLOWED_ORIGINS    (Text)    sites allowed to call this, comma-separated, e.g. https://appuccinohub.github.io
//   MODEL              (Text, optional)  defaults to claude-sonnet-5-5
export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = (env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
    const okOrigin = allowed.includes(origin);
    const cors = {
      "Access-Control-Allow-Origin": okOrigin ? origin : (allowed[0] || "null"),
      "Access-Control-Allow-Headers": "content-type, x-livella-passcode",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin",
    };
    const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", ...cors } });

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method === "GET") {
      // Health check: open the Worker address in a browser to see what is still missing.
      const k = (env.ANTHROPIC_API_KEY || "").trim();
      return json(200, { ok: true, service: "livella", key: !!k, keyLooksRight: k.startsWith("sk-ant-") && k.length > 60, passcode: !!env.PASSCODE, origins: allowed.length, build: 2 });
    }
    if (request.method !== "POST") return json(405, { ok: false, code: "method" });
    if (!okOrigin) return json(403, { ok: false, code: "origin", message: "this site is not on the allowed list" });
    // Pasted secrets often carry a stray space or line break; ignore them.
    const apiKey = (env.ANTHROPIC_API_KEY || "").trim();
    const passcode = (env.PASSCODE || "").trim();
    if (!passcode || (request.headers.get("x-livella-passcode") || "").trim() !== passcode) return json(401, { ok: false, code: "passcode" });
    if (!apiKey) return json(500, { ok: false, code: "no_key", message: "ANTHROPIC_API_KEY is not set" });
    if (!apiKey.startsWith("sk-ant-")) return json(500, { ok: false, code: "key_format", message: "the stored key does not start with sk-ant-" });

    let body;
    try { body = await request.json(); } catch (e) { return json(400, { ok: false, code: "bad_json" }); }
    const m = body && body.messages;
    if (!Array.isArray(m) || m.length !== 2 || typeof m[0].content !== "string" || typeof m[1].content !== "string") return json(400, { ok: false, code: "bad_request" });
    if (m[0].content.length + m[1].content.length > 80000) return json(413, { ok: false, code: "too_long", message: "the text is too long" });
    const images = Array.isArray(body.images) ? body.images.slice(0, 4) : [];
    for (const im of images) {
      if (!im || typeof im.data !== "string" || !/^image\/(jpeg|png|webp|gif)$/.test(im.media_type) || im.data.length > 7000000) return json(400, { ok: false, code: "image_rejected" });
    }

    const content = images.map((im) => ({ type: "image", source: { type: "base64", media_type: im.media_type, data: im.data } }));
    content.push({ type: "text", text: m[1].content });

    let upstream;
    try {
      upstream = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({ model: env.MODEL || "claude-sonnet-5-5", max_tokens: 12000, system: m[0].content, messages: [{ role: "user", content }] }),
      });
    } catch (e) { return json(502, { ok: false, code: "upstream_network" }); }
    if (upstream.status === 429 || upstream.status === 529) return json(429, { ok: false, code: "rate_limited" });
    const out = await upstream.json().catch(() => null);
    if (!upstream.ok || !out) return json(502, { ok: false, code: "upstream_" + upstream.status, message: (out && out.error && out.error.message) || "" });

    const text = (out.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
    const a = text.indexOf("{"), z = text.lastIndexOf("}");
    if (a < 0 || z <= a) return json(502, { ok: false, code: "invalid_json", message: out.stop_reason || "" });
    try { return json(200, { ok: true, data: JSON.parse(text.slice(a, z + 1)) }); }
    catch (e) { return json(502, { ok: false, code: "invalid_json", message: out.stop_reason || "" }); }
  },
};
