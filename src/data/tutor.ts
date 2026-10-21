import type { TopicId, TutorBlock } from '../lib/types'

/**
 * Predefined tutor content used in demo mode.
 * Language coverage is honest: fractions, variables and equations are written in
 * English, Hindi and Gujarati; simplifying and word problems are English-first
 * (Hindi for simplifying). The UI shows this coverage to the student.
 */
export const TUTOR: Record<TopicId, TutorBlock> = {
  fractions: {
    simple: {
      en: 'A fraction shows a part of a whole. The bottom number (denominator) tells you how many equal pieces the whole is cut into. The top number (numerator) tells you how many pieces you have.',
      hi: 'भिन्न किसी पूरी वस्तु का एक हिस्सा दिखाती है। नीचे की संख्या (हर) बताती है कि पूरी वस्तु कितने बराबर टुकड़ों में बाँटी गई है। ऊपर की संख्या (अंश) बताती है कि तुम्हारे पास कितने टुकड़े हैं।',
      gu: 'અપૂર્ણાંક એટલે પૂરી વસ્તુનો એક ભાગ. નીચેની સંખ્યા (છેદ) કહે છે કે પૂરી વસ્તુ કેટલા સરખા ટુકડામાં વહેંચાઈ છે. ઉપરની સંખ્યા (અંશ) કહે છે કે તમારી પાસે કેટલા ટુકડા છે.',
    },
    exampleTitle: {
      en: 'Pizza example: why 1/2 + 1/3 = 5/6',
      hi: 'पिज़्ज़ा उदाहरण: 1/2 + 1/3 = 5/6 क्यों है',
      gu: 'પિઝા ઉદાહરણ: 1/2 + 1/3 = 5/6 કેમ છે',
    },
    exampleSteps: [
      {
        en: 'Cut one pizza into 2 equal slices. One slice is 1/2 of the pizza.',
        hi: 'एक पिज़्ज़ा को 2 बराबर टुकड़ों में काटो। एक टुकड़ा पिज़्ज़ा का 1/2 है।',
        gu: 'એક પિઝાને 2 સરખા ટુકડામાં કાપો. એક ટુકડો પિઝાનો 1/2 છે.',
      },
      {
        en: 'Cut a second pizza into 3 equal slices. One slice is 1/3 of the pizza.',
        hi: 'दूसरे पिज़्ज़ा को 3 बराबर टुकड़ों में काटो। एक टुकड़ा पिज़्ज़ा का 1/3 है।',
        gu: 'બીજા પિઝાને 3 સરખા ટુકડામાં કાપો. એક ટુકડો પિઝાનો 1/3 છે.',
      },
      {
        en: 'You cannot add slices of different sizes. Cut both pizzas into 6 equal slices instead: 1/2 becomes 3/6 and 1/3 becomes 2/6.',
        hi: 'अलग-अलग आकार के टुकड़े जोड़े नहीं जा सकते। दोनों पिज़्ज़ा को 6 बराबर टुकड़ों में काटो: 1/2 बनता है 3/6 और 1/3 बनता है 2/6।',
        gu: 'અલગ-અલગ સાઇઝના ટુકડા જોડી શકાતા નથી. બંને પિઝાને 6 સરખા ટુકડામાં કાપો: 1/2 એ 3/6 થાય અને 1/3 એ 2/6 થાય.',
      },
      {
        en: 'Now the pieces match: 3 pieces + 2 pieces = 5 pieces out of 6. So 1/2 + 1/3 = 5/6.',
        hi: 'अब टुकड़े एक जैसे हैं: 3 टुकड़े + 2 टुकड़े = 6 में से 5 टुकड़े। इसलिए 1/2 + 1/3 = 5/6।',
        gu: 'હવે ટુકડા સરખા છે: 3 ટુકડા + 2 ટુકડા = 6 માંથી 5 ટુકડા. તેથી 1/2 + 1/3 = 5/6.',
      },
    ],
    why: {
      en: 'Before adding fractions, the pieces must be the same size. Finding a common denominator does exactly that.',
      hi: 'भिन्न जोड़ने से पहले टुकड़ों का आकार एक जैसा होना चाहिए। समान हर ढूँढने से यही होता है।',
      gu: 'અપૂર્ણાંક જોડતા પહેલાં ટુકડા સરખા હોવા જોઈએ. સામાન્ય છેદ શોધવાથી એ જ થાય છે.',
    },
    faq: [
      {
        q: {
          en: 'Why can’t I just add the top and bottom numbers?',
          hi: 'मैं सीधे ऊपर और नीचे की संख्याएँ क्यों नहीं जोड़ सकता?',
          gu: 'હું સીધા ઉપર અને નીચેની સંખ્યાઓ કેમ જોડી શકતો નથી?',
        },
        a: {
          en: 'Because 1/2 + 1/3 is not 2/5. Half a pizza plus one-third of a pizza is 5/6 — that is more than half, not less.',
          hi: 'क्योंकि 1/2 + 1/3, 2/5 नहीं होता। आधा पिज़्ज़ा और एक-तिहाई पिज़्ज़ा मिलकर 5/6 होते हैं — यह आधे से ज़्यादा है, कम नहीं।',
          gu: 'કારણ કે 1/2 + 1/3 એ 2/5 થતું નથી. અડધો પિઝા અને એક-તૃતીયાંશ પિઝા મળીને 5/6 થાય — જે અડધાથી વધુ છે, ઓછું નહીં.',
        },
      },
      {
        q: {
          en: 'How do I find a common denominator quickly?',
          hi: 'समान हर जल्दी कैसे ढूँढूँ?',
          gu: 'સામાન્ય છેદ ઝડપથી કેવી રીતે શોધું?',
        },
        a: {
          en: 'Look for the smallest number that both denominators divide into. For 2 and 3 it is 6; for 4 and 6 it is 12.',
          hi: 'वह सबसे छोटी संख्या ढूँढो जो दोनों हर में पूरी तरह विभाजित हो। 2 और 3 के लिए वह 6 है; 4 और 6 के लिए 12।',
          gu: 'એવી સૌથી નાની સંખ્યા શોધો જે બંને છેદમાં પૂરી રીતે ભાગાય. 2 અને 3 માટે તે 6 છે; 4 અને 6 માટે 12.',
        },
      },
    ],
    keywords: ['fraction', 'denominator', 'numerator', 'common', 'pizza', 'add', 'equivalent'],
  },

  variables: {
    simple: {
      en: 'A variable is a letter that stands for a number we do not know yet. An expression like 3x + 2 is a recipe made of numbers and letters — it has no equals sign.',
      hi: 'चर एक अक्षर है जो ऐसी संख्या को दिखाता है जो हमें अभी नहीं पता। 3x + 2 जैसा व्यंजक संख्याओं और अक्षर का मेल है — इसमें बराबर का चिन्ह नहीं होता।',
      gu: 'ચલ એ અક્ષર છે જે એવી સંખ્યા દર્શાવે છે જે આપણે હજી જાણતા નથી. 3x + 2 જેવો વ્યંજક સંખ્યાઓ અને અક્ષરનો મેળ છે — તેમાં બરાબરનું નિશાન હોતું નથી.',
    },
    exampleTitle: {
      en: 'Notebooks example: why 3 notebooks cost 3x',
      hi: 'कॉपी उदाहरण: 3 कॉपियों की कीमत 3x क्यों होती है',
      gu: 'નોટબુક ઉદાહરણ: 3 નોટબુકની કિંમત 3x કેમ થાય',
    },
    exampleSteps: [
      {
        en: 'Let one notebook cost x rupees. We do not know x yet — that is fine.',
        hi: 'मान लो एक कॉपी की कीमत x रुपये है। हमें x अभी नहीं पता — कोई बात नहीं।',
        gu: 'ધારો કે એક નોટબુકની કિંમત x રૂપિયા છે. આપણે x હજી જાણતા નથી — કોઈ વાંધો નહીં.',
      },
      {
        en: 'Three notebooks cost x + x + x, which we write as 3x.',
        hi: 'तीन कॉपियों की कीमत x + x + x है, जिसे हम 3x लिखते हैं।',
        gu: 'ત્રણ નોટબુકની કિંમત x + x + x છે, જેને આપણે 3x લખીએ છીએ.',
      },
      {
        en: 'If a notebook costs ₹20, then 3x = 3 × 20 = ₹60. The letter simply took a value.',
        hi: 'अगर कॉपी ₹20 की है, तो 3x = 3 × 20 = ₹60। अक्षर ने बस एक मान ले लिया।',
        gu: 'જો નોટબુક ₹20 ની હોય, તો 3x = 3 × 20 = ₹60. અક્ષરે ફક્ત એક કિંમત લીધી.',
      },
    ],
    why: {
      en: 'An expression describes a quantity. An equation states that two quantities are equal.',
      hi: 'व्यंजक किसी मात्रा का वर्णन करता है। समीकरण कहता है कि दो मात्राएँ बराबर हैं।',
      gu: 'વ્યંજક કોઈ માત્રાનું વર્ણન કરે છે. સમીકરણ કહે છે કે બે માત્રા સરખી છે.',
    },
    faq: [
      {
        q: {
          en: 'What is the difference between an expression and an equation?',
          hi: 'व्यंजक और समीकरण में क्या अंतर है?',
          gu: 'વ્યંજક અને સમીકરણમાં શું ફરક છે?',
        },
        a: {
          en: 'An equation has an equals sign (2x + 3 = 9). An expression does not (2x + 3).',
          hi: 'समीकरण में बराबर का चिन्ह होता है (2x + 3 = 9)। व्यंजक में नहीं (2x + 3)।',
          gu: 'સમીકરણમાં બરાબરનું નિશાન હોય છે (2x + 3 = 9). વ્યંજકમાં નહીં (2x + 3).',
        },
      },
    ],
    keywords: ['variable', 'letter', 'expression', 'equation', 'value', 'term'],
  },

  simplify: {
    simple: {
      en: 'Simplifying means writing an expression in the shortest way. Add the x-terms with the x-terms, and the numbers with the numbers.',
      hi: 'सरल करने का मतलब है व्यंजक को सबसे छोटे रूप में लिखना। x वाले पदों को x वाले पदों से और संख्याओं को संख्याओं से जोड़ो।',
    },
    exampleTitle: {
      en: 'Simplify 3x + 2 + 4x',
      hi: '3x + 2 + 4x को सरल करो',
    },
    exampleSteps: [
      {
        en: 'Collect the x-terms: 3x + 4x = 7x.',
        hi: 'x वाले पद इकट्ठे करो: 3x + 4x = 7x।',
      },
      {
        en: 'Keep the number as it is: + 2.',
        hi: 'संख्या को वैसे ही रखो: + 2।',
      },
      {
        en: 'Answer: 7x + 2. We cannot add 7x and 2 because they are different kinds of things.',
        hi: 'उत्तर: 7x + 2। 7x और 2 को नहीं जोड़ सकते क्योंकि ये अलग तरह की चीज़ें हैं।',
      },
    ],
    why: {
      en: 'Only like terms combine. Three apples plus four apples gives seven apples, but apples and oranges stay separate.',
      hi: 'केवल समान पद जुड़ते हैं। तीन सेब और चार सेब से सात सेब बनते हैं, पर सेब और संतरे अलग रहते हैं।',
    },
    faq: [
      {
        q: { en: 'Do I always add the numbers in brackets?' },
        a: { en: 'No. 5(x + 2) multiplies, so it becomes 5x + 10.' },
      },
    ],
    keywords: ['simplify', 'like terms', 'brackets', 'multiply'],
  },

  equations: {
    simple: {
      en: 'An equation says that two things are equal. Solving it means finding the value of the letter that keeps both sides balanced, like a see-saw.',
      hi: 'समीकरण कहता है कि दो चीज़ें बराबर हैं। इसे हल करने का मतलब है वह मान ढूँढना जिससे दोनों पक्ष संतुलित रहें, जैसे सी-सॉ पर।',
      gu: 'સમીકરણ કહે છે કે બે વસ્તુ સરખી છે. તેને ઉકેલવાનો અર્થ છે એવી કિંમત શોધવી જેનાથી બંને બાજુ સંતુલિત રહે, જેમ કે સી-સો પર.',
    },
    exampleTitle: {
      en: 'Solve 2x + 5 = 17',
      hi: '2x + 5 = 17 हल करो',
      gu: '2x + 5 = 17 ઉકેલો',
    },
    exampleSteps: [
      {
        en: 'Undo the +5 by subtracting 5 from both sides: 2x = 12.',
        hi: '+5 हटाने के लिए दोनों पक्षों से 5 घटाओ: 2x = 12।',
        gu: '+5 દૂર કરવા બંને બાજુથી 5 બાદ કરો: 2x = 12.',
      },
      {
        en: 'Undo the ×2 by dividing both sides by 2: x = 6.',
        hi: '×2 हटाने के लिए दोनों पक्षों को 2 से भाग दो: x = 6।',
        gu: '×2 દૂર કરવા બંને બાજુને 2 થી ભાગો: x = 6.',
      },
      {
        en: 'Check your answer: 2 × 6 + 5 = 12 + 5 = 17. Correct.',
        hi: 'उत्तर जाँचो: 2 × 6 + 5 = 12 + 5 = 17। सही है।',
        gu: 'જવાબ ચકાસો: 2 × 6 + 5 = 12 + 5 = 17. સાચો છે.',
      },
    ],
    why: {
      en: 'Whatever you do to one side, do to the other. That keeps the see-saw level.',
      hi: 'एक पक्ष के साथ जो करो, दूसरे पक्ष के साथ भी करो। इससे सी-सॉ संतुलित रहता है।',
      gu: 'એક બાજુ સાથે જે કરો તે બીજી બાજુ સાથે પણ કરો. એથી સી-સો સંતુલિત રહે છે.',
    },
    faq: [
      {
        q: {
          en: 'Which side do I subtract from first?',
          hi: 'पहले किस पक्ष से घटाऊँ?',
          gu: 'પહેલાં કઈ બાજુથી બાદ કરું?',
        },
        a: {
          en: 'Both sides — always. Move the number farthest from the letter first, then the multiplication.',
          hi: 'हमेशा दोनों पक्षों से। पहले अक्षर से सबसे दूर की संख्या हटाओ, फिर गुणा।',
          gu: 'હંમેશા બંને બાજુથી. પહેલાં અક્ષરથી સૌથી દૂરની સંખ્યા દૂર કરો, પછી ગુણાકાર.',
        },
      },
    ],
    keywords: ['equation', 'solve', 'balance', 'both sides', 'check'],
  },

  word: {
    simple: {
      en: 'Word problems are short stories with numbers. Read once for the story, then write what you know as an expression or an equation.',
    },
    exampleTitle: {
      en: '“Twice a number plus 3 is 17”',
    },
    exampleSteps: [
      { en: 'Let the number be n. “Twice a number” is 2n.' },
      { en: '“Plus 3 is 17” gives the equation 2n + 3 = 17.' },
      { en: 'Subtract 3: 2n = 14. Divide by 2: n = 7.' },
    ],
    faq: [
      {
        q: { en: 'How do I choose the letter?' },
        a: { en: 'Any letter works. Pick one that reminds you of the quantity — n for number, c for cost.' },
      },
    ],
    keywords: ['word', 'problem', 'story', 'let', 'equation'],
  },
}

/** Which languages have a full explanation and worked example for a topic. */
export function tutorLanguages(topicId: TopicId): ('en' | 'hi' | 'gu')[] {
  const block = TUTOR[topicId]
  const langs: ('en' | 'hi' | 'gu')[] = ['en']
  if (block.simple.hi && block.simple.gu && block.exampleSteps.every((s) => s.hi && s.gu)) langs.push('hi', 'gu')
  else if (block.simple.hi) langs.push('hi')
  return langs
}

export function questionsLanguages(topicId: TopicId): ('en' | 'hi' | 'gu')[] {
  const questions = [...PRACTICE_QUESTIONS_FOR(topicId)]
  const langs: ('en' | 'hi' | 'gu')[] = ['en']
  if (questions.length && questions.every((q) => q.prompt.hi && q.explanation.hi)) langs.push('hi')
  if (questions.length && questions.every((q) => q.prompt.gu && q.explanation.gu)) langs.push('gu')
  return langs
}

// imported late to avoid a circular import at module top level
import { PRACTICE_QUESTIONS } from './curriculum'
function PRACTICE_QUESTIONS_FOR(topicId: TopicId) {
  return PRACTICE_QUESTIONS.filter((q) => q.topicId === topicId)
}
