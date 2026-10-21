import type { Lang, Localized } from './types'

export type LangKey = keyof typeof STRINGS

/**
 * Interface strings. Hindi and Gujarati cover navigation, the student dashboard,
 * assessment, tutor and practice screens. Anything missing falls back to English
 * on purpose — the Language coverage page lists exactly what is translated.
 */
export const STRINGS = {
  'nav.home': { en: 'Home', hi: 'होम', gu: 'હોમ' },
  'nav.student': { en: 'My learning', hi: 'मेरी पढ़ाई', gu: 'મારું શીખવું' },
  'nav.assessment': { en: 'Diagnostic', hi: 'जाँच परीक्षा', gu: 'નિદાન કસોટી' },
  'nav.tutor': { en: 'AI tutor', hi: 'एआई शिक्षक', gu: 'એઆઈ શિક્ષક' },
  'nav.practice': { en: 'Practice', hi: 'अभ्यास', gu: 'અભ્યાસ' },
  'nav.path': { en: 'Learning path', hi: 'सीखने का रास्ता', gu: 'શીખવાનો માર્ગ' },
  'nav.revision': { en: 'Revision', hi: 'दोहराई', gu: 'પુનરાવર્તન' },
  'nav.achievements': { en: 'Achievements', hi: 'उपलब्धियाँ', gu: 'સિદ્ધિઓ' },
  'nav.teacher': { en: 'Teacher', hi: 'शिक्षक', gu: 'શિક્ષક' },
  'nav.parent': { en: 'Parent', hi: 'अभिभावक', gu: 'વાલી' },
  'nav.about': { en: 'How it works', hi: 'यह कैसे काम करता है', gu: 'આ કેવી રીતે કામ કરે છે' },

  'lang.partialNote': {
    en: 'One language is on. Explanations, questions and key labels are translated; some descriptive sentences still stay in English in this prototype.',
    hi: 'एक भाषा चालू है। समझाइश, प्रश्न और मुख्य लेबल अनुवादित हैं; कुछ वर्णनात्मक वाक्य इस प्रोटोटाइप में अब भी अंग्रेज़ी में हैं।',
    gu: 'એક ભાષા ચાલુ છે. સમજૂતી, પ્રશ્નો અને મુખ્ય લેબલ અનુવાદિત છે; કેટલાંક વર્ણનાત્મક વાક્યો આ પ્રોટોટાઇપમાં હજી અંગ્રેજીમાં જ છે.',
  },
  'common.start': { en: 'Start learning', hi: 'पढ़ना शुरू करो', gu: 'શીખવાનું શરૂ કરો' },
  'common.continue': { en: 'Continue', hi: 'जारी रखो', gu: 'ચાલુ રાખો' },
  'common.back': { en: 'Back', hi: 'पीछे', gu: 'પાછળ' },
  'common.next': { en: 'Next', hi: 'आगे', gu: 'આગળ' },
  'common.submit': { en: 'Submit', hi: 'जमा करो', gu: 'સબમિટ કરો' },
  'common.tryAgain': { en: 'Try again', hi: 'फिर कोशिश करो', gu: 'ફરી પ્રયાસ કરો' },
  'common.hint': { en: 'Hint', hi: 'संकेत', gu: 'સંકેત' },
  'common.checkAnswer': { en: 'Check answer', hi: 'उत्तर जाँचो', gu: 'જવાબ ચકાસો' },
  'common.correct': { en: 'Correct', hi: 'सही', gu: 'સાચું' },
  'common.incorrect': { en: 'Not quite', hi: 'थोड़ा गड़बड़', gu: 'થોડું ખોટું' },
  'common.explanation': { en: 'Explanation', hi: 'समझाइश', gu: 'સમજૂતી' },
  'common.language': { en: 'Language', hi: 'भाषा', gu: 'ભાષા' },
  'common.points': { en: 'Learning points', hi: 'लर्निंग पॉइंट्स', gu: 'લર્નિંગ પોઈન્ટ' },
  'common.streak': { en: 'Day streak', hi: 'दिन की लय', gu: 'દિવસની શ્રેણી' },
  'common.level': { en: 'Level', hi: 'स्तर', gu: 'સ્તર' },
  'common.topic': { en: 'Topic', hi: 'विषय', gu: 'વિષય' },
  'common.recommended': { en: 'Recommended next', hi: 'आगे के लिए सुझाव', gu: 'આગળ માટે સૂચન' },
  'common.demoMode': { en: 'Demo mode', hi: 'डेमो मोड', gu: 'ડેમો મોડ' },
  'common.mastered': { en: 'Mastered', hi: 'अच्छी पकड़', gu: 'સારી પકડ' },
  'common.needsPractice': { en: 'Needs practice', hi: 'अभ्यास चाहिए', gu: 'અભ્યાસ જરૂરી' },
  'common.inProgress': { en: 'In progress', hi: 'चल रहा है', gu: 'ચાલુ છે' },
  'common.locked': { en: 'Locked', hi: 'बंद', gu: 'બંધ' },
  'common.available': { en: 'Ready', hi: 'तैयार', gu: 'તૈયાર' },
  'common.notStarted': { en: 'Not started', hi: 'शुरू नहीं हुआ', gu: 'શરૂ થયું નથી' },

  'dash.hello': { en: 'Hello', hi: 'नमस्ते', gu: 'નમસ્તે' },
  'dash.subtitle': {
    en: 'Here is what your learning looks like today.',
    hi: 'आज तुम्हारी पढ़ाई कैसी चल रही है, यह देखो।',
    gu: 'આજે તમારું શીખવું કેવું ચાલી રહ્યું છે તે જુઓ.',
  },
  'dash.overall': { en: 'Overall progress', hi: 'कुल प्रगति', gu: 'કુલ પ્રગતિ' },
  'dash.topicsToPractise': { en: 'Topics needing practice', hi: 'जिन विषयों में अभ्यास चाहिए', gu: 'જે વિષયોમાં અભ્યાસ જરૂરી છે' },
  'dash.recent': { en: 'Recent assessment', hi: 'हाल की जाँच', gu: 'તાજેતરની કસોટી' },
  'dash.badges': { en: 'Badges', hi: 'बैज', gu: 'બેજ' },
  'dash.revision': { en: 'Revision reminders', hi: 'दोहराई की याद', gu: 'પુનરાવર્તન યાદ' },
  'dash.completed': { en: 'Lessons completed', hi: 'पूरी की गई पाठ', gu: 'પૂર્ણ કરેલા પાઠ' },
  'dash.why': { en: 'Why this?', hi: 'यह क्यों?', gu: 'આ કેમ?' },

  'quiz.question': { en: 'Question', hi: 'प्रश्न', gu: 'પ્રશ્ન' },
  'quiz.of': { en: 'of', hi: 'में से', gu: 'માંથી' },
  'quiz.answered': { en: 'answered', hi: 'उत्तर दिए', gu: 'જવાબ આપ્યા' },
  'quiz.results': { en: 'Your results', hi: 'तुम्हारे नतीजे', gu: 'તમારા પરિણામ' },
  'quiz.byTopic': { en: 'By topic', hi: 'विषय के अनुसार', gu: 'વિષય મુજબ' },

  'tutor.title': { en: 'Ask the tutor', hi: 'शिक्षक से पूछो', gu: 'શિક્ષકને પૂછો' },
  'tutor.placeholder': {
    en: 'Ask a question about this topic…',
    hi: 'इस विषय पर कुछ पूछो…',
    gu: 'આ વિષય વિશે કંઈ પૂછો…',
  },
  'tutor.suggested': { en: 'Try asking', hi: 'यह पूछकर देखो', gu: 'આ પૂછીને જુઓ' },
  'tutor.worked': { en: 'Worked example', hi: 'हल किया उदाहरण', gu: 'ઉકેલેલું ઉદાહરણ' },


  'tutor.eyebrow': { en: 'Personal tutor', hi: 'निजी शिक्षक', gu: 'વ્યક્તિગત શિક્ષક' },
  'tutor.askAbout': { en: 'Ask about', hi: 'पूछो इस बारे में:', gu: 'આ વિશે પૂછો:' },
  'tutor.subtitle': {
    en: 'A small, hand-written teaching pack — explanations, worked steps and answers to common questions. It is not a live language model unless one is configured.',
    hi: 'एक छोटा, हाथ से लिखा पाठ-संग्रह — समझाइश, हल किए कदम और आम सवालों के जवाब। जब तक कोई मॉडल जोड़ा न जाए, यह जीवंत भाषा-मॉडल नहीं है।',
    gu: 'એક નાનું, હાથે લખેલું શિક્ષણ-સંગ્રહ — સમજૂતી, ઉકેલેલા પગલાં અને સામાન્ય પ્રશ્નોના જવાબ. મોડેલ જોડાયેલું ન હોય ત્યાં સુધી આ જીવંત ભાષા-મોડેલ નથી.',
  },
  'tutor.choose': { en: 'Choose what to learn', hi: 'क्या सीखना है चुनो', gu: 'શું શીખવું છે તે પસંદ કરો' },
  'tutor.inOneIdea': { en: 'In one idea', hi: 'एक विचार में', gu: 'એક વિચારમાં' },
  'tutor.doubts': { en: 'Common doubts', hi: 'आम शंकाएँ', gu: 'સામાન્ય શંકાઓ' },
  'tutor.coverage': { en: 'Language coverage', hi: 'भाषा कवरेज', gu: 'ભાષા કવરેજ' },
  'tutor.coverageTitle': { en: 'What is actually translated', hi: 'असल में क्या अनुवादित है', gu: 'ખરેખર શું અનુવાદિત છે' },
  'tutor.coverageNote': {
    en: 'We would rather show the gaps than overstate coverage. Topics marked with a dash fall back to English.',
    hi: 'हम कवरेज बढ़ा-चढ़ाकर न बताकर कमियाँ दिखाना बेहतर समझते हैं। डैश वाले विषय अंग्रेज़ी में ही मिलेंगे।',
    gu: 'કવરેજ મોટું દેખાડવા કરતાં ખાલી જગ્યા દેખાડવી સારી લાગે છે. ડેશવાળા વિષય અંગ્રેજીમાં જ મળશે.',
  },

  'assessment.eyebrow': { en: 'Diagnostic', hi: 'जाँच परीक्षा', gu: 'નિદાન કસોટી' },
  'assessment.subtitle': {
    en: 'Eight questions across fractions, variables and equations. Answer honestly — this decides where you start, not your marks.',
    hi: 'भिन्न, चर और समीकरणों पर आठ प्रश्न। सच्चाई से उत्तर दो — इससे तुम्हारी शुरुआत तय होती है, अंक नहीं।',
    gu: 'અપૂર્ણાંક, ચલ અને સમીકરણો પર આઠ પ્રશ્નો. પ્રામાણિકપણે જવાબ આપો — આ તમારી શરૂઆત નક્કી કરે છે, ગુણ નહીં.',
  },
  'assessment.title': {
    en: 'Find out what Aarav already knows',
    hi: 'देखो आरव को पहले से क्या आता है',
    gu: 'જુઓ આરવને પહેલેથી શું આવડે છે',
  },
  'assessment.eyebrowFull': {
    en: 'Diagnostic · Class 8 Mathematics',
    hi: 'जाँच परीक्षा · कक्षा 8 गणित',
    gu: 'નિદાન કસોટી · ધોરણ 8 ગણિત',
  },
  'path.title': {
    en: 'A route that respects prerequisites',
    hi: 'ऐसा रास्ता जो पहली शर्तें पूरी करता है',
    gu: 'એવો માર્ગ જે પહેલી શરતો સાચવે છે',
  },
  'revision.title': { en: 'Short reviews, on time', hi: 'छोटी दोहराइयाँ, सही समय पर', gu: 'નાના પુનરાવર્તન, યોગ્ય સમયે' },
  'lessons.title': { en: 'Read now, or save for later', hi: 'अभी पढ़ो या बाद के लिए सहेजो', gu: 'હમણાં વાંચો કે પછી માટે સાચવો' },
  'lessons.eyebrow': { en: 'Lessons & offline', hi: 'पाठ और ऑफ़लाइन', gu: 'પાઠ અને ઑફલાઇન' },
  'achievements.title': { en: 'Points and badges', hi: 'पॉइंट और बैज', gu: 'પોઈન્ટ અને બેજ' },
  'achievements.eyebrow': { en: 'Progress & rewards', hi: 'प्रगति और इनाम', gu: 'પ્રગતિ અને ઇનામ' },
  'assessment.howScoring': { en: 'How the scoring works', hi: 'अंक कैसे निकलते हैं', gu: 'ગુણ કેવી રીતે ગણાય છે' },

  'results.subtitle': {
    en: 'Every number below is calculated from your answers in this attempt. The questions, your choices and the explanations are all shown.',
    hi: 'नीचे की हर संख्या इसी कोशिश में दिए तुम्हारे उत्तरों से निकली है। प्रश्न, तुम्हारी पसंद और समझाइश सब दिखाई गई है।',
    gu: 'નીચેની દરેક સંખ્યા આ પ્રયાસમાં આપેલા તમારા જવાબોમાંથી ગણાઈ છે. પ્રશ્નો, તમારી પસંદ અને સમજૂતી બધું દેખાડ્યું છે.',
  },

  'practice.eyebrow': { en: 'Adaptive practice', hi: 'अनुकूली अभ्यास', gu: 'અનુકૂલ અભ્યાસ' },
  'practice.subtitle': {
    en: 'The next question is chosen by rules over your last answers — not at random.',
    hi: 'अगला प्रश्न तुम्हारे पिछले उत्तरों पर चलने वाले नियमों से चुना जाता है — बिना किसी तुक्के के।',
    gu: 'આગલો પ્રશ્ન તમારા છેલ્લા જવાબો પર ચાલતા નિયમોથી પસંદ થાય છે — અવ્યવસ્થિત રીતે નહીં.',
  },
  'practice.where': { en: 'Where you are', hi: 'तुम अभी कहाँ हो', gu: 'તમે અત્યારે ક્યાં છો' },
  'practice.session': { en: 'This session', hi: 'यह सत्र', gu: 'આ સત્ર' },
  'practice.ladder': { en: 'Level ladder', hi: 'स्तर की सीढ़ी', gu: 'સ્તરની સીડી' },
  'practice.best': { en: 'Personal best', hi: 'अपना सर्वश्रेष्ठ', gu: 'તમારો શ્રેષ્ઠ' },

  'path.subtitle': {
    en: 'Five topics, in order. A topic opens when the one before it reaches 60%. Click any open topic to learn or practise.',
    hi: 'पाँच विषय, क्रम से। पिछला विषय 60% पर पहुँचे तो अगला खुलता है। खुले विषय पर क्लिक करके सीखो या अभ्यास करो।',
    gu: 'પાંચ વિષયો, ક્રમમાં. આગલો વિષય 60% થાય ત્યારે પછીનો ખૂલે. ખુલ્લા વિષય પર ક્લિક કરીને શીખો કે અભ્યાસ કરો.',
  },
  'revision.subtitle': {
    en: 'Short reviews the app has scheduled from your own answers. Dates are suggestions stored in this browser — nothing is pushed or emailed.',
    hi: 'तुम्हारे उत्तरों से ऐप ने तय की छोटी दोहराइयाँ। तारीखें सिर्फ सुझाव हैं और इसी ब्राउज़र में रखी हैं — कोई सूचना नहीं भेजी जाती।',
    gu: 'તમારા જવાબોમાંથી ઍપે ગોઠવેલા નાના પુનરાવર્તન. તારીખો ફક્ત સૂચન છે અને આ જ બ્રાઉઝરમાં સચવાય છે — કોઈ સૂચના મોકલાતી નથી.',
  },
  'lessons.subtitle': {
    en: 'Saved lessons stay readable without a connection because their content is stored in this browser. Live tutoring does not work offline.',
    hi: 'सहेजे पाठ बिना इंटरनेट भी पढ़े जा सकते हैं क्योंकि उनका पाठ इसी ब्राउज़र में रखा है। जीवंत ट्यूटर ऑफ़लाइन काम नहीं करता।',
    gu: 'સાચવેલા પાઠ ઇન્ટરનેટ વગર પણ વાંચી શકાય કારણ કે તેમનો ભાગ આ જ બ્રાઉઝરમાં સચવાય છે. જીવંત ટ્યુટર ઑફલાઇન કામ કરતું નથી.',
  },
  'achievements.subtitle': {
    en: 'Points come from finishing real work. Nothing here pays out for clicking the same answer twice.',
    hi: 'पॉइंट असली काम पूरा करने से मिलते हैं। एक ही उत्तर दोबारा दबाने पर यहाँ कुछ नहीं मिलता।',
    gu: 'પોઈન્ટ ખરેખર કામ પૂરું કરવાથી મળે છે. એક જ જવાબ ફરી દબાવવાથી અહીં કંઈ મળતું નથી.',
  },

  'teacher.title': { en: 'Class overview', hi: 'कक्षा की जानकारी', gu: 'વર્ગની ઝલક' },
  'teacher.support': { en: 'Students who may need support', hi: 'जिन्हें सहायता चाहिए हो सकती है', gu: 'જેમને મદદની જરૂર હોઈ શકે' },
  'teacher.concepts': { en: 'Commonly misunderstood concepts', hi: 'अक्सर गलत समझे जाने वाले विषय', gu: 'વારંવાર ખોટી સમજાતી બાબતો' },
  'teacher.lessonPlan': { en: 'Lesson plan suggestion', hi: 'पाठ योजना का सुझाव', gu: 'પાઠ યોજનાનું સૂચન' },
  'teacher.suggestionNote': {
    en: 'Suggestions only — the teacher decides.',
    hi: 'केवल सुझाव — फैसला शिक्षक का है।',
    gu: 'ફક્ત સૂચન — નિર્ણય શિક્ષકનો છે.',
  },

  'parent.title': { en: 'Progress summary', hi: 'प्रगति सारांश', gu: 'પ્રગતિ સારાંશ' },
  'parent.home': { en: 'Try this at home', hi: 'घर पर यह करके देखें', gu: 'ઘરે આ કરીને જુઓ' },
} satisfies Record<string, Localized>

export function t(key: LangKey, lang: Lang): string {
  const entry = STRINGS[key]
  return (entry as unknown as Record<string, string | undefined>)[lang] ?? entry.en
}

/** Translate an arbitrary Localized value with English fallback. */
export function tr(value: Localized | undefined, lang: Lang): string {
  if (!value) return ''
  return (value as unknown as Record<string, string | undefined>)[lang] ?? value.en
}

export function hasTranslation(value: Localized | undefined, lang: Lang): boolean {
  if (!value) return false
  if (lang === 'en') return true
  return Boolean((value as unknown as Record<string, string | undefined>)[lang])
}

export const LANG_LABELS: Record<Lang, { native: string; english: string }> = {
  en: { native: 'English', english: 'English' },
  hi: { native: 'हिन्दी', english: 'Hindi' },
  gu: { native: 'ગુજરાતી', english: 'Gujarati' },
}
