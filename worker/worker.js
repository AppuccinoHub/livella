// Livella Worker: the go-between that holds the Anthropic API key.
// Settings (Cloudflare dashboard → this Worker → Settings → Variables and Secrets):
//   ANTHROPIC_API_KEY  (Secret)  your Anthropic API key
//   PASSCODE           (Secret)  the teacher passcode you hand out
//   ALLOWED_ORIGINS    (Text)    sites allowed to call this, comma-separated, e.g. https://appuccinohub.github.io
//   MODEL              (Text, optional)  defaults to claude-sonnet-5-5
//   LESSONS            (KV storage)      shared lessons, set up by wrangler.jsonc; each is deleted after 90 days
export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = (env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
    const okOrigin = allowed.includes(origin);
    const cors = {
      "Access-Control-Allow-Origin": okOrigin ? origin : (allowed[0] || "null"),
      "Access-Control-Allow-Headers": "content-type, x-livella-passcode",
      "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin",
    };
    const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", ...cors } });

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    // ----- Shared lessons: anyone with the link can read; saving needs the teacher passcode -----
    const path = new URL(request.url).pathname;
    const lm = path.match(/^\/lesson(?:\/([a-z0-9]{8,24}))?$/);
    if (lm) {
      if (!env.LESSONS) return json(501, { ok: false, code: "no_storage", message: "lesson storage is not set up" });
      if (!okOrigin) return json(403, { ok: false, code: "origin" });
      const id = lm[1];
      if (request.method === "GET") {
        if (!id) return json(400, { ok: false, code: "bad_request" });
        const raw = await env.LESSONS.get("lesson:" + id);
        if (!raw) return json(404, { ok: false, code: "not_found", message: "no lesson at this link; it may have expired" });
        return json(200, { ok: true, id, lesson: JSON.parse(raw) });
      }
      if (request.method === "POST" || request.method === "PUT") {
        const pc = (env.PASSCODE || "").trim();
        if (!pc || (request.headers.get("x-livella-passcode") || "").trim() !== pc) return json(401, { ok: false, code: "passcode" });
        const text = await request.text();
        if (text.length > 400000) return json(413, { ok: false, code: "too_long", message: "the lesson is too large to share" });
        let body; try { body = JSON.parse(text); } catch (e) { return json(400, { ok: false, code: "bad_json" }); }
        const lesson = body && body.lesson;
        if (!lesson || typeof lesson !== "object" || !lesson.result || typeof lesson.result.passage !== "string") return json(400, { ok: false, code: "bad_request" });
        let useId = id;
        if (request.method === "PUT") {
          if (!id) return json(400, { ok: false, code: "bad_request" });
          if (!(await env.LESSONS.get("lesson:" + id))) return json(404, { ok: false, code: "not_found" });
        } else {
          const bytes = crypto.getRandomValues(new Uint8Array(12));
          useId = Array.from(bytes, (b) => "abcdefghijkmnpqrstuvwxyz23456789"[b % 32]).join("");
        }
        lesson.updatedAt = Date.now();
        await env.LESSONS.put("lesson:" + useId, JSON.stringify(lesson), { expirationTtl: 60 * 60 * 24 * 90 });
        return json(200, { ok: true, id: useId });
      }
      return json(405, { ok: false, code: "method" });
    }
    if (request.method === "GET") {
      // Free diagnostic: asks Anthropic whether the stored key and the model name are accepted.
      // Reports status codes only; uses no tokens.
      if (new URL(request.url).pathname === "/diag") {
        const key = (env.ANTHROPIC_API_KEY || "").trim();
        const model = env.MODEL || "claude-sonnet-5-5";
        const h = { "x-api-key": key, "anthropic-version": "2023-06-01" };
        const out = { ok: true, model, keyLength: key.length, keyEndsCleanly: /^[A-Za-z0-9_-]+$/.test(key) };
        try {
          const r1 = await fetch("https://api.anthropic.com/v1/models?limit=100", { headers: h });
          out.keyStatus = r1.status;
          const j1 = await r1.json().catch(() => null);
          if (r1.ok && j1 && Array.isArray(j1.data)) out.models = j1.data.map((m) => m.id);
          else out.keyError = (j1 && j1.error && (j1.error.type + ": " + j1.error.message)) || "";
          const r2 = await fetch("https://api.anthropic.com/v1/models/" + model, { headers: h });
          out.modelStatus = r2.status;
        } catch (e) { out.network = String(e && e.message || e); }
        return json(200, out);
      }
      // Health check: open the Worker address in a browser to see what is still missing.
      const k = (env.ANTHROPIC_API_KEY || "").trim();
      return json(200, { ok: true, service: "livella", key: !!k, keyLooksRight: k.startsWith("sk-ant-") && k.length > 60, passcode: !!env.PASSCODE, origins: allowed.length, storage: !!env.LESSONS, build: 3 });
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
