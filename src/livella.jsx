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
      { id: "it1", label: "Italiano 1", sub: "Novice Low–Mid", description: "present tense of essere/avere/chiamarsi/abitare + regular -are verbs, articles, numbers, concrete self/family/school topics", calibration: "Present tense only: essere, avere, chiamarsi, abitare, piacere (mi piace), regular -are verbs. Articles, numbers, days, colors. Sentences 5-8 words. Top 500 words. NO past tense, NO future, NO conditional, NO subjunctive, NO reflexives beyond chiamarsi. Topics: self, family, school, likes." },
      { id: "it2", label: "Italiano 2", sub: "Novice High", description: "high-frequency vocab, simple present tense, basic past forms", calibration: "Present tense + most common irregulars, very limited passato prossimo, sentences 6-10 words, top 1000 words, no subjunctive/conditional/future, concrete topics." },
      { id: "it3", label: "Italiano 3", sub: "Intermediate Low", description: "passato prossimo, imperfetto contrast, expanded thematic vocab", calibration: "Passato prossimo fluent, imperfetto introduced, future introduced, sentences 8-14 words, top 2000 words, reflexives, conditional only in fixed expressions." },
      { id: "it4", label: "Italiano 4", sub: "Intermediate Mid", description: "subjunctive intro, conditional, complex sentence structures", calibration: "All indicative tenses fluent, present subjunctive introduced, conditional fluent, sentences 10-18 words, subordinate clauses, abstract concepts." },
      { id: "itap", label: "AP Italiano", sub: "Intermediate High → Advanced Low", description: "full register range, idiomatic usage, cultural depth, AP themes", calibration: "Full tense/mood range, idiomatic expressions, register variation, AP Italian Language and Culture themes, sophisticated discourse markers." },
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
      { id: "fr1", label: "Français 1", sub: "Novice Low–Mid", description: "present tense of être/avoir/aller/faire + regular -er verbs, articles, numbers, concrete self/family/school topics", calibration: "Present tense only: être, avoir, aller, faire, s'appeler, habiter, aimer, regular -er verbs. Articles (le/la/les/un/une/des), numbers, days, colors. Sentences 5-8 words. Top 500 words. NO passé composé, NO futur, NO conditionnel, NO subjonctif. Topics: self, family, school, likes." },
      { id: "fr2", label: "Français 2", sub: "Novice High", description: "present + common irregulars, passé composé with avoir introduced, futur proche", calibration: "Present tense + common irregulars (vouloir, pouvoir, prendre), passé composé with avoir introduced (regular participles), futur proche (aller + infinitive). Sentences 6-10 words. Top 1000 words. NO imparfait, NO futur simple, NO conditionnel, NO subjonctif." },
      { id: "fr3", label: "Français 3", sub: "Intermediate Low", description: "passé composé (avoir and être), imparfait contrast, futur simple, reflexives", calibration: "Passé composé fluent (avoir AND être, agreement), imparfait introduced with contrast, futur simple introduced, reflexive verbs, sentences 8-14 words, top 2000 words, conditionnel only in fixed expressions (je voudrais)." },
      { id: "fr4", label: "Français 4", sub: "Intermediate Mid", description: "all indicative tenses, present subjunctive intro, conditional, complex sentences", calibration: "All indicative tenses fluent (incl. plus-que-parfait), subjonctif présent introduced after common triggers (il faut que, je veux que), conditionnel fluent, sentences 10-18 words, subordinate clauses, abstract concepts." },
      { id: "frap", label: "AP Français", sub: "Intermediate High → Advanced Low", description: "full register range, idiomatic usage, cultural depth, AP themes", calibration: "Full tense/mood range, idiomatic expressions, tu/vous register variation, AP French Language and Culture themes, sophisticated discourse markers." },
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
      { id: "es1", label: "Español 1", sub: "Novice Low–Mid", description: "present tense of ser/estar/tener/ir + regular -ar/-er/-ir verbs, gustar basics, articles, numbers, concrete topics", calibration: "Present tense only: ser, estar, tener, ir, llamarse, vivir, gustar (me gusta), regular -ar/-er/-ir verbs. Articles, numbers, days, colors. Sentences 5-8 words. Top 500 words. NO pretérito, NO futuro, NO condicional, NO subjuntivo. Topics: self, family, school, likes." },
      { id: "es2", label: "Español 2", sub: "Novice High", description: "present + stem-changers, preterite introduced, ir a + infinitive", calibration: "Present tense + stem-changing verbs, pretérito introduced (regular + ser/ir/hacer), ir a + infinitive for future. Sentences 6-10 words. Top 1000 words. NO imperfecto, NO futuro simple, NO condicional, NO subjuntivo." },
      { id: "es3", label: "Español 3", sub: "Intermediate Low", description: "preterite fluent, imperfect contrast, future introduced, reflexives", calibration: "Pretérito fluent (incl. common irregulars), imperfecto introduced with contrast, futuro simple introduced, reflexive verbs, sentences 8-14 words, top 2000 words, condicional only in fixed expressions (me gustaría)." },
      { id: "es4", label: "Español 4", sub: "Intermediate Mid", description: "all indicative tenses, present subjunctive intro, conditional, complex sentences", calibration: "All indicative tenses fluent (incl. pluscuamperfecto), presente de subjuntivo introduced after common triggers (quiero que, es importante que), condicional fluent, sentences 10-18 words, subordinate clauses, abstract concepts." },
      { id: "esap", label: "AP Español", sub: "Intermediate High → Advanced Low", description: "full register range, idiomatic usage, cultural depth, AP themes", calibration: "Full tense/mood range, idiomatic expressions, tú/usted register variation, AP Spanish Language and Culture themes, sophisticated discourse markers." },
    ],
  },
  esl: {
    id: "esl",
    ui: "en",
    support: [],
    flag: "🌐",
    name: "ESL",
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
    uploadBtn: "Carica immagine o file .txt", uploadHint: "Foto di una pagina, un menù, un cartello: Claude legge il testo nell'immagine.",
    linkLabel: "Link della fonte", linkHint: "Solo per la citazione sul foglio — la pagina non apre i link. Incolla il testo qui sopra.",
    source: "Fonte", errImages: "Le immagini non sono disponibili in questa vista. Incolla il testo.", errFile: "Non riesco a leggere questo file. Usa un'immagine (JPG/PNG) o un file .txt.",
    scalaBtn: "La Scala — tutti e cinque i livelli", scalaBuilding: "Costruisco la scala...", scalaTitle: "La Scala",
    scalaSub: "Lo stesso testo a cinque livelli, paragrafo per paragrafo. Tocca ↑ o ↓ su un paragrafo per salire o scendere di un livello.",
    up: "Sali", down: "Scendi", allUp: "Tutti su", allDown: "Tutti giù", rung: "gradino", scalaReset: "Torna al mio livello",
    errScala: "Non riesco a costruire la scala.", scalaCount: "paragrafi",
    pdfStudent: "PDF studente", pdfTeacher: "PDF insegnante", pdfBuilding: "Creo il PDF...", teacherGuide: "Guida per l'insegnante", studentSheet: "Scheda dello studente",
    errPdf: "Non riesco a scaricare il PDF in questa vista.", pdfDeclined: "Download annullato.",
    heroHead: "Il livello giusto per ogni studente.", heroSub: "Incolla un testo, o scrivi solo un tema. Livella ti restituisce la stessa pagina a ogni livello della tua classe, con i supporti per chi ne ha bisogno.", heroCta: "Livella un testo", heroMicro: "Cinque livelli · quattro lingue · profili di lettura",
    modeText: "Da un testo", modeWrite: "Scrivi da zero", genreLabel: "Genere", topicLabel: "Tema",
    topicPlaceholder: "Es. una gita a Napoli con la classe · la mia famiglia · il mercato del sabato", writeHint: "Livella scrive un testo originale al livello scelto. Il tema può essere in inglese.",
    errTopic: "Scrivi un tema.", write: "Scrivi", writing: "Sto scrivendo...",
    profileLabel: "Profilo", profileHint: "Il livello non cambia. Scegli uno o più profili.", standard: "Standard", standardSub: "nessun adattamento",
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
    uploadBtn: "Importer une image ou un fichier .txt", uploadHint: "Photo d'une page, d'un menu, d'un panneau : Claude lit le texte de l'image.",
    linkLabel: "Lien de la source", linkHint: "Pour la citation sur la feuille seulement — la page n'ouvre pas les liens. Collez le texte ci-dessus.",
    source: "Source", errImages: "Les images ne sont pas disponibles dans cette vue. Collez le texte.", errFile: "Impossible de lire ce fichier. Utilisez une image (JPG/PNG) ou un fichier .txt.",
    scalaBtn: "La Scala — les cinq niveaux", scalaBuilding: "Je construis l'échelle...", scalaTitle: "La Scala",
    scalaSub: "Le même texte à cinq niveaux, paragraphe par paragraphe. Touchez ↑ ou ↓ sur un paragraphe pour monter ou descendre d'un niveau.",
    up: "Monter", down: "Descendre", allUp: "Tout monter", allDown: "Tout descendre", rung: "échelon", scalaReset: "Revenir à mon niveau",
    errScala: "Impossible de construire l'échelle.", scalaCount: "paragraphes",
    pdfStudent: "PDF élève", pdfTeacher: "PDF enseignant·e", pdfBuilding: "Création du PDF...", teacherGuide: "Guide de l'enseignant·e", studentSheet: "Fiche de l'élève",
    errPdf: "Impossible de télécharger le PDF dans cette vue.", pdfDeclined: "Téléchargement annulé.",
    heroHead: "Le bon niveau pour chaque élève.", heroSub: "Collez un texte, ou indiquez seulement un sujet. Livella vous rend la même page à chaque niveau de votre classe, avec des aides pour les lecteurs qui en ont besoin.", heroCta: "Niveler un texte", heroMicro: "Cinq niveaux · quatre langues · profils de lecture",
    modeText: "À partir d'un texte", modeWrite: "Écrire de zéro", genreLabel: "Genre", topicLabel: "Sujet",
    topicPlaceholder: "Ex. une sortie à Lyon avec la classe · ma famille · le marché du samedi", writeHint: "Livella écrit un texte original au niveau choisi. Le sujet peut être en anglais.",
    errTopic: "Indiquez un sujet.", write: "Écrire", writing: "J'écris...",
    profileLabel: "Profil", profileHint: "Le niveau ne change pas. Choisissez un ou plusieurs profils.", standard: "Standard", standardSub: "aucune adaptation",
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
    uploadBtn: "Upload an image or .txt file", uploadHint: "Photo of a page, a menu, a sign: Claude reads the text in the image.",
    linkLabel: "Source link", linkHint: "Citation on the handout only — the page can't open links. Paste the text above.",
    source: "Source", errImages: "Images aren't available in this view. Paste the text instead.", errFile: "Can't read that file. Use an image (JPG/PNG) or a .txt file.",
    scalaBtn: "La Scala — all five levels", scalaBuilding: "Building the ladder...", scalaTitle: "La Scala",
    scalaSub: "The same text at five levels, paragraph by paragraph. Tap ↑ or ↓ on a paragraph to move it one level up or down.",
    up: "Up", down: "Down", allUp: "All up", allDown: "All down", rung: "rung", scalaReset: "Back to my level",
    errScala: "Couldn't build the ladder.", scalaCount: "paragraphs",
    pdfStudent: "Student PDF", pdfTeacher: "Teacher PDF", pdfBuilding: "Building the PDF...", teacherGuide: "Teacher guide", studentSheet: "Student sheet",
    errPdf: "Can't download the PDF in this view.", pdfDeclined: "Download cancelled.",
    heroHead: "The right level for every student.", heroSub: "Paste a text, or just a topic. Livella hands back the same page at every level in your room, with supports for the readers who need them.", heroCta: "Level a text now", heroMicro: "Five levels · four languages · reader profiles",
    modeText: "From a text", modeWrite: "Write from scratch", genreLabel: "Genre", topicLabel: "Topic",
    topicPlaceholder: "e.g. a class trip · my family · the Saturday market", writeHint: "Livella writes an original text at the chosen level. The topic can be in English.",
    errTopic: "Enter a topic.", write: "Write", writing: "Writing...",
    profileLabel: "Profile", profileHint: "The level never changes. Pick one or more profiles.", standard: "Standard", standardSub: "no adaptations",
    wordBank: "Word bank", microTask: "Micro-task", of: "of", accommodations: "Accommodations applied", pdfFontNote: "The Lexend font isn't available in the PDF; spacing and line length still follow the rules.",
  },
};


