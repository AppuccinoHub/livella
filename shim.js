// Stand-in for the two services the page gets for free when it runs inside Claude:
// "sample" (ask Claude) and "downloads" (save a file). On the open web the first goes
// through the Livella Worker with a teacher passcode; the second is a normal download.
(function () {
  if (window.claude && window.claude.use) return; // running inside Claude: nothing to do
  var KEY = "livella.passcode", mem = "";
  function getPass() { try { return localStorage.getItem(KEY) || mem; } catch (e) { return mem; } }
  function setPass(v) { mem = v; try { localStorage.setItem(KEY, v); } catch (e) {} }
  function clearPass() { mem = ""; try { localStorage.removeItem(KEY); } catch (e) {} }

  // Words for the passcode box, in the interface language the page is using.
  var WORDS = {
    en: { title: "Teacher passcode", intro: "Livella is open to teachers with a passcode. Enter it once: this device remembers it, and your browser may offer to save it.", wrong: "That passcode did not work. Try again, or ask the person who sent you Livella.", show: "Show", hide: "Hide", cancel: "Cancel", ok: "OK" },
    it: { title: "Codice insegnante", intro: "Livella è aperta ai docenti con un codice. Inseriscilo una volta: questo dispositivo lo ricorda e il browser può offrirsi di salvarlo.", wrong: "Codice non valido. Riprova, o chiedilo a chi ti ha inviato Livella.", show: "Mostra", hide: "Nascondi", cancel: "Annulla", ok: "OK" },
    fr: { title: "Code enseignant", intro: "Livella est ouverte aux enseignants munis d\u2019un code. Entrez-le une fois : cet appareil s\u2019en souvient et le navigateur peut proposer de l\u2019enregistrer.", wrong: "Ce code n\u2019a pas fonctionn\u00e9. R\u00e9essayez, ou demandez-le \u00e0 la personne qui vous a envoy\u00e9 Livella.", show: "Afficher", hide: "Masquer", cancel: "Annuler", ok: "OK" },
    es: { title: "C\u00f3digo docente", intro: "Livella est\u00e1 abierta a docentes con un c\u00f3digo. Escr\u00edbelo una vez: este dispositivo lo recuerda y el navegador puede ofrecerse a guardarlo.", wrong: "Ese c\u00f3digo no funcion\u00f3. Int\u00e9ntalo de nuevo o p\u00eddeselo a quien te envi\u00f3 Livella.", show: "Mostrar", hide: "Ocultar", cancel: "Cancelar", ok: "OK" }
  };
  function words() { var l = (document.documentElement.getAttribute("data-ui") || document.documentElement.lang || "en").slice(0, 2); return WORDS[l] || WORDS.en; }

  function askPass(wrong) {
    var W = words();
    return new Promise(function (resolve, reject) {
      var back = document.createElement("div");
      back.setAttribute("style", "position:fixed;inset:0;background:rgba(8,14,34,.6);display:flex;align-items:center;justify-content:center;padding:16px;z-index:9999;font-family:Inter,system-ui,sans-serif");
      back.innerHTML =
        '<form autocomplete="on" role="dialog" aria-labelledby="livella-pass-title" style="background:#fffdf8;color:#101c3d;border-radius:12px;padding:24px;max-width:360px;width:100%;box-shadow:0 20px 50px rgba(0,0,0,.35)">' +
        '<label id="livella-pass-title" for="livella-pass" style="display:block;font-weight:700;font-size:17px;margin-bottom:6px">' + W.title + '</label>' +
        '<input type="text" name="username" autocomplete="username" value="livella-teacher" readonly tabindex="-1" aria-hidden="true" style="position:absolute;width:1px;height:1px;opacity:0;pointer-events:none">' +
        '<p style="font-size:13px;line-height:1.5;margin:0 0 14px;color:#3c4a73">' + (wrong ? W.wrong : W.intro) + '</p>' +
        '<div style="display:flex;gap:8px;margin-bottom:14px">' +
        '<input id="livella-pass" name="password" type="password" autocomplete="current-password" autocapitalize="none" spellcheck="false" required style="flex:1;min-width:0;box-sizing:border-box;padding:12px;font-size:16px;border:1.5px solid #22346b;border-radius:8px;min-height:48px">' +
        '<button type="button" data-eye aria-pressed="false" aria-label="' + W.show + '" style="flex:none;min-width:64px;min-height:48px;border:1.5px solid #22346b;background:#fff;color:#101c3d;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer">' + W.show + '</button>' +
        '</div>' +
        '<div style="display:flex;gap:10px;justify-content:flex-end">' +
        '<button type="button" data-x style="min-height:44px;padding:0 16px;border:1.5px solid #b9c3e3;background:transparent;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;color:#101c3d">' + W.cancel + '</button>' +
        '<button type="submit" style="min-height:44px;padding:0 20px;border:0;background:#1d5be0;color:#fff;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 2px 0 #1648b8">' + W.ok + '</button>' +
        '</div></form>';
      document.body.appendChild(back);
      var input = back.querySelector("#livella-pass"); input.focus();
      var eye = back.querySelector("[data-eye]");
      eye.addEventListener("click", function () {
        var show = input.type === "password";
        input.type = show ? "text" : "password";
        eye.textContent = show ? W.hide : W.show; eye.setAttribute("aria-label", show ? W.hide : W.show);
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

  // One door to the Worker. needPass = attach (and if needed ask for) the teacher passcode.
  async function send(method, path, payload, needPass) {
    var api = (window.LIVELLA_CONFIG || {}).api;
    if (!api) throw { code: "not_configured", message: "the Worker address is missing in config.js" };
    var pass = "";
    if (needPass) { pass = getPass(); if (!pass) { pass = await askPass(false); setPass(pass); } }
    for (var attempt = 0; attempt < 3; attempt++) {
      var res, init = { method: method };
      if (needPass || payload) { init.headers = {}; if (payload) init.headers["content-type"] = "application/json"; if (needPass) init.headers["x-livella-passcode"] = pass; }
      if (payload) init.body = JSON.stringify(payload);
      try { res = await fetch(api + path, init); }
      catch (e) { throw { code: "network", message: String(e && e.message || e) }; }
      if (res.status === 401 && needPass) { clearPass(); pass = await askPass(true); setPass(pass); continue; }
      if (res.status === 429) throw { code: "rate_limited", message: "busy" };
      var out = await res.json().catch(function () { return null; });
      if (!res.ok || !out || !out.ok) throw { code: (out && out.code) || ("http_" + res.status), message: (out && out.message) || "" };
      return out;
    }
    throw { code: "passcode", message: "passcode rejected three times" };
  }
  async function call(payload) { return (await send("POST", "", payload, true)).data; }

  // Shared lessons: save returns the lesson's id; load needs no passcode.
  window.LIVELLA_SHARE = {
    save: async function (lesson, id) { return { id: (await send(id ? "PUT" : "POST", "lesson" + (id ? "/" + id : ""), { lesson: lesson }, true)).id }; },
    load: async function (id) { return (await send("GET", "lesson/" + id, null, false)).lesson; },
  };

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
