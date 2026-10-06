import React, { useState, useRef, useEffect } from "react";


// ===== LANGUAGES =====
// One ladder per language. UI buttons AND the model's calibration both read from here,
// so the level a teacher clicks and the level the model targets can never drift apart.
// IT / FR / ES follow ACTFL. ESL follows WIDA.
const LANGUAGES = {
  it: {
    id: "it",
    ui: "it",
    support: [],
    flag: "🇮🇹",
    name: "Italiano",
    langEn: "Italian",
    // Front-page sample: one story at this ladder's five levels (shown on the fanned pages).
    heroTitle: "Al mercato",
    heroSheets: [{"txt": "Marco va al mercato. Il mercato è grande.", "gloss": [["mercato", "market"], ["grande", "big"]], "chunks": [["Marco va al mercato.", "Vero o falso? Marco va a scuola."], ["Il mercato è grande.", "Cerchia: grande / piccolo."]]}, {"txt": "Marco va al mercato con sua nonna il sabato. Comprano frutta e pane.", "gloss": [["nonna", "grandmother"], ["comprano", "they buy"]], "chunks": [["Marco va al mercato con sua nonna il sabato.", "Con chi va Marco?"], ["Comprano frutta e pane.", "Cerchia due cose da mangiare."]]}, {"txt": "Ogni sabato Marco accompagnava sua nonna al mercato di Ballarò, dove compravano la frutta.", "gloss": [["accompagnava", "used to go with"], ["dove", "where"]], "chunks": [["Ogni sabato Marco accompagnava sua nonna al mercato di Ballarò.", "Vero o falso? Marco andava da solo."], ["Lì compravano la frutta.", "Che cosa compravano?"]]}, {"txt": "Ogni sabato Marco accompagnava la nonna a Ballarò, dove lei contrattava su ogni prezzo.", "gloss": [["contrattava", "haggled"], ["prezzo", "price"]], "chunks": [["Ogni sabato Marco accompagnava la nonna a Ballarò.", "Quando andavano al mercato?"], ["Lei contrattava su ogni prezzo.", "Dillo a un compagno: chi contrattava?"]]}, {"txt": "Se non fosse stato per la nonna, Marco non avrebbe mai imparato a contrattare tra le bancarelle di Ballarò.", "gloss": [["bancarelle", "stalls"], ["se non fosse stato", "had it not been"]], "chunks": [["Marco ha imparato a contrattare tra le bancarelle di Ballarò.", "Dove ha imparato Marco?"], ["Senza la nonna non l'avrebbe mai imparato.", "Spiega a un compagno: perché?"]]}],
    framework: "ACTFL",
    culture: "Italy and the Italian-speaking world",
    cultureRule: "2 questions (1 Italy-specific, 1 Italian/American comparison). No tourist clichés.",
    tf: ["Vero", "Falso"],
    glossRule: "english gloss",
    levels: [
      { id: "it1", label: "Novice Mid", sub: "~ Italiano 1", description: "present tense of essere/avere/chiamarsi/abitare + regular -are verbs, articles, numbers, concrete self/family/school topics", calibration: "Present tense only: essere, avere, chiamarsi, abitare, piacere (mi piace), regular -are verbs. Articles, numbers, days, colors. Sentences 5-8 words. Top 500 words. NO past tense, NO future, NO conditional, NO subjunctive, NO reflexives beyond chiamarsi. Topics: self, family, school, likes." },
      { id: "it2", label: "Novice High", sub: "~ Italiano 2", description: "high-frequency vocab, simple present tense, basic past forms", calibration: "Present tense + most common irregulars, very limited passato prossimo, sentences 6-10 words, top 1000 words, no subjunctive/conditional/future, concrete topics." },
      { id: "it3", label: "Intermediate Low", sub: "~ Italiano 3", description: "passato prossimo, imperfetto contrast, expanded thematic vocab", calibration: "Passato prossimo fluent, imperfetto introduced, future introduced, sentences 8-14 words, top 2000 words, reflexives, conditional only in fixed expressions." },
      { id: "it4", label: "Intermediate Mid", sub: "~ Italiano 4", description: "subjunctive intro, conditional, complex sentence structures", calibration: "All indicative tenses fluent, present subjunctive introduced, conditional fluent, sentences 10-18 words, subordinate clauses, abstract concepts." },
      { id: "itap", label: "Intermediate High", sub: "~ AP Italiano", description: "full register range, idiomatic usage, cultural depth, AP themes", calibration: "Full tense/mood range, idiomatic expressions, register variation, AP Italian Language and Culture themes, sophisticated discourse markers." },
    ],
  },
  fr: {
    id: "fr",
    ui: "fr",
    support: ["it", "en"],
    flag: "🇫🇷",
    name: "Français",
    langEn: "French",
    // Front-page sample: one story at this ladder's five levels (shown on the fanned pages).
    heroTitle: "Au marché",
    heroSheets: [{"txt": "Marc va au marché. Le marché est grand.", "gloss": [["marché", "market"], ["grand", "big"]], "chunks": [["Marc va au marché.", "Vrai ou faux ? Marc va à l'école."], ["Le marché est grand.", "Entoure : grand / petit."]]}, {"txt": "Marc va au marché avec sa grand-mère le samedi. Ils achètent des fruits et du pain.", "gloss": [["grand-mère", "grandmother"], ["achètent", "they buy"]], "chunks": [["Marc va au marché avec sa grand-mère le samedi.", "Avec qui va Marc ?"], ["Ils achètent des fruits et du pain.", "Entoure deux choses à manger."]]}, {"txt": "Chaque samedi, Marc accompagnait sa grand-mère au marché, où ils achetaient des fruits.", "gloss": [["accompagnait", "used to go with"], ["où", "where"]], "chunks": [["Chaque samedi, Marc accompagnait sa grand-mère au marché.", "Vrai ou faux ? Marc y allait seul."], ["Là, ils achetaient des fruits.", "Qu'est-ce qu'ils achetaient ?"]]}, {"txt": "Chaque samedi, Marc accompagnait sa grand-mère au marché, où elle marchandait chaque prix.", "gloss": [["marchandait", "haggled"], ["prix", "price"]], "chunks": [["Chaque samedi, Marc accompagnait sa grand-mère au marché.", "Quand allaient-ils au marché ?"], ["Elle marchandait chaque prix.", "Dis-le à un camarade : qui marchandait ?"]]}, {"txt": "Sans sa grand-mère, Marc n'aurait jamais appris à marchander entre les étals du marché.", "gloss": [["étals", "stalls"], ["n'aurait jamais appris", "would never have learned"]], "chunks": [["Marc a appris à marchander entre les étals du marché.", "Où Marc a-t-il appris ?"], ["Sans sa grand-mère, il ne l'aurait jamais appris.", "Explique à un camarade : pourquoi ?"]]}],
    framework: "ACTFL",
    culture: "France and the Francophone world (Québec, West Africa, the Maghreb, the Caribbean)",
    cultureRule: "2 questions (1 specific to a Francophone country or region, 1 Francophone/American comparison). No tourist clichés.",
    tf: ["Vrai", "Faux"],
    glossRule: "english gloss",
    levels: [
      { id: "fr1", label: "Novice Mid", sub: "~ Français 1", description: "present tense of être/avoir/aller/faire + regular -er verbs, articles, numbers, concrete self/family/school topics", calibration: "Present tense only: être, avoir, aller, faire, s'appeler, habiter, aimer, regular -er verbs. Articles (le/la/les/un/une/des), numbers, days, colors. Sentences 5-8 words. Top 500 words. NO passé composé, NO futur, NO conditionnel, NO subjonctif. Topics: self, family, school, likes." },
      { id: "fr2", label: "Novice High", sub: "~ Français 2", description: "present + common irregulars, passé composé with avoir introduced, futur proche", calibration: "Present tense + common irregulars (vouloir, pouvoir, prendre), passé composé with avoir introduced (regular participles), futur proche (aller + infinitive). Sentences 6-10 words. Top 1000 words. NO imparfait, NO futur simple, NO conditionnel, NO subjonctif." },
      { id: "fr3", label: "Intermediate Low", sub: "~ Français 3", description: "passé composé (avoir and être), imparfait contrast, futur simple, reflexives", calibration: "Passé composé fluent (avoir AND être, agreement), imparfait introduced with contrast, futur simple introduced, reflexive verbs, sentences 8-14 words, top 2000 words, conditionnel only in fixed expressions (je voudrais)." },
      { id: "fr4", label: "Intermediate Mid", sub: "~ Français 4", description: "all indicative tenses, present subjunctive intro, conditional, complex sentences", calibration: "All indicative tenses fluent (incl. plus-que-parfait), subjonctif présent introduced after common triggers (il faut que, je veux que), conditionnel fluent, sentences 10-18 words, subordinate clauses, abstract concepts." },
      { id: "frap", label: "Intermediate High", sub: "~ AP Français", description: "full register range, idiomatic usage, cultural depth, AP themes", calibration: "Full tense/mood range, idiomatic expressions, tu/vous register variation, AP French Language and Culture themes, sophisticated discourse markers." },
    ],
  },
  es: {
    id: "es",
    ui: "en",
    support: ["en"],
    flag: "🇪🇸",
    name: "Español",
    langEn: "Spanish",
    // Front-page sample: one story at this ladder's five levels (shown on the fanned pages).
    heroTitle: "En el mercado",
    heroSheets: [{"txt": "Marcos va al mercado. El mercado es grande.", "gloss": [["mercado", "market"], ["grande", "big"]], "chunks": [["Marcos va al mercado.", "¿Cierto o falso? Marcos va a la escuela."], ["El mercado es grande.", "Marca: grande / pequeño."]]}, {"txt": "Marcos va al mercado con su abuela los sábados. Compran fruta y pan.", "gloss": [["abuela", "grandmother"], ["compran", "they buy"]], "chunks": [["Marcos va al mercado con su abuela los sábados.", "¿Con quién va Marcos?"], ["Compran fruta y pan.", "Marca dos cosas para comer."]]}, {"txt": "Cada sábado Marcos acompañaba a su abuela al mercado, donde compraban fruta.", "gloss": [["acompañaba", "used to go with"], ["donde", "where"]], "chunks": [["Cada sábado Marcos acompañaba a su abuela al mercado.", "¿Cierto o falso? Marcos iba solo."], ["Allí compraban fruta.", "¿Qué compraban?"]]}, {"txt": "Cada sábado Marcos acompañaba a su abuela al mercado, donde ella regateaba cada precio.", "gloss": [["regateaba", "haggled"], ["precio", "price"]], "chunks": [["Cada sábado Marcos acompañaba a su abuela al mercado.", "¿Cuándo iban al mercado?"], ["Ella regateaba cada precio.", "Díselo a un compañero: ¿quién regateaba?"]]}, {"txt": "Si no hubiera sido por su abuela, Marcos nunca habría aprendido a regatear entre los puestos del mercado.", "gloss": [["puestos", "stalls"], ["si no hubiera sido", "had it not been"]], "chunks": [["Marcos aprendió a regatear entre los puestos del mercado.", "¿Dónde aprendió Marcos?"], ["Sin su abuela, nunca lo habría aprendido.", "Explícale a un compañero: ¿por qué?"]]}],
    framework: "ACTFL",
    culture: "Spain and Latin America (do not default to Spain; vary countries)",
    cultureRule: "2 questions (1 specific to a Spanish-speaking country or region, 1 Hispanic/American comparison). No tourist clichés.",
    tf: ["Cierto", "Falso"],
    glossRule: "english gloss",
    levels: [
      { id: "es1", label: "Novice Mid", sub: "~ Español 1", description: "present tense of ser/estar/tener/ir + regular -ar/-er/-ir verbs, gustar basics, articles, numbers, concrete topics", calibration: "Present tense only: ser, estar, tener, ir, llamarse, vivir, gustar (me gusta), regular -ar/-er/-ir verbs. Articles, numbers, days, colors. Sentences 5-8 words. Top 500 words. NO pretérito, NO futuro, NO condicional, NO subjuntivo. Topics: self, family, school, likes." },
      { id: "es2", label: "Novice High", sub: "~ Español 2", description: "present + stem-changers, preterite introduced, ir a + infinitive", calibration: "Present tense + stem-changing verbs, pretérito introduced (regular + ser/ir/hacer), ir a + infinitive for future. Sentences 6-10 words. Top 1000 words. NO imperfecto, NO futuro simple, NO condicional, NO subjuntivo." },
      { id: "es3", label: "Intermediate Low", sub: "~ Español 3", description: "preterite fluent, imperfect contrast, future introduced, reflexives", calibration: "Pretérito fluent (incl. common irregulars), imperfecto introduced with contrast, futuro simple introduced, reflexive verbs, sentences 8-14 words, top 2000 words, condicional only in fixed expressions (me gustaría)." },
      { id: "es4", label: "Intermediate Mid", sub: "~ Español 4", description: "all indicative tenses, present subjunctive intro, conditional, complex sentences", calibration: "All indicative tenses fluent (incl. pluscuamperfecto), presente de subjuntivo introduced after common triggers (quiero que, es importante que), condicional fluent, sentences 10-18 words, subordinate clauses, abstract concepts." },
      { id: "esap", label: "Intermediate High", sub: "~ AP Español", description: "full register range, idiomatic usage, cultural depth, AP themes", calibration: "Full tense/mood range, idiomatic expressions, tú/usted register variation, AP Spanish Language and Culture themes, sophisticated discourse markers." },
    ],
  },
  esl: {
    id: "esl",
    ui: "en",
    support: [],
    flag: "🌐",
    name: "English · ESL / ML",
    langEn: "English",
    // Front-page sample: one story at this ladder's five levels (shown on the fanned pages).
    heroTitle: "At the market",
    heroSheets: [{"txt": "Marco goes to the market. The market is big.", "gloss": [["market", "a place to buy food"], ["big", "large"]], "chunks": [["Marco goes to the market.", "True or false? Marco goes to school."], ["The market is big.", "Circle: big / small."]]}, {"txt": "Marco goes to the market with his grandmother on Saturdays. They buy fruit and bread.", "gloss": [["grandmother", "your parent's mother"], ["buy", "pay money for"]], "chunks": [["Marco goes to the market with his grandmother on Saturdays.", "Who goes with Marco?"], ["They buy fruit and bread.", "Circle two things to eat."]]}, {"txt": "Every Saturday, Marco went to the market with his grandmother, where they bought fruit.", "gloss": [["went", "past of go"], ["bought", "past of buy"]], "chunks": [["Every Saturday, Marco went to the market with his grandmother.", "True or false? Marco went alone."], ["They bought fruit there.", "What did they buy?"]]}, {"txt": "Every Saturday, Marco went with his grandmother to the market, where she bargained over every price.", "gloss": [["bargained", "asked for a lower price"], ["price", "how much it costs"]], "chunks": [["Every Saturday, Marco went with his grandmother to the market.", "When did they go to the market?"], ["She bargained over every price.", "Tell a partner: who bargained?"]]}, {"txt": "If it had not been for his grandmother, Marco would never have learned to bargain among the market stalls.", "gloss": [["stalls", "small tables that sell things"], ["bargain", "ask for a lower price"]], "chunks": [["Marco learned to bargain among the market stalls.", "Where did Marco learn?"], ["Without his grandmother, he would never have learned.", "Explain to a partner: why?"]]}],
    framework: "WIDA",
    culture: "U.S. school and community life, held next to the students' own home cultures",
    cultureRule: "2 questions (1 about U.S. school or community life as it appears in the passage, 1 inviting the student to compare with their own home culture). Never assume one home culture; phrase for any background.",
    tf: ["True", "False"],
    glossRule: "simple English definition (5 words max) — NOT a translation",
    levels: [
      { id: "wida1", label: "Entering", sub: "WIDA 1", description: "single words and short phrases, present tense, very concrete, high-frequency words", calibration: "Present tense and present progressive only. Sentences 3-6 words, one idea each. Top 300 words. Concrete nouns, visible actions. Repeat key words often. NO idioms, NO passive voice, NO contractions beyond I'm / it's." },
      { id: "wida2", label: "Emerging", sub: "WIDA 2", description: "simple sentences, present + regular past, common irregular past, everyday vocabulary", calibration: "Present, present progressive, simple past (regular -ed + was/were/had/went/said). Sentences 5-8 words. Top 800 words. Simple and/but connections. NO perfect tenses, NO passive voice, NO idioms." },
      { id: "wida3", label: "Developing", sub: "WIDA 3", description: "expanded sentences, past/present/future, compound sentences, some academic words", calibration: "Past, present, future (will / going to). Compound sentences with and/but/because/so. Sentences 8-12 words. Top 1500 words plus a few Tier-2 academic words, each supported by context. Limited idioms, explained by context. NO passive voice." },
      { id: "wida4", label: "Expanding", sub: "WIDA 4", description: "complex sentences, present perfect, subordinate clauses, grade-level academic vocabulary with support", calibration: "Full tense range incl. present perfect. Subordinate clauses (when, although, if). Sentences 10-16 words. Grade-level Tier-2 academic vocabulary with contextual support. Occasional passive voice. Common idioms allowed." },
      { id: "wida5", label: "Bridging", sub: "WIDA 5", description: "near grade-level text, full tense range, technical and academic vocabulary, nuance", calibration: "Near grade-level English. Full tense range, passive voice, nuanced meaning, technical and Tier-3 vocabulary where the topic calls for it. Sentences 12-20 words. Idioms and figurative language allowed." },
    ],
  },
};

const LANGUAGE_ORDER = ["it", "fr", "es", "esl"];
// Short tab names for the ACTFL sublevels (the ESL side uses WIDA numbers 1-5).
const LEVEL_SHORT = { "Novice Mid": "NM", "Novice High": "NH", "Intermediate Low": "IL", "Intermediate Mid": "IM", "Intermediate High": "IH" };
// Voice used by the Listen button (the browser's own speech engine).
const SPEECH = { it: "it-IT", fr: "fr-FR", es: "es-MX", esl: "en-US" };

// Teacher-facing translations of generated content. The teacher may not read the
// target language (Spanish) or may share the lesson with an Italian-speaking colleague
// (French), so the output carries parallel versions in these languages.
const SUPPORT_NAMES = { en: "English", it: "Italiano" };
const SUPPORT_LANG_EN = { en: "English", it: "Italian" };

function translationSpec(L, what) {
  if (!L.support.length) return "";
  const keys = L.support.map((k) => `"${k}": "${SUPPORT_LANG_EN[k]} version of ${what}"`).join(", ");
  return `,
  "translations": {${keys}}`;
}
function translationRule(L) {
  if (!L.support.length) return "";
  const names = L.support.map((k) => SUPPORT_LANG_EN[k]).join(" and ");
  return `
TRANSLATIONS: The teacher reviewing this may not read ${L.langEn}. Provide a faithful, natural ${names} translation wherever the JSON asks for "translations". Translate meaning, keep the same sentence order, do not simplify or annotate.`;
}