const PURPOSES = [
  { id: "warmup", label: { it: "Riscaldamento", fr: "Échauffement", en: "Warm-up" }, sub: { it: "Warm-up", fr: "Warm-up", en: "60–100 words" }, promptName: "Riscaldamento", promptSub: "Warm-up", description: "short passage (60-100 words), simple comprehension, activates background knowledge" },
  { id: "main", label: { it: "Lezione principale", fr: "Leçon principale", en: "Main lesson" }, sub: { it: "Main lesson", fr: "Main lesson", en: "140–200 words" }, promptName: "Lezione principale", promptSub: "Main lesson", description: "full passage (140-200 words), full activity suite, balances skills" },
  { id: "homework", label: { it: "Compito a casa", fr: "Devoir à la maison", en: "Homework" }, sub: { it: "Homework", fr: "Homework", en: "180–250 words" }, promptName: "Compito a casa", promptSub: "Homework", description: "longer passage (180-250 words), independent work, clearer scaffolding in questions" },
  { id: "assessment", label: { it: "Verifica", fr: "Évaluation", en: "Assessment" }, sub: { it: "Assessment", fr: "Assessment", en: "includes inference" }, promptName: "Verifica", promptSub: "Assessment", description: "full passage (140-200 words), sharper questions, no hints, includes inference" },
];

