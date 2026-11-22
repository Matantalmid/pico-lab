/* Language handling + UI strings. Everything hangs off window.PICO so the
   site works when opened straight from disk (no modules, no build step). */
window.PICO = window.PICO || {};
(function (P) {
  'use strict';

  var LANGS = ['he', 'en'];
  var lang = 'he';
  try {
    var q = new URLSearchParams(location.search).get('lang');
    var saved = localStorage.getItem('pico.lang');
    if (LANGS.indexOf(q) >= 0) lang = q;
    else if (LANGS.indexOf(saved) >= 0) lang = saved;
  } catch (e) { /* storage blocked: stay on default */ }

  P.lang = function () { return lang; };
  P.setLang = function (l) {
    if (LANGS.indexOf(l) < 0) return;
    lang = l;
    try { localStorage.setItem('pico.lang', l); } catch (e) { /* ignore */ }
  };

  /* t({he, en}) -> string in the current language. Plain strings pass through. */
  P.t = function (v) {
    if (v == null) return '';
    if (typeof v === 'string') return v;
    return v[lang] != null ? v[lang] : (v.he != null ? v.he : v.en || '');
  };

  P.ui = {
    brand: { he: 'מעבדת Pico 2', en: 'Pico 2 Lab' },
    navHome: { he: 'בית', en: 'Home' },
    navStart: { he: 'מתחילים', en: 'Get started' },
    navPinout: { he: 'מפת פינים', en: 'Pinout' },
    navInterfaces: { he: 'ממשקים', en: 'Interfaces' },
    navComponents: { he: 'רכיבים', en: 'Components' },
    navPlanner: { he: 'מתכנן', en: 'Planner' },
    navRobot: { he: 'הרובוט', en: 'Robot' },
    usedInLessons: { he: 'שיעורים שמשתמשים ברכיב הזה', en: 'Lessons that use this part' },
    navBasics: { he: 'יסודות', en: 'Basics' },
    navLessons: { he: 'שיעורים', en: 'Lessons' },
    navGlossary: { he: 'מילון', en: 'Glossary' },
    whatIs: { he: 'מה זה', en: 'What it is' },
    looks: { he: 'איך מזהים אותו', en: 'How to recognise it' },
    partPins: { he: 'הרגליים של הרכיב', en: 'The legs of the part' },
    build: { he: 'בונים צעד אחר צעד', en: 'Build it step by step' },
    expect: { he: 'מה אמור לקרות', en: 'What should happen' },
    explainCode: { he: 'הקוד, שורה אחר שורה', en: 'The code, line by line' },
    ideas: { he: 'רעיונות לפרויקט', en: 'Project ideas' },
    quiz: { he: 'בדקו את עצמכם', en: 'Check yourself' },
    line: { he: 'שורה', en: 'Line' },
    lines: { he: 'שורות', en: 'Lines' },
    correct: { he: 'נכון.', en: 'Correct.' },
    wrong: { he: 'לא בדיוק.', en: 'Not quite.' },
    quizScore: { he: 'תשובות נכונות: {r} מתוך {n}.', en: 'Correct answers: {r} of {n}.' },
    quizLeft: { he: '(נשארו {k})', en: '({k} left)' },
    quizAgain: { he: 'נסו שוב', en: 'Try again' },
    toGlossary: { he: 'למילון המונחים', en: 'Open the glossary' },
    searchTerm: { he: 'חיפוש מונח', en: 'Search for a term' },
    inShort: { he: 'במשפט אחד', en: 'In one sentence' },
    analogy: { he: 'חשבו על זה כך', en: 'Think of it like this' },
    whenUse: { he: 'מתי משתמשים בזה', en: 'When to use it' },
    seeHere: { he: 'מה רואים כאן', en: 'What you are looking at' },
    prevCh: { he: 'הפרק הקודם', en: 'Previous chapter' },
    nextCh: { he: 'הפרק הבא', en: 'Next chapter' },
    chapter: { he: 'פרק', en: 'Chapter' },
    addToPlan: { he: '+ הוסיפו למתכנן הפרויקט', en: '+ Add to the project planner' },
    langSwitch: { he: 'English', en: 'עברית' },
    themeToggle: { he: 'מצב כהה / בהיר', en: 'Dark / light mode' },
    copy: { he: 'העתיקו', en: 'Copy' },
    copied: { he: 'הועתק', en: 'Copied' },
    back: { he: 'חזרה', en: 'Back' },
    all: { he: 'הכול', en: 'All' },
    power: { he: 'מתח ואדמה', en: 'Power & ground' },
    pin: { he: 'פין', en: 'Pin' },
    physicalPin: { he: 'פין פיזי', en: 'Physical pin' },
    functions: { he: 'מה הפין הזה יודע לעשות', en: 'What this pin can do' },
    usedBy: { he: 'רכיבים בקטלוג שמשתמשים בפין הזה', en: 'Catalog components that use this pin' },
    pickPin: { he: 'לחצו על פין בלוח כדי לראות מה הוא עושה.', en: 'Click a pin on the board to see what it does.' },
    pickPinHint: {
      he: 'אפשר גם לבחור ממשק למעלה, ואז הפינים שתומכים בו יודגשו.',
      en: 'You can also pick an interface above to highlight the pins that support it.'
    },
    onboard: { he: 'פינים פנימיים (לא בשורות הפינים)', en: 'Internal pins (not on the header)' },
    codeExample: { he: 'קוד MicroPython', en: 'MicroPython code' },
    wiring: { he: 'חיווט', en: 'Wiring' },
    wiringPart: { he: 'ברכיב', en: 'On the part' },
    wiringPico: { he: 'ב-Pico 2', en: 'On the Pico 2' },
    wiringNote: { he: 'הערה', en: 'Note' },
    mistakes: { he: 'לא עובד? בדקו את אלה', en: 'Not working? Check these' },
    needs: { he: 'מה צריך', en: 'What you need' },
    library: { he: 'ספרייה', en: 'Library' },
    voltage: { he: 'מתח הזנה', en: 'Supply voltage' },
    interface: { he: 'ממשק', en: 'Interface' },
    howItWorks: { he: 'איך זה עובד', en: 'How it works' },
    tryIt: { he: 'נסו בעצמכם', en: 'Try it' },
    signals: { he: 'הקווים', en: 'The wires' },
    whichPins: { he: 'אילו פינים', en: 'Which pins' },
    showOnBoard: { he: 'הצגה במפת הפינים', en: 'Show on the pinout' },
    tips: { he: 'כדאי לדעת', en: 'Good to know' },
    worksWith: { he: 'רכיבים שמתחברים כך', en: 'Parts that connect this way' },
    more: { he: 'עוד רכיבים נפוצים בממשק הזה', en: 'Other common parts on this interface' },
    step: { he: 'שלב', en: 'Step' },
    prev: { he: 'הקודם', en: 'Previous' },
    next: { he: 'הבא', en: 'Next' },
    notFound: { he: 'העמוד לא נמצא.', en: 'Page not found.' }
  };
  P.s = function (key) { return P.t(P.ui[key]); };

  P.esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  /* Text with light markup, used for all explanatory prose:
       [[term-id|shown text]]  -> a glossary term the reader can click
       `code`                  -> inline code                              */
  P.rich = function (s) {
    return P.esc(s)
      .replace(/\[\[([a-z0-9-]+)\|([^\]]+)\]\]/g, function (_, id, shown) {
        var g = P.glossary && P.glossary[id];
        var tip = g ? ' title="' + P.esc(P.plain(P.t(g.d))) + '"' : '';
        return '<button type="button" class="term" data-term="' + id + '"' + tip + '>' + shown + '</button>';
      })
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  };
  /* Same text with the markup stripped, for places that need plain text. */
  P.plain = function (s) {
    return String(s).replace(/\[\[[a-z0-9-]+\|([^\]]+)\]\]/g, '$1').replace(/`/g, '');
  };
})(window.PICO);