// ===== CHROME (the teacher's language) =====
// Buttons, labels and messages follow the TEACHER, not the student text:
// Italian teacher → Italian chrome, French teacher → French chrome,
// Spanish and ESL → English chrome (the person running the tool reads English).
const UI = {
  it: {
    inputLabel: "Testo o argomento",
    placeholder: "Incolla un articolo, una canzone, un capitolo del libro... oppure scrivi un argomento in inglese.",
    purposeLabel: "Tipo di lettura", levelLabel: "Livello",
    go: "Livella", going: "Sto livellando...",
    errEmpty: "Inserisci del testo o un argomento.", errGeneric: "Qualcosa è andato storto. Riprova.",
    errCompare: "Errore nel confronto.", errActivity: "Errore nella generazione dell'attività.", errExercise: "Errore nella generazione degli esercizi.",
    errNotGranted: "Questa pagina non ha il permesso di usare Claude. Apri il menu Permessi della pagina e consenti l'accesso, poi riprova.",
    errRate: "Troppe richieste in poco tempo. Aspetta un momento e riprova.",
    showOriginal: "Mostra originale", hideOriginal: "Nascondi originale", original: "Originale",
    vocab: "Vocabolario", teacherNote: "Nota per l'insegnante",
    compareLabel: "Confronta con un altro livello", closeCompare: "Chiudi confronto",
    easier: "← Più facile", harder: "Più difficile →",
    copyAll: "Copia tutto", copied: "Copiato ✓", print: "Stampa / PDF",
    buildTitle: "Crea esercizi", buildSub: "Costruisci il tuo set — scegli tipo, quantità e difficoltà.",
    typeLabel: "Tipo", countLabel: "Quantità", diffLabel: "Difficoltà",
    genExercises: "Genera esercizi", generating: "Sto generando...", questions: "domande", remove: "Rimuovi",
    whatDoWeDo: "Cosa facciamo?", activitiesSub: "Attività in classe — scegli cosa generare.",
    ready: "✓ pronto", emptyActivities: "Clicca un'attività sopra per iniziare",
    answer: "Risposta", name: "Nome", date: "Data", klass: "Classe",
    uploadBtn: "Carica immagine o file .txt", uploadHint: "Foto o screenshot: Claude legge il testo nell'immagine. Puoi anche incollare uno screenshot (Ctrl+V) o trascinarlo sul riquadro.",
    linkLabel: "Link della fonte", linkHint: "Solo per la citazione sul foglio — la pagina non apre i link. Incolla il testo qui sopra.",
    source: "Fonte", errImages: "Le immagini non sono disponibili in questa vista. Incolla il testo.", errFile: "Non riesco a leggere questo file. Usa un'immagine (JPG/PNG) o un file .txt.",
    scalaBtn: "La Scala — tutti e cinque i livelli", scalaBuilding: "Costruisco la scala...", scalaTitle: "La Scala",
    scalaSub: "Lo stesso testo a cinque livelli, paragrafo per paragrafo. Tocca ↑ o ↓ su un paragrafo per salire o scendere di un livello.",
    up: "Sali", down: "Scendi", allUp: "Tutti su", allDown: "Tutti giù", rung: "gradino", scalaReset: "Torna al mio livello",
    errScala: "Non riesco a costruire la scala.", scalaCount: "paragrafi",
    pdfStudent: "PDF studente", pdfTeacher: "PDF insegnante", pdfBuilding: "Creo il PDF...", teacherGuide: "Guida per l'insegnante", studentSheet: "Scheda dello studente",
    errPdf: "Non riesco a scaricare il PDF in questa vista.", pdfDeclined: "Download annullato.",
    heroHead: "Il livello giusto per ogni studente.", heroSub: "Incolla un testo, o scrivi solo un tema. Livella ti restituisce la stessa pagina a ogni livello della tua classe, con i supporti per chi ne ha bisogno.", heroCta: "Livella un testo", heroMicro: "Cinque livelli · quattro lingue · profili di lettura",
    cmpTitle: "Confronta", cmpLevel: "Livello", cmpProfile: "Supporto", cmpLang: "Lingua", cmpHint: "Ogni confronto è una nuova generazione: la tua pagina resta a sinistra.", cmpWorking: "Preparo il confronto...",
    switchWarn: "Passare a {x} cancella la lezione sullo schermo.", switchYes: "Passa a {x}", switchNo: "Resta qui", switchTip: "Per vedere la stessa lezione in un'altra lingua, usa Confronta → Lingua.",
    listen: "Ascolta", stopListen: "Ferma", slow: "Lento", hideText: "Nascondi il testo", showText: "Mostra il testo", hiddenNote: "Testo nascosto. Ascolta e rispondi.", errVoice: "Questo dispositivo non ha una voce per questa lingua.", listenNote: "Voce del browser: la qualità dipende dal dispositivo.",
    rights: "Tutti i diritti riservati.",
    learnersLabel: "Studenti", learnersHint: "Il livello indica la competenza. Qui scegli l'età: cambiano temi, lunghezza e compiti.",
    shareBtn: "Condividi con un collega", shareTitle: "Lezione condivisa", shareName: "Il tuo nome", shareNamePh: "Così il collega sa chi ha scritto cosa", shareSave: "Crea il link", shareLink: "Link", copyLink: "Copia link", copiedLink: "Link copiato ✓", refresh: "Aggiorna", shareHint: "Chi ha il link può vedere questa lezione. Per modificarla serve il codice insegnante. Le lezioni condivise vengono cancellate dopo 90 giorni.", sharedBy: "Iniziata da {x}.", versions: "Versioni", addLang: "Aggiungi {x}", adding: "Sto scrivendo...", edit: "Modifica", save: "Salva", cancel: "Annulla", editedBy: "Ultimo salvataggio: {x}", notes: "Note", noNotes: "Nessuna nota.", notePh: "Lascia una nota al collega", addNote: "Aggiungi nota", pdfAll: "PDF: tutte le versioni", errShare: "Non riesco a salvare la lezione condivisa.", errLoad: "Non riesco ad aprire questa lezione condivisa. Il link potrebbe essere scaduto.", saving: "Salvo...", loadingShared: "Apro la lezione condivisa...",
    tagline: "il testo giusto, al livello giusto", forAll: "per tutti",
    inviteBtn: "Condividi Livella", inviteCopied: "Messaggio e link copiati ✓", inviteText: "Imparare una lingua è diverso per ogni studente. Livella prende una lettura e la riscrive al livello di ogni studente, così tutta la classe legge la stessa storia. E il bello: la mandi a un collega, che può aggiungerla nella sua lingua o adattarla alla sua classe.",
    modeText: "Da un testo", modeWrite: "Scrivi da zero", genreLabel: "Genere", topicLabel: "Tema",
    topicPlaceholder: "Es. una gita a Napoli con la classe · la mia famiglia · il mercato del sabato", writeHint: "Livella scrive un testo originale al livello scelto. Scrivi un tema, oppure incolla appunti o fatti; anche in inglese.",
    errTopic: "Scrivi un tema.", write: "Scrivi", writing: "Sto scrivendo...",
    profileLabel: "Supporti", profileHint: "Il livello non cambia. Scegline uno o più.", pagesView: "Pagine", notWritten: "non è ancora scritto.", writeLevel: "Scrivi questo livello", writeHint: "La Scala li scrive tutti e cinque insieme.", fromScala: "Da La Scala: solo il testo.", fullVersion: "Aggiungi vocabolario e note per docenti", heroExample: "Questo è un esempio. Incolla la tua lettura qui sotto.", standard: "Standard", standardSub: "nessun adattamento",
    wordBank: "Banca di parole", microTask: "Mini-compito", of: "di", accommodations: "Adattamenti applicati", pdfFontNote: "Nel PDF il carattere Lexend non è disponibile: spaziatura e lunghezza delle righe seguono comunque le regole.",
  },
  fr: {
    inputLabel: "Texte ou sujet",
    placeholder: "Collez un article, une chanson, un chapitre du livre... ou écrivez un sujet en anglais.",
    purposeLabel: "Type de lecture", levelLabel: "Niveau",
    go: "Livella", going: "Je nivelle...",
    errEmpty: "Entrez un texte ou un sujet.", errGeneric: "Quelque chose n'a pas fonctionné. Réessayez.",
    errCompare: "Erreur lors de la comparaison.", errActivity: "Erreur lors de la génération de l'activité.", errExercise: "Erreur lors de la génération des exercices.",
    errNotGranted: "Cette page n'a pas la permission d'utiliser Claude. Ouvrez le menu Permissions de la page, autorisez l'accès, puis réessayez.",
    errRate: "Trop de demandes en peu de temps. Attendez un instant et réessayez.",
    showOriginal: "Afficher l'original", hideOriginal: "Masquer l'original", original: "Original",
    vocab: "Vocabulaire", teacherNote: "Note pour l'enseignant·e",
    compareLabel: "Comparer avec un autre niveau", closeCompare: "Fermer la comparaison",
    easier: "← Plus facile", harder: "Plus difficile →",
    copyAll: "Tout copier", copied: "Copié ✓", print: "Imprimer / PDF",
    buildTitle: "Créer des exercices", buildSub: "Composez votre série — choisissez le type, le nombre et la difficulté.",
    typeLabel: "Type", countLabel: "Nombre", diffLabel: "Difficulté",
    genExercises: "Générer les exercices", generating: "Génération...", questions: "questions", remove: "Supprimer",
    whatDoWeDo: "Qu'est-ce qu'on fait ?", activitiesSub: "Activités en classe — choisissez quoi générer.",
    ready: "✓ prêt", emptyActivities: "Cliquez sur une activité ci-dessus pour commencer",
    answer: "Réponse", name: "Nom", date: "Date", klass: "Classe",
    uploadBtn: "Importer une image ou un fichier .txt", uploadHint: "Photo ou capture d'écran : Claude lit le texte de l'image. Vous pouvez aussi coller une capture (Ctrl+V) ou la glisser sur la zone.",
    linkLabel: "Lien de la source", linkHint: "Pour la citation sur la feuille seulement — la page n'ouvre pas les liens. Collez le texte ci-dessus.",
    source: "Source", errImages: "Les images ne sont pas disponibles dans cette vue. Collez le texte.", errFile: "Impossible de lire ce fichier. Utilisez une image (JPG/PNG) ou un fichier .txt.",
    scalaBtn: "La Scala — les cinq niveaux", scalaBuilding: "Je construis l'échelle...", scalaTitle: "La Scala",
    scalaSub: "Le même texte à cinq niveaux, paragraphe par paragraphe. Touchez ↑ ou ↓ sur un paragraphe pour monter ou descendre d'un niveau.",
    up: "Monter", down: "Descendre", allUp: "Tout monter", allDown: "Tout descendre", rung: "échelon", scalaReset: "Revenir à mon niveau",
    errScala: "Impossible de construire l'échelle.", scalaCount: "paragraphes",
    pdfStudent: "PDF élève", pdfTeacher: "PDF enseignant·e", pdfBuilding: "Création du PDF...", teacherGuide: "Guide de l'enseignant·e", studentSheet: "Fiche de l'élève",
    errPdf: "Impossible de télécharger le PDF dans cette vue.", pdfDeclined: "Téléchargement annulé.",
    heroHead: "Le bon niveau pour chaque élève.", heroSub: "Collez un texte, ou indiquez seulement un sujet. Livella vous rend la même page à chaque niveau de votre classe, avec des aides pour les lecteurs qui en ont besoin.", heroCta: "Niveler un texte", heroMicro: "Cinq niveaux · quatre langues · profils de lecture",
    cmpTitle: "Comparer", cmpLevel: "Niveau", cmpProfile: "Aide", cmpLang: "Langue", cmpHint: "Chaque comparaison est une nouvelle génération : votre page reste à gauche.", cmpWorking: "Je prépare la comparaison...",
    switchWarn: "Passer à {x} efface la leçon affichée.", switchYes: "Passer à {x}", switchNo: "Rester ici", switchTip: "Pour voir la même leçon dans une autre langue, utilisez Comparer → Langue.",
    listen: "Écouter", stopListen: "Arrêter", slow: "Lent", hideText: "Masquer le texte", showText: "Afficher le texte", hiddenNote: "Texte masqué. Écoutez et répondez.", errVoice: "Cet appareil n'a pas de voix pour cette langue.", listenNote: "Voix du navigateur : la qualité dépend de l'appareil.",
    rights: "Tous droits réservés.",
    learnersLabel: "Apprenants", learnersHint: "Le niveau indique la compétence. Ici, choisissez l'âge : thèmes, longueur et tâches changent.",
    shareBtn: "Partager avec un·e collègue", shareTitle: "Leçon partagée", shareName: "Votre nom", shareNamePh: "Pour que votre collègue sache qui a écrit quoi", shareSave: "Créer le lien", shareLink: "Lien", copyLink: "Copier le lien", copiedLink: "Lien copié ✓", refresh: "Actualiser", shareHint: "Toute personne ayant le lien peut voir cette leçon. Pour la modifier, il faut le code enseignant. Les leçons partagées sont supprimées après 90 jours.", sharedBy: "Commencée par {x}.", versions: "Versions", addLang: "Ajouter {x}", adding: "J'écris...", edit: "Modifier", save: "Enregistrer", cancel: "Annuler", editedBy: "Dernier enregistrement : {x}", notes: "Notes", noNotes: "Aucune note.", notePh: "Laissez une note à votre collègue", addNote: "Ajouter la note", pdfAll: "PDF : toutes les versions", errShare: "Impossible d'enregistrer la leçon partagée.", errLoad: "Impossible d'ouvrir cette leçon partagée. Le lien a peut-être expiré.", saving: "Enregistrement...", loadingShared: "Ouverture de la leçon partagée...",
    tagline: "le bon texte, au bon niveau", forAll: "pour tous",
    inviteBtn: "Partager Livella", inviteCopied: "Message et lien copiés ✓", inviteText: "Apprendre une langue, c'est différent pour chaque élève. Livella prend une lecture et la réécrit au niveau de chaque élève, pour que toute la classe lise la même histoire. Le plus : envoyez-la à un·e collègue, qui peut l'ajouter dans sa langue ou l'adapter à sa classe.",
    modeText: "À partir d'un texte", modeWrite: "Écrire de zéro", genreLabel: "Genre", topicLabel: "Sujet",
    topicPlaceholder: "Ex. une sortie à Lyon avec la classe · ma famille · le marché du samedi", writeHint: "Livella écrit un texte original au niveau choisi. Indiquez un sujet, ou collez des notes ou des faits ; même en anglais.",
    errTopic: "Indiquez un sujet.", write: "Écrire", writing: "J'écris...",
    profileLabel: "Aides", profileHint: "Le niveau ne change pas. Choisissez-en une ou plusieurs.", pagesView: "Pages", notWritten: "n'est pas encore écrit.", writeLevel: "Écrire ce niveau", writeHint: "La Scala écrit les cinq d'un coup.", fromScala: "De La Scala : texte seul.", fullVersion: "Ajouter vocabulaire et notes pour l'enseignant", heroExample: "Ceci est un exemple. Collez votre lecture ci-dessous.", standard: "Standard", standardSub: "aucune adaptation",
    wordBank: "Banque de mots", microTask: "Mini-tâche", of: "sur", accommodations: "Adaptations appliquées", pdfFontNote: "Dans le PDF, la police Lexend n'est pas disponible : l'espacement et la longueur des lignes suivent quand même les règles.",
  },
  en: {
    inputLabel: "Text or topic",
    placeholder: "Paste an article, a song, a chapter from the book... or type a topic in English.",
    purposeLabel: "Reading purpose", levelLabel: "Level",
    go: "Livella", going: "Leveling...",
    errEmpty: "Enter some text or a topic.", errGeneric: "Something went wrong. Try again.",
    errCompare: "Comparison failed.", errActivity: "Could not generate that activity.", errExercise: "Could not generate the exercises.",
    errNotGranted: "This page isn't allowed to use Claude yet. Open the page's Permissions menu, allow access, then try again.",
    errRate: "Too many requests at once. Wait a moment and try again.",
    showOriginal: "Show original", hideOriginal: "Hide original", original: "Original",
    vocab: "Vocabulary", teacherNote: "Teacher note",
    compareLabel: "Compare with another level", closeCompare: "Close comparison",
    easier: "← Easier", harder: "Harder →",
    copyAll: "Copy all", copied: "Copied ✓", print: "Print / PDF",
    buildTitle: "Build exercises", buildSub: "Build your own exercise set — pick the type, count, and difficulty.",
    typeLabel: "Type", countLabel: "How many", diffLabel: "Difficulty",
    genExercises: "Generate exercises", generating: "Generating...", questions: "questions", remove: "Remove",
    whatDoWeDo: "What are we doing?", activitiesSub: "Classroom activities — choose what to generate.",
    ready: "✓ ready", emptyActivities: "Click an activity above to start",
    answer: "Answer", name: "Name", date: "Date", klass: "Class",
    uploadBtn: "Upload an image or .txt file", uploadHint: "Photo or screenshot: Claude reads the text in the image. You can also paste a screenshot (Ctrl+V) or drag it onto the box.",
    linkLabel: "Source link", linkHint: "Citation on the handout only — the page can't open links. Paste the text above.",
    source: "Source", errImages: "Images aren't available in this view. Paste the text instead.", errFile: "Can't read that file. Use an image (JPG/PNG) or a .txt file.",
    scalaBtn: "La Scala — all five levels", scalaBuilding: "Building the ladder...", scalaTitle: "La Scala",
    scalaSub: "The same text at five levels, paragraph by paragraph. Tap ↑ or ↓ on a paragraph to move it one level up or down.",
    up: "Up", down: "Down", allUp: "All up", allDown: "All down", rung: "rung", scalaReset: "Back to my level",
    errScala: "Couldn't build the ladder.", scalaCount: "paragraphs",
    pdfStudent: "Student PDF", pdfTeacher: "Teacher PDF", pdfBuilding: "Building the PDF...", teacherGuide: "Teacher guide", studentSheet: "Student sheet",
    errPdf: "Can't download the PDF in this view.", pdfDeclined: "Download cancelled.",
    heroHead: "The right level for every student.", heroSub: "Paste a text, or just a topic. Livella hands back the same page at every level in your room, with supports for the readers who need them.", heroCta: "Level a text now", heroMicro: "Five levels · four languages · reader profiles",
    cmpTitle: "Compare", cmpLevel: "Level", cmpProfile: "Support", cmpLang: "Language", cmpHint: "Each comparison is a new generation. Your page stays on the left.", cmpWorking: "Preparing the comparison...",
    switchWarn: "Switching to {x} clears the lesson on screen.", switchYes: "Switch to {x}", switchNo: "Stay here", switchTip: "To see the same lesson in another language, use Compare → Language.",
    listen: "Listen", stopListen: "Stop", slow: "Slow", hideText: "Hide the text", showText: "Show the text", hiddenNote: "Text hidden. Listen and answer.", errVoice: "This device has no voice for this language.", listenNote: "Browser voice: quality depends on the device.",
    rights: "All rights reserved.",
    learnersLabel: "Learners", learnersHint: "The level is proficiency. Here you choose the age: topics, length and tasks change.",
    shareBtn: "Share with a colleague", shareTitle: "Shared lesson", shareName: "Your name", shareNamePh: "So your colleague knows who wrote what", shareSave: "Create the link", shareLink: "Link", copyLink: "Copy link", copiedLink: "Link copied ✓", refresh: "Refresh", shareHint: "Anyone with the link can view this lesson. Changing it needs the teacher passcode. Shared lessons are deleted after 90 days.", sharedBy: "Started by {x}.", versions: "Versions", addLang: "Add {x}", adding: "Writing...", edit: "Edit", save: "Save", cancel: "Cancel", editedBy: "Last saved by {x}", notes: "Notes", noNotes: "No notes yet.", notePh: "Leave a note for your colleague", addNote: "Add note", pdfAll: "PDF: all versions", errShare: "Couldn't save the shared lesson.", errLoad: "Couldn't open that shared lesson. The link may have expired.", saving: "Saving...", loadingShared: "Opening the shared lesson...",
    tagline: "the right text, at the right level", forAll: "for everyone",
    inviteBtn: "Share Livella", inviteCopied: "Message and link copied ✓", inviteText: "Language learning looks different for every student. Livella takes any reading and rewrites it at each student's level, so the whole class reads the same story. Best part: send it to a colleague and they can add it in their language or edit it for their own class.",
    modeText: "From a text", modeWrite: "Write from scratch", genreLabel: "Genre", topicLabel: "Topic",
    topicPlaceholder: "e.g. a class trip · my family · the Saturday market", writeHint: "Livella writes an original text at the chosen level. Type a topic, or paste notes or facts; English is fine.",
    errTopic: "Enter a topic.", write: "Write", writing: "Writing...",
    profileLabel: "Supports", profileHint: "The level never changes. Pick one or more.", pagesView: "Pages", notWritten: "is not written yet.", writeLevel: "Write this level", writeHint: "La Scala writes all five at once.", fromScala: "From La Scala: text only.", fullVersion: "Add vocabulary and teacher notes", heroExample: "This is an example. Paste your own reading below.", standard: "Standard", standardSub: "no adaptations",
    wordBank: "Word bank", microTask: "Micro-task", of: "of", accommodations: "Accommodations applied", pdfFontNote: "The Lexend font isn't available in the PDF; spacing and line length still follow the rules.",
  },  es: {
    inputLabel: "Texto o tema",
    placeholder: "Pega un artículo, una canción, un capítulo del libro... o escribe un tema en inglés.",
    purposeLabel: "Tipo de lectura", levelLabel: "Nivel",
    go: "Livella", going: "Nivelando...",
    errEmpty: "Escribe un texto o un tema.", errGeneric: "Algo salió mal. Inténtalo de nuevo.",
    errCompare: "La comparación falló.", errActivity: "No se pudo generar la actividad.", errExercise: "No se pudieron generar los ejercicios.",
    errNotGranted: "Esta página aún no tiene permiso para usar Claude. Abre el menú Permisos de la página, permite el acceso e inténtalo de nuevo.",
    errRate: "Demasiadas solicitudes a la vez. Espera un momento e inténtalo de nuevo.",
    showOriginal: "Mostrar original", hideOriginal: "Ocultar original", original: "Original",
    vocab: "Vocabulario", teacherNote: "Nota para el docente",
    compareLabel: "Comparar con otro nivel", closeCompare: "Cerrar comparación",
    easier: "← Más fácil", harder: "Más difícil →",
    copyAll: "Copiar todo", copied: "Copiado ✓", print: "Imprimir / PDF",
    buildTitle: "Crear ejercicios", buildSub: "Arma tu propio conjunto: elige el tipo, la cantidad y la dificultad.",
    typeLabel: "Tipo", countLabel: "Cantidad", diffLabel: "Dificultad",
    genExercises: "Generar ejercicios", generating: "Generando...", questions: "preguntas", remove: "Quitar",
    whatDoWeDo: "¿Qué hacemos?", activitiesSub: "Actividades de clase: elige qué generar.",
    ready: "✓ listo", emptyActivities: "Haz clic en una actividad para empezar",
    answer: "Respuesta", name: "Nombre", date: "Fecha", klass: "Clase",
    uploadBtn: "Subir una imagen o un archivo .txt", uploadHint: "Foto o captura de pantalla: Claude lee el texto de la imagen. También puedes pegar una captura (Ctrl+V) o arrastrarla al cuadro.",
    linkLabel: "Enlace de la fuente", linkHint: "Solo para la cita en la hoja: la página no abre enlaces. Pega el texto arriba.",
    source: "Fuente", errImages: "Las imágenes no están disponibles en esta vista. Pega el texto.", errFile: "No se puede leer ese archivo. Usa una imagen (JPG/PNG) o un archivo .txt.",
    scalaBtn: "La Scala — los cinco niveles", scalaBuilding: "Construyendo la escalera...", scalaTitle: "La Scala",
    scalaSub: "El mismo texto en cinco niveles, párrafo por párrafo. Toca ↑ o ↓ en un párrafo para subirlo o bajarlo un nivel.",
    up: "Subir", down: "Bajar", allUp: "Todos arriba", allDown: "Todos abajo", rung: "peldaño", scalaReset: "Volver a mi nivel",
    errScala: "No se pudo construir la escalera.", scalaCount: "párrafos",
    pdfStudent: "PDF del estudiante", pdfTeacher: "PDF del docente", pdfBuilding: "Creando el PDF...", teacherGuide: "Guía del docente", studentSheet: "Hoja del estudiante",
    errPdf: "No se puede descargar el PDF en esta vista.", pdfDeclined: "Descarga cancelada.",
    heroHead: "El nivel adecuado para cada estudiante.", heroSub: "Pega un texto, o solo un tema. Livella te devuelve la misma página en cada nivel de tu clase, con apoyos para los lectores que los necesitan.", heroCta: "Nivelar un texto", heroMicro: "Cinco niveles · cuatro idiomas · perfiles de lectura",
    cmpTitle: "Comparar", cmpLevel: "Nivel", cmpProfile: "Apoyo", cmpLang: "Idioma", cmpHint: "Cada comparación es una nueva generación. Tu página queda a la izquierda.", cmpWorking: "Preparando la comparación...",
    switchWarn: "Cambiar a {x} borra la lección en pantalla.", switchYes: "Cambiar a {x}", switchNo: "Quedarme aquí", switchTip: "Para ver la misma lección en otro idioma, usa Comparar → Idioma.",
    listen: "Escuchar", stopListen: "Detener", slow: "Lento", hideText: "Ocultar el texto", showText: "Mostrar el texto", hiddenNote: "Texto oculto. Escucha y responde.", errVoice: "Este dispositivo no tiene una voz para este idioma.", listenNote: "Voz del navegador: la calidad depende del dispositivo.",
    rights: "Todos los derechos reservados.",
    learnersLabel: "Estudiantes", learnersHint: "El nivel indica la competencia. Aquí eliges la edad: cambian los temas, la extensión y las tareas.",
    shareBtn: "Compartir con un colega", shareTitle: "Lección compartida", shareName: "Tu nombre", shareNamePh: "Para que tu colega sepa quién escribió qué", shareSave: "Crear el enlace", shareLink: "Enlace", copyLink: "Copiar enlace", copiedLink: "Enlace copiado ✓", refresh: "Actualizar", shareHint: "Cualquier persona con el enlace puede ver esta lección. Para cambiarla se necesita el código docente. Las lecciones compartidas se borran después de 90 días.", sharedBy: "Iniciada por {x}.", versions: "Versiones", addLang: "Añadir {x}", adding: "Escribiendo...", edit: "Editar", save: "Guardar", cancel: "Cancelar", editedBy: "Último guardado: {x}", notes: "Notas", noNotes: "Aún no hay notas.", notePh: "Deja una nota para tu colega", addNote: "Añadir nota", pdfAll: "PDF: todas las versiones", errShare: "No se pudo guardar la lección compartida.", errLoad: "No se pudo abrir esa lección compartida. El enlace puede haber caducado.", saving: "Guardando...", loadingShared: "Abriendo la lección compartida...",
    tagline: "el texto adecuado, al nivel adecuado", forAll: "para todos",
    inviteBtn: "Compartir Livella", inviteCopied: "Mensaje y enlace copiados ✓", inviteText: "Aprender un idioma es distinto para cada estudiante. Livella toma una lectura y la reescribe al nivel de cada estudiante, para que toda la clase lea la misma historia. Lo mejor: envíasela a un colega, que puede añadirla en su idioma o adaptarla a su clase.",
    modeText: "A partir de un texto", modeWrite: "Escribir desde cero", genreLabel: "Género", topicLabel: "Tema",
    topicPlaceholder: "p. ej. una excursión de la clase · mi familia · el mercado del sábado", writeHint: "Livella escribe un texto original en el nivel elegido. Escribe un tema, o pega apuntes o datos; puede ser en inglés.",
    errTopic: "Escribe un tema.", write: "Escribir", writing: "Escribiendo...",
    profileLabel: "Apoyos", profileHint: "El nivel no cambia. Elige uno o más.", pagesView: "Páginas", notWritten: "aún no está escrito.", writeLevel: "Escribir este nivel", writeHint: "La Scala escribe los cinco a la vez.", fromScala: "De La Scala: solo el texto.", fullVersion: "Añadir vocabulario y notas para docentes", heroExample: "Esto es un ejemplo. Pega tu lectura abajo.", standard: "Estándar", standardSub: "sin adaptaciones",
    wordBank: "Banco de palabras", microTask: "Mini-tarea", of: "de", accommodations: "Adaptaciones aplicadas", pdfFontNote: "La fuente Lexend no está disponible en el PDF; el espaciado y la longitud de línea siguen las reglas.",
  },
};


const PURPOSES = [
  { id: "warmup", label: { it: "Riscaldamento", fr: "Échauffement", en: "Warm-up", es: "Calentamiento" }, sub: { it: "Warm-up", fr: "Warm-up", en: "60–100 words", es: "60–100 palabras" }, promptName: "Riscaldamento", promptSub: "Warm-up", description: "short passage (60-100 words), simple comprehension, activates background knowledge" },
  { id: "main", label: { it: "Lezione principale", fr: "Leçon principale", en: "Main lesson", es: "Lección principal" }, sub: { it: "Main lesson", fr: "Main lesson", en: "140–200 words", es: "140–200 palabras" }, promptName: "Lezione principale", promptSub: "Main lesson", description: "full passage (140-200 words), full activity suite, balances skills" },
  { id: "homework", label: { it: "Compito a casa", fr: "Devoir à la maison", en: "Homework", es: "Tarea" }, sub: { it: "Homework", fr: "Homework", en: "180–250 words", es: "180–250 palabras" }, promptName: "Compito a casa", promptSub: "Homework", description: "longer passage (180-250 words), independent work, clearer scaffolding in questions" },
  { id: "assessment", label: { it: "Verifica", fr: "Évaluation", en: "Assessment", es: "Evaluación" }, sub: { it: "Assessment", fr: "Assessment", en: "includes inference", es: "incluye inferencia" }, promptName: "Verifica", promptSub: "Assessment", description: "full passage (140-200 words), sharper questions, no hints, includes inference" },
];

const EXERCISE_TYPES = [
  { id: "multiple_choice", label: { it: "Scelta multipla", fr: "Choix multiple", en: "Multiple choice", es: "Opción múltiple" }, sub: { it: "Multiple choice", fr: "Multiple choice", en: "", es: "" } },
  { id: "true_false", label: { it: "Vero o falso", fr: "Vrai ou faux", en: "True / False", es: "Cierto / Falso" }, sub: { it: "True / False", fr: "True / False", en: "", es: "" } },
  { id: "short_answer", label: { it: "Risposta breve", fr: "Réponse courte", en: "Short answer", es: "Respuesta corta" }, sub: { it: "Short answer", fr: "Short answer", en: "", es: "" } },
  { id: "fill_blank", label: { it: "Riempi gli spazi", fr: "Texte à trous", en: "Fill in the blank", es: "Completar espacios" }, sub: { it: "Fill in the blank", fr: "Fill in the blank", en: "", es: "" } },
];

const COUNTS = [3, 5, 8, 10];

const DIFFICULTIES = [
  { id: "easier", label: { it: "Più facile", fr: "Plus facile", en: "Easier", es: "Más fácil" }, sub: { it: "Easier", fr: "Easier", en: "literal recall", es: "recuerdo literal" }, description: "literal recall, direct retrieval from text" },
  { id: "standard", label: { it: "Standard", fr: "Standard", en: "Standard", es: "Estándar" }, sub: { it: "At-level", fr: "At-level", en: "at level", es: "al nivel" }, description: "matches the reading's complexity" },
  { id: "harder", label: { it: "Più difficile", fr: "Plus difficile", en: "Harder", es: "Más difícil" }, sub: { it: "Harder", fr: "Harder", en: "inference", es: "inferencia" }, description: "inference, analysis, between-the-lines thinking" },
];