const EXERCISE_TYPES = [
  { id: "multiple_choice", label: { it: "Scelta multipla", fr: "Choix multiple", en: "Multiple choice" }, sub: { it: "Multiple choice", fr: "Multiple choice", en: "" } },
  { id: "true_false", label: { it: "Vero o falso", fr: "Vrai ou faux", en: "True / False" }, sub: { it: "True / False", fr: "True / False", en: "" } },
  { id: "short_answer", label: { it: "Risposta breve", fr: "Réponse courte", en: "Short answer" }, sub: { it: "Short answer", fr: "Short answer", en: "" } },
  { id: "fill_blank", label: { it: "Riempi gli spazi", fr: "Texte à trous", en: "Fill in the blank" }, sub: { it: "Fill in the blank", fr: "Fill in the blank", en: "" } },
];

const COUNTS = [3, 5, 8, 10];

const DIFFICULTIES = [
  { id: "easier", label: { it: "Più facile", fr: "Plus facile", en: "Easier" }, sub: { it: "Easier", fr: "Easier", en: "literal recall" }, description: "literal recall, direct retrieval from text" },
  { id: "standard", label: { it: "Standard", fr: "Standard", en: "Standard" }, sub: { it: "At-level", fr: "At-level", en: "at level" }, description: "matches the reading's complexity" },
  { id: "harder", label: { it: "Più difficile", fr: "Plus difficile", en: "Harder" }, sub: { it: "Harder", fr: "Harder", en: "inference" }, description: "inference, analysis, between-the-lines thinking" },
];

