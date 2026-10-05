// Stand-in for the two services the page gets for free when it runs inside Claude:
// "sample" (ask Claude) and "downloads" (save a file). On the open web the first goes
// through the Livella Worker with a teacher passcode; the second is a normal download.
(function () {
  if (window.claude && window.claude.use) return; // running inside Claude: nothing to do
  var KEY = "livella.passcode", mem = "";
  function getPass() { try { return localStorage.getItem(KEY) || mem; } catch (e) { return mem; } }
  function setPass(v) { mem = v; try { localStorage.setItem(KEY, v); } catch (e) {} }
  function clearPass() { mem = ""; try { localStorage.removeItem(KEY); } catch (e) {} }

  function askPass(wrong) {
    return new Promise(function (resolve, reject) {
      var back = document.createElement("div");
      back.setAttribute("style", "position:fixed;inset:0;background:rgba(10,40,42,.55);display:flex;align-items:center;justify-content:center;padding:16px;z-index:9999;font-family:Inter,system-ui,sans-serif");
      back.innerHTML =
        '<form style="background:#faf6f0;color:#2b1810;border-radius:10px;padding:24px;max-width:360px;width:100%;box-shadow:0 20px 50px rgba(0,0,0,.3)">' +
        '<label for="livella-pass" style="display:block;font-weight:700;font-size:16px;margin-bottom:6px">Codice insegnante · Teacher passcode</label>' +
        '<p style="font-size:13px;line-height:1.5;margin:0 0 14px;color:#6b5a48">' + (wrong ? "Codice non valido. That passcode did not work. Try again." : "Livella is open to teachers with a passcode. Enter it once and this device remembers it.") + '</p>' +
        '<div style="display:flex;gap:8px;margin-bottom:14px">' +
        '<input id="livella-pass" type="password" autocomplete="off" autocapitalize="none" spellcheck="false" required style="flex:1;min-width:0;box-sizing:border-box;padding:12px;font-size:16px;border:1.5px solid #0d7377;border-radius:6px">' +
        '<button type="button" data-eye aria-pressed="false" aria-label="Mostra il codice · Show the passcode" title="Mostra · Show" style="flex:none;width:52px;border:1.5px solid #0d7377;background:#fff;color:#0a5c5f;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer">Mostra</button>' +
        '</div>' +
        '<div style="display:flex;gap:10px;justify-content:flex-end">' +
        '<button type="button" data-x style="padding:10px 16px;border:1px solid #c9bda8;background:transparent;border-radius:6px;font-size:14px;cursor:pointer;color:#2b1810">Annulla · Cancel</button>' +
        '<button type="submit" style="padding:10px 18px;border:0;background:#0d7377;color:#fff;border-radius:6px;font-size:14px;font-weight:600;cursor:pointer">OK</button>' +
        '</div></form>';
      document.body.appendChild(back);
      var input = back.querySelector("input"); input.focus();
      var eye = back.querySelector("[data-eye]");
      eye.addEventListener("click", function () {
        var show = input.type === "password";
        input.type = show ? "text" : "password";
        eye.textContent = show ? "Nascondi" : "Mostra";
        eye.setAttribute("aria-pressed", String(show));
        input.focus();
      });
      back.querySelector("[data-x]").addEventListener("click", function () { back.remove(); reject({ code: "declined", message: "passcode not entered" }); });
      back.querySelector("form").addEventListener("submit", function (e) { e.preventDefault(); var v = input.value.trim(); if (!v) return; back.remove(); resolve(v); });
    });
  }

  // Phone photos are large; shrink to 1600px on the long side before sending.
  function prepImage(blob) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(blob), img = new Image();
      img.onload = function () {
        var k = Math.min(1, 1600 / Math.max(img.width, img.height));
        var c = document.createElement("canvas"); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
        resolve({ media_type: "image/jpeg", data: c.toDataURL("image/jpeg", 0.85).split(",")[1] });
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject({ code: "image_rejected", message: "could not read the image" }); };
      img.src = url;
    });
  }

  async function call(payload) {
    var api = (window.LIVELLA_CONFIG || {}).api;
    if (!api) throw { code: "not_configured", message: "the Worker address is missing in config.js" };
    var pass = getPass();
    if (!pass) { pass = await askPass(false); setPass(pass); }
    for (var attempt = 0; attempt < 3; attempt++) {
      var res;
      try {
        res = await fetch(api, { method: "POST", headers: { "content-type": "application/json", "x-livella-passcode": pass }, body: JSON.stringify(payload) });
      } catch (e) { throw { code: "network", message: String(e && e.message || e) }; }
      if (res.status === 401) { clearPass(); pass = await askPass(true); setPass(pass); continue; }
      if (res.status === 429) throw { code: "rate_limited", message: "busy" };
      var out = await res.json().catch(function () { return null; });
      if (!res.ok || !out || !out.ok) throw { code: (out && out.code) || ("http_" + res.status), message: (out && out.message) || "" };
      return out.data;
    }
    throw { code: "passcode", message: "passcode rejected three times" };
  }

  var sample = {
    json: async function (messages, opts) {
      var imgs = opts && opts.images ? (opts.images instanceof Blob ? [opts.images] : Array.prototype.slice.call(opts.images)) : [];
      var images = []; for (var i = 0; i < imgs.length && i < 4; i++) images.push(await prepImage(imgs[i]));
      return call({ messages: messages.map(function (m) { return { role: m.role, content: String(m.content) }; }), images: images });
    },
    limits: async function () { return { images: { maxCount: 4, mediaTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"] } }; },
  };
  var downloads = {
    save: async function (req) {
      var blob = req.data instanceof Blob ? req.data : new Blob([req.data]);
      var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = req.filename || "livella.pdf";
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
      return { status: "saved" };
    },
  };
  window.claude = { use: async function (name) { return name === "sample" ? sample : name === "downloads" ? downloads : null; } };
})();