// ===== SCRIVI (generation mode): genres Livella can write from scratch =====
// Conventions are written for the model in English and apply to every language;
// examples are described, not quoted, so no language's phrasing leaks into another's prompt.
const GENRES = [
  { id: "postcard", label: { it: "Cartolina", fr: "Carte postale", en: "Postcard", es: "Postal" }, sub: { it: "Postcard", fr: "Postcard", en: "50–90 words", es: "50–90 palabras" }, promptName: "Postcard",
    conventions: "A postcard: a greeting line, 3-6 sentences about where the writer is and what they are doing, a closing and a signature. 50-90 words at the middle rung; the genre's length wins over the purpose length. Informal register. Lowest rung: fixed, high-frequency chunks (greeting, 'I am in...', weather, one food, one activity). Highest rung: vivid detail, varied connectors, a touch of humour." },
  { id: "letter", label: { it: "Lettera / Email", fr: "Lettre / Courriel", en: "Letter / Email", es: "Carta / Correo" }, sub: { it: "Letter / Email", fr: "Letter / Email", en: "formal or informal", es: "formal o informal" }, promptName: "Letter or email",
    conventions: "A letter or email with an opening, body and closing. The register (formal or informal) must fit the addressee named in the topic; if none is named, write to a friend. Lower rungs: informal and short. Highest rung: may be formal (a request, a complaint, an application) using the language's real conventions of formal correspondence." },
  { id: "story", label: { it: "Racconto", fr: "Récit", en: "Story", es: "Cuento" }, sub: { it: "Short story", fr: "Short story", en: "narrative", es: "narración" }, promptName: "Short story",
    conventions: "A short narrative with a beginning, a complication and an ending. Named characters and a concrete setting in the target culture. Where the rung's calibration forbids past tenses, narrate in the present. Higher rungs: past narration and dialogue as the calibration allows." },
  { id: "article", label: { it: "Articolo informativo", fr: "Article informatif", en: "Informational article", es: "Artículo informativo" }, sub: { it: "Informational", fr: "Informational", en: "facts · explanation", es: "datos · explicación" }, promptName: "Informational article",
    conventions: "An informational text that explains the topic or presents the facts given in the TOPIC: a headline-style title, a short opening that states the subject, then 2-4 short paragraphs that each develop one aspect. Neutral register. If the TOPIC contains notes or facts, use them and never contradict them; do not invent statistics, dates or quotations. Lower rungs: simple declarative sentences, one fact each. Higher rungs: connectors of cause and contrast and precise vocabulary. Paragraphs separated by a blank line." },
  { id: "dialogue", label: { it: "Dialogo", fr: "Dialogue", en: "Dialogue", es: "Diálogo" }, sub: { it: "Dialogue", fr: "Dialogue", en: "two speakers", es: "dos hablantes" }, promptName: "Dialogue",
    conventions: "A conversation between two named speakers. Each turn on its own line, prefixed with the speaker's name and a colon. 8-16 turns at the middle rung. Natural spoken language with the fillers and reactions typical of the culture. Performable by two students. Separate turns with newline characters inside the JSON string." },
  { id: "essay", label: { it: "Saggio", fr: "Essai", en: "Essay", es: "Ensayo" }, sub: { it: "Essay", fr: "Essay", en: "opinion / argument", es: "opinión / argumento" }, promptName: "Essay",
    conventions: "An opinion or argumentative text with a thesis, reasons and a conclusion. At the two lowest rungs the 'essay' is one short opinion paragraph of 4-7 simple sentences ('I like X because...', 'In my opinion...' in the target language). Middle rung: three short paragraphs. Highest rungs: full structure with connectors of argument and, where the calibration allows, the moods the language uses after opinion verbs." },
  { id: "rhyme", label: { it: "Filastrocca", fr: "Comptine", en: "Rhyme", es: "Rima" }, sub: { it: "Rhyme / chant", fr: "Rhyme / chant", en: "8–12 lines", es: "8–12 versos" }, promptName: "Rhyme or chant",
    conventions: "A short rhyming chant of 8-12 lines with a regular rhythm, built on repetition so a class can recite it. Lower rungs: every line is a complete simple sentence. Higher rungs: internal rhyme, richer vocabulary, a playful twist in the last couplet. One line per newline; stanzas separated by a blank line, inside the JSON string." },
  { id: "song", label: { it: "Canzone", fr: "Chanson", en: "Song", es: "Canción" }, sub: { it: "Song lyrics", fr: "Song lyrics", en: "verses + refrain", es: "estrofas + estribillo" }, promptName: "Song lyrics",
    conventions: "Original song lyrics: two or three verses and a repeated refrain, each section labelled in the target language (Verse 1 / Refrain equivalents). Rhyme and a singable, regular line length. This is a DRAFT the class will improve and perform, so keep the structure plain and the refrain very memorable. Never reproduce, adapt or imitate an existing song. One line per newline; sections separated by a blank line, inside the JSON string." },
  { id: "description", label: { it: "Descrizione", fr: "Description", en: "Description", es: "Descripción" }, sub: { it: "Description", fr: "Description", en: "person · place · object", es: "persona · lugar · objeto" }, promptName: "Description",
    conventions: "A descriptive text about a person, place, object or scene from the topic, organised spatially or by category. Lower rungs: simple sentences, one adjective each. Higher rungs: comparisons, sensory detail, figurative language where the calibration allows." },
];

// ===== LEARNER PROFILES =====
// Each profile adds rules ON TOP of the level the teacher chose. The level never changes.
// writing → passage/ladder prompts · tasks → activity/exercise prompts · the id → CSS class p-<id>.
// On screen and on paper each support is named for WHAT IT DOES, never for a diagnosis (v0.16).
// The ids below are internal and stay as they were so lessons already shared keep opening.
// Sources: BDA Dyslexia Friendly Style Guide (dyslexia); CAST UDL guidelines (ADHD);
// autism-informed literal-language practice (neuro). "support" is the bundle of common
// IEP/504 reading accommodations and is labelled reading support, never "IEP-compliant".
const PROFILES = [
  { id: "dyslexia", label: { it: "Formato chiaro", fr: "Format clair", en: "Clear format", es: "Formato claro" }, sub: { it: "carattere leggibile · frasi brevi", fr: "police lisible · phrases courtes", en: "easy-read type · short sentences", es: "letra legible · frases cortas" },
    writing: "CLEAR FORMAT: sentences of 8-12 words, one idea each; paragraphs of 2-3 sentences separated by a blank line; high-frequency words; no idioms or figurative language; never three polysyllabic words in a row; the glossed words are the hardest words in the text and appear in it exactly as glossed.",
    tasks: "CLEAR FORMAT: multiple choice over open answer; every open item carries an answer stem; nothing timed; instructions in one short sentence." },
  { id: "adhd", label: { it: "Blocchi brevi", fr: "Blocs courts", en: "Short chunks", es: "Bloques cortos" }, sub: { it: "4 blocchi · un mini-compito dopo ognuno", fr: "4 blocs · une mini-tâche après chacun", en: "4 chunks · a quick task after each", es: "4 bloques · una mini-tarea tras cada uno" },
    writing: "SHORT CHUNKS: the text is EXACTLY 4 chunks separated by a blank line; each chunk is 2-3 sentences and a complete thought on its own; the whole text finishable in under 8 minutes. ALSO return \"micro_tasks\": an array of exactly 4 strings, one per chunk, in the target language at the level, each doable in under 30 seconds (true/false, circle a word, say one sentence to a partner).",
    tasks: "SHORT CHUNKS: build in choice ('pick 2 of these 3'); 3 comprehension items instead of 5; one movement option in production (stand up and ask three classmates)." },
  { id: "neuro", label: { it: "Linguaggio letterale", fr: "Langage littéral", en: "Literal language", es: "Lenguaje literal" }, sub: { it: "niente modi di dire · struttura prevedibile", fr: "sans expressions idiomatiques · structure prévisible", en: "no idioms · predictable structure", es: "sin modismos · estructura predecible" },
    writing: "LITERAL LANGUAGE: fully literal language — no idioms, sarcasm, irony, metaphor or rhetorical questions; say exactly what is meant; predictable structure with explicit signposting (first, then, finally); the same name for the same person or thing every time, never a synonym; concrete, specific details; no sudden tone shifts or surprises; a clear final sentence that closes the text.",
    tasks: "LITERAL LANGUAGE: explicit, literal instructions; one question type at a time; no 'how would you feel' without answer choices; no trick options or double negatives; give a worked example before the first item." },
  { id: "support", label: { it: "Supporto alla lettura", fr: "Soutien à la lecture", en: "Reading support", es: "Apoyo a la lectura" }, sub: { it: "banca di parole · testo più breve", fr: "banque de mots · texte plus court", en: "word bank · shorter text", es: "banco de palabras · texto más corto" },
    writing: "READING SUPPORT: text 40% shorter than the purpose length; one paragraph = one event, paragraphs separated by a blank line; explicit sequence words (first, then, finally in the target language). ALSO return \"word_bank\": the 5 glosses plus 5 more useful words from the text (10 total) as [{\"word\",\"translation\"}].",
    tasks: "READING SUPPORT: a sentence frame for every production item; every question carries an answer stem; matching over fill-in-the-blank; reduced set: 3 comprehension, 2 vocabulary." },
];
const PROFILE_STACK = "These rules stack: where two rules conflict, the stricter one wins (shorter, simpler, more explicit). The LEVEL never changes — a profile changes how the level is written, shown and practised, not what the level is.";

function profileWritingBlock(ids) {
  const ps = PROFILES.filter((p) => ids.includes(p.id));
  if (!ps.length) return "";
  return `\n\nLEARNER PROFILE RULES (obey exactly):\n${ps.map((p) => "- " + p.writing).join("\n")}\n${PROFILE_STACK}`;
}
function profileTaskBlock(ids) {
  const ps = PROFILES.filter((p) => ids.includes(p.id));
  if (!ps.length) return "";
  return `\n\nLEARNER PROFILE TASK RULES (obey exactly):\n${ps.map((p) => "- " + p.tasks).join("\n")}\n${PROFILE_STACK}`;
}

// ===== LEARNERS (age band) =====
// Proficiency (the level) and age are separate: a Novice Mid reader can be 7 or 19.
// The band changes topics, length, tone and task types. The level's language rules stay the ceiling.
// "high" adds no rules: it is the behaviour the tool has always had.
const AGE_BANDS = [
  { id: "elem", label: { it: "Elementari", fr: "Élémentaire", en: "Elementary", es: "Primaria" }, sub: { it: "classi 1–5", fr: "1re–5e année", en: "grades 1–5", es: "grados 1–5" },
    writing: "ELEMENTARY SCHOOL (about ages 6-10). Topics from a child's world: family, pets and animals, food, the school day, games, seasons, celebrations. Very short: at most half the purpose length. Sentences of 4-8 words. Deliberate repetition of the key words and of one sentence pattern. Concrete nouns and actions a child can picture or act out; no abstractions, no irony. A named child or animal as the main character. Gloss words a child could draw.",
    tasks: "ELEMENTARY: only tasks a 6-10 year old can do: circle, match, draw and label, point and say, act it out, yes/no. No written paragraphs. Instructions of at most 8 words. 3 items per set." },
  { id: "middle", label: { it: "Medie", fr: "Collège", en: "Middle school", es: "Escuela media" }, sub: { it: "classi 6–8", fr: "6e–8e année", en: "grades 6–8", es: "grados 6–8" },
    writing: "MIDDLE SCHOOL (about ages 11-13). Topics from early-teen life: friends, sports, music, phones and games, school life, food, weekend plans; a touch of humour is welcome. Short: toward the low end of the purpose length. One idea per paragraph, paragraphs of 2-3 sentences. A relatable character of the same age. Nothing childish, nothing preachy.",
    tasks: "MIDDLE SCHOOL: quick tasks of under a minute each; a choice in at least one ('pick 2 of 3'); one partner-talk item; concrete over abstract." },
  { id: "high", label: { it: "Superiori", fr: "Lycée", en: "High school", es: "Escuela secundaria" }, sub: { it: "classi 9–12", fr: "9e–12e année", en: "grades 9–12", es: "grados 9–12" }, writing: "", tasks: "" },
  { id: "college", label: { it: "Università / Adulti", fr: "Université / Adultes", en: "College / Adult", es: "Universidad / Adultos" }, sub: { it: "adulti", fr: "adultes", en: "adults", es: "adultos" },
    writing: "COLLEGE / ADULT LEARNERS. Keep the language at the level, but never childish. Adult topics and settings: work, study abroad, travel logistics, housing, news, society, culture. Adult characters. At the same level the text may sit at the upper end of the purpose length and carry more information per sentence. No cartoonish names and no school-day framing.",
    tasks: "COLLEGE / ADULT: open questions, an opinion with a reason, a comparison with the learner's own experience, one analysis item. No drawing or acting tasks." },
];
function ageBlock(id) {
  const a = AGE_BANDS.find((x) => x.id === id);
  return a && a.writing ? `\n\nLEARNER AGE RULES (obey; the level's language rules remain the ceiling):\n- ${a.writing}` : "";
}
function ageTaskBlock(id) {
  const a = AGE_BANDS.find((x) => x.id === id);
  return a && a.tasks ? `\n\nLEARNER AGE TASK RULES (obey):\n- ${a.tasks}` : "";
}

function genreBlock(genre, topic) {
  return `\n\nGENRE: ${genre.promptName}\nGENRE CONVENTIONS: ${genre.conventions}\n\nTOPIC (may be in English; write the text in the target language):\n${topic}`;
}

// ===== PROMPTS (built per language so calibration always matches the chosen ladder) =====
function buildPassagePrompt(L, mode = "text") {
  const write = mode === "write";
  const calibration = L.levels.map((l) => `${l.label.toUpperCase()} (${l.sub}): ${l.calibration}`).join("\n\n");
  const pedagogy = L.id === "esl"
    ? "WIDA English Language Development standards and Comprehensible Input pedagogy"
    : "ACTFL proficiency guidelines and Comprehensible Input pedagogy";
  const natural = L.id === "esl"
    ? `NATURAL ENGLISH: Write the way people actually speak and write today, NOT like a simplified-reader from 1995.`
    : `NATURAL ${L.langEn.toUpperCase()}: Write the way ${L.langEn} speakers actually speak, NOT like a 1995 textbook.`;
  const job = write
    ? `who writes ORIGINAL ${L.langEn} texts for American secondary students at a precise proficiency level, according to ${pedagogy}`
    : `who specializes in re-leveling ${L.langEn} text for American secondary students according to ${pedagogy}`;
  const genreRules = write ? `
7. GENRE: Follow the GENRE CONVENTIONS in the request exactly — form, register, layout. Where the genre has a natural length, the genre's length wins over the purpose length.
8. ORIGINAL: Invent the content from the TOPIC. Names, places, foods, habits and details must be authentic to ${L.culture}, never generic.` : "";
  return `You are Livella, an expert ${L.langEn} language teacher ${job}.

CORE PRINCIPLES:
1. PROFICIENCY-FIRST: Match the requested level precisely. Do not exceed it. Never use a structure from a higher level on the ladder.
2. COMPREHENSIBLE INPUT: 95-98% known vocabulary at the target level.
3. ${natural}
4. REPETITION: Allow key words to repeat naturally.
5. CULTURAL AUTHENTICITY: Content reflects ${L.culture}. No tourist-board stereotypes.
6. PURPOSE-AWARE: Length and density match the reading's purpose.${genreRules}

LEVEL CALIBRATION (${L.framework}):

${calibration}

PURPOSE CALIBRATION:
- Riscaldamento (warm-up): 60-100 words, simple structure
- Lezione principale (main lesson): 140-200 words, balanced complexity
- Compito a casa (homework): 180-250 words, more independent
- Verifica (assessment): 140-200 words, includes inference

LEARNER PROFILES: If the request contains LEARNER PROFILE RULES, obey them exactly. They never change the level. Report what you applied in "accommodations". In "accommodations", "teacher_note" and everywhere else, describe what was changed in the text; NEVER name a diagnosis, condition or plan (no dyslexia, ADHD, autism, neurodivergent, IEP, 504).
LEARNER AGE: If the request contains LEARNER AGE RULES, obey them. They choose topics, length and tone; the level's language rules remain the ceiling.

${translationRule(L)}

OUTPUT FORMAT (respond with ONLY a JSON object, no other text, no markdown fences):
{
  "title": "${L.langEn} title (3-6 words)",
  "passage": "${write ? `The full original ${L.langEn} text. Keep line breaks as \\n inside the string where the genre needs them.` : `The full re-leveled ${L.langEn} text.`}",
  "glosses": [{"word": "${L.langEn} word from the passage", "translation": "${L.glossRule}"${L.support.includes("it") ? ', "it": "Italian gloss"' : ""}}],
  "teacher_note": "1-2 sentence note in English about what you targeted.",
  "accommodations": ["short English list of the changes you made for these rules, described by what changed — empty array when there are none"],
  "word_bank": [{"word": "...", "translation": "..."}] ONLY when a profile asks for it — otherwise omit the key,
  "micro_tasks": ["..."] ONLY when a profile asks for it — otherwise omit the key${translationSpec(L, "the full passage (title included on its first line)")}
}

Exactly 5 glosses. No text before/after JSON.`;
}

// La Scala: one call, the passage at every rung, paragraph-aligned.
function buildScalaPrompt(L, mode = "text") {
  const write = mode === "write";
  const calibration = L.levels.map((l, i) => `RUNG ${i + 1} — ${l.label.toUpperCase()} (${l.sub}): ${l.calibration}`).join("\n\n");
  const pedagogy = L.id === "esl" ? "WIDA English Language Development standards" : "ACTFL proficiency guidelines";
  const what = write ? "Write ONE ORIGINAL text, in the GENRE and on the TOPIC given in the request," : "Write ONE passage";
  const genreRules = write ? `
8. GENRE: the GENRE CONVENTIONS apply at EVERY rung (form, register, layout), adapted to each rung's calibration. A "paragraph" is the genre's natural unit: a stanza for a rhyme or song, a block of 2-4 turns for a dialogue, a paragraph otherwise. Keep line breaks as \\n inside the strings where the genre needs them.
9. ORIGINAL: invent the content from the TOPIC; names, places and details authentic to ${L.culture}.` : "";
  return `You are Livella, an expert ${L.langEn} language teacher. ${what} at ALL FIVE proficiency rungs at once, aligned paragraph by paragraph, according to ${pedagogy} and Comprehensible Input pedagogy.

THE LADDER (${L.framework}):

${calibration}

ALIGNMENT RULES — these matter more than anything else:
1. Choose a paragraph count P between 3 and 5. EVERY rung has EXACTLY P paragraphs.
2. Paragraph i at every rung tells the SAME events and facts in the SAME order. Only the language changes.
3. A higher rung may add descriptive detail, connectors and richer vocabulary. It may NEVER add a new event, a new character, or change a fact.
4. A lower rung simplifies the language. It may NEVER drop an event that the other rungs have.
5. Each rung obeys its own calibration strictly. Never use a structure from a higher rung in a lower one.
6. Length follows the reading purpose for the MIDDLE rung; lower rungs are shorter, higher rungs longer, by at most 30%.
7. CULTURAL AUTHENTICITY: content reflects ${L.culture}. No tourist-board stereotypes.${genreRules}
LEARNER PROFILES: If the request contains LEARNER PROFILE RULES, they apply at EVERY rung and never change a rung's calibration. If a SHORT CHUNKS rule is present, P = 4. Never name a diagnosis, condition or plan anywhere in the output. Do not return micro_tasks or word_bank for the ladder.
LEARNER AGE: If the request contains LEARNER AGE RULES, they apply at EVERY rung (topics, length, tone) and never change a rung's calibration.

OUTPUT FORMAT (respond with ONLY a JSON object, no other text, no markdown fences):
{
  "title": "${L.langEn} title (3-6 words)",
  "rungs": [
    { "id": "${L.levels[0].id}", "paragraphs": ["paragraph 1", "paragraph 2", "..."] },
    { "id": "${L.levels[1].id}", "paragraphs": ["..."] },
    { "id": "${L.levels[2].id}", "paragraphs": ["..."] },
    { "id": "${L.levels[3].id}", "paragraphs": ["..."] },
    { "id": "${L.levels[4].id}", "paragraphs": ["..."] }
  ],
  "teacher_note": "1-2 sentences in English on what changes between rungs."
}

All five rungs, in this order, each with exactly P paragraphs. No text before/after JSON.`;
}

function buildActivitiesPrompt(L) {
  return `You are Livella, designing classroom activities for a ${L.langEn} reading passage.

Activity type: {ACTIVITY_TYPE}

PRINCIPLES:
- If the request contains LEARNER PROFILE TASK RULES or LEARNER AGE TASK RULES, obey them exactly (they override the counts below)
- ${L.langEn} in questions never harder than the passage
- Vary formats
- Include inference
- Cultural questions grounded in ${L.culture}

If "comprensione": 5 mixed-format (2 MC with 4 options, 1 T/F with justification, 2 short answer). At least one inference.
If "vocabolario": 4 activities (1 synonym hunt, 1 fill-in with 4 options, 1 match ${L.langEn}-to-${L.langEn} definitions with 4 pairs, 1 use-in-sentence).
If "produzione": 3 prompts (1 speaking with target structures listed, 1 writing 50-150 words, 1 partner activity).
If "cultura": ${L.cultureRule}

True/False answers use "${L.tf[0]}" / "${L.tf[1]}".

OUTPUT FORMAT (respond with ONLY a JSON object):
{
  "activity_type": "comprensione" | "vocabolario" | "produzione" | "cultura",
  "items": [
    {
      "instruction": "${L.langEn} instruction",
      "format": "multiple_choice" | "true_false" | "short_answer" | "fill_blank" | "match" | "speaking" | "writing" | "partner" | "open",
      "question": "Question or prompt",
      "options": [...] OR null,
      "answer": "Model answer" OR null,
      "note": "Optional teacher note" OR null${translationSpec(L, "the instruction, question, options and answer, in one readable block")}
    }
  ]
}
${translationRule(L)}
No text before/after JSON.`;
}

function buildCustomPrompt(L) {
  return `You are Livella, building focused exercises for a ${L.langEn} reading passage.

RULES:
- If the request contains LEARNER PROFILE TASK RULES or LEARNER AGE TASK RULES, obey them exactly
- All ${L.langEn} at or below passage level
- Difficulty = cognitive task, NOT linguistic level
- Items grounded in the passage

DIFFICULTY:
- easier: literal retrieval
- standard: comprehension, may combine sentences
- harder: inference, why questions, tone, implication

TYPES:
multiple_choice: 4 options, plausible distractors, answer = letter + correct text
true_false: ${L.tf[0]}/${L.tf[1]} + justification, answer = "${L.tf[0]}"/"${L.tf[1]}" + justification
short_answer: open, options=null, answer = 1-2 sentence model
fill_blank: real passage sentence with ONE key word as _____. question = full sentence with blank. options = 4 word options (1 correct + 3 distractors). answer = correct word.

OUTPUT FORMAT (respond with ONLY a JSON object):
{
  "exercise_type": "...",
  "difficulty": "...",
  "items": [
    {
      "question": "...",
      "options": [...] OR null,
      "answer": "...",
      "note": "..." OR null${translationSpec(L, "the question, options and answer, in one readable block")}
    }
  ]
}
${translationRule(L)}
Exactly COUNT items. No text before/after JSON.`;
}