// ===== SCRIVI (generation mode): genres Livella can write from scratch =====
// Conventions are written for the model in English and apply to every language;
// examples are described, not quoted, so no language's phrasing leaks into another's prompt.
const GENRES = [
  { id: "postcard", label: { it: "Cartolina", fr: "Carte postale", en: "Postcard" }, sub: { it: "Postcard", fr: "Postcard", en: "50–90 words" }, promptName: "Postcard",
    conventions: "A postcard: a greeting line, 3-6 sentences about where the writer is and what they are doing, a closing and a signature. 50-90 words at the middle rung; the genre's length wins over the purpose length. Informal register. Lowest rung: fixed, high-frequency chunks (greeting, 'I am in...', weather, one food, one activity). Highest rung: vivid detail, varied connectors, a touch of humour." },
  { id: "letter", label: { it: "Lettera / Email", fr: "Lettre / Courriel", en: "Letter / Email" }, sub: { it: "Letter / Email", fr: "Letter / Email", en: "formal or informal" }, promptName: "Letter or email",
    conventions: "A letter or email with an opening, body and closing. The register (formal or informal) must fit the addressee named in the topic; if none is named, write to a friend. Lower rungs: informal and short. Highest rung: may be formal (a request, a complaint, an application) using the language's real conventions of formal correspondence." },
  { id: "story", label: { it: "Racconto", fr: "Récit", en: "Story" }, sub: { it: "Short story", fr: "Short story", en: "narrative" }, promptName: "Short story",
    conventions: "A short narrative with a beginning, a complication and an ending. Named characters and a concrete setting in the target culture. Where the rung's calibration forbids past tenses, narrate in the present. Higher rungs: past narration and dialogue as the calibration allows." },
  { id: "dialogue", label: { it: "Dialogo", fr: "Dialogue", en: "Dialogue" }, sub: { it: "Dialogue", fr: "Dialogue", en: "two speakers" }, promptName: "Dialogue",
    conventions: "A conversation between two named speakers. Each turn on its own line, prefixed with the speaker's name and a colon. 8-16 turns at the middle rung. Natural spoken language with the fillers and reactions typical of the culture. Performable by two students. Separate turns with newline characters inside the JSON string." },
  { id: "essay", label: { it: "Saggio", fr: "Essai", en: "Essay" }, sub: { it: "Essay", fr: "Essay", en: "opinion / argument" }, promptName: "Essay",
    conventions: "An opinion or argumentative text with a thesis, reasons and a conclusion. At the two lowest rungs the 'essay' is one short opinion paragraph of 4-7 simple sentences ('I like X because...', 'In my opinion...' in the target language). Middle rung: three short paragraphs. Highest rungs: full structure with connectors of argument and, where the calibration allows, the moods the language uses after opinion verbs." },
  { id: "rhyme", label: { it: "Filastrocca", fr: "Comptine", en: "Rhyme" }, sub: { it: "Rhyme / chant", fr: "Rhyme / chant", en: "8–12 lines" }, promptName: "Rhyme or chant",
    conventions: "A short rhyming chant of 8-12 lines with a regular rhythm, built on repetition so a class can recite it. Lower rungs: every line is a complete simple sentence. Higher rungs: internal rhyme, richer vocabulary, a playful twist in the last couplet. One line per newline; stanzas separated by a blank line, inside the JSON string." },
  { id: "song", label: { it: "Canzone", fr: "Chanson", en: "Song" }, sub: { it: "Song lyrics", fr: "Song lyrics", en: "verses + refrain" }, promptName: "Song lyrics",
    conventions: "Original song lyrics: two or three verses and a repeated refrain, each section labelled in the target language (Verse 1 / Refrain equivalents). Rhyme and a singable, regular line length. This is a DRAFT the class will improve and perform, so keep the structure plain and the refrain very memorable. Never reproduce, adapt or imitate an existing song. One line per newline; sections separated by a blank line, inside the JSON string." },
  { id: "description", label: { it: "Descrizione", fr: "Description", en: "Description" }, sub: { it: "Description", fr: "Description", en: "person · place · object" }, promptName: "Description",
    conventions: "A descriptive text about a person, place, object or scene from the topic, organised spatially or by category. Lower rungs: simple sentences, one adjective each. Higher rungs: comparisons, sensory detail, figurative language where the calibration allows." },
];

