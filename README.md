# Livella

*il testo giusto, al livello giusto*

Livella rewrites any text, or writes one from a topic, at five proficiency levels, with reading supports (clear format, short chunks, literal language, reading support), in Italian, French, Spanish and ESL. Built by a high school Italian teacher.

## What is in this folder

| File | What it is |
|---|---|
| `index.html` | The page people open. |
| `app.js` | The app, built from `src/livella.jsx`. Do not edit by hand. |
| `shim.js` | Connects the page to the Worker and handles the teacher passcode. |
| `config.js` | The Worker's address. |
| `worker/worker.js` | The Cloudflare Worker that holds the API key. It is pasted into Cloudflare; it does not run from here. |
| `src/livella.jsx` | The source of the app. |

No keys or passcodes are stored in this repository.