export default function Livella() {
  // A link such as …/livella/fr/ arrives here as ?l=fr: open that side, in that interface language.
  const startLang = (() => { try { const v = new URLSearchParams(window.location.search).get("l"); return ["it", "fr", "es"].includes(v) ? v : null; } catch (e) { return null; } })();
  const [lang, setLang] = useState(startLang || "it");
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("text");       // "text" = re-level a source · "write" = original text from a topic
  const [genre, setGenre] = useState("postcard");
  const [topic, setTopic] = useState("");
  const [profiles, setProfiles] = useState([]);   // ids from PROFILES; [] = Standard
  const [ageBand, setAgeBand] = useState("high");  // id from AGE_BANDS
  // Front-page fan: which level is in front, Standard or ADHD view, opened yet, still auto-advancing.
  const [heroIdx, setHeroIdx] = useState(1);
  const [heroAdhd, setHeroAdhd] = useState(false);
  const [heroOpen, setHeroOpen] = useState(false);
  const [heroAuto, setHeroAuto] = useState(true);
  const toolRef = useRef(null);
  const [uiPref, setUiPref] = useState(() => {
    let saved = {};
    try { saved = JSON.parse(window.localStorage.getItem("livella.ui") || "{}") || {}; } catch (e) {}
    return startLang ? { ...saved, [startLang]: startLang } : saved;
  });
  // Compare control: which tab is open, what the right-hand column currently shows, which chip is loading.
  const [cmpTab, setCmpTab] = useState("level");
  const [cmpInfo, setCmpInfo] = useState(null);     // { kind, key, title, lang }
  const [cmpBusy, setCmpBusy] = useState(null);
  const [pendingLang, setPendingLang] = useState(null); // language waiting for "yes, clear my lesson"
  // Listen
  const [speaking, setSpeaking] = useState(false);
  const [slowVoice, setSlowVoice] = useState(false);
  const [hideText, setHideText] = useState(false);
  const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance === "function";
  function stopSpeaking() { if (canSpeak) window.speechSynthesis.cancel(); setSpeaking(false); }
  useEffect(() => { if (canSpeak) window.speechSynthesis.getVoices(); return () => { if (canSpeak) window.speechSynthesis.cancel(); }; }, []);
  function speak(text) {
    if (!canSpeak) return;
    if (speaking) { stopSpeaking(); return; }
    const code = SPEECH[lang] || "en-US", base = code.slice(0, 2);
    const voices = window.speechSynthesis.getVoices() || [];
    const voice = voices.find((v) => v.lang === code) || voices.find((v) => (v.lang || "").toLowerCase().startsWith(base));
    if (voices.length && !voice) { setError(T.errVoice); return; }
    // Some browsers cut long utterances short, so speak sentence by sentence.
    const parts = String(text).replace(/\s+/g, " ").match(/[^.!?…]+[.!?…]*/g) || [String(text)];
    window.speechSynthesis.cancel(); setError(null); setSpeaking(true);
    parts.map((p) => p.trim()).filter(Boolean).forEach((p, i, arr) => {
      const u = new window.SpeechSynthesisUtterance(p);
      u.lang = code; if (voice) u.voice = voice; u.rate = slowVoice ? 0.75 : 1;
      if (i === arr.length - 1) { u.onend = () => setSpeaking(false); }
      u.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(u);
    });
  }
  useEffect(() => { const t = setTimeout(() => setHeroOpen(true), 350); return () => clearTimeout(t); }, []);
  useEffect(() => {
    if (!heroAuto) return;
    if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setHeroIdx((i) => (i + 1) % 5), 6000);
    return () => clearInterval(t);
  }, [heroAuto]);
  function pickHero(i) { setHeroAuto(false); setHeroIdx(i); }
  function scrollToTool() { if (toolRef.current && toolRef.current.scrollIntoView) toolRef.current.scrollIntoView({ behavior: "smooth", block: "start" }); }
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [imagesOk, setImagesOk] = useState(null); // null = unknown yet
  const [pdfBusy, setPdfBusy] = useState(false);
  const [scala, setScala] = useState(null);        // { title, rungs[], teacher_note }
  const [scalaIdx, setScalaIdx] = useState([]);    // per-paragraph rung index (0..4)
  // Pages: one finished reading per level for the SAME subject. The level in front lives in
  // result/activities/shared; the others wait here as { result, activities, activeTab, customExercises, shared }.
  const [pages, setPages] = useState({});
  const [view, setView] = useState("pages");       // "pages" | "ladder" (La Scala, paragraph by paragraph)
  const pagesSig = useRef("");                      // what the pages were written from
  const [loadingScala, setLoadingScala] = useState(false);
  const [bumped, setBumped] = useState(null);      // paragraph index that just moved (for the flash)
  const [level, setLevel] = useState((startLang || "it") + "2");
  const [purpose, setPurpose] = useState("main");
  const [result, setResult] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [comparisonLevel, setComparisonLevel] = useState(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const [activities, setActivities] = useState({});
  const [activeTab, setActiveTab] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingActivity, setLoadingActivity] = useState(null);
  const [loadingComparison, setLoadingComparison] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [hoveredGloss, setHoveredGloss] = useState(null);
  const [exerciseType, setExerciseType] = useState("multiple_choice");
  const [exerciseCount, setExerciseCount] = useState(5);
  const [exerciseDifficulty, setExerciseDifficulty] = useState("standard");
  const [customExercises, setCustomExercises] = useState([]);
  const [loadingCustom, setLoadingCustom] = useState(false);

  const L = LANGUAGES[lang];
  // Interface language. Teachers plan in English, so English is the default on the Italian side;
  // every side opens in English. The teacher can switch to any of the four, and the choice is remembered.
  const ALL_UI = ["en", "it", "fr", "es"];   // English first: it is the default everywhere
  const UI_CHOICES = { it: ALL_UI, fr: ALL_UI, es: ALL_UI, esl: ALL_UI };
  const UI_NAMES = { en: "English", it: "Italiano", fr: "Français", es: "Español" };
  const uiOptions = UI_CHOICES[lang] || ["en"];
  const UIL = uiOptions.includes(uiPref[lang]) ? uiPref[lang] : uiOptions[0];
  function chooseUi(code) {
    const next = { ...uiPref, [lang]: code };
    setUiPref(next);
    try { window.localStorage.setItem("livella.ui", JSON.stringify(next)); } catch (e) {}
  }
  const T = UI[UIL];
  const LEVELS = L.levels;
  const selectedLevel = LEVELS.find((l) => l.id === level) || LEVELS[0];
  const selectedPurpose = PURPOSES.find((p) => p.id === purpose);
  const selectedGenre = GENRES.find((g) => g.id === genre) || GENRES[0];
  const writing = mode === "write";
  function toggleProfile(id) {
    setProfiles((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }
  const profileClass = (obj) => ((obj && obj.profiles) || []).map((id) => "p-" + id).join(" ");
  // Supports are never printed beside the level: a handout does not say what its reader needs.
  // The teacher's copy lists what was applied, by what it does.
  function supportItems(obj) {
    const ids = (obj && obj.profiles) || [];
    return PROFILES.filter((p) => ids.includes(p.id)).map((p) => `${p.label[UIL]}: ${p.sub[UIL]}`);
  }
  const appliedList = (obj) => supportItems(obj).concat((obj && obj.accommodations) || []);
  function ageMeta(obj) {
    const a = obj && obj.age && obj.age !== "high" && AGE_BANDS.find((x) => x.id === obj.age);
    return a ? ` · ${a.label[UIL]}` : "";
  }
  const ageClass = (obj) => (obj && obj.age === "elem" ? "age-elem" : "");
  const hasP = (obj, id) => !!(obj && obj.profiles && obj.profiles.includes(id));

  // Switching language swaps the whole ladder, so anything generated for the old
  // language is cleared rather than left on screen mislabeled.
  function askSwitchLanguage(nextId) {
    if (nextId === lang) { setPendingLang(null); return; }
    if (result || scala) { setPendingLang(nextId); return; }   // something on screen would be lost: ask first
    switchLanguage(nextId);
  }
  function switchLanguage(nextId) {
    if (nextId === lang) return;
    setPendingLang(null); stopSpeaking(); setHideText(false); setCmpInfo(null); setCmpTab("level"); leaveShared();
    const next = LANGUAGES[nextId];
    setLang(nextId);
    setLevel(next.levels[1] ? next.levels[1].id : next.levels[0].id);
    setResult(null); setComparison(null); setComparisonLevel(null);
    setActivities({}); setActiveTab(null); setCustomExercises([]);
    setScala(null); setScalaIdx([]); setPages({}); setView("pages"); pagesSig.current = "";
    setError(null); setCopied(false); setShowOriginal(false);
  }

  // The page asks Claude through the viewer's own account (the `sample` capability).
  // There is no system role: the instructions travel as a leading user turn.
  const sampleRef = useRef(null);
  function getSample() {
    if (!sampleRef.current) {
      sampleRef.current = (typeof window !== "undefined" && window.claude && window.claude.use)
        ? window.claude.use("sample")
        : Promise.resolve(null);
    }
    return sampleRef.current;
  }

  useEffect(() => {
    let alive = true;
    getSample().then((sample) => {
      if (!sample || !sample.limits) { if (alive) setImagesOk(false); return; }
      sample.limits().then((lim) => { if (alive) setImagesOk(!!(lim && lim.images)); })
                     .catch(() => { if (alive) setImagesOk(false); });
    });
    return () => { alive = false; };
  }, []);

  async function callClaude(systemPrompt, userMessage, images = null) {
    const sample = await getSample();
    if (!sample) throw { code: "not_granted", message: "sample capability unavailable in this view" };
    const opts = { modelTier: "default" };
    if (images) opts.images = images;
    return await sample.json(
      [{ role: "user", content: systemPrompt }, { role: "user", content: userMessage }],
      opts
    );
  }

  function onFileChosen(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    acceptFile(file);
  }
  // A pasted screenshot (Ctrl+V) or a picture dragged onto the box is treated like an upload.
  function onPasteInput(e) {
    const files = e.clipboardData && e.clipboardData.files;
    const img = files && Array.prototype.find.call(files, (f) => f.type.startsWith("image/"));
    if (img) { e.preventDefault(); acceptFile(img); }
  }
  function onDropInput(e) {
    const files = e.dataTransfer && e.dataTransfer.files;
    if (files && files.length) { e.preventDefault(); acceptFile(files[0]); }
  }
  function acceptFile(file) {
    if (!file) return;
    setError(null);
    if (file.type.startsWith("image/")) {
      if (imagesOk === false) { setError(T.errImages); return; }
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
      return;
    }
    if (file.type === "text/plain" || /\.txt$/i.test(file.name)) {
      const reader = new FileReader();
      reader.onload = () => setInput((prev) => (prev.trim() ? prev + "\n\n" : "") + String(reader.result || ""));
      reader.onerror = () => setError(T.errFile);
      reader.readAsText(file);
      return;
    }
    setError(T.errFile);
  }

  function clearImage() {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageFile(null); setImageUrl(null);
  }

  // Viewer-facing copy for a failed call. The code rides along in brackets so a
  // screenshot tells us exactly what happened.
  function describeError(err, fallback) {
    const code = err && err.code;
    if (code === "not_granted" || code === "sampling_disabled" || code === "not_declared") return T.errNotGranted;
    if (code === "rate_limited") return T.errRate;
    return `${fallback} [${code || "error"}]`;
  }

  function sourceBlock() {
    let b = "";
    if (imageFile) b += `\n\nSOURCE IMAGE ATTACHED: Read ALL the text in the attached image and treat it as the INPUT text (in addition to any typed input below). If the image shows no text, describe what it shows and build the passage about that.`;
    if (sourceUrl.trim()) b += `\n\nSOURCE URL (citation only, you cannot open it): ${sourceUrl.trim()}`;
    return b;
  }

  // What the request is about: a source to re-level, or a genre + topic to write from.
  function subjectBlock() {
    const subject = writing ? genreBlock(selectedGenre, topic.trim()) : `${sourceBlock()}\n\nINPUT:\n${input || "(see attached image)"}`;
    return subject + profileWritingBlock(profiles) + ageBlock(ageBand);
  }
  function attachment() { return writing ? null : imageFile; }
  // Everything the reading is written from, except the level. Same signature = same set of pages.
  function sigNow() {
    return JSON.stringify([lang, mode, writing ? [genre, topic.trim()] : [input, sourceUrl.trim(), imageFile ? String(imageFile.name || "") + ":" + String(imageFile.size || (imageFile.data ? imageFile.data.length : 1)) : ""], profiles.slice().sort(), ageBand, purpose]);
  }
  // Bring a level to the front. With pages on the desk this swaps the page; with none it only sets the level.
  function pickLevel(id) {
    if (id === level || loading || loadingScala) return;
    if (!result && Object.keys(pages).length === 0) { setLevel(id); return; }
    const next = { ...pages };
    if (result) next[level] = { result, activities, activeTab, customExercises, shared }; else delete next[level];
    const b = next[id] || null;
    delete next[id];
    setPages(next);
    stopSpeaking(); setHideText(false); setComparison(null); setComparisonLevel(null); setCmpInfo(null);
    setShowOriginal(false); setEditing(null); setShareOpen(false); setNoteText(""); setCopied(false); setError(null);
    setResult(b ? b.result : null); setActivities(b ? b.activities : {}); setActiveTab(b ? b.activeTab : null);
    setCustomExercises(b ? b.customExercises : []);
    setShared(b ? b.shared : null); setHash(b && b.shared ? b.shared.id : null);
    setLevel(id);
  }
  function hasSubject() {
    if (writing) { if (!topic.trim()) { setError(T.errTopic); return false; } return true; }
    if (!input.trim() && !imageFile) { setError(T.errEmpty); return false; }
    return true;
  }

  function buildPassageMessage(modifier = null) {
    let msg = `LEVEL: ${selectedLevel.label} (${selectedLevel.sub})\nLEVEL NOTES: ${selectedLevel.description}\n\nPURPOSE: ${selectedPurpose.promptName} (${selectedPurpose.promptSub})\nPURPOSE NOTES: ${selectedPurpose.description}${subjectBlock()}`;
    if (modifier === "easier") {
      msg += `\n\nREVISION: Previous was too hard. Simpler. Stay at ${selectedLevel.label} but EASIER end.`;
      if (result) msg += `\n\nPREVIOUS:\n${result.passage}`;
    } else if (modifier === "harder") {
      msg += `\n\nREVISION: Previous was too easy. Push upper edge of ${selectedLevel.label}. Do NOT exceed.`;
      if (result) msg += `\n\nPREVIOUS:\n${result.passage}`;
    }
    return msg;
  }

  async function generate(modifier = null) {
    if (!hasSubject()) return;
    setLoading(true); setError(null); setCopied(false);
    setActivities({}); setActiveTab(null);
    setComparison(null); setComparisonLevel(null); setShowOriginal(false); setCmpInfo(null);
    stopSpeaking(); setHideText(false); leaveShared();
    setCustomExercises([]);
    const sig = sigNow();
    if (sig !== pagesSig.current) { setPages({}); setScala(null); setScalaIdx([]); }   // a new subject: the old pages go
    pagesSig.current = sig; setView("pages");
    try {
      const parsed = await callClaude(buildPassagePrompt(L, mode), buildPassageMessage(modifier), attachment());
      setResult({ ...parsed, genre: writing ? selectedGenre.id : null, profiles: profiles.slice(), age: ageBand });
    } catch (err) {
      console.error(err);
      setError(describeError(err, T.errGeneric));
    } finally { setLoading(false); }
  }

  async function generateComparison(otherLevelId) {
    const otherLevel = LEVELS.find((l) => l.id === otherLevelId);
    setLoadingComparison(true); setError(null);
    try {
      const msg = `LEVEL: ${otherLevel.label} (${otherLevel.sub})\nLEVEL NOTES: ${otherLevel.description}\n\nPURPOSE: ${selectedPurpose.promptName} (${selectedPurpose.promptSub})\nPURPOSE NOTES: ${selectedPurpose.description}${subjectBlock()}`;
      const parsed = await callClaude(buildPassagePrompt(L, mode), msg, attachment());
      setComparison(parsed); setComparisonLevel(otherLevel);
      setCmpInfo({ kind: "level", key: otherLevel.id, title: `${otherLevel.label} · ${otherLevel.sub}` });
    } catch (err) {
      console.error(err);
      setError(describeError(err, T.errCompare));
    } finally { setLoadingComparison(false); setCmpBusy(null); }
  }

  // Same page, same level, under another reader profile ("" = Standard). The page on screen is the
  // source, so both columns tell the same story.
  async function compareProfile(pid) {
    setLoadingComparison(true); setCmpBusy("p:" + pid); setError(null);
    try {
      const ids = pid ? [pid] : [];
      const msg = `LEVEL: ${selectedLevel.label} (${selectedLevel.sub})\nLEVEL NOTES: ${selectedLevel.description}\n\nPURPOSE: ${selectedPurpose.promptName} (${selectedPurpose.promptSub})\nPURPOSE NOTES: ${selectedPurpose.description}\n\nTASK: Rewrite the INPUT below at the SAME level. Keep the same title, events, facts and order. ${pid ? "Apply the learner profile rules that follow." : "Write it with no learner-profile adaptations."}${profileWritingBlock(ids)}${ageBlock(result.age)}\n\nINPUT:\n${result.title}\n\n${result.passage}`;
      const parsed = await callClaude(buildPassagePrompt(L, "text"), msg, null);
      const p = PROFILES.find((x) => x.id === pid);
      setComparison({ ...parsed, profiles: ids, age: result.age }); setComparisonLevel(null);
      setCmpInfo({ kind: "profile", key: pid, title: `${selectedLevel.label} · ${p ? p.label[UIL] : T.standard}` });
    } catch (err) {
      console.error(err);
      setError(describeError(err, T.errCompare));
    } finally { setLoadingComparison(false); setCmpBusy(null); }
  }

  async function writeInLanguage(L2, lv2) {
    const msg = `LEVEL: ${lv2.label} (${lv2.sub})\nLEVEL NOTES: ${lv2.description}\n\nPURPOSE: ${selectedPurpose.promptName} (${selectedPurpose.promptSub})\nPURPOSE NOTES: ${selectedPurpose.description}\n\nTASK: The INPUT below is a ${L.langEn} classroom reading. Write the SAME lesson in ${L2.langEn} at the level above, for a colleague who teaches ${L2.langEn}: same events, same facts, same order and paragraphing. Do not translate word for word; write it the way a ${L2.langEn} teacher would for this level. Where a name, place or cultural detail would not make sense for a ${L2.langEn} class, replace it with an equivalent from ${L2.culture}; otherwise keep it.${ageBlock(result.age)}\n\nINPUT:\n${result.title}\n\n${result.passage}`;
    return await callClaude(buildPassagePrompt(L2, "text"), msg, null);
  }

  // Same lesson in another language, at the matching rung of that language's ladder.
  async function compareLanguage(otherId) {
    const L2 = LANGUAGES[otherId];
    const lv2 = L2.levels[levelIndex(level)] || L2.levels[0];
    setLoadingComparison(true); setCmpBusy("l:" + otherId); setError(null);
    try {
      const parsed = await writeInLanguage(L2, lv2);
      setComparison({ ...parsed, profiles: [] }); setComparisonLevel(null);
      setCmpInfo({ kind: "lang", key: otherId, lang: otherId, title: `${L2.name} · ${lv2.label} · ${lv2.sub}` });
    } catch (err) {
      console.error(err);
      setError(describeError(err, T.errCompare));
    } finally { setLoadingComparison(false); setCmpBusy(null); }
  }
  function closeCompare() { setComparison(null); setComparisonLevel(null); setCmpInfo(null); }

  // ===== SHARED LESSON: two or more teachers, one lesson, several languages =====
  // Available on the open web only (the Worker stores it). Anyone with the link can view;
  // saving needs the teacher passcode. Nothing here holds student names or work.
  const shareApi = typeof window !== "undefined" ? window.LIVELLA_SHARE : null;
  const [shared, setShared] = useState(null);        // { id, lesson }
  const [shareOpen, setShareOpen] = useState(false);
  const [shareBusy, setShareBusy] = useState(null);  // "save" | "load" | "refresh" | "add:<lang>" | "note" | "edit"
  const [myName, setMyName] = useState(() => { try { return window.localStorage.getItem("livella.name") || ""; } catch (e) { return ""; } });
  const [linkCopied, setLinkCopied] = useState(false);
  const [editing, setEditing] = useState(null);      // { key, title, passage }
  const [noteText, setNoteText] = useState("");
  const shareRef = useRef(null);
  function rememberName(v) { setMyName(v); try { window.localStorage.setItem("livella.name", v); } catch (e) {} }
  function who() { return myName.trim() || "—"; }
  function shareUrl(id) { return window.location.origin + window.location.pathname + "#l=" + id; }
  function setHash(id) { try { window.history.replaceState(null, "", id ? "#l=" + id : window.location.pathname + window.location.search); } catch (e) {} }
  function leaveShared() { if (shared) setHash(null); setShared(null); setShareOpen(false); setEditing(null); setNoteText(""); }
  function pickResult(r) { return { title: r.title, passage: r.passage, glosses: r.glosses || [], teacher_note: r.teacher_note || "", translations: r.translations || null, accommodations: r.accommodations || [], word_bank: r.word_bank || null, micro_tasks: r.micro_tasks || null, genre: r.genre || null, profiles: r.profiles || [], age: r.age || "high" }; }
  // Two people may save close together: the newest copy of each part wins and notes are pooled.
  function mergeLesson(remote, local) {
    if (!remote) return local;
    const out = { ...remote, ...local };
    if ((remote.resultAt || 0) > (local.resultAt || 0)) { out.result = remote.result; out.resultAt = remote.resultAt; out.resultBy = remote.resultBy; }
    const versions = { ...(remote.versions || {}) };
    Object.entries(local.versions || {}).forEach(([k, v]) => { if (!versions[k] || (v.at || 0) >= (versions[k].at || 0)) versions[k] = v; });
    out.versions = versions;
    const seen = {};
    out.notes = (remote.notes || []).concat(local.notes || []).filter((n) => { const k = `${n.at}|${n.name}|${n.text}`; if (seen[k]) return false; seen[k] = 1; return true; }).sort((a, b) => a.at - b.at);
    return out;
  }
  async function createShare() {
    if (!shareApi || !result) return;
    setShareBusy("save"); setError(null);
    try {
      const lesson = { v: 1, lang, levelId: level, purpose, sourceUrl: sourceUrl.trim(), author: who(), createdAt: Date.now(), result: pickResult(result), resultAt: Date.now(), resultBy: who(), versions: {}, notes: [] };
      const { id } = await shareApi.save(lesson);
      setShared({ id, lesson }); setHash(id);
    } catch (err) { console.error(err); setError(describeError(err, T.errShare)); }
    finally { setShareBusy(null); }
  }
  async function saveShared(nextLesson, busy) {
    if (!shareApi || !shared) return;
    setShareBusy(busy); setError(null);
    try {
      let remote = null; try { remote = await shareApi.load(shared.id); } catch (e) {}
      const merged = mergeLesson(remote, nextLesson);
      await shareApi.save(merged, shared.id);
      setShared({ id: shared.id, lesson: merged });
      setResult((prev) => ({ ...(prev || {}), ...merged.result }));
    } catch (err) { console.error(err); setError(describeError(err, T.errShare)); }
    finally { setShareBusy(null); }
  }
  async function openShared(id, busy = "load") {
    if (!shareApi) return;
    setShareBusy(busy); setError(null);
    try {
      const lesson = await shareApi.load(id);
      if (LANGUAGES[lesson.lang]) setLang(lesson.lang);
      if (lesson.levelId) setLevel(lesson.levelId);
      if (lesson.purpose) setPurpose(lesson.purpose);
      setAgeBand((lesson.result && lesson.result.age) || "high");
      setProfiles((lesson.result && lesson.result.profiles) || []);
      setSourceUrl(lesson.sourceUrl || "");
      setComparison(null); setComparisonLevel(null); setCmpInfo(null);
      if (busy === "load") { setActivities({}); setActiveTab(null); setCustomExercises([]); setScala(null); setScalaIdx([]); setPages({}); setView("pages"); pagesSig.current = ""; }
      setResult({ ...lesson.result }); setShared({ id, lesson }); setEditing(null);
    } catch (err) { console.error(err); setError(describeError(err, T.errLoad)); if (busy === "load") setHash(null); }
    finally { setShareBusy(null); }
  }
  useEffect(() => {
    const m = typeof window !== "undefined" && /^#l=([a-z0-9]{8,24})$/.exec(window.location.hash || "");
    if (m && shareApi) openShared(m[1]);
  }, []);
  async function addVersion(otherId) {
    const L2 = LANGUAGES[otherId]; const lv2 = L2.levels[levelIndex(level)] || L2.levels[0];
    setShareBusy("add:" + otherId); setError(null);
    try {
      const parsed = await writeInLanguage(L2, lv2);
      const version = { title: parsed.title, passage: parsed.passage, glosses: parsed.glosses || [], translations: parsed.translations || null, level: `${lv2.label} · ${lv2.sub}`, by: who(), at: Date.now() };
      await saveShared({ ...shared.lesson, versions: { ...(shared.lesson.versions || {}), [otherId]: version } }, "add:" + otherId);
    } catch (err) { console.error(err); setError(describeError(err, T.errCompare)); setShareBusy(null); }
  }
  function saveEdit() {
    if (!editing || !shared) return;
    const now = Date.now(); let next;
    if (editing.key === "origin") next = { ...shared.lesson, result: { ...shared.lesson.result, title: editing.title, passage: editing.passage }, resultAt: now, resultBy: who() };
    else next = { ...shared.lesson, versions: { ...shared.lesson.versions, [editing.key]: { ...shared.lesson.versions[editing.key], title: editing.title, passage: editing.passage, by: who(), at: now } } };
    setEditing(null); saveShared(next, "edit");
  }
  function addNote() {
    const text = noteText.trim(); if (!text || !shared) return;
    setNoteText("");
    saveShared({ ...shared.lesson, notes: (shared.lesson.notes || []).concat([{ name: who(), text, at: Date.now() }]) }, "note");
  }
  function copyShareLink() {
    const done = () => { setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(shareUrl(shared.id)).then(done).catch(() => {});
  }
  // "Share Livella": the phone's share menu (or the clipboard on a laptop) with a ready-written
  // message and the address for the current interface language.
  const [invited, setInvited] = useState(false);
  function inviteTeachers() {
    const base = window.location.origin + window.location.pathname.replace(/[^/]*$/, "");
    const url = base + (UIL === "en" ? "" : UIL + "/");
    const done = () => { setInvited(true); setTimeout(() => setInvited(false), 2600); };
    if (navigator.share) { navigator.share({ title: "Livella", text: T.inviteText, url }).catch(() => {}); return; }
    const full = `${T.inviteText}\n\n${url}`;
    const byHand = () => { try { window.prompt(T.inviteBtn, full); } catch (e) {} };   // last resort: a box to copy from
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(full).then(done).catch(byHand);
    else byHand();
  }
  function startShare() {
    setShareOpen(true);
    setTimeout(() => { if (shareRef.current && shareRef.current.scrollIntoView) shareRef.current.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60);
  }
  // Every version of the shared lesson, the starting language first.
  const sharedVersions = !shared ? [] : (() => {
    const ls = shared.lesson; const L0 = LANGUAGES[ls.lang] || L;
    const lv0 = L0.levels.find((x) => x.id === ls.levelId) || L0.levels[0];
    const first = { key: "origin", langId: L0.id, title: ls.result.title, passage: ls.result.passage, glosses: ls.result.glosses || [], level: `${lv0.label} · ${lv0.sub}`, by: ls.resultBy || ls.author };
    return [first].concat(LANGUAGE_ORDER.filter((k) => (ls.versions || {})[k]).map((k) => ({ key: k, langId: k, ...ls.versions[k] })));
  })();
  // One handout with the versions side by side, two per row, paragraph against paragraph.
  function buildSharedPdf() {
    const JsPDF = window.jspdf && window.jspdf.jsPDF;
    if (!JsPDF) throw { code: "unavailable", message: "jsPDF not loaded" };
    const doc = new JsPDF({ unit: "pt", format: "letter" });
    const M = 54, W = 612 - 2 * M, BOTTOM = 792 - 54, GUT = 24, CW = (W - GUT) / 2;
    const ink = [43, 24, 16], copper = [138, 80, 40], muted = [120, 100, 80], teal = [10, 92, 95];
    let y = M;
    const need = (h) => { if (y + h > BOTTOM) { doc.addPage(); y = M; } };
    const set = (size, style, color) => { doc.setFont("helvetica", style || "normal"); doc.setFontSize(size); doc.setTextColor(...(color || ink)); };
    // draw one row: the same kind of text in the left and right column, top-aligned
    const row = (cells, size, style, color, gapAfter) => {
      set(size, style, color);
      const lines = cells.map((t) => (t ? doc.splitTextToSize(String(t), CW) : []));
      const lh = size * 1.5, h = Math.max(...lines.map((l) => l.length)) * lh;
      if (!h) return;
      need(h);
      lines.forEach((ls, c) => ls.forEach((ln, i) => doc.text(ln, M + c * (CW + GUT), y + i * lh)));
      y += h + (gapAfter || 0);
    };
    set(9, "bold", copper); doc.text(T.shareTitle.toUpperCase(), M, y); y += 16;
    set(9, "normal", muted); doc.text(`${selectedPurpose.label[UIL]}${ageMeta(result)}`.replace(/^ · /, ""), M, y); y += 10;
    doc.setDrawColor(184, 116, 58); doc.setLineWidth(0.8); doc.line(M, y, M + W, y); y += 18;
    for (let i = 0; i < sharedVersions.length; i += 2) {
      const pair = sharedVersions.slice(i, i + 2);
      row(pair.map((v) => `${LANGUAGES[v.langId].name.toUpperCase()} · ${v.level}`), 8, "bold", teal, 4);
      row(pair.map((v) => v.title), 15, "bold", ink, 6);
      const paras = pair.map((v) => String(v.passage).split(/\n\s*\n/));
      const n = Math.max(...paras.map((p) => p.length));
      for (let k = 0; k < n; k++) row(paras.map((p) => p[k] || ""), 11, "normal", ink, 8);
      const gl = pair.map((v) => (v.glosses || []).map((g) => `${g.word} — ${g.translation}`));
      const gn = Math.max(...gl.map((g) => g.length));
      if (gn) { y += 4; row(pair.map(() => T.vocab.toUpperCase()), 8, "bold", copper, 2); for (let k = 0; k < gn; k++) row(gl.map((g) => g[k] || ""), 10, "normal", ink, 0); }
      y += 18;
    }
    const notes = shared.lesson.notes || [];
    if (notes.length) {
      need(40); set(8, "bold", teal); doc.text(T.notes.toUpperCase(), M, y); y += 14;
      notes.forEach((nt) => { set(10, "normal", ink); const ls = doc.splitTextToSize(`${nt.name}: ${nt.text}`, W); need(ls.length * 15); ls.forEach((ln) => { doc.text(ln, M, y); y += 15; }); y += 3; });
    }
    const pages = doc.getNumberOfPages();
    for (let p = 1; p <= pages; p++) { doc.setPage(p); set(8, "normal", muted); doc.text(`Livella · ${T.shareTitle} · ${p}/${pages}`, M, 792 - 30); }
    return doc;
  }
  async function downloadSharedPdf() {
    setPdfBusy(true); setError(null);
    try {
      const doc = buildSharedPdf();
      const dl = (window.claude && window.claude.use) ? await window.claude.use("downloads") : null;
      if (!dl) throw { code: "unavailable", message: "downloads unavailable" };
      const slug = String(shared.lesson.result.title || "livella").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
      await dl.save({ filename: `livella-${slug || "lesson"}-shared.pdf`, data: doc.output("blob") });
    } catch (err) { console.error(err); setError(err && err.code === "declined" ? T.pdfDeclined : `${T.errPdf} [${(err && err.code) || "error"}]`); }
    finally { setPdfBusy(false); }
  }

  function levelIndex(id) { const i = LEVELS.findIndex((l) => l.id === id); return i < 0 ? 1 : i; }

  async function generateScala() {
    if (!hasSubject()) return;
    setLoadingScala(true); setError(null);
    const sig = sigNow(); const same = sig === pagesSig.current; pagesSig.current = sig;
    try {
      const msg = `PURPOSE: ${selectedPurpose.promptName} (${selectedPurpose.promptSub})\nPURPOSE NOTES: ${selectedPurpose.description}\nTEACHER'S CLASS LEVEL (the middle reference): ${selectedLevel.label} (${selectedLevel.sub})${subjectBlock()}`;
      const parsed = await callClaude(buildScalaPrompt(L, mode), msg, attachment());
      // Normalize: rungs in ladder order, equal paragraph counts (truncate to the shortest).
      const byId = {}; (parsed.rungs || []).forEach((r) => { byId[r.id] = r; });
      const rungs = LEVELS.map((l) => byId[l.id] || { id: l.id, paragraphs: [] });
      const P = Math.max(1, Math.min(...rungs.map((r) => (r.paragraphs || []).length)));
      if (!isFinite(P) || rungs.some((r) => !r.paragraphs || r.paragraphs.length === 0)) throw { code: "invalid_json", message: "rungs incomplete" };
      rungs.forEach((r) => { r.paragraphs = r.paragraphs.slice(0, P); });
      const meta = { genre: writing ? selectedGenre.id : null, profiles: profiles.slice(), age: ageBand };
      setScala({ title: parsed.title, rungs, teacher_note: parsed.teacher_note, ...meta });
      setScalaIdx(Array.from({ length: P }, () => levelIndex(level)));
      // La Scala fills every level tab that has no page yet (text only; a full page keeps its place).
      const page = (i) => ({ title: parsed.title, passage: rungs[i].paragraphs.join("\n\n"), glosses: [], teacher_note: "", fromScala: true, ...meta });
      const blank = (r) => ({ result: r, activities: {}, activeTab: null, customExercises: [], shared: null });
      setPages((prev) => {
        const base = same ? { ...prev } : {};
        LEVELS.forEach((l, i) => { if (l.id !== level && !base[l.id]) base[l.id] = blank(page(i)); });
        return base;
      });
      if (!same || !result) {
        leaveShared(); stopSpeaking(); setHideText(false);
        setResult(page(levelIndex(level))); setActivities({}); setActiveTab(null); setCustomExercises([]);
        setComparison(null); setComparisonLevel(null); setCmpInfo(null); setShowOriginal(false);
      }
      setView("pages");
      setBumped(null);
    } catch (err) {
      console.error(err);
      setError(describeError(err, T.errScala));
    } finally { setLoadingScala(false); }
  }

  function moveParagraph(i, delta) {
    setScalaIdx((prev) => {
      const next = prev.slice();
      next[i] = Math.max(0, Math.min(LEVELS.length - 1, next[i] + delta));
      return next;
    });
    setBumped(i); setTimeout(() => setBumped(null), 450);
  }
  function moveAll(delta) {
    setScalaIdx((prev) => prev.map((v) => Math.max(0, Math.min(LEVELS.length - 1, v + delta))));
    setBumped("all"); setTimeout(() => setBumped(null), 450);
  }
  function resetScala() { setScalaIdx((prev) => prev.map(() => levelIndex(level))); }

  async function generateActivity(type) {
    if (activities[type]) { setActiveTab(type); return; }
    setLoadingActivity(type); setError(null);
    try {
      const userMessage = `LEVEL: ${selectedLevel.label} (${selectedLevel.sub})\nPURPOSE: ${selectedPurpose.promptName} (${selectedPurpose.promptSub})\nACTIVITY_TYPE: ${type}${profileTaskBlock(result.profiles || [])}${ageTaskBlock(result.age)}\n\nPASSAGE:\n${result.passage}`;
      const parsed = await callClaude(buildActivitiesPrompt(L).replace("{ACTIVITY_TYPE}", type), userMessage);
      setActivities({ ...activities, [type]: parsed });
      setActiveTab(type);
    } catch (err) {
      console.error(err);
      setError(describeError(err, T.errActivity));
    } finally { setLoadingActivity(null); }
  }

  async function generateCustomExercise() {
    if (!result) return;
    setLoadingCustom(true); setError(null);
    const typeObj = EXERCISE_TYPES.find((t) => t.id === exerciseType);
    const diffObj = DIFFICULTIES.find((d) => d.id === exerciseDifficulty);
    try {
      const userMessage = `LEVEL: ${selectedLevel.label} (${selectedLevel.sub})
LEVEL NOTES: ${selectedLevel.description}

EXERCISE_TYPE: ${exerciseType}
COUNT: ${exerciseCount}
DIFFICULTY: ${exerciseDifficulty}
DIFFICULTY NOTES: ${diffObj.description}

PASSAGE:
${result.passage}

Generate exactly ${exerciseCount} ${exerciseType} items at ${exerciseDifficulty} difficulty.${profileTaskBlock(result.profiles || [])}${ageTaskBlock(result.age)}`;
      const parsed = await callClaude(buildCustomPrompt(L), userMessage);
      parsed._typeLabel = typeObj.label[UIL];
      parsed._difficultyLabel = diffObj.label[UIL];
      parsed._count = exerciseCount;
      parsed._timestamp = Date.now();
      setCustomExercises([...customExercises, parsed]);
    } catch (err) {
      console.error(err);
      setError(describeError(err, T.errExercise));
    } finally { setLoadingCustom(false); }
  }

  function removeCustomExercise(timestamp) {
    setCustomExercises(customExercises.filter((e) => e._timestamp !== timestamp));
  }

  function clearAllCustom() { setCustomExercises([]); }

  // ===== PDF handout (jsPDF, text layout, US Letter, 1-inch margins) =====
  // Student sheet: target language only, blank answer lines. Teacher guide: answers,
  // notes, and the teacher-facing translations.
  function buildPdf(teacher) {
    const lad = view === "ladder" && !!scala;
    return buildPdfFor(teacher, lad ? null : result, lad ? scala : null);
  }
  function buildPdfFor(teacher, result, scala) {
    const JsPDF = window.jspdf && window.jspdf.jsPDF;
    if (!JsPDF) throw { code: "unavailable", message: "jsPDF not loaded" };
    const doc = new JsPDF({ unit: "pt", format: "letter" });
    const M = 72, W = 612 - 2 * M, BOTTOM = 792 - 72;
    let y = M;
    const need = (h) => { if (y + h > BOTTOM) { doc.addPage(); y = M; } };
    const text = (str, size, style, color, lineGap = 1.45, indent = 0) => {
      if (!str) return;
      doc.setFont("helvetica", style || "normal"); doc.setFontSize(size);
      doc.setTextColor(...(color || [43, 24, 16]));
      const lines = doc.splitTextToSize(String(str), W - indent);
      const lh = size * lineGap;
      for (const ln of lines) { need(lh); doc.text(ln, M + indent, y); y += lh; }
    };
    const gap = (h) => { y += h; };
    const rule = () => { need(10); doc.setDrawColor(184, 116, 58); doc.setLineWidth(0.8); doc.line(M, y, M + W, y); y += 12; };
    const copper = [138, 80, 40], muted = [120, 100, 80], teal = [10, 92, 95];

    // header
    if (teacher) {
      text(T.teacherGuide.toUpperCase(), 9, "bold", copper, 1.3); gap(4);
    } else {
      doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.setTextColor(43, 24, 16);
      doc.text(`${T.name}: ______________________________`, M, y);
      doc.text(`${T.date}: ____________`, M + W - 130, y); y += 18;
      doc.text(`${T.klass}: ______________________________`, M, y); y += 14;
    }
    rule();
    const meta = `${selectedLevel.label} · ${selectedLevel.sub} · ${selectedPurpose.label[UIL]}` + genreMeta(result) + ageMeta(result) + (sourceUrl.trim() && !(result && result.genre) ? ` · ${T.source}: ${sourceUrl.trim()}` : "");
    const dys = hasP(result, "dyslexia") || hasP(scala, "dyslexia");
    const bodySize = dys ? 13 : 12, bodyGap = dys ? 1.85 : 1.6;
    if (result) {
    text(result.title, 18, "bold", null, 1.25); gap(2);
    text(meta, 9, "normal", muted, 1.3); gap(10);

    // word bank (reading support) comes BEFORE the text
    if (result.word_bank && result.word_bank.length) {
      text(T.wordBank.toUpperCase(), 9, "bold", copper, 1.3); gap(2);
      text(result.word_bank.map((w) => `${w.word} — ${w.translation}`).join("   ·   "), 10, "normal", null, 1.5); gap(8);
    }
    // passage: plain, numbered (reading support) or chunked with micro-tasks (ADHD)
    const paras = String(result.passage).split(/\n\s*\n/);
    if (hasP(result, "adhd") || hasP(result, "support")) {
      paras.forEach((ptxt, i) => {
        if (hasP(result, "adhd")) { gap(4); text(`${i + 1} ${T.of} ${paras.length}`, 8, "bold", teal, 1.3); }
        text(hasP(result, "adhd") ? ptxt : `${i + 1}.  ${ptxt}`, bodySize, "normal", null, bodyGap);
        if (hasP(result, "adhd") && result.micro_tasks && result.micro_tasks[i]) text(`☐ ${T.microTask}: ${result.micro_tasks[i]}`, 10, "italic", teal, 1.5, 10);
        gap(6);
      });
    } else {
      text(result.passage, bodySize, "normal", null, bodyGap); gap(6);
    }
    if (teacher && result.translations) {
      L.support.filter((k) => result.translations[k]).forEach((k) => {
        text(SUPPORT_NAMES[k].toUpperCase(), 8, "bold", teal, 1.3);
        text(result.translations[k], 10, "italic", muted, 1.5); gap(4);
      });
    }

    // vocab
    if (result.glosses && result.glosses.length) {
      gap(6); text(T.vocab.toUpperCase(), 9, "bold", copper, 1.3); gap(2);
      result.glosses.forEach((g) => text(`${g.word}  —  ${g.translation}${g.it ? "  ·  " + g.it : ""}`, 11, "normal", null, 1.5, 10));
    }
    if (teacher && result.teacher_note) { gap(8); text(T.teacherNote.toUpperCase(), 8, "bold", teal, 1.3); text(result.teacher_note, 10, "italic", muted, 1.5); }
    if (teacher && appliedList(result).length) {
      gap(6); text(T.accommodations.toUpperCase(), 8, "bold", teal, 1.3);
      appliedList(result).forEach((a) => text(`• ${a}`, 9, "normal", muted, 1.45, 8));
      if (hasP(result, "dyslexia")) text(T.pdfFontNote, 8, "italic", muted, 1.4, 8);
    }
    } // end result block

    // La Scala at the configuration on screen
    if (scala) {
      gap(14); rule(); text(T.scalaTitle.toUpperCase(), 10, "bold", copper, 1.3);
      text(scala.title, 15, "bold", null, 1.3); gap(4);
      scala.rungs[0].paragraphs.forEach((_, i) => {
        const ri = scalaIdx[i] ?? 0; const lv = LEVELS[ri];
        gap(4); text(`${T.rung.toUpperCase()} ${ri + 1} · ${lv.label} · ${lv.sub}`, 8, "bold", teal, 1.3);
        text(scala.rungs[ri].paragraphs[i], bodySize, "normal", null, bodyGap);
      });
      if (teacher && scala.teacher_note) { gap(6); text(scala.teacher_note, 9, "italic", muted, 1.4); }
    }

    // activity items (shared renderer)
    const items = (list) => {
      list.forEach((item, i) => {
        gap(6);
        if (item.instruction) text(item.instruction, 10, "italic", muted, 1.4);
        text(`${i + 1}. ${item.question}`, 11, "normal", null, 1.5);
        if (item.options) item.options.forEach((o, j) => text(`${String.fromCharCode(97 + j)})  ${o}`, 11, "normal", null, 1.45, 18));
        if (teacher) {
          if (item.answer) text(`${T.answer}: ${item.answer}`, 10, "bold", teal, 1.45, 18);
          if (item.note) text(item.note, 9, "italic", muted, 1.4, 18);
          if (item.translations) L.support.filter((k) => item.translations[k]).forEach((k) => text(`[${SUPPORT_NAMES[k]}] ${item.translations[k]}`, 9, "italic", muted, 1.4, 18));
        } else if (!item.options) {
          // answer lines for open items
          const linesN = item.format === "writing" ? 6 : 2;
          for (let n = 0; n < linesN; n++) { need(16); doc.setDrawColor(190, 180, 165); doc.setLineWidth(0.5); doc.line(M + 18, y + 8, M + W, y + 8); y += 16; }
        }
      });
    };
    ACTIVITY_TABS.forEach((t) => {
      const act = activities[t.id];
      if (!act || !act.items) return;
      gap(14); rule(); text(t.label[UIL].toUpperCase(), 10, "bold", copper, 1.3);
      items(act.items);
    });
    customExercises.forEach((ex) => {
      gap(14); rule(); text(`${ex._typeLabel.toUpperCase()}  ·  ${ex._difficultyLabel}`, 10, "bold", copper, 1.3);
      items(ex.items);
    });

    // footer on every page
    const pages = doc.getNumberOfPages();
    for (let p = 1; p <= pages; p++) {
      doc.setPage(p); doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(150, 135, 115);
      doc.text(`Livella  ·  ${teacher ? T.teacherGuide : T.studentSheet}  ·  ${p}/${pages}`, M, 792 - 40);
    }
    return doc;
  }

  async function downloadPdf(teacher) {
    if ((!result && !scala) || pdfBusy) return;
    setPdfBusy(true); setError(null);
    try {
      const dl = (window.claude && window.claude.use) ? await window.claude.use("downloads") : null;
      if (!dl) throw { code: "unavailable" };
      const doc = buildPdf(teacher);
      const slug = String((result && result.title) || (scala && scala.title) || "livella").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
      const filename = `livella-${slug}-${selectedLevel.id}-${teacher ? "teacher" : "student"}.pdf`;
      await dl.save({ filename, data: doc.output("blob") });
    } catch (err) {
      console.error(err);
      if (err && err.code === "declined") setError(T.pdfDeclined);
      else if (err && err.code === "cancelled") {}
      else setError(`${T.errPdf} [${(err && err.code) || "error"}]`);
    } finally { setPdfBusy(false); }
  }

  function copyToClipboard() {
    const lad = view === "ladder" && !!scala;
    copyFor(lad ? null : result, lad ? scala : null);
  }
  function copyFor(result, scala) {
    if (!result && !scala) return;
    const tr = (obj) => obj ? L.support.filter((k) => obj[k]).map((k) => `\n[${SUPPORT_NAMES[k]}]\n${obj[k]}`).join("\n") : "";
    let text = result
      ? `${result.title}\n${result.word_bank && result.word_bank.length ? `\n${T.wordBank}: ${result.word_bank.map((w) => `${w.word} — ${w.translation}`).join(" · ")}\n` : ""}\n${result.passage}\n${result.micro_tasks ? "\n" + result.micro_tasks.map((m, i) => `[${T.microTask} ${i + 1}] ${m}`).join("\n") + "\n" : ""}${tr(result.translations)}\n\n${T.vocab}:\n${result.glosses.map((g) => `${g.word} — ${g.translation}${g.it ? " · " + g.it : ""}`).join("\n")}${result.accommodations && result.accommodations.length ? `\n\n${T.accommodations}:\n${result.accommodations.map((a) => "- " + a).join("\n")}` : ""}`
      : "";
    Object.entries(activities).forEach(([type, act]) => {
      text += `\n\n--- ${type.toUpperCase()} ---\n`;
      act.items.forEach((item, i) => {
        text += `\n${i + 1}. ${item.instruction || ""}\n${item.question}\n`;
        if (item.options) text += item.options.map((o, j) => `   ${String.fromCharCode(97 + j)}) ${o}`).join("\n") + "\n";
        if (item.answer) text += `[${T.answer}: ${item.answer}]\n`;
        text += tr(item.translations) ? tr(item.translations) + "\n" : "";
      });
    });
    customExercises.forEach((ex) => {
      text += `\n\n--- ${ex._typeLabel.toUpperCase()} · ${ex._difficultyLabel} ---\n`;
      ex.items.forEach((item, i) => {
        text += `\n${i + 1}. ${item.question}\n`;
        if (item.options) text += item.options.map((o, j) => `   ${String.fromCharCode(97 + j)}) ${o}`).join("\n") + "\n";
        if (item.answer) text += `[${T.answer}: ${item.answer}]\n`;
        text += tr(item.translations) ? tr(item.translations) + "\n" : "";
      });
    });
    if (scala) {
      text += `\n\n--- ${T.scalaTitle.toUpperCase()} · ${scala.title} ---\n`;
      scala.rungs[0].paragraphs.forEach((_, i) => { const ri = scalaIdx[i] ?? 0; text += `\n[${LEVELS[ri].label}] ${scala.rungs[ri].paragraphs[i]}\n`; });
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Teacher-facing parallel text. Never printed: the student handout stays in the target language.
  function renderTranslations(obj, compact = false) {
    if (!obj || !L.support.length) return null;
    const rows = L.support.filter((k) => obj[k]);
    if (!rows.length) return null;
    return (
      <div className={`livella-translations ${compact ? "compact" : ""}`}>
        {rows.map((k) => (
          <div key={k} className="livella-translation-row">
            <span className="livella-translation-label">{SUPPORT_NAMES[k]}</span>
            <div className="livella-translation-text">{obj[k]}</div>
          </div>
        ))}
      </div>
    );
  }

  function genreMeta(obj) {
    const g = obj && obj.genre && GENRES.find((x) => x.id === obj.genre);
    return g ? ` · ${g.label[UIL]}` : "";
  }

  // The passage body under a profile: word bank first (reading support), then either
  // numbered paragraphs (reading support), ADHD chunks with micro-tasks, or the plain text.
  // The level tabs on top of the page: every level of this reading, written or not.
  function renderLevelTabs() {
    if (shared && Object.keys(pages).length === 0) return null;   // a lesson opened from a link is one level
    return (
      <div className="livella-desk-tabs" role="tablist" aria-label={T.levelLabel}>
        {LEVELS.map((l, i) => {
          const written = l.id === level ? !!result : !!pages[l.id];
          return (
            <button key={l.id} type="button" role="tab" aria-selected={l.id === level} title={`${l.label} · ${l.sub}`}
              aria-label={written ? l.label : `${l.label} · ${T.writeLevel}`}
              className={`livella-desk-tab ${written ? "" : "empty"}`} onClick={() => pickLevel(l.id)}>
              {LEVEL_SHORT[l.label] || i + 1}{!written && <small aria-hidden="true">+</small>}
            </button>
          );
        })}
      </div>
    );
  }
  function renderBody(r) {
    const adhd = hasP(r, "adhd"), sup = hasP(r, "support");
    const paras = String(r.passage).split(/\n\s*\n/);
    return (
      <>
        {r.word_bank && r.word_bank.length > 0 && (
          <div className="livella-wordbank">
            <h4>{T.wordBank}</h4>
            <div className="livella-wordbank-chips">
              {r.word_bank.map((w, i) => <span key={i} className="livella-wordbank-chip"><b>{w.word}</b> — {w.translation}</span>)}
            </div>
          </div>
        )}
        {(adhd || sup) ? (
          <div className="livella-passage">
            {paras.map((ptxt, i) => (
              <div key={i} className={`livella-para ${adhd ? "chunk" : "numbered"}`}>
                {adhd ? (
                  <div className="livella-chunk-head">
                    <span className="livella-chunk-count">{i + 1} {T.of} {paras.length}</span>
                    <span className="livella-chunk-bar" aria-hidden="true">{paras.map((_, j) => <i key={j} className={j <= i ? "on" : ""}></i>)}</span>
                  </div>
                ) : <span className="livella-para-num" aria-hidden="true">{i + 1}</span>}
                <div className="livella-para-text">{renderPassage(ptxt, r.glosses)}</div>
                {adhd && r.micro_tasks && r.micro_tasks[i] && (
                  <div className="livella-micro"><span className="livella-micro-box" aria-hidden="true"></span><b>{T.microTask}:</b> {r.micro_tasks[i]}</div>
                )}
              </div>
            ))}
          </div>
        ) : <div className="livella-passage">{renderPassage(r.passage, r.glosses)}</div>}
      </>
    );
  }

  function renderPassage(passage, glosses) {
    if (!glosses || glosses.length === 0) return passage;
    const escaped = glosses.map((g) => g.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const regex = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");
    const parts = passage.split(regex);
    return parts.map((part, i) => {
      const match = glosses.find((g) => g.word.toLowerCase() === part.toLowerCase());
      if (match) {
        return (
          <span key={i} className="livella-gloss"
            onMouseEnter={() => setHoveredGloss(match)}
            onMouseLeave={() => setHoveredGloss(null)}>
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  }

  const ACTIVITY_TABS = [
    { id: "comprensione", label: { it: "Comprensione", fr: "Compréhension", en: "Comprehension", es: "Comprensión" }, sub: { it: "Comprehension", fr: "Comprehension", en: "questions", es: "preguntas" }, icon: "?" },
    { id: "vocabolario", label: { it: "Vocabolario", fr: "Vocabulaire", en: "Vocabulary", es: "Vocabulario" }, sub: { it: "Vocabulary", fr: "Vocabulary", en: "words", es: "palabras" }, icon: "Aa" },
    { id: "produzione", label: { it: "Produzione", fr: "Production", en: "Production", es: "Producción" }, sub: { it: "Output", fr: "Output", en: "speak & write", es: "hablar y escribir" }, icon: "✎" },
    { id: "cultura", label: { it: "Cultura", fr: "Culture", en: "Culture", es: "Cultura" }, sub: { it: "Culture", fr: "Culture", en: "compare", es: "comparar" }, icon: "★" },
  ];

  function renderItem(item, i) {
    return (
      <div key={i} className="q-card">
        <div className="q-number">{i + 1}</div>
        <div className="q-body">
          {item.instruction && <div className="q-instruction">{item.instruction}</div>}
          <div className="q-question">{item.question}</div>
          {item.options && (
            <ul className="q-options">
              {item.options.map((o, j) => (
                <li key={j}>
                  <span className="q-letter">{String.fromCharCode(97 + j)}</span>
                  <span className="q-option-text">{o}</span>
                </li>
              ))}
            </ul>
          )}
          {item.answer && (
            <div className="q-answer">
              <div className="q-answer-label">{T.answer}</div>
              <div className="q-answer-text">{item.answer}</div>
            </div>
          )}
          {item.note && <div className="q-note">{item.note}</div>}
          {renderTranslations(item.translations, true)}
        </div>
      </div>
    );
  }

  return (
    <div className="livella-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700;800&family=Lexend:wght@400;600;700&display=swap');

        .livella-root {
          /* Brand */
          --espresso: #2b1810;
          --espresso-light: #4a2d20;
          --copper: #b8743a;
          --copper-light: #d49a6a;
          --copper-pale: #f4e4d4;
          --cream: #faf6f0;
          --paper: #ffffff;

          /* Functional colors with real contrast */
          --ink: #1a1a1a;
          --ink-soft: #404040;
          --gray-700: #525252;
          --gray-500: #737373;
          --gray-400: #a3a3a3;
          --gray-200: #e5e5e5;
          --gray-100: #f5f5f5;

          /* Answer green - high contrast signal */
          --answer-bg: #f0f9f4;
          --answer-border: #86efac;
          --answer-dark: #15803d;
          --answer-darker: #14532d;

          /* Teal - interactive UI color */
          --teal: #0d7377;
          --teal-light: #14a098;
          --teal-pale: #d6f1ef;
          --teal-dark: #0a5c5f;

          font-family: 'Inter', sans-serif;
          color: var(--ink);
          background: var(--cream);
          min-height: 100vh;
          padding: 32px 20px 60px;
          -webkit-font-smoothing: antialiased;
        }
        .livella-container { max-width: 920px; margin: 0 auto; }

        /* ====== LANGUAGE BAR (very top: the whole tool switches ladder) ====== */
        .livella-lang-bar {
          display: flex;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }
        .livella-lang-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 18px;
          background: #fff;
          color: var(--teal-dark);
          border: 1.5px solid var(--teal-pale);
          border-radius: 999px;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.15s;
        }
        .livella-lang-btn:hover { border-color: var(--teal); transform: translateY(-1px); }
        .livella-lang-btn:focus-visible { outline: 3px solid var(--teal-pale); outline-offset: 2px; }
        .livella-lang-btn.active {
          background: var(--teal);
          color: #fff;
          border-color: var(--teal);
          box-shadow: 0 4px 14px rgba(13, 115, 119, 0.25);
        }
        .livella-lang-flag { font-size: 16px; line-height: 1; }
        @media (max-width: 640px) {
          .livella-lang-btn { padding: 8px 12px; font-size: 12px; }
        }

        /* ====== HERO: teal field, copy left, the same page fanned at five levels right ====== */
        .livella-hero {
          background: var(--teal-dark); color: var(--cream); border-radius: 10px; overflow: hidden; margin-bottom: 28px;
          padding: 28px 36px 34px; display: grid; grid-template-columns: minmax(0, 54fr) minmax(0, 46fr);
          grid-template-areas: "logo logo" "copy fan"; column-gap: 28px; row-gap: 8px; align-items: center;
        }
        .livella-logo { grid-area: logo; font-family: 'Cormorant Garamond', serif; font-weight: 600; font-size: 32px; letter-spacing: -0.01em; margin: 0; line-height: 1; color: var(--cream); }
        .livella-logo span { color: #e3ad7c; }
        .livella-hero-copy { grid-area: copy; min-width: 0; padding: 24px 0 18px; }
        .livella-tagline { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 21px; color: rgba(214, 241, 239, 0.85); margin: 0 0 12px; }
        .livella-tagline-all { color: #e3ad7c; white-space: nowrap; }
        .livella-hero-head { font-family: 'Cormorant Garamond', serif; font-weight: 600; font-size: clamp(36px, 5.6vw, 56px); line-height: 1.03; letter-spacing: -0.015em; margin: 0 0 18px; text-wrap: balance; color: var(--cream); }
        .livella-hero-rule { width: 60px; height: 2px; background: var(--copper); border: 0; margin: 0 0 18px; }
        .livella-hero-sub { font-size: 16px; line-height: 1.6; color: rgba(214, 241, 239, 0.82); max-width: 40ch; margin: 0 0 24px; }
        .livella-hero-cta { background: var(--cream); color: #8a5028; border: 0; border-radius: 6px; padding: 13px 24px; font: 600 15px 'Inter', sans-serif; cursor: pointer; transition: background 0.2s, color 0.2s; }
        .livella-hero-cta:hover, .livella-hero-cta:focus-visible { background: var(--copper); color: var(--cream); outline: 2px solid var(--cream); outline-offset: 3px; }
        .livella-hero-btns { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
        .livella-hero-invite { background: transparent; color: var(--cream); border: 1.5px solid rgba(250, 246, 240, 0.55); border-radius: 6px; padding: 11.5px 18px; font: 600 15px 'Inter', sans-serif; cursor: pointer; transition: background 0.2s, border-color 0.2s; }
        .livella-hero-invite:hover, .livella-hero-invite:focus-visible { background: rgba(250, 246, 240, 0.12); border-color: var(--cream); outline: none; }
        .livella-hero-micro { display: block; font-size: 12.5px; color: rgba(214, 241, 239, 0.75); margin-top: 12px; letter-spacing: 0.02em; }

        .livella-fanwrap { grid-area: fan; min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 2px; }
        .livella-fan { position: relative; width: 100%; max-width: 310px; aspect-ratio: 4 / 5; margin: 40px 0 30px; }
        .livella-fan-tabs { position: absolute; top: -28px; left: 5%; right: 5%; height: 29px; display: flex; gap: 5px; z-index: 11; }
        .livella-fan-tab { flex: 1 1 0; min-width: 0; border: 0; padding: 0; border-radius: 5px 5px 0 0; background: #f0e7d7; color: #8a5028; font: italic 500 19px 'Cormorant Garamond', serif; cursor: pointer; transition: background 0.3s; }
        .livella-fan-tab[aria-selected="true"] { background: #fffdf8; font-weight: 700; font-style: normal; }
        .livella-fan-tab:focus-visible { outline: 2px solid var(--copper); outline-offset: 2px; }
        .livella-sheet {
          position: absolute; inset: 0; background: #f0e7d7; color: var(--espresso); border-radius: 3px; cursor: pointer;
          box-shadow: 0 10px 26px rgba(4, 34, 36, 0.42), 0 1px 2px rgba(4, 34, 36, 0.42);
          transform-origin: 50% 120%; transform: rotate(0deg); z-index: calc(var(--n) + 1);
          transition: transform 0.9s cubic-bezier(.2,.8,.2,1) calc(var(--n) * 110ms), background 0.5s;
          padding: 20px 20px 16px; box-sizing: border-box; text-align: left;
        }
        .livella-fan.open .livella-sheet { transform: rotate(calc((var(--n) - 2) * 4.5deg + 2deg)); }
        .livella-fan.open .livella-sheet.front { transform: rotate(0deg); }
        .livella-sheet.front { background: #fffdf8; z-index: 10; cursor: default; }
        .livella-sheet-body { animation: livella-sheet-in 0.5s ease-out; }
        @keyframes livella-sheet-in { from { opacity: 0.25; } to { opacity: 1; } }
        .livella-sheet-lvl { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--teal-dark); margin: 0 0 10px; }
        .livella-sheet-title { font-family: 'Cormorant Garamond', serif; font-weight: 600; font-size: 26px; line-height: 1.1; margin: 0 0 10px; }
        .livella-sheet-title.small { font-size: 21px; margin-bottom: 8px; }
        .livella-sheet-text { font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: 19px; line-height: 1.42; margin: 0; }
        .livella-sheet-gloss { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 14px; }
        .livella-sheet-gloss span { font-size: 11.5px; color: #6b5a48; border: 1px solid #f0e7d7; border-radius: 999px; padding: 3px 9px; }
        .livella-sheet-gloss b { color: var(--espresso); font-weight: 600; }
        .livella-sheet-chunk { border: 1px solid #f0e7d7; border-radius: 6px; padding: 8px 11px; margin-bottom: 7px; }
        .livella-sheet-count { font-size: 9.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--teal-dark); margin: 0 0 3px; }
        .livella-sheet-ctext { font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: 17px; line-height: 1.32; margin: 0; }
        .livella-sheet-mini { display: flex; gap: 7px; align-items: flex-start; font-size: 12px; line-height: 1.35; color: var(--teal-dark); border-top: 1px dashed #f0e7d7; margin: 6px 0 0; padding-top: 6px; }
        .livella-sheet-mini i { flex: none; width: 11px; height: 11px; border: 1.5px solid var(--teal); border-radius: 2px; margin-top: 2px; }
        .livella-hero-prof { display: inline-flex; border: 1px solid rgba(214, 241, 239, 0.3); border-radius: 999px; overflow: hidden; }
        .livella-hero-prof button { border: 0; background: transparent; color: rgba(214, 241, 239, 0.85); font: 600 12.5px 'Inter', sans-serif; padding: 7px 16px; cursor: pointer; }
        .livella-hero-prof button[aria-pressed="true"] { background: var(--cream); color: var(--teal-dark); }
        .livella-hero-prof button:focus-visible { outline: 2px solid var(--cream); outline-offset: 2px; }
        .livella-hero-example { margin: 12px 0 0; font: 500 12.5px 'Inter', sans-serif; color: rgba(214, 241, 239, 0.85); text-align: center; }

        /* ====== THE DESK: the reading as tabbed pages, the same picture the front page shows ====== */
        .livella-desk { position: relative; background: var(--teal-dark); border-radius: 10px; padding: 16px 14px 18px; margin-bottom: 24px; overflow: hidden; }
        .livella-desk > .livella-card { position: relative; z-index: 2; margin: 0; background: #fffdf8; box-shadow: 0 10px 26px rgba(4, 34, 36, 0.4); }
        .livella-desk::before, .livella-desk::after { content: ""; position: absolute; z-index: 1; left: 14px; right: 14px; top: 62px; bottom: 18px; background: #f0e7d7; border-radius: 6px; transform-origin: 50% 0; }
        .livella-desk::before { transform: rotate(-0.55deg); } .livella-desk::after { transform: rotate(0.55deg); }
        .livella-desk-tabs { position: relative; z-index: 3; display: flex; gap: 6px; padding: 0 4%; height: 44px; margin-bottom: -1px; }
        .livella-desk-tabs + .livella-card { border-top-left-radius: 4px; border-top-right-radius: 4px; }
        .livella-desk-tab { flex: 1 1 0; min-width: 0; border: 0; border-radius: 7px 7px 0 0; background: #f0e7d7; color: var(--copper-dark, #8a5028); cursor: pointer;
          font: italic 500 20px 'Cormorant Garamond', Georgia, serif; display: flex; align-items: center; justify-content: center; gap: 5px; line-height: 1; margin-top: 6px; transition: margin-top 160ms, background 160ms; }
        .livella-desk-tab small { font: 700 13px 'Inter', sans-serif; color: var(--teal-dark); opacity: 0.75; font-style: normal; }
        .livella-desk-tab[aria-selected="true"] { background: #fffdf8; font-style: normal; font-weight: 700; margin-top: 0; }
        .livella-desk-tab.empty:not([aria-selected="true"]) { background: rgba(240, 231, 215, 0.62); }
        .livella-desk-tab:hover { background: #fffdf8; }
        .livella-desk-tab:focus-visible { outline: 3px solid var(--copper); outline-offset: 2px; }
        .livella-desk-empty { text-align: center; padding: 52px 20px 44px; display: flex; flex-direction: column; align-items: center; gap: 14px; }
        .livella-desk-empty p { margin: 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 24px; color: var(--espresso, #2b1810); }
        .livella-desk-empty .livella-primary-btn { width: auto; margin: 0; padding-left: 28px; padding-right: 28px; }
        .livella-fromscala { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin: 0 0 16px; font: 500 13px 'Inter', sans-serif; color: var(--gray-500); }
        .livella-view { display: inline-flex; border: 1.5px solid var(--teal); border-radius: 6px; overflow: hidden; margin: 0 0 14px; }
        .livella-view button { border: 0; background: #fff; color: var(--teal-dark); font: 600 13px 'Inter', sans-serif; padding: 9px 18px; cursor: pointer; }
        .livella-view button + button { border-left: 1.5px solid var(--teal); }
        .livella-view button[aria-pressed="true"] { background: var(--teal); color: #fff; }
        .livella-view button:focus-visible { outline: 3px solid var(--copper); outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) { .livella-desk-tab { transition: none; } }
        @media (max-width: 560px) { .livella-desk { padding: 12px 8px 12px; } .livella-desk::before, .livella-desk::after { left: 8px; right: 8px; top: 56px; bottom: 12px; } .livella-desk-tabs { padding: 0 2%; gap: 4px; } .livella-desk-tab { font-size: 18px; } }
        @media print { .livella-desk { background: none !important; padding: 0 !important; overflow: visible !important; } .livella-desk::before, .livella-desk::after, .livella-desk-tabs, .livella-view, .livella-fromscala, .livella-desk-empty { display: none !important; } .livella-desk > .livella-card { box-shadow: none !important; background: white !important; } }
        @media (max-width: 720px) {
          .livella-hero { grid-template-columns: minmax(0, 1fr); grid-template-areas: "logo" "fan" "copy"; padding: 20px 18px 26px; }
          .livella-fan { max-width: 250px; margin: 42px 0 34px; }
          .livella-sheet { padding: 14px 13px 10px; }
          .livella-sheet-title { font-size: 21px; } .livella-sheet-text { font-size: 16px; } .livella-sheet-ctext { font-size: 15px; }
          .livella-hero-copy { padding: 18px 0 4px; }
        }
        @media (prefers-reduced-motion: reduce) { .livella-sheet { transition: none; } .livella-sheet-body { animation: none; } }

        /* ====== CARDS ====== */
        .livella-card {
          background: var(--paper); border: 1px solid var(--gray-200); border-radius: 8px;
          padding: 28px; margin-bottom: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
        }

        /* ====== FORM LABELS (high contrast) ====== */
        .livella-label {
          font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--ink-soft); margin-bottom: 10px; display: block;
        }

        .livella-textarea {
          width: 100%; min-height: 120px; padding: 14px 16px;
          border: 1px solid var(--gray-200); border-radius: 6px;
          background: var(--gray-100);
          font-family: 'Inter', sans-serif; font-size: 15px;
          color: var(--ink); resize: vertical; box-sizing: border-box;
          transition: all 0.18s;
          line-height: 1.5;
        }
        .livella-textarea:focus { outline: none; border-color: var(--teal); background: white; box-shadow: 0 0 0 3px rgba(13, 115, 119, 0.1); }
        .livella-textarea::placeholder { color: var(--gray-400); }

        /* ====== MODE: from a text · write from scratch ====== */
        .livella-mode {
          display: flex; border: 1.5px solid var(--teal); border-radius: 6px; overflow: hidden; margin-bottom: 20px;
        }
        .livella-mode-btn {
          flex: 1; padding: 11px 12px; background: white; border: none; cursor: pointer;
          font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; color: var(--teal-dark);
          transition: background 0.15s, color 0.15s;
        }
        .livella-mode-btn + .livella-mode-btn { border-left: 1.5px solid var(--teal); }
        .livella-mode-btn:hover { background: var(--teal-pale); }
        .livella-mode-btn.active { background: var(--teal); color: white; }
        .livella-mode-btn:focus-visible { outline: 3px solid var(--teal-pale); outline-offset: -3px; }
        .livella-write .livella-link-row { margin-top: 18px; }
        @media print { .livella-mode, .livella-write { display: none !important; } }

        /* ====== LEARNER PROFILES (display rules) ====== */
        @media (min-width: 640px) { .livella-options-grid.profiles { grid-template-columns: repeat(5, 1fr); } }
        /* Dyslexia — BDA style guide: Lexend, 1.8 line height, +0.03em tracking, left-aligned, cream, bold not italic */
        .p-dyslexia.livella-card { background: #fbf7ee; }
        .p-dyslexia .livella-passage, .p-dyslexia .livella-scala-text, .p-dyslexia .livella-comparison-col-text, .p-dyslexia .livella-para-text {
          font-family: 'Lexend', 'Inter', sans-serif; font-size: 16px; line-height: 1.8; letter-spacing: 0.03em; text-align: left; max-width: 62ch;
        }
        .p-dyslexia .livella-gloss { font-weight: 700; font-style: normal; }
        .p-dyslexia em, .p-dyslexia i:not(.livella-chunk-bar i) { font-style: normal; font-weight: 700; }
        /* Reading support — numbered paragraphs, generous spacing */
        .livella-para { position: relative; margin-bottom: 22px; }
        .livella-para.numbered { padding-left: 34px; }
        .livella-para-num {
          position: absolute; left: 0; top: 4px; width: 24px; height: 24px; border-radius: 50%;
          background: var(--teal-pale); color: var(--teal-dark); font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700;
          display: inline-flex; align-items: center; justify-content: center;
        }
        .livella-wordbank { margin-bottom: 22px; padding: 14px 16px; background: var(--teal-pale); border-radius: 8px; }
        .livella-wordbank h4 { margin: 0 0 10px; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--teal-dark); }
        .livella-wordbank-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .livella-wordbank-chip { background: white; border: 1px solid var(--teal-light); border-radius: 999px; padding: 5px 12px; font-family: 'Inter', sans-serif; font-size: 13px; color: var(--ink); }
        .livella-wordbank-chip b { color: var(--teal-dark); }
        /* ADHD — one chunk, one count, one micro-task */
        .livella-para.chunk { padding: 14px 16px; border: 1px solid var(--gray-200); border-radius: 8px; background: white; }
        .livella-chunk-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 8px; }
        .livella-chunk-count { font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--teal-dark); }
        .livella-chunk-bar { display: flex; gap: 4px; }
        .livella-chunk-bar i { display: block; width: 22px; height: 6px; border-radius: 3px; background: var(--gray-200); }
        .livella-chunk-bar i.on { background: var(--teal); }
        .livella-micro { margin-top: 10px; padding-top: 10px; border-top: 1px dashed var(--gray-200); font-family: 'Inter', sans-serif; font-size: 14px; color: var(--teal-dark); display: flex; align-items: flex-start; gap: 8px; }
        .livella-micro-box { flex: 0 0 16px; width: 16px; height: 16px; border: 2px solid var(--teal); border-radius: 3px; margin-top: 2px; }
        .livella-micro b { font-weight: 700; }
        .p-adhd .livella-passage { margin-bottom: 20px; }
        /* Accommodations list inside the teacher note */
        .livella-accommodations { margin: 10px 0 0; padding-left: 18px; font-size: 13px; }
        .livella-accommodations-label { list-style: none; margin-left: -18px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; font-size: 10px; color: var(--copper); margin-bottom: 4px; }
        @media print { .livella-accommodations { display: none; } }

        /* Elementary readers: larger type, more air */
        .age-elem .livella-passage, .age-elem .livella-para-text, .age-elem .livella-scala-text { font-size: 24px; line-height: 1.75; }
        .livella-ui-choice { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 6px; margin: -4px 0 14px; font-family: 'Inter', sans-serif; font-size: 12px; color: var(--gray-500); }
        .livella-ui-choice span { letter-spacing: 0.08em; text-transform: uppercase; font-weight: 700; font-size: 10.5px; margin-right: 4px; }
        .livella-ui-choice button { border: 1px solid var(--gray-200); background: white; color: var(--teal-dark); border-radius: 999px; padding: 4px 12px; font: 600 12px 'Inter', sans-serif; cursor: pointer; }
        .livella-ui-choice button.active { background: var(--teal-dark); color: white; border-color: var(--teal-dark); }
        .livella-ui-choice button:focus-visible { outline: 3px solid var(--teal-pale); outline-offset: 2px; }
        @media print { .livella-ui-choice { display: none !important; } }
        /* ====== SHARED LESSON ====== */
        .livella-share-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: var(--teal-dark); color: white; border: 0; border-radius: 6px; padding: 12px 18px; font: 600 14px 'Inter', sans-serif; cursor: pointer; }
        .livella-share-btn:hover { background: var(--teal); }
        .livella-share-btn:focus-visible { outline: 3px solid var(--teal-pale); outline-offset: 2px; }
        .livella-share { border-top: 3px solid var(--teal-dark); }
        .livella-share-name { max-width: 360px; }
        .livella-share-row { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-bottom: 6px; }
        .livella-share-row .livella-link-input { flex: 1 1 240px; min-width: 0; }
        .livella-version { display: flex; flex-direction: column; gap: 8px; }
        .livella-version .livella-comparison-col-head { margin: 0; }
        .livella-version-edit { min-height: 180px; font-family: 'Cormorant Garamond', serif; font-size: 17px; background: white; }
        .livella-version-foot { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: auto; padding-top: 8px; font-family: 'Inter', sans-serif; font-size: 12px; color: var(--gray-500); }
        .livella-notes { list-style: none; margin: 0 0 10px; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        .livella-notes li { background: var(--copper-pale); border-left: 3px solid var(--copper); border-radius: 0 6px 6px 0; padding: 9px 12px; font-family: 'Inter', sans-serif; font-size: 14px; color: var(--espresso); }
        .livella-notes li span { font-size: 11.5px; color: var(--gray-500); margin-left: 6px; }
        .livella-notes li p { margin: 4px 0 0; line-height: 1.45; }
        @media print { .livella-share, .livella-share-btn { display: none !important; } }
        /* ====== COMPARE · LISTEN · LANGUAGE-SWITCH WARNING ====== */
        .livella-cmp { margin-top: 22px; padding-top: 18px; border-top: 1px solid var(--gray-200); }
        .livella-cmp-head { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; margin-bottom: 10px; }
        .livella-cmp-tabs { display: inline-flex; border: 1.5px solid var(--teal); border-radius: 6px; overflow: hidden; }
        .livella-cmp-tab { border: 0; background: white; color: var(--teal-dark); font: 600 12.5px 'Inter', sans-serif; padding: 7px 14px; cursor: pointer; }
        .livella-cmp-tab + .livella-cmp-tab { border-left: 1.5px solid var(--teal); }
        .livella-cmp-tab.active { background: var(--teal); color: white; }
        .livella-cmp-tab:focus-visible { outline: 3px solid var(--teal-pale); outline-offset: -3px; }
        .livella-cmp .livella-compare-row { margin-bottom: 8px; }
        .livella-comparison-col-head { font-family: 'Cormorant Garamond', serif; font-weight: 600; font-size: 20px; line-height: 1.15; margin: 0 0 8px; color: var(--ink); }
        .livella-comparison-col-body .livella-passage { font-size: 16px; margin-bottom: 8px; }
        .livella-comparison-col-body .livella-wordbank { margin-bottom: 14px; }
        .livella-comparison-col-gloss { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
        .livella-comparison-col-gloss span { font-family: 'Inter', sans-serif; font-size: 12px; color: var(--gray-500); border: 1px solid var(--gray-200); border-radius: 999px; padding: 3px 9px; }
        .livella-comparison-col-gloss b { color: var(--ink); font-weight: 600; }
        .livella-listen { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 18px; }
        .livella-listen-btn { display: inline-flex; align-items: center; gap: 8px; background: var(--teal); color: white; border: 0; border-radius: 999px; padding: 9px 18px; font: 600 13.5px 'Inter', sans-serif; cursor: pointer; }
        .livella-listen-btn.on { background: var(--espresso); }
        .livella-listen-btn:focus-visible { outline: 3px solid var(--teal-pale); outline-offset: 2px; }
        .livella-hidden-note { padding: 28px 18px; margin-bottom: 24px; border: 1.5px dashed var(--teal-light); border-radius: 8px; text-align: center; font-family: 'Inter', sans-serif; font-size: 15px; color: var(--teal-dark); background: var(--teal-pale); }
        .livella-switch-warn { display: flex; align-items: center; justify-content: space-between; gap: 12px 18px; flex-wrap: wrap; margin: 0 0 14px; padding: 12px 16px; background: var(--copper-pale); border-left: 3px solid var(--copper); border-radius: 0 6px 6px 0; font-family: 'Inter', sans-serif; font-size: 13.5px; color: var(--espresso); }
        .livella-switch-warn p { margin: 0; flex: 1 1 320px; line-height: 1.5; }
        .livella-switch-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .livella-topic-box { resize: vertical; min-height: 46px; line-height: 1.45; font-family: 'Inter', sans-serif; }
        @media print { .livella-cmp, .livella-listen, .livella-hidden-note, .livella-switch-warn { display: none !important; } }

        /* ====== SOURCE: upload + link ====== */
        .livella-source-row {
          display: flex; align-items: center; gap: 14px; flex-wrap: wrap; margin-bottom: 16px;
        }
        .livella-upload-btn {
          position: relative; display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 16px; border-radius: 6px; cursor: pointer;
          background: white; color: var(--teal-dark); border: 1.5px solid var(--teal);
          font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
          transition: background 0.15s, color 0.15s;
        }
        .livella-upload-btn:hover { background: var(--teal); color: white; }
        .livella-upload-btn:focus-within { outline: 3px solid var(--teal-pale); outline-offset: 2px; }
        .livella-upload-btn input { position: absolute; width: 1px; height: 1px; opacity: 0; overflow: hidden; }
        .livella-upload-icon { font-size: 15px; line-height: 1; }
        .livella-upload-hint { font-family: 'Inter', sans-serif; font-size: 12px; color: var(--gray-500); flex: 1 1 220px; min-width: 0; }
        .livella-image-chip {
          display: flex; align-items: center; gap: 12px; margin-bottom: 16px;
          padding: 8px 10px; background: var(--teal-pale); border: 1px solid var(--teal-light); border-radius: 8px;
        }
        .livella-image-chip img { width: 56px; height: 56px; object-fit: cover; border-radius: 4px; border: 1px solid white; }
        .livella-image-name { flex: 1; min-width: 0; font-family: 'Inter', sans-serif; font-size: 13px; color: var(--teal-dark); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .livella-image-remove {
          width: 28px; height: 28px; border-radius: 50%; border: none; cursor: pointer;
          background: white; color: var(--teal-dark); font-size: 18px; line-height: 1;
        }
        .livella-image-remove:hover { background: var(--teal); color: white; }
        .livella-link-row { margin-top: 14px; display: flex; flex-direction: column; gap: 6px; }
        .livella-link-input {
          width: 100%; padding: 10px 14px; box-sizing: border-box;
          border: 1px solid var(--gray-200); border-radius: 6px; background: var(--gray-100);
          font-family: 'Inter', sans-serif; font-size: 14px; color: var(--ink);
        }
        .livella-link-input:focus { outline: none; border-color: var(--teal); background: white; box-shadow: 0 0 0 3px rgba(13, 115, 119, 0.1); }
        .livella-link-hint { font-family: 'Inter', sans-serif; font-size: 11px; color: var(--gray-500); }
        .livella-source-link { color: var(--teal-dark); word-break: break-all; }
        @media print { .livella-source-row, .livella-image-chip, .livella-link-row { display: none !important; } }

        .livella-options-grid {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-top: 4px;
        }
        @media (min-width: 640px) { .livella-options-grid { grid-template-columns: repeat(4, 1fr); } }

        .livella-option-btn {
          background: white; border: 1.5px solid var(--gray-200); border-radius: 6px;
          padding: 12px 14px; cursor: pointer; text-align: left;
          transition: all 0.15s ease; font-family: 'Inter', sans-serif;
        }
        .livella-option-btn:hover { border-color: var(--teal-light); }
        .livella-option-btn.active {
          border-color: var(--teal);
          background: var(--teal-pale);
          box-shadow: 0 1px 3px rgba(13, 115, 119, 0.15);
        }
        .livella-option-name {
          font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600;
          color: var(--ink); display: block; line-height: 1.2;
        }
        .livella-option-sub { font-size: 11px; color: var(--gray-500); margin-top: 3px; }
        .livella-option-btn.active .livella-option-name { color: var(--teal-dark); }

        .livella-primary-btn {
          width: 100%; background: var(--teal); color: white; border: none;
          padding: 14px; font-family: 'Inter', sans-serif; font-size: 15px;
          font-weight: 600; letter-spacing: 0.02em; cursor: pointer; border-radius: 6px;
          margin-top: 24px; transition: all 0.18s;
        }
        .livella-primary-btn:hover:not(:disabled) { background: var(--teal-dark); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(13, 115, 119, 0.3); }
        .livella-primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ====== LA SCALA ====== */
        .livella-scala-btn {
          width: 100%; margin-top: 10px; padding: 13px;
          background: white; color: var(--copper-darker, #8a5028);
          border: 1.5px solid var(--copper); border-radius: 6px; cursor: pointer;
          font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; letter-spacing: 0.02em;
          display: inline-flex; align-items: center; justify-content: center; gap: 12px;
          transition: all 0.18s;
        }
        .livella-scala-btn:hover:not(:disabled) { background: var(--copper); color: white; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(184, 116, 58, 0.3); }
        .livella-scala-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .livella-scala-glyph { display: inline-flex; align-items: flex-end; gap: 2px; height: 16px; }
        .livella-scala-glyph i { display: block; width: 4px; background: currentColor; border-radius: 1px; opacity: 0.85; }
        .livella-scala-glyph i:nth-child(1) { height: 4px; } .livella-scala-glyph i:nth-child(2) { height: 7px; }
        .livella-scala-glyph i:nth-child(3) { height: 10px; } .livella-scala-glyph i:nth-child(4) { height: 13px; } .livella-scala-glyph i:nth-child(5) { height: 16px; }

        .livella-scala-card { border-top: 4px solid var(--copper); }
        .livella-scala-eyebrow {
          font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--copper); margin-bottom: 4px;
        }
        .livella-scala-all { display: flex; gap: 6px; flex-wrap: wrap; align-items: flex-start; }
        .livella-scala-mini {
          padding: 7px 12px; border-radius: 999px; cursor: pointer;
          background: var(--teal-pale); color: var(--teal-dark); border: 1px solid var(--teal-light);
          font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600;
        }
        .livella-scala-mini:hover { background: var(--teal); color: white; }
        .livella-scala-mini.ghost { background: transparent; color: var(--gray-500); border-color: var(--gray-200); }
        .livella-scala-mini.ghost:hover { color: var(--teal-dark); border-color: var(--teal-light); background: transparent; }

        .livella-scala-legend { display: flex; align-items: center; gap: 6px; margin: 6px 0 18px; }
        .livella-scala-legend-text { font-family: 'Inter', sans-serif; font-size: 11px; color: var(--gray-500); margin-left: 6px; }
        .livella-rung-dot {
          width: 22px; height: 22px; border-radius: 50%; display: inline-grid; place-items: center;
          font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 700; color: white;
        }
        /* five rungs: pale → deep teal. The darker the rung, the higher the level. */
        .r0 { --rung: #8fcfca; --rung-ink: #0a5c5f; }
        .r1 { --rung: #4fb3ad; --rung-ink: #0a5c5f; }
        .r2 { --rung: #14a098; --rung-ink: #ffffff; }
        .r3 { --rung: #0d7377; --rung-ink: #ffffff; }
        .r4 { --rung: #0a5c5f; --rung-ink: #ffffff; }
        .livella-rung-dot { background: var(--rung); color: var(--rung-ink); }

        .livella-scala { display: flex; flex-direction: column; gap: 18px; }
        .livella-scala-para {
          border-left: 4px solid var(--rung); padding: 4px 0 4px 18px;
          transition: border-color 0.25s, background-color 0.4s; border-radius: 0 6px 6px 0;
        }
        .livella-scala-para.bump { background-color: rgba(20, 160, 152, 0.10); }
        @media (prefers-reduced-motion: reduce) { .livella-scala-para { transition: none; } }
        .livella-scala-ctrl { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
        .livella-scala-arrow {
          width: 34px; height: 34px; border-radius: 50%; cursor: pointer; font-size: 16px; line-height: 1;
          background: white; color: var(--teal-dark); border: 1.5px solid var(--teal-light);
          display: inline-grid; place-items: center; transition: all 0.15s;
        }
        .livella-scala-arrow:hover:not(:disabled) { background: var(--teal); color: white; border-color: var(--teal); transform: translateY(-1px); }
        .livella-scala-arrow:disabled { opacity: 0.3; cursor: not-allowed; }
        .livella-scala-arrow:focus-visible { outline: 3px solid var(--teal-pale); outline-offset: 2px; }
        .livella-rung-badge {
          display: inline-flex; align-items: baseline; gap: 8px; padding: 5px 12px 5px 6px;
          border-radius: 999px; background: var(--rung); color: var(--rung-ink);
          font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600;
        }
        .livella-rung-num {
          display: inline-grid; place-items: center; width: 20px; height: 20px; border-radius: 50%;
          background: rgba(255,255,255,0.35); color: var(--rung-ink); font-size: 11px; font-weight: 700; align-self: center;
        }
        .livella-rung-sub { font-weight: 400; opacity: 0.85; font-size: 11px; }
        .livella-scala-text {
          font-family: 'Cormorant Garamond', serif; font-size: 19px; line-height: 1.65; color: var(--espresso); margin: 0;
          white-space: pre-line;
        }
        @media (max-width: 640px) {
          .livella-scala-text { font-size: 17px; }
          .livella-rung-sub { display: none; }
        }

        .livella-error {
          color: #b91c1c;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 6px;
          padding: 10px 14px;
          font-size: 14px;
          margin-top: 14px;
          font-weight: 500;
        }

        /* ====== RESULT HEADER ====== */
        .livella-result-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          gap: 16px; margin-bottom: 24px; flex-wrap: wrap;
          padding-bottom: 20px; border-bottom: 1px solid var(--gray-200);
        }
        .livella-result-title {
          font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 600;
          color: var(--espresso); margin: 0 0 4px; line-height: 1.15;
        }
        .livella-result-meta {
          font-size: 11px; color: var(--gray-500); letter-spacing: 0.08em;
          text-transform: uppercase; font-weight: 600;
        }
        .livella-toggle-btn {
          background: white; border: 1.5px solid var(--teal); color: var(--teal);
          padding: 8px 14px; font-family: 'Inter', sans-serif; font-size: 12px;
          font-weight: 600; cursor: pointer; border-radius: 6px; transition: all 0.15s; white-space: nowrap;
        }
        .livella-toggle-btn:hover { background: var(--teal); color: white; }
        .livella-toggle-btn.active { background: var(--teal); color: white; }

        /* ====== PASSAGE (the only place where serif content lives) ====== */
        .livella-passage {
          font-family: 'Cormorant Garamond', serif; font-size: 19px;
          line-height: 1.7; color: var(--ink); margin-bottom: 28px;
          white-space: pre-line; /* dialogues, rhymes and songs keep their line breaks */
        }

        .livella-comparison-grid {
          display: grid; grid-template-columns: 1fr; gap: 16px; margin-bottom: 24px;
        }
        @media (min-width: 768px) { .livella-comparison-grid.two-col { grid-template-columns: 1fr 1fr; } }
        .livella-comparison-col {
          background: var(--gray-100); border: 1px solid var(--gray-200); border-radius: 6px;
          padding: 18px 20px;
        }
        .livella-comparison-col-title {
          font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--copper); margin-bottom: 12px; padding-bottom: 10px;
          border-bottom: 1px solid var(--gray-200);
        }
        .livella-comparison-col-text {
          font-family: 'Cormorant Garamond', serif; font-size: 16px;
          line-height: 1.65; color: var(--ink); white-space: pre-line;
        }

        .livella-gloss {
          background: linear-gradient(180deg, transparent 60%, var(--copper-pale) 60%);
          padding: 0 2px; cursor: help; transition: background 0.2s; border-radius: 2px;
        }
        .livella-gloss:hover { background: var(--copper-pale); }

        .livella-tooltip {
          position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
          background: var(--espresso); color: white;
          padding: 12px 18px; border-radius: 6px; font-size: 14px;
          font-family: 'Inter', sans-serif;
          z-index: 100; box-shadow: 0 4px 16px rgba(43, 24, 16, 0.3);
          max-width: 90%; text-align: center;
        }
        .livella-tooltip strong {
          color: var(--copper-light); font-weight: 700; margin-right: 6px;
        }

        /* ====== TEACHER TRANSLATIONS (parallel text; never printed) ====== */
        .livella-translations {
          margin: 14px 0 22px;
          padding: 14px 18px;
          background: var(--teal-pale);
          border-left: 3px solid var(--teal);
          border-radius: 0 8px 8px 0;
        }
        .livella-translations.compact { margin: 10px 0 0; padding: 10px 14px; }
        .livella-translation-row + .livella-translation-row { margin-top: 10px; padding-top: 10px; border-top: 1px dashed rgba(13,115,119,0.3); }
        .livella-translation-label {
          display: block; font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase; color: var(--teal-dark); margin-bottom: 4px;
        }
        .livella-translation-text {
          font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.6; color: var(--ink-soft);
          white-space: pre-line;
        }
        .livella-translations.compact .livella-translation-text { font-size: 13px; }
        .livella-gloss-it { color: var(--teal-dark); font-style: italic; }
        @media print { .livella-translations { display: none !important; } }

        /* ====== VOCABOLARIO LIST ====== */
        .livella-glosses-list {
          background: var(--gray-100); border: 1px solid var(--gray-200); border-radius: 6px;
          padding: 18px 22px; margin-bottom: 20px;
        }
        .livella-glosses-list h4 {
          font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--copper); margin: 0 0 14px;
        }
        .livella-gloss-row {
          display: grid; grid-template-columns: 1fr 1.4fr; gap: 16px;
          padding: 8px 0; border-bottom: 1px solid var(--gray-200); align-items: baseline;
        }
        .livella-gloss-row:last-child { border-bottom: none; }
        .livella-gloss-italian {
          font-family: 'Cormorant Garamond', serif; font-size: 17px; font-weight: 600;
          color: var(--espresso); font-style: italic;
        }
        .livella-gloss-english { font-family: 'Inter', sans-serif; font-size: 14px; color: var(--ink-soft); }

        .livella-teacher-note {
          background: var(--copper-pale);
          border-left: 3px solid var(--copper);
          padding: 14px 18px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: var(--espresso);
          margin-bottom: 20px;
          line-height: 1.55;
          border-radius: 0 4px 4px 0;
        }
        .livella-teacher-note-label {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--copper);
          font-weight: 700;
          display: block;
          margin-bottom: 6px;
        }

        /* ====== SECTION HEADERS ====== */
        .livella-section-title {
          font-family: 'Inter', sans-serif; font-size: 20px; font-weight: 700;
          color: var(--ink); margin: 0 0 6px;
          letter-spacing: -0.01em;
        }
        .livella-section-subtitle {
          font-family: 'Inter', sans-serif; font-size: 13px; color: var(--gray-500);
          margin-bottom: 20px;
        }

        /* ====== BUILDER ====== */
        .livella-builder-row {
          display: grid; grid-template-columns: 1fr; gap: 18px; margin-bottom: 18px;
        }
        @media (min-width: 768px) { .livella-builder-row { grid-template-columns: 1.4fr 1fr 1fr; } }

        .livella-count-row {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px;
        }
        .livella-count-btn {
          background: white; border: 1.5px solid var(--gray-200); border-radius: 6px;
          padding: 10px 8px; font-family: 'Inter', sans-serif;
          font-size: 15px; font-weight: 600; color: var(--ink); cursor: pointer;
          transition: all 0.15s;
        }
        .livella-count-btn:hover { border-color: var(--teal-light); }
        .livella-count-btn.active { background: var(--teal); color: white; border-color: var(--teal); }

        .livella-diff-row {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;
        }
        .livella-diff-btn {
          background: white; border: 1.5px solid var(--gray-200); border-radius: 6px;
          padding: 9px 6px; font-family: 'Inter', sans-serif; font-size: 12px;
          font-weight: 500; color: var(--ink-soft); cursor: pointer; transition: all 0.15s; text-align: center;
        }
        .livella-diff-btn:hover { border-color: var(--teal-light); }
        .livella-diff-btn.active { background: var(--teal); color: white; border-color: var(--teal); }

        .livella-builder-btn {
          width: 100%; background: var(--teal); color: white; border: none;
          padding: 13px; font-family: 'Inter', sans-serif;
          font-size: 14px; font-weight: 600;
          cursor: pointer; border-radius: 6px; margin-top: 8px; transition: all 0.18s;
        }
        .livella-builder-btn:hover:not(:disabled) { background: var(--teal-dark); transform: translateY(-1px); }
        .livella-builder-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .livella-exercise-set {
          background: var(--gray-100); border: 1px solid var(--gray-200); border-radius: 8px;
          padding: 20px; margin-top: 18px;
        }
        .livella-exercise-set-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 14px; padding-bottom: 12px;
          border-bottom: 1px solid var(--gray-200);
          gap: 12px; flex-wrap: wrap;
        }
        .livella-exercise-set-title {
          font-family: 'Inter', sans-serif; font-size: 16px;
          font-weight: 700; color: var(--ink);
        }
        .livella-exercise-set-meta {
          font-size: 11px; color: var(--gray-500); letter-spacing: 0.06em;
          text-transform: uppercase; font-weight: 600; margin-top: 2px;
        }
        .livella-exercise-set-remove {
          background: white; border: 1px solid var(--gray-200); color: var(--gray-500);
          font-size: 18px; cursor: pointer; padding: 2px 10px; line-height: 1;
          font-family: 'Inter', sans-serif; border-radius: 6px;
          transition: all 0.15s;
        }
        .livella-exercise-set-remove:hover { color: #b91c1c; border-color: #fecaca; background: #fef2f2; }

        .livella-clear-all-row { text-align: right; margin-top: 14px; }
        .livella-clear-all-btn {
          background: transparent; border: none; color: var(--gray-500);
          font-family: 'Inter', sans-serif; font-size: 12px;
          cursor: pointer; padding: 6px 10px; text-decoration: underline;
          font-weight: 500;
        }
        .livella-clear-all-btn:hover { color: var(--copper); }

        .livella-compare-row { display: flex; gap: 6px; margin-bottom: 16px; flex-wrap: wrap; }
        .livella-compare-mini-btn {
          background: white; border: 1.5px solid var(--gray-200); color: var(--ink-soft);
          padding: 7px 14px; font-family: 'Inter', sans-serif; font-size: 12px;
          font-weight: 600; cursor: pointer; border-radius: 6px;
          transition: all 0.15s;
        }
        .livella-compare-mini-btn:hover:not(:disabled) { border-color: var(--teal); color: var(--teal); }
        .livella-compare-mini-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .livella-compare-mini-btn.active { background: var(--teal); color: white; border-color: var(--teal); }

        /* ====== ACTIVITY TABS ====== */
        .livella-activity-tabs {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 20px;
        }
        @media (min-width: 640px) { .livella-activity-tabs { grid-template-columns: repeat(4, 1fr); } }

        .livella-tab-btn {
          background: white; border: 1.5px solid var(--gray-200); padding: 14px 12px;
          font-family: 'Inter', sans-serif; cursor: pointer; border-radius: 8px;
          transition: all 0.15s; text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 6px;
        }
        .livella-tab-btn:hover { border-color: var(--teal-light); transform: translateY(-1px); }
        .livella-tab-btn.active { background: var(--teal); border-color: var(--teal); }
        .livella-tab-btn.active .livella-tab-name { color: white; }
        .livella-tab-btn.active .livella-tab-sub { color: var(--teal-pale); }
        .livella-tab-btn.active .livella-tab-icon { color: white; background: rgba(255,255,255,0.2); }
        .livella-tab-icon {
          font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 700;
          color: var(--copper); background: var(--copper-pale);
          width: 28px; height: 28px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }
        .livella-tab-name {
          font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600;
          color: var(--ink);
        }
        .livella-tab-sub { font-size: 11px; color: var(--gray-500); font-weight: 500; }
        .livella-tab-btn.loading .livella-tab-name::after { content: ' ...'; color: var(--copper); }

        /* ====== QUESTION CARDS (the big visual fix) ====== */
        .q-card {
          background: white;
          border: 1px solid var(--gray-200);
          border-radius: 8px;
          padding: 18px 20px;
          margin-bottom: 12px;
          display: grid;
          grid-template-columns: 36px 1fr;
          gap: 16px;
          align-items: flex-start;
          transition: border-color 0.15s;
        }
        .q-card:hover { border-color: var(--copper-light); }

        .q-number {
          background: var(--copper);
          color: white;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 700;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .q-body { min-width: 0; }

        .q-instruction {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          color: var(--gray-500);
          font-style: italic;
          margin-bottom: 8px;
          letter-spacing: 0;
          line-height: 1.4;
        }

        .q-question {
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: var(--ink);
          line-height: 1.55;
          margin-bottom: 12px;
        }

        .q-options {
          list-style: none;
          padding: 0;
          margin: 8px 0 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .q-options li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 8px 12px;
          background: var(--gray-100);
          border-radius: 6px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: var(--ink);
          line-height: 1.4;
        }
        .q-letter {
          font-weight: 700;
          color: var(--copper);
          flex-shrink: 0;
          width: 18px;
          text-transform: lowercase;
        }
        .q-letter::after { content: ')'; }

        .q-answer {
          margin-top: 12px;
          background: var(--answer-bg);
          border: 1px solid var(--answer-border);
          border-radius: 6px;
          padding: 10px 14px;
        }
        .q-answer-label {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--answer-dark);
          margin-bottom: 4px;
        }
        .q-answer-text {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: var(--answer-darker);
          font-weight: 500;
          line-height: 1.45;
        }
        .q-note {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          color: var(--gray-500);
          font-style: italic;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px dashed var(--gray-200);
        }

        /* ====== ACTIONS ====== */
        .livella-actions {
          display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-top: 24px;
        }
        .livella-action-btn {
          background: white; border: 1.5px solid var(--copper); color: var(--copper);
          padding: 11px 12px; font-family: 'Inter', sans-serif; font-size: 13px;
          font-weight: 600; cursor: pointer;
          border-radius: 6px; transition: all 0.15s;
        }
        .livella-action-btn:hover:not(:disabled) { background: var(--copper); color: white; }
        .livella-action-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .livella-action-btn.copy.copied { background: var(--answer-dark); color: white; border-color: var(--answer-dark); }

        .livella-loading {
          text-align: center; padding: 60px 20px;
          font-family: 'Inter', sans-serif;
          font-size: 15px; color: var(--gray-500);
          font-weight: 500;
        }
        .livella-loading::after {
          content: '...'; animation: dots 1.2s steps(4, end) infinite;
          display: inline-block; width: 18px; text-align: left;
        }
        @keyframes dots {
          0%, 20% { content: ''; }
          40% { content: '.'; }
          60% { content: '..'; }
          80%, 100% { content: '...'; }
        }

        .livella-footer {
          text-align: center; margin-top: 36px;
          font-family: 'Inter', sans-serif;
          font-size: 12px; color: var(--gray-400);
          letter-spacing: 0.04em;
        }

        .livella-empty-state {
          text-align: center; padding: 36px 20px; color: var(--gray-500);
          font-family: 'Inter', sans-serif; font-size: 14px;
          background: var(--gray-100); border-radius: 8px;
        }

        /* ====== PRINT-READY VIEW ====== */
        @media print {
          /* Page setup: letter, 1 inch margins (per teacher's standard) */
          @page {
            size: letter;
            margin: 1in;
          }

          body {
            background: white !important;
            color: black !important;
          }

          /* Hide everything that's not the actual lesson content */
          .livella-hero,
          .livella-card-input,
          .livella-actions,
          .livella-compare-row,
          .livella-action-btn,
          .livella-print-btn,
          .livella-activity-tabs,
          .livella-builder-row,
          .livella-toggle-row,
          .livella-footer,
          button {
            display: none !important;
          }

          /* Reset container to fit page */
          .livella-container {
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Show only result content + activities */
          .livella-card {
            background: white !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            padding: 0 !important;
            margin-bottom: 24pt !important;
            page-break-inside: avoid;
          }

          /* Italian title styling for print */
          .livella-section-title {
            font-family: 'Cormorant Garamond', serif !important;
            font-size: 22pt !important;
            color: black !important;
            border-bottom: 1.5pt solid black !important;
            padding-bottom: 8pt !important;
            margin-bottom: 16pt !important;
          }

          /* Italian passage styling */
          .livella-passage,
          .livella-italian-text {
            font-family: 'Cormorant Garamond', 'Georgia', serif !important;
            font-size: 13pt !important;
            line-height: 1.7 !important;
            color: black !important;
          }

          /* Hide hover glosses; print inline vocab list instead */
          .livella-gloss-tooltip { display: none !important; }
          .livella-gloss-word {
            color: black !important;
            border-bottom: none !important;
            font-style: normal !important;
          }

          /* Vocabulary list - clean print layout */
          .livella-vocab-list {
            border-top: 1pt solid #999 !important;
            padding-top: 12pt !important;
            margin-top: 16pt !important;
          }
          .livella-vocab-item {
            background: white !important;
            border: none !important;
            border-bottom: 0.5pt solid #ccc !important;
            padding: 6pt 0 !important;
            page-break-inside: avoid;
          }

          /* Question cards */
          .livella-question-card {
            background: white !important;
            border: 1pt solid #999 !important;
            border-radius: 0 !important;
            padding: 10pt !important;
            margin-bottom: 10pt !important;
            page-break-inside: avoid;
          }
          .livella-question-number {
            background: black !important;
            color: white !important;
            font-weight: 700;
          }
          .livella-question-text {
            color: black !important;
            font-size: 11pt !important;
          }

          /* Hide answer boxes by default in print — teachers can toggle student vs answer key */
          .livella-question-answer {
            background: white !important;
            border: 0.5pt dashed #999 !important;
            color: black !important;
            min-height: 36pt !important;
          }
          .livella-question-answer::before {
            content: "" !important;
          }

          /* Show classroom standard header at top */
          .livella-print-header {
            display: block !important;
            border-bottom: 1.5pt solid black;
            padding-bottom: 8pt;
            margin-bottom: 16pt;
            font-family: 'Inter', sans-serif;
            font-size: 11pt;
          }

          /* Avoid bad page breaks */
          h1, h2, h3 { page-break-after: avoid; }
          p, li { orphans: 3; widows: 3; }
        }

        /* Print header hidden on screen, only visible in print */
        .livella-print-header { display: none; }

        /* Print button styling */
        .livella-print-btn {
          background: white;
          color: var(--espresso);
          border: 1.5px solid var(--espresso);
          padding: 10px 18px;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 500;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s;
          letter-spacing: 0.01em;
        }
        .livella-print-btn:hover:not(:disabled) {
          background: var(--espresso);
          color: white;
        }
        .livella-print-btn:disabled { opacity: 0.55; cursor: wait; }
        .livella-print-btn.teacher { border-style: dashed; }
      `}</style>

      <div className="livella-container">
        <nav className="livella-lang-bar" aria-label="Language">
          {LANGUAGE_ORDER.map((id) => {
            const lg = LANGUAGES[id];
            return (
              <button key={id}
                className={`livella-lang-btn ${lang === id ? "active" : ""}`}
                onClick={() => askSwitchLanguage(id)}
                aria-pressed={lang === id}>
                <span className="livella-lang-flag" aria-hidden="true">{lg.flag}</span>
                <span className="livella-lang-name">{lg.name}</span>
              </button>
            );
          })}
        </nav>
        {uiOptions.length > 1 && (
          <div className="livella-ui-choice" role="group" aria-label="Interface language">
            <span>Interface</span>
            {uiOptions.map((code) => (
              <button key={code} type="button" aria-pressed={UIL === code} className={UIL === code ? "active" : ""} onClick={() => chooseUi(code)}>{UI_NAMES[code]}</button>
            ))}
          </div>
        )}
        {pendingLang && (
          <div className="livella-switch-warn" role="alertdialog" aria-label={T.switchWarn.replace("{x}", LANGUAGES[pendingLang].name)}>
            <p><strong>{T.switchWarn.replace("{x}", LANGUAGES[pendingLang].name)}</strong> {T.switchTip}</p>
            <div className="livella-switch-actions">
              <button type="button" className="livella-compare-mini-btn" onClick={() => setPendingLang(null)}>{T.switchNo}</button>
              <button type="button" className="livella-compare-mini-btn active" onClick={() => switchLanguage(pendingLang)}>{T.switchYes.replace("{x}", LANGUAGES[pendingLang].name)}</button>
            </div>
          </div>
        )}

        <header className="livella-hero">
          <h1 className="livella-logo">Livel<span>la</span></h1>
          <div className="livella-hero-copy">
            <p className="livella-tagline">{T.tagline} <span className="livella-tagline-all">· {T.forAll}</span></p>
            <h2 className="livella-hero-head">{T.heroHead}</h2>
            <hr className="livella-hero-rule" />
            <p className="livella-hero-sub">{T.heroSub}</p>
            <div className="livella-hero-btns">
              <button type="button" className="livella-hero-cta" onClick={scrollToTool}>{T.heroCta}</button>
              {shareApi && (
                <button type="button" className="livella-hero-invite" onClick={inviteTeachers} aria-live="polite">
                  {invited ? T.inviteCopied : <><span aria-hidden="true">↗</span> {T.inviteBtn}</>}
                </button>
              )}
            </div>
            <span className="livella-hero-micro">{T.heroMicro}</span>
          </div>
          <div className="livella-fanwrap">
            <div className={`livella-fan ${heroOpen ? "open" : ""}`}>
              <div className="livella-fan-tabs" role="tablist" aria-label={T.levelLabel}>
                {LEVELS.map((l, i) => (
                  <button key={l.id} type="button" role="tab" aria-selected={heroIdx === i} aria-label={l.label}
                    className="livella-fan-tab" onClick={() => pickHero(i)}>
                    {LEVEL_SHORT[l.label] || i + 1}
                  </button>
                ))}
              </div>
              {LEVELS.map((l, i) => {
                const sh = L.heroSheets[i];
                const front = heroIdx === i;
                return (
                  <div key={l.id} className={`livella-sheet ${front ? "front" : ""}`} style={{ "--n": i }} onClick={() => pickHero(i)}>
                    {front && (
                      <div className="livella-sheet-body">
                        <p className="livella-sheet-lvl">{l.label} · {l.sub}</p>
                        <p className={`livella-sheet-title ${heroAdhd ? "small" : ""}`}>{L.heroTitle}</p>
                        {!heroAdhd && (<>
                          <p className="livella-sheet-text">{sh.txt}</p>
                          <div className="livella-sheet-gloss">{sh.gloss.map((g, j) => <span key={j}><b>{g[0]}</b> {g[1]}</span>)}</div>
                        </>)}
                        {heroAdhd && sh.chunks.map((c, j) => (
                          <div key={j} className="livella-sheet-chunk">
                            <p className="livella-sheet-count">{j + 1} {T.of} {sh.chunks.length}</p>
                            <p className="livella-sheet-ctext">{c[0]}</p>
                            <p className="livella-sheet-mini"><i aria-hidden="true"></i>{c[1]}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="livella-hero-prof" role="group" aria-label={T.profileLabel}>
              <button type="button" aria-pressed={!heroAdhd} onClick={() => setHeroAdhd(false)}>{T.standard}</button>
              <button type="button" aria-pressed={heroAdhd} onClick={() => { setHeroAuto(false); setHeroAdhd(true); }}>{PROFILES[1].label[UIL]}</button>
            </div>
            <p className="livella-hero-example">{T.heroExample}</p>
          </div>
        </header>

        <div className="livella-card" ref={toolRef}>
          <div className="livella-mode" role="tablist" aria-label={`${T.modeText} / ${T.modeWrite}`}>
            <button role="tab" aria-selected={!writing} className={`livella-mode-btn ${!writing ? "active" : ""}`} onClick={() => { setMode("text"); setError(null); }}>{T.modeText}</button>
            <button role="tab" aria-selected={writing} className={`livella-mode-btn ${writing ? "active" : ""}`} onClick={() => { setMode("write"); setError(null); }}>{T.modeWrite}</button>
          </div>

          {writing && (
            <div className="livella-write">
              <label className="livella-label">{T.genreLabel}</label>
              <div className="livella-options-grid">
                {GENRES.map((g) => (
                  <button key={g.id}
                    className={`livella-option-btn ${genre === g.id ? "active" : ""}`}
                    onClick={() => setGenre(g.id)}>
                    <span className="livella-option-name">{g.label[UIL]}</span>
                    {g.sub[UIL] && <span className="livella-option-sub">{g.sub[UIL]}</span>}
                  </button>
                ))}
              </div>
              <div className="livella-link-row">
                <label className="livella-label" htmlFor="livella-topic">{T.topicLabel}</label>
                <textarea id="livella-topic" className="livella-link-input livella-topic-box" rows={2}
                  placeholder={T.topicPlaceholder} value={topic} onChange={(e) => setTopic(e.target.value)} />
                <span className="livella-link-hint">{T.writeHint}</span>
              </div>
            </div>
          )}

          {!writing && (<>
          <div className="livella-source-row">
            <label className="livella-upload-btn">
              <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,.txt,text/plain" onChange={onFileChosen} />
              <span className="livella-upload-icon" aria-hidden="true">⤒</span>
              {T.uploadBtn}
            </label>
            <span className="livella-upload-hint">{T.uploadHint}</span>
          </div>

          {imageUrl && (
            <div className="livella-image-chip">
              <img src={imageUrl} alt="" />
              <span className="livella-image-name">{imageFile.name}</span>
              <button className="livella-image-remove" onClick={clearImage} title={T.remove} aria-label={T.remove}>×</button>
            </div>
          )}

          <label className="livella-label">{T.inputLabel}</label>
          <textarea
            className="livella-textarea"
            placeholder={T.placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPaste={onPasteInput}
            onDrop={onDropInput}
            onDragOver={(e) => { if (e.dataTransfer && Array.prototype.indexOf.call(e.dataTransfer.types || [], "Files") >= 0) e.preventDefault(); }}
          />

          <div className="livella-link-row">
            <label className="livella-label" htmlFor="livella-source-url">{T.linkLabel}</label>
            <input id="livella-source-url" className="livella-link-input" type="url" inputMode="url"
              placeholder="https://…" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} />
            <span className="livella-link-hint">{T.linkHint}</span>
          </div>
          </>)}

          <div style={{ marginTop: 24 }}>
            <label className="livella-label">{T.purposeLabel}</label>
            <div className="livella-options-grid">
              {PURPOSES.map((p) => (
                <button key={p.id}
                  className={`livella-option-btn ${purpose === p.id ? "active" : ""}`}
                  onClick={() => setPurpose(p.id)}>
                  <span className="livella-option-name">{p.label[UIL]}</span>
                  {p.sub[UIL] && <span className="livella-option-sub">{p.sub[UIL]}</span>}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 22 }}>
            <label className="livella-label">{T.levelLabel}</label>
            <div className="livella-options-grid">
              {LEVELS.map((l) => (
                <button key={l.id}
                  className={`livella-option-btn ${level === l.id ? "active" : ""}`}
                  onClick={() => pickLevel(l.id)}>
                  <span className="livella-option-name">{l.label}</span>
                  <span className="livella-option-sub">{l.sub}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 22 }}>
            <label className="livella-label">{T.learnersLabel}</label>
            <div className="livella-options-grid">
              {AGE_BANDS.map((a) => (
                <button key={a.id} type="button"
                  className={`livella-option-btn ${ageBand === a.id ? "active" : ""}`}
                  onClick={() => setAgeBand(a.id)} aria-pressed={ageBand === a.id}>
                  <span className="livella-option-name">{a.label[UIL]}</span>
                  <span className="livella-option-sub">{a.sub[UIL]}</span>
                </button>
              ))}
            </div>
            <span className="livella-link-hint" style={{ display: "block", marginTop: 8 }}>{T.learnersHint}</span>
          </div>

          <div style={{ marginTop: 22 }}>
            <label className="livella-label">{T.profileLabel}</label>
            <div className="livella-options-grid profiles">
              <button className={`livella-option-btn ${profiles.length === 0 ? "active" : ""}`} onClick={() => setProfiles([])} aria-pressed={profiles.length === 0}>
                <span className="livella-option-name">{T.standard}</span>
                <span className="livella-option-sub">{T.standardSub}</span>
              </button>
              {PROFILES.map((p) => (
                <button key={p.id}
                  className={`livella-option-btn ${profiles.includes(p.id) ? "active" : ""}`}
                  onClick={() => toggleProfile(p.id)} aria-pressed={profiles.includes(p.id)}>
                  <span className="livella-option-name">{p.label[UIL]}</span>
                  <span className="livella-option-sub">{p.sub[UIL]}</span>
                </button>
              ))}
            </div>
            <span className="livella-link-hint" style={{ display: "block", marginTop: 8 }}>{T.profileHint}</span>
          </div>

          <button className="livella-primary-btn" onClick={() => generate()} disabled={loading || loadingScala}>
            {loading ? (writing ? T.writing : T.going) : (writing ? T.write : T.go)}
          </button>
          <button className="livella-scala-btn" onClick={generateScala} disabled={loading || loadingScala}>
            <span className="livella-scala-glyph" aria-hidden="true">
              <i></i><i></i><i></i><i></i><i></i>
            </span>
            {loadingScala ? T.scalaBuilding : T.scalaBtn}
          </button>

          {error && <div className="livella-error">{error}</div>}
        </div>

        {loading && (
          <div className="livella-card">
            <div className="livella-loading">Un momento</div>
          </div>
        )}

        {shareBusy === "load" && !result && (
          <div className="livella-card"><div className="livella-loading">{T.loadingShared}</div></div>
        )}

        {loadingScala && (
          <div className="livella-card">
            <div className="livella-loading">{T.scalaBuilding}</div>
          </div>
        )}

        {scala && !loadingScala && !loading && (
          <div className="livella-view" role="group" aria-label={`${T.pagesView} / ${T.scalaTitle}`}>
            <button type="button" aria-pressed={view === "pages"} onClick={() => setView("pages")}>{T.pagesView}</button>
            <button type="button" aria-pressed={view === "ladder"} onClick={() => { stopSpeaking(); setView("ladder"); }}>{T.scalaTitle}</button>
          </div>
        )}

        {!loadingScala && !loading && scala && view === "ladder" && (
          <div className={`livella-card livella-scala-card ${profileClass(scala)} ${ageClass(scala)}`}>
            <div className="livella-result-header">
              <div>
                <div className="livella-scala-eyebrow">{T.scalaTitle}</div>
                <h2 className="livella-result-title">{scala.title}</h2>
                <div className="livella-result-meta">{L.name}{genreMeta(scala)}{ageMeta(scala)} · {scala.rungs[0].paragraphs.length} {T.scalaCount} · {LEVELS[0].label} → {LEVELS[LEVELS.length - 1].label}</div>
              </div>
              <div className="livella-scala-all">
                <button className="livella-scala-mini" onClick={() => moveAll(-1)} title={T.allDown}>↓ {T.allDown}</button>
                <button className="livella-scala-mini" onClick={() => moveAll(1)} title={T.allUp}>↑ {T.allUp}</button>
                <button className="livella-scala-mini ghost" onClick={resetScala}>{T.scalaReset}</button>
              </div>
            </div>
            <p className="livella-section-subtitle">{T.scalaSub}</p>

            <div className="livella-scala-legend" aria-hidden="true">
              {LEVELS.map((l, i) => (
                <span key={l.id} className={`livella-rung-dot r${i}`}>{i + 1}</span>
              ))}
              <span className="livella-scala-legend-text">{LEVELS[0].sub} → {LEVELS[LEVELS.length - 1].sub}</span>
            </div>

            <div className="livella-scala">
              {scala.rungs[0].paragraphs.map((_, i) => {
                const ri = scalaIdx[i] ?? levelIndex(level);
                const lv = LEVELS[ri];
                const txt = scala.rungs[ri].paragraphs[i];
                return (
                  <div key={i} className={`livella-scala-para r${ri} ${bumped === i || bumped === "all" ? "bump" : ""}`}>
                    <div className="livella-scala-ctrl">
                      <button className="livella-scala-arrow" onClick={() => moveParagraph(i, -1)} disabled={ri === 0} aria-label={T.down} title={T.down}>↓</button>
                      <span className={`livella-rung-badge r${ri}`}>
                        <span className="livella-rung-num">{ri + 1}</span>
                        <span className="livella-rung-label">{lv.label}</span>
                        <span className="livella-rung-sub">{lv.sub}</span>
                      </span>
                      <button className="livella-scala-arrow" onClick={() => moveParagraph(i, 1)} disabled={ri === LEVELS.length - 1} aria-label={T.up} title={T.up}>↑</button>
                    </div>
                    <p className="livella-scala-text">{txt}</p>
                  </div>
                );
              })}
            </div>

            {scala.teacher_note && (
              <div className="livella-teacher-note">
                <span className="livella-teacher-note-label">{T.teacherNote}</span>
                {scala.teacher_note}
              </div>
            )}

            {scala && (
              <div className="livella-actions">
                <button className={`livella-action-btn copy ${copied ? "copied" : ""}`} onClick={copyToClipboard}>
                  {copied ? T.copied : T.copyAll}
                </button>
                <button className="livella-print-btn" onClick={() => downloadPdf(false)} disabled={pdfBusy}>
                  {pdfBusy ? T.pdfBuilding : T.pdfStudent}
                </button>
                <button className="livella-print-btn teacher" onClick={() => downloadPdf(true)} disabled={pdfBusy}>
                  {pdfBusy ? T.pdfBuilding : T.pdfTeacher}
                </button>
              </div>
            )}
          </div>
        )}

        {!loading && !result && view !== "ladder" && Object.keys(pages).length > 0 && shareBusy !== "load" && (
          <div className="livella-desk">
            {renderLevelTabs()}
            <div className="livella-card livella-desk-empty">
              <p>{selectedLevel.label} {T.notWritten}</p>
              <button type="button" className="livella-primary-btn" onClick={() => generate()} disabled={loadingScala}>{T.writeLevel}</button>
              {!scala && <span className="livella-link-hint">{T.writeHint}</span>}
            </div>
          </div>
        )}

        {!loading && result && view !== "ladder" && (
          <>
            <div className="livella-desk">
            {renderLevelTabs()}
            <div className={`livella-card ${profileClass(result)} ${ageClass(result)}`}>
              <div className="livella-print-header">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8pt" }}>
                  <span>{T.name}: ______________________________</span>
                  <span>{T.date}: ____________</span>
                </div>
                <div>{T.klass}: ______________________________</div>
              </div>
              <div className="livella-result-header">
                <div>
                  <h2 className="livella-result-title">{result.title}</h2>
                  <div className="livella-result-meta">
                    {selectedLevel.label} · {selectedLevel.sub} · {selectedPurpose.label[UIL]}{genreMeta(result)}{ageMeta(result)}
                    {sourceUrl.trim() && !result.genre && <> · {T.source}: <a className="livella-source-link" href={sourceUrl.trim()} target="_blank" rel="noopener noreferrer">{sourceUrl.trim()}</a></>}
                  </div>
                </div>
                {!result.genre && (
                  <button
                    className={`livella-toggle-btn ${showOriginal ? "active" : ""}`}
                    onClick={() => setShowOriginal(!showOriginal)}>
                    {showOriginal ? T.hideOriginal : T.showOriginal}
                  </button>
                )}
              </div>

              {result.fromScala && (
                <div className="livella-fromscala">
                  <span>{T.fromScala}</span>
                  <button type="button" className="livella-compare-mini-btn" onClick={() => generate()} disabled={loading || loadingScala}>{T.fullVersion}</button>
                </div>
              )}

              {showOriginal && (
                <div className="livella-comparison-grid two-col">
                  <div className="livella-comparison-col">
                    <div className="livella-comparison-col-title">{T.original}</div>
                    <div className="livella-comparison-col-text">{input}</div>
                  </div>
                  <div className="livella-comparison-col">
                    <div className="livella-comparison-col-title">{selectedLevel.label}</div>
                    <div className="livella-comparison-col-text">{result.passage}</div>
                  </div>
                </div>
              )}

              {canSpeak && !showOriginal && !comparison && (
                <div className="livella-listen">
                  <button type="button" className={`livella-listen-btn ${speaking ? "on" : ""}`} onClick={() => speak(`${result.title}. ${result.passage}`)} aria-pressed={speaking}>
                    <span aria-hidden="true">{speaking ? "■" : "▶"}</span> {speaking ? T.stopListen : T.listen}
                  </button>
                  <button type="button" className={`livella-compare-mini-btn ${slowVoice ? "active" : ""}`} aria-pressed={slowVoice} onClick={() => { stopSpeaking(); setSlowVoice(!slowVoice); }}>{T.slow}</button>
                  <button type="button" className={`livella-compare-mini-btn ${hideText ? "active" : ""}`} aria-pressed={hideText} onClick={() => setHideText(!hideText)}>{hideText ? T.showText : T.hideText}</button>
                  <span className="livella-link-hint">{T.listenNote}</span>
                </div>
              )}

              {!showOriginal && !comparison && hideText && canSpeak && (
                <div className="livella-hidden-note">{T.hiddenNote}</div>
              )}

              {!showOriginal && !comparison && !(hideText && canSpeak) && (
                <>
                  {renderBody(result)}
                  {renderTranslations(result.translations)}
                </>
              )}

              {comparison && !showOriginal && (
                <div className="livella-comparison-grid two-col">
                  <div className="livella-comparison-col">
                    <div className="livella-comparison-col-title">{selectedLevel.label} · {selectedLevel.sub}</div>
                    <div className="livella-comparison-col-text">{result.passage}</div>
                    {renderTranslations(result.translations, true)}
                  </div>
                  <div className={`livella-comparison-col ${profileClass(comparison)}`}>
                    <div className="livella-comparison-col-title">{cmpInfo ? cmpInfo.title : ""}</div>
                    {cmpInfo && cmpInfo.kind !== "level" && comparison.title && <div className="livella-comparison-col-head">{comparison.title}</div>}
                    {cmpInfo && cmpInfo.kind === "profile"
                      ? <div className="livella-comparison-col-body">{renderBody({ ...comparison, glosses: [] })}</div>
                      : <div className="livella-comparison-col-text">{comparison.passage}</div>}
                    {cmpInfo && cmpInfo.kind === "lang" && comparison.glosses && comparison.glosses.length > 0 && (
                      <div className="livella-comparison-col-gloss">{comparison.glosses.map((g, i) => <span key={i}><b>{g.word}</b> {g.translation}</span>)}</div>
                    )}
                    {comparison.translations && Object.keys(comparison.translations).filter((k) => comparison.translations[k]).map((k) => (
                      <div key={k} className="livella-translations compact">
                        <div className="livella-translation-row">
                          <span className="livella-translation-label">{SUPPORT_NAMES[k] || k}</span>
                          <div className="livella-translation-text">{comparison.translations[k]}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.glosses && result.glosses.length > 0 && !showOriginal && !comparison && !(hideText && canSpeak) && (
                <div className="livella-glosses-list">
                  <h4>{T.vocab}</h4>
                  {result.glosses.map((g, i) => (
                    <div key={i} className="livella-gloss-row">
                      <div className="livella-gloss-italian">{g.word}</div>
                      <div className="livella-gloss-english">
                        {g.translation}
                        {g.it && <span className="livella-gloss-it"> · {g.it}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(result.teacher_note || appliedList(result).length > 0) && (
                <div className="livella-teacher-note">
                  {result.teacher_note && <span className="livella-teacher-note-label">{T.teacherNote}</span>}
                  {result.teacher_note}
                  {appliedList(result).length > 0 && (
                    <ul className="livella-accommodations">
                      <li className="livella-accommodations-label">{T.accommodations}</li>
                      {appliedList(result).map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                  )}
                </div>
              )}

              <div className="livella-cmp">
                <div className="livella-cmp-head">
                  <span className="livella-label" style={{ margin: 0 }}>{T.cmpTitle}</span>
                  <div className="livella-cmp-tabs" role="tablist" aria-label={T.cmpTitle}>
                    {[["level", T.cmpLevel], ["profile", T.cmpProfile], ["lang", T.cmpLang]].map(([id, name]) => (
                      <button key={id} type="button" role="tab" aria-selected={cmpTab === id}
                        className={`livella-cmp-tab ${cmpTab === id ? "active" : ""}`} onClick={() => setCmpTab(id)}>{name}</button>
                    ))}
                  </div>
                </div>
                <div className="livella-compare-row">
                  {cmpTab === "level" && LEVELS.filter((l) => l.id !== level).map((l) => (
                    <button key={l.id} type="button"
                      className={`livella-compare-mini-btn ${cmpInfo && cmpInfo.kind === "level" && cmpInfo.key === l.id ? "active" : ""}`}
                      onClick={() => { setCmpBusy("v:" + l.id); generateComparison(l.id); }}
                      disabled={loadingComparison}>
                      {cmpBusy === "v:" + l.id ? "…" : l.label}
                    </button>
                  ))}
                  {cmpTab === "profile" && [{ id: "", label: null }].concat(PROFILES).filter((p) => {
                    const cur = (result.profiles || []);
                    return p.id === "" ? cur.length > 0 : !(cur.length === 1 && cur[0] === p.id);
                  }).map((p) => (
                    <button key={p.id || "std"} type="button"
                      className={`livella-compare-mini-btn ${cmpInfo && cmpInfo.kind === "profile" && cmpInfo.key === p.id ? "active" : ""}`}
                      onClick={() => compareProfile(p.id)} disabled={loadingComparison}>
                      {cmpBusy === "p:" + p.id ? "…" : (p.label ? p.label[UIL] : T.standard)}
                    </button>
                  ))}
                  {cmpTab === "lang" && LANGUAGE_ORDER.filter((id) => id !== lang).map((id) => (
                    <button key={id} type="button"
                      className={`livella-compare-mini-btn ${cmpInfo && cmpInfo.kind === "lang" && cmpInfo.key === id ? "active" : ""}`}
                      onClick={() => compareLanguage(id)} disabled={loadingComparison}>
                      {cmpBusy === "l:" + id ? "…" : <><span aria-hidden="true">{LANGUAGES[id].flag}</span> {LANGUAGES[id].name}</>}
                    </button>
                  ))}
                  {comparison && !loadingComparison && (
                    <button type="button" className="livella-compare-mini-btn" onClick={closeCompare}>{T.closeCompare}</button>
                  )}
                </div>
                <span className="livella-link-hint">{loadingComparison ? T.cmpWorking : T.cmpHint}</span>
              </div>

              <div className="livella-actions">
                <button className="livella-action-btn" onClick={() => generate("easier")} disabled={loading}>{T.easier}</button>
                <button className={`livella-action-btn copy ${copied ? "copied" : ""}`} onClick={copyToClipboard}>
                  {copied ? T.copied : T.copyAll}
                </button>
                <button className="livella-print-btn" onClick={() => downloadPdf(false)} disabled={pdfBusy}>
                  {pdfBusy ? T.pdfBuilding : T.pdfStudent}
                </button>
                <button className="livella-print-btn teacher" onClick={() => downloadPdf(true)} disabled={pdfBusy}>
                  {pdfBusy ? T.pdfBuilding : T.pdfTeacher}
                </button>
                <button className="livella-action-btn" onClick={() => generate("harder")} disabled={loading}>{T.harder}</button>
                {shareApi && (
                  <button type="button" className="livella-share-btn" onClick={startShare}>
                    <span aria-hidden="true">⇄</span> {shared ? T.shareTitle : T.shareBtn}
                  </button>
                )}
              </div>
            </div>
            </div>

            {shareApi && (shareOpen || shared) && (
              <div className="livella-card livella-share" ref={shareRef}>
                <h3 className="livella-section-title">{T.shareTitle}</h3>
                <div className="livella-share-name">
                  <label className="livella-label" htmlFor="livella-myname">{T.shareName}</label>
                  <input id="livella-myname" className="livella-link-input" type="text" autoComplete="name" value={myName}
                    onChange={(e) => rememberName(e.target.value)} placeholder={T.shareNamePh} />
                </div>

                {!shared && (
                  <>
                    <p className="livella-section-subtitle" style={{ marginTop: 14 }}>{T.shareHint}</p>
                    <button type="button" className="livella-primary-btn" style={{ marginTop: 14 }} onClick={createShare} disabled={shareBusy === "save"}>
                      {shareBusy === "save" ? T.saving : T.shareSave}
                    </button>
                  </>
                )}

                {shared && (
                  <>
                    <label className="livella-label" style={{ marginTop: 18 }} htmlFor="livella-sharelink">{T.shareLink}</label>
                    <div className="livella-share-row">
                      <input id="livella-sharelink" className="livella-link-input" type="text" readOnly value={shareUrl(shared.id)} onFocus={(e) => e.target.select()} />
                      <button type="button" className="livella-compare-mini-btn active" onClick={copyShareLink}>{linkCopied ? T.copiedLink : T.copyLink}</button>
                      <button type="button" className="livella-compare-mini-btn" onClick={() => openShared(shared.id, "refresh")} disabled={!!shareBusy}>{shareBusy === "refresh" ? "…" : T.refresh}</button>
                    </div>
                    <span className="livella-link-hint">{T.shareHint} {T.sharedBy.replace("{x}", shared.lesson.author || "—")}</span>

                    <label className="livella-label" style={{ marginTop: 22 }}>{T.versions}</label>
                    <div className="livella-comparison-grid two-col">
                      {sharedVersions.map((v) => {
                        const LG = LANGUAGES[v.langId];
                        const ed = editing && editing.key === v.key;
                        return (
                          <div key={v.key} className="livella-comparison-col livella-version">
                            <div className="livella-comparison-col-title"><span aria-hidden="true">{LG.flag}</span> {LG.name} · {v.level}</div>
                            {ed ? (
                              <>
                                <input className="livella-link-input" type="text" aria-label={`${LG.name}: title`} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                                <textarea className="livella-textarea livella-version-edit" aria-label={`${LG.name}: text`} value={editing.passage} onChange={(e) => setEditing({ ...editing, passage: e.target.value })} />
                                <div className="livella-compare-row">
                                  <button type="button" className="livella-compare-mini-btn active" onClick={saveEdit}>{T.save}</button>
                                  <button type="button" className="livella-compare-mini-btn" onClick={() => setEditing(null)}>{T.cancel}</button>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="livella-comparison-col-head">{v.title}</div>
                                <div className="livella-comparison-col-text">{v.passage}</div>
                                {v.glosses && v.glosses.length > 0 && (
                                  <div className="livella-comparison-col-gloss">{v.glosses.map((g, i) => <span key={i}><b>{g.word}</b> {g.translation}</span>)}</div>
                                )}
                                <div className="livella-version-foot">
                                  <span>{v.by ? T.editedBy.replace("{x}", v.by) : ""}</span>
                                  <button type="button" className="livella-compare-mini-btn" onClick={() => setEditing({ key: v.key, title: v.title, passage: v.passage })} disabled={!!shareBusy}>{T.edit}</button>
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="livella-compare-row">
                      {LANGUAGE_ORDER.filter((id) => id !== shared.lesson.lang && !(shared.lesson.versions || {})[id]).map((id) => (
                        <button key={id} type="button" className="livella-compare-mini-btn" onClick={() => addVersion(id)} disabled={!!shareBusy}>
                          {shareBusy === "add:" + id ? T.adding : <>+ <span aria-hidden="true">{LANGUAGES[id].flag}</span> {T.addLang.replace("{x}", LANGUAGES[id].name)}</>}
                        </button>
                      ))}
                      <button type="button" className="livella-compare-mini-btn" onClick={downloadSharedPdf} disabled={pdfBusy}>{pdfBusy ? T.pdfBuilding : T.pdfAll}</button>
                    </div>

                    <label className="livella-label" style={{ marginTop: 22 }} htmlFor="livella-note">{T.notes}</label>
                    {(shared.lesson.notes || []).length === 0 && <span className="livella-link-hint">{T.noNotes}</span>}
                    <ul className="livella-notes">
                      {(shared.lesson.notes || []).map((n, i) => (
                        <li key={i}><b>{n.name}</b> <span>{new Date(n.at).toLocaleString()}</span><p>{n.text}</p></li>
                      ))}
                    </ul>
                    <div className="livella-share-row">
                      <input id="livella-note" className="livella-link-input" type="text" value={noteText} placeholder={T.notePh}
                        onChange={(e) => setNoteText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addNote(); }} />
                      <button type="button" className="livella-compare-mini-btn active" onClick={addNote} disabled={!!shareBusy || !noteText.trim()}>{shareBusy === "note" ? "…" : T.addNote}</button>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="livella-card">
              <h3 className="livella-section-title">{T.buildTitle}</h3>
              <p className="livella-section-subtitle">{T.buildSub}</p>

              <div className="livella-builder-row">
                <div>
                  <label className="livella-label">{T.typeLabel}</label>
                  <div className="livella-options-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
                    {EXERCISE_TYPES.map((t) => (
                      <button key={t.id}
                        className={`livella-option-btn ${exerciseType === t.id ? "active" : ""}`}
                        onClick={() => setExerciseType(t.id)}>
                        <span className="livella-option-name">{t.label[UIL]}</span>
                        {t.sub[UIL] && <span className="livella-option-sub">{t.sub[UIL]}</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="livella-label">{T.countLabel}</label>
                  <div className="livella-count-row">
                    {COUNTS.map((n) => (
                      <button key={n}
                        className={`livella-count-btn ${exerciseCount === n ? "active" : ""}`}
                        onClick={() => setExerciseCount(n)}>{n}</button>
                    ))}
                  </div>
                  <label className="livella-label" style={{ marginTop: 18 }}>{T.diffLabel}</label>
                  <div className="livella-diff-row">
                    {DIFFICULTIES.map((d) => (
                      <button key={d.id}
                        className={`livella-diff-btn ${exerciseDifficulty === d.id ? "active" : ""}`}
                        onClick={() => setExerciseDifficulty(d.id)}
                        title={d.description}>{d.label[UIL]}</button>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-end" }}>
                  <button className="livella-builder-btn"
                    onClick={generateCustomExercise}
                    disabled={loadingCustom}>
                    {loadingCustom ? T.generating : T.genExercises}
                  </button>
                </div>
              </div>

              {customExercises.length > 0 && (
                <>
                  {customExercises.map((ex) => (
                    <div key={ex._timestamp} className="livella-exercise-set">
                      <div className="livella-exercise-set-header">
                        <div>
                          <div className="livella-exercise-set-title">{ex._typeLabel}</div>
                          <div className="livella-exercise-set-meta">
                            {ex._count} {T.questions} · {ex._difficultyLabel}
                          </div>
                        </div>
                        <button className="livella-exercise-set-remove"
                          onClick={() => removeCustomExercise(ex._timestamp)}
                          title={T.remove}>×</button>
                      </div>
                      {ex.items.map((item, i) => renderItem(item, i))}
                    </div>
                  ))}
                  <div className="livella-clear-all-row">
                    <button className="livella-clear-all-btn" onClick={clearAllCustom}>
                      Cancella tutti gli esercizi
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="livella-card">
              <h3 className="livella-section-title">{T.whatDoWeDo}</h3>
              <p className="livella-section-subtitle">{T.activitiesSub}</p>

              <div className="livella-activity-tabs">
                {ACTIVITY_TABS.map((t) => (
                  <button key={t.id}
                    className={`livella-tab-btn ${activeTab === t.id ? "active" : ""} ${loadingActivity === t.id ? "loading" : ""}`}
                    onClick={() => generateActivity(t.id)}
                    disabled={loadingActivity !== null}>
                    <span className="livella-tab-icon">{t.icon}</span>
                    <span className="livella-tab-name">{t.label[UIL]}</span>
                    <span className="livella-tab-sub">
                      {activities[t.id] ? T.ready : t.sub[UIL]}
                    </span>
                  </button>
                ))}
              </div>

              {activeTab && activities[activeTab] && (
                <div>
                  {activities[activeTab].items.map((item, i) => renderItem(item, i))}
                </div>
              )}

              {!activeTab && (
                <div className="livella-empty-state">
                  {T.emptyActivities}
                </div>
              )}
            </div>
          </>
        )}

        {hoveredGloss && (
          <div className="livella-tooltip">
            <strong>{hoveredGloss.word}</strong>{hoveredGloss.translation}
          </div>
        )}

        <div className="livella-footer">uno strumento, un lavoro · v0.16 · © 2026 Assunta Scotto. {T.rights}</div>
      </div>
    </div>
  );
}