// ===== LEARNER PROFILES =====
// Each profile adds rules ON TOP of the level the teacher chose. The level never changes.
// writing → passage/ladder prompts · tasks → activity/exercise prompts · the id → CSS class p-<id>.
// Sources: BDA Dyslexia Friendly Style Guide (dyslexia); CAST UDL guidelines (ADHD);
// autism-informed literal-language practice (neuro). "support" is the bundle of common
// IEP/504 reading accommodations and is labelled reading support, never "IEP-compliant".
const PROFILES = [
  { id: "dyslexia", label: { it: "Dislessia", fr: "Dyslexie", en: "Dyslexia" }, sub: { it: "frasi brevi · Lexend", fr: "phrases courtes · Lexend", en: "short sentences · Lexend" },
    writing: "DYSLEXIA (BDA Dyslexia Friendly Style Guide): sentences of 8-12 words, one idea each; paragraphs of 2-3 sentences separated by a blank line; high-frequency words; no idioms or figurative language; never three polysyllabic words in a row; the glossed words are the hardest words in the text and appear in it exactly as glossed.",
    tasks: "DYSLEXIA: multiple choice over open answer; every open item carries an answer stem; nothing timed; instructions in one short sentence." },
  { id: "adhd", label: { it: "ADHD", fr: "TDAH", en: "ADHD" }, sub: { it: "4 blocchi + mini-compiti", fr: "4 blocs + mini-tâches", en: "4 chunks + micro-tasks" },
    writing: "ADHD (CAST UDL, minimise distraction / mastery feedback): the text is EXACTLY 4 chunks separated by a blank line; each chunk is 2-3 sentences and a complete thought on its own; the whole text finishable in under 8 minutes. ALSO return \"micro_tasks\": an array of exactly 4 strings, one per chunk, in the target language at the level, each doable in under 30 seconds (true/false, circle a word, say one sentence to a partner).",
    tasks: "ADHD: build in choice ('pick 2 of these 3'); 3 comprehension items instead of 5; one movement option in production (stand up and ask three classmates)." },
  { id: "neuro", label: { it: "Neurodivergente", fr: "Neurodivergent·e", en: "Neurodivergent" }, sub: { it: "linguaggio letterale", fr: "langage littéral", en: "literal language" },
    writing: "NEURODIVERGENT (autism-informed): fully literal language — no idioms, sarcasm, irony, metaphor or rhetorical questions; say exactly what is meant; predictable structure with explicit signposting (first, then, finally); the same name for the same person or thing every time, never a synonym; concrete, specific details; no sudden tone shifts or surprises; a clear final sentence that closes the text.",
    tasks: "NEURODIVERGENT: explicit, literal instructions; one question type at a time; no 'how would you feel' without answer choices; no trick options or double negatives; give a worked example before the first item." },
  { id: "support", label: { it: "Supporto alla lettura", fr: "Soutien à la lecture", en: "Reading support" }, sub: { it: "IEP / 504", fr: "PEI / 504", en: "IEP / 504" },
    writing: "READING SUPPORT (common IEP/504 reading accommodations; label it reading support, never 'IEP-compliant'): text 40% shorter than the purpose length; one paragraph = one event, paragraphs separated by a blank line; explicit sequence words (first, then, finally in the target language). ALSO return \"word_bank\": the 5 glosses plus 5 more useful words from the text (10 total) as [{\"word\",\"translation\"}].",
    tasks: "READING SUPPORT: a sentence frame for every production item; every question carries an answer stem; matching over fill-in-the-blank; reduced set: 3 comprehension, 2 vocabulary." },
];
const PROFILE_STACK = "Profiles stack: where two rules conflict, the stricter one wins (shorter, simpler, more explicit). The LEVEL never changes — a profile changes how the level is written, shown and practised, not what the level is.";

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

LEARNER PROFILES: If the request contains LEARNER PROFILE RULES, obey them exactly. They never change the level. Report what you applied in "accommodations".

${translationRule(L)}

OUTPUT FORMAT (respond with ONLY a JSON object, no other text, no markdown fences):
{
  "title": "${L.langEn} title (3-6 words)",
  "passage": "${write ? `The full original ${L.langEn} text. Keep line breaks as \\n inside the string where the genre needs them.` : `The full re-leveled ${L.langEn} text.`}",
  "glosses": [{"word": "${L.langEn} word from the passage", "translation": "${L.glossRule}"${L.support.includes("it") ? ', "it": "Italian gloss"' : ""}}],
  "teacher_note": "1-2 sentence note in English about what you targeted.",
  "accommodations": ["short English list of the profile rules you applied — empty array when no profile"],
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
LEARNER PROFILES: If the request contains LEARNER PROFILE RULES, they apply at EVERY rung and never change a rung's calibration. If an ADHD rule is present, P = 4. Do not return micro_tasks or word_bank for the ladder.

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
- If the request contains LEARNER PROFILE TASK RULES, obey them exactly (they override the counts below)
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
- If the request contains LEARNER PROFILE TASK RULES, obey them exactly
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
  const [lang, setLang] = useState("it");
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("text");       // "text" = re-level a source · "write" = original text from a topic
  const [genre, setGenre] = useState("postcard");
  const [topic, setTopic] = useState("");
  const [profiles, setProfiles] = useState([]);   // ids from PROFILES; [] = Standard
  // Front-page fan: which level is in front, Standard or ADHD view, opened yet, still auto-advancing.
  const [heroIdx, setHeroIdx] = useState(1);
  const [heroAdhd, setHeroAdhd] = useState(false);
  const [heroOpen, setHeroOpen] = useState(false);
  const [heroAuto, setHeroAuto] = useState(true);
  const toolRef = useRef(null);
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
  const [loadingScala, setLoadingScala] = useState(false);
  const [bumped, setBumped] = useState(null);      // paragraph index that just moved (for the flash)
  const [level, setLevel] = useState("it2");
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
  const T = UI[L.ui];
  const LEVELS = L.levels;
  const selectedLevel = LEVELS.find((l) => l.id === level) || LEVELS[0];
  const selectedPurpose = PURPOSES.find((p) => p.id === purpose);
  const selectedGenre = GENRES.find((g) => g.id === genre) || GENRES[0];
  const writing = mode === "write";
  function toggleProfile(id) {
    setProfiles((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }
  const profileClass = (obj) => ((obj && obj.profiles) || []).map((id) => "p-" + id).join(" ");
  function profileMeta(obj) {
    const ids = (obj && obj.profiles) || [];
    const names = PROFILES.filter((p) => ids.includes(p.id)).map((p) => p.label[L.ui]);
    return names.length ? ` · ${names.join(" + ")}` : "";
  }
  const hasP = (obj, id) => !!(obj && obj.profiles && obj.profiles.includes(id));

  // Switching language swaps the whole ladder, so anything generated for the old
  // language is cleared rather than left on screen mislabeled.
  function switchLanguage(nextId) {
    if (nextId === lang) return;
    const next = LANGUAGES[nextId];
    setLang(nextId);
    setLevel(next.levels[1] ? next.levels[1].id : next.levels[0].id);
    setResult(null); setComparison(null); setComparisonLevel(null);
    setActivities({}); setActiveTab(null); setCustomExercises([]);
    setScala(null); setScalaIdx([]);
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
    return subject + profileWritingBlock(profiles);
  }
  function attachment() { return writing ? null : imageFile; }
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
    setComparison(null); setComparisonLevel(null); setShowOriginal(false);
    setCustomExercises([]);
    try {
      const parsed = await callClaude(buildPassagePrompt(L, mode), buildPassageMessage(modifier), attachment());
      setResult({ ...parsed, genre: writing ? selectedGenre.id : null, profiles: profiles.slice() });
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
    } catch (err) {
      console.error(err);
      setError(describeError(err, T.errCompare));
    } finally { setLoadingComparison(false); }
  }

  function levelIndex(id) { const i = LEVELS.findIndex((l) => l.id === id); return i < 0 ? 1 : i; }

  async function generateScala() {
    if (!hasSubject()) return;
    setLoadingScala(true); setError(null);
    try {
      const msg = `PURPOSE: ${selectedPurpose.promptName} (${selectedPurpose.promptSub})\nPURPOSE NOTES: ${selectedPurpose.description}\nTEACHER'S CLASS LEVEL (the middle reference): ${selectedLevel.label} (${selectedLevel.sub})${subjectBlock()}`;
      const parsed = await callClaude(buildScalaPrompt(L, mode), msg, attachment());
      // Normalize: rungs in ladder order, equal paragraph counts (truncate to the shortest).
      const byId = {}; (parsed.rungs || []).forEach((r) => { byId[r.id] = r; });
      const rungs = LEVELS.map((l) => byId[l.id] || { id: l.id, paragraphs: [] });
      const P = Math.max(1, Math.min(...rungs.map((r) => (r.paragraphs || []).length)));
      if (!isFinite(P) || rungs.some((r) => !r.paragraphs || r.paragraphs.length === 0)) throw { code: "invalid_json", message: "rungs incomplete" };
      rungs.forEach((r) => { r.paragraphs = r.paragraphs.slice(0, P); });
      setScala({ title: parsed.title, rungs, teacher_note: parsed.teacher_note, genre: writing ? selectedGenre.id : null, profiles: profiles.slice() });
      setScalaIdx(Array.from({ length: P }, () => levelIndex(level)));
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
      const userMessage = `LEVEL: ${selectedLevel.label} (${selectedLevel.sub})\nPURPOSE: ${selectedPurpose.promptName} (${selectedPurpose.promptSub})\nACTIVITY_TYPE: ${type}${profileTaskBlock(result.profiles || [])}\n\nPASSAGE:\n${result.passage}`;
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

Generate exactly ${exerciseCount} ${exerciseType} items at ${exerciseDifficulty} difficulty.${profileTaskBlock(result.profiles || [])}`;
      const parsed = await callClaude(buildCustomPrompt(L), userMessage);
      parsed._typeLabel = typeObj.label[L.ui];
      parsed._difficultyLabel = diffObj.label[L.ui];
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
    const meta = `${selectedLevel.label} · ${selectedLevel.sub} · ${selectedPurpose.label[L.ui]}` + genreMeta(result) + profileMeta(result) + (sourceUrl.trim() && !(result && result.genre) ? ` · ${T.source}: ${sourceUrl.trim()}` : "");
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
    if (teacher && result.accommodations && result.accommodations.length) {
      gap(6); text(T.accommodations.toUpperCase(), 8, "bold", teal, 1.3);
      result.accommodations.forEach((a) => text(`• ${a}`, 9, "normal", muted, 1.45, 8));
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
      gap(14); rule(); text(t.label[L.ui].toUpperCase(), 10, "bold", copper, 1.3);
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
    return g ? ` · ${g.label[L.ui]}` : "";
  }

  // The passage body under a profile: word bank first (reading support), then either
  // numbered paragraphs (reading support), ADHD chunks with micro-tasks, or the plain text.
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
    { id: "comprensione", label: { it: "Comprensione", fr: "Compréhension", en: "Comprehension" }, sub: { it: "Comprehension", fr: "Comprehension", en: "questions" }, icon: "?" },
    { id: "vocabolario", label: { it: "Vocabolario", fr: "Vocabulaire", en: "Vocabulary" }, sub: { it: "Vocabulary", fr: "Vocabulary", en: "words" }, icon: "Aa" },
    { id: "produzione", label: { it: "Produzione", fr: "Production", en: "Production" }, sub: { it: "Output", fr: "Output", en: "speak & write" }, icon: "✎" },
    { id: "cultura", label: { it: "Cultura", fr: "Culture", en: "Culture" }, sub: { it: "Culture", fr: "Culture", en: "compare" }, icon: "★" },
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
        .livella-hero-head { font-family: 'Cormorant Garamond', serif; font-weight: 600; font-size: clamp(36px, 5.6vw, 56px); line-height: 1.03; letter-spacing: -0.015em; margin: 0 0 18px; text-wrap: balance; color: var(--cream); }
        .livella-hero-rule { width: 60px; height: 2px; background: var(--copper); border: 0; margin: 0 0 18px; }
        .livella-hero-sub { font-size: 16px; line-height: 1.6; color: rgba(214, 241, 239, 0.82); max-width: 40ch; margin: 0 0 24px; }
        .livella-hero-cta { background: var(--cream); color: #8a5028; border: 0; border-radius: 6px; padding: 13px 24px; font: 600 15px 'Inter', sans-serif; cursor: pointer; transition: background 0.2s, color 0.2s; }
        .livella-hero-cta:hover, .livella-hero-cta:focus-visible { background: var(--copper); color: var(--cream); outline: 2px solid var(--cream); outline-offset: 3px; }
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
                onClick={() => switchLanguage(id)}
                aria-pressed={lang === id}>
                <span className="livella-lang-flag" aria-hidden="true">{lg.flag}</span>
                <span className="livella-lang-name">{lg.name}</span>
              </button>
            );
          })}
        </nav>

        <header className="livella-hero">
          <h1 className="livella-logo">Livel<span>la</span></h1>
          <div className="livella-hero-copy">
            <p className="livella-tagline">il testo giusto, al livello giusto</p>
            <h2 className="livella-hero-head">{T.heroHead}</h2>
            <hr className="livella-hero-rule" />
            <p className="livella-hero-sub">{T.heroSub}</p>
            <button type="button" className="livella-hero-cta" onClick={scrollToTool}>{T.heroCta}</button>
            <span className="livella-hero-micro">{T.heroMicro}</span>
          </div>
          <div className="livella-fanwrap">
            <div className={`livella-fan ${heroOpen ? "open" : ""}`}>
              <div className="livella-fan-tabs" role="tablist" aria-label={T.levelLabel}>
                {LEVELS.map((l, i) => (
                  <button key={l.id} type="button" role="tab" aria-selected={heroIdx === i} aria-label={l.label}
                    className="livella-fan-tab" onClick={() => pickHero(i)}>
                    {/^AP/.test(l.label) ? "AP" : i + 1}
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
                        <p className="livella-sheet-lvl">{l.label} · {l.sub}{heroAdhd ? " · " + PROFILES[1].label[L.ui] : ""}</p>
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
              <button type="button" aria-pressed={heroAdhd} onClick={() => { setHeroAuto(false); setHeroAdhd(true); }}>{PROFILES[1].label[L.ui]}</button>
            </div>
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
                    <span className="livella-option-name">{g.label[L.ui]}</span>
                    {g.sub[L.ui] && <span className="livella-option-sub">{g.sub[L.ui]}</span>}
                  </button>
                ))}
              </div>
              <div className="livella-link-row">
                <label className="livella-label" htmlFor="livella-topic">{T.topicLabel}</label>
                <input id="livella-topic" className="livella-link-input" type="text"
                  placeholder={T.topicPlaceholder} value={topic} onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !loading && !loadingScala) generate(); }} />
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
                  <span className="livella-option-name">{p.label[L.ui]}</span>
                  {p.sub[L.ui] && <span className="livella-option-sub">{p.sub[L.ui]}</span>}
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
                  onClick={() => setLevel(l.id)}>
                  <span className="livella-option-name">{l.label}</span>
                  <span className="livella-option-sub">{l.sub}</span>
                </button>
              ))}
            </div>
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
                  <span className="livella-option-name">{p.label[L.ui]}</span>
                  <span className="livella-option-sub">{p.sub[L.ui]}</span>
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

        {loadingScala && (
          <div className="livella-card">
            <div className="livella-loading">{T.scalaBuilding}</div>
          </div>
        )}

        {!loadingScala && scala && (
          <div className={`livella-card livella-scala-card ${profileClass(scala)}`}>
            <div className="livella-result-header">
              <div>
                <div className="livella-scala-eyebrow">{T.scalaTitle}</div>
                <h2 className="livella-result-title">{scala.title}</h2>
                <div className="livella-result-meta">{L.name}{genreMeta(scala)}{profileMeta(scala)} · {scala.rungs[0].paragraphs.length} {T.scalaCount} · {LEVELS[0].label} → {LEVELS[LEVELS.length - 1].label}</div>
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

            {!result && (
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

        {!loading && result && (
          <>
            <div className={`livella-card ${profileClass(result)}`}>
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
                    {selectedLevel.label} · {selectedLevel.sub} · {selectedPurpose.label[L.ui]}{genreMeta(result)}{profileMeta(result)}
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

              {!showOriginal && !comparison && (
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
                  <div className="livella-comparison-col">
                    <div className="livella-comparison-col-title">{comparisonLevel.label} · {comparisonLevel.sub}</div>
                    <div className="livella-comparison-col-text">{comparison.passage}</div>
                    {renderTranslations(comparison.translations, true)}
                  </div>
                </div>
              )}

              {result.glosses && result.glosses.length > 0 && !showOriginal && !comparison && (
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

              {result.teacher_note && (
                <div className="livella-teacher-note">
                  <span className="livella-teacher-note-label">{T.teacherNote}</span>
                  {result.teacher_note}
                  {result.accommodations && result.accommodations.length > 0 && (
                    <ul className="livella-accommodations">
                      <li className="livella-accommodations-label">{T.accommodations}</li>
                      {result.accommodations.map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                  )}
                </div>
              )}

              <div style={{ marginTop: 20 }}>
                <label className="livella-label">{T.compareLabel}</label>
                <div className="livella-compare-row">
                  {LEVELS.filter((l) => l.id !== level).map((l) => (
                    <button key={l.id}
                      className={`livella-compare-mini-btn ${comparisonLevel?.id === l.id ? "active" : ""}`}
                      onClick={() => generateComparison(l.id)}
                      disabled={loadingComparison}>
                      {loadingComparison && comparisonLevel === null ? "..." : l.label}
                    </button>
                  ))}
                  {comparison && (
                    <button className="livella-compare-mini-btn"
                      onClick={() => { setComparison(null); setComparisonLevel(null); }}>
                      {T.closeCompare}
                    </button>
                  )}
                </div>
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
              </div>
            </div>

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
                        <span className="livella-option-name">{t.label[L.ui]}</span>
                        {t.sub[L.ui] && <span className="livella-option-sub">{t.sub[L.ui]}</span>}
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
                        title={d.description}>{d.label[L.ui]}</button>
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
                    <span className="livella-tab-name">{t.label[L.ui]}</span>
                    <span className="livella-tab-sub">
                      {activities[t.id] ? T.ready : t.sub[L.ui]}
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

        <div className="livella-footer">uno strumento, un lavoro · v0.12 · nuova prima pagina</div>
      </div>
    </div>
  );
}
