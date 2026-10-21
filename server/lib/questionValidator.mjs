/**
 * Validation for model-generated questions.
 *
 * Rule: a generated question is never shown to a student unless it passes every
 * check here. If validation fails we return an error and the client keeps the
 * verified predefined question instead. Nothing is "fixed up" silently.
 */

const LEVELS = [1, 2, 3]

/** Concepts the app actually teaches. A generated question must map to one. */
export const KNOWN_CONCEPTS = new Set([
  'add-subtract-fractions',
  'equivalent-fractions',
  'fraction-reasoning',
  'variable-meaning',
  'substitution',
  'expressions',
  'like-terms',
  'brackets',
  'one-step-equations',
  'two-step-equations',
  'modelling',
])

const HTML = /<\s*\/?\s*[a-z][^>]*>/i

/**
 * @param {unknown} raw
 * @returns {{ ok: true, value: object } | { ok: false, errors: string[] }}
 */
export function validateQuestion(raw, { topicId, level } = {}) {
  const errors = []

  if (!raw || typeof raw !== 'object') {
    return { ok: false, errors: ['response was not a JSON object'] }
  }
  const q = /** @type {Record<string, unknown>} */ (raw)

  const prompt = typeof q.prompt === 'string' ? q.prompt.trim() : ''
  if (prompt.length < 8) errors.push('prompt is too short')
  if (prompt.length > 240) errors.push('prompt is longer than 240 characters')
  if (HTML.test(prompt)) errors.push('prompt contains HTML')
  if (prompt.includes('```')) errors.push('prompt contains a code fence')

  const options = Array.isArray(q.options) ? q.options : []
  if (options.length !== 4) errors.push('exactly four options are required')
  const cleanOptions = options.map((o) => (typeof o === 'string' ? o.trim() : ''))
  if (cleanOptions.some((o) => o.length === 0)) errors.push('an option is empty')
  if (cleanOptions.some((o) => o.length > 60)) errors.push('an option is longer than 60 characters')
  if (new Set(cleanOptions).size !== cleanOptions.length) errors.push('options are not unique')

  const correct = Number(q.correct)
  if (!Number.isInteger(correct) || correct < 0 || correct > 3) {
    errors.push('correct index must be 0-3')
  }

  const nudgeCorrect = Number(q.correct)
  if (cleanOptions.length === 4 && Number.isInteger(nudgeCorrect)) {
    const distractorLooksRight = cleanOptions.filter(
      (o, i) => i !== nudgeCorrect && /^x\s*=/.test(o) && o === cleanOptions[nudgeCorrect],
    )
    if (distractorLooksRight.length) errors.push('a distractor repeats the correct answer')
  }

  const concept = typeof q.concept === 'string' ? q.concept.trim() : ''
  if (!KNOWN_CONCEPTS.has(concept)) errors.push(`unknown concept "${concept}"`)

  const qLevel = Number(q.level)
  if (!LEVELS.includes(qLevel)) errors.push('level must be 1, 2 or 3')
  if (level && qLevel !== Number(level)) errors.push('level does not match the requested level')
  if (topicId && q.topicId && q.topicId !== topicId) errors.push('topic does not match the requested topic')

  const hint = typeof q.hint === 'string' ? q.hint.trim() : ''
  if (hint.length < 6 || hint.length > 200) errors.push('hint must be 6-200 characters')

  const explanation = typeof q.explanation === 'string' ? q.explanation.trim() : ''
  if (explanation.length < 10 || explanation.length > 320) errors.push('explanation must be 10-320 characters')

  if (errors.length) return { ok: false, errors }

  return {
    ok: true,
    value: {
      id: `gen-${Date.now().toString(36)}`,
      topicId: topicId || q.topicId,
      level: qLevel,
      concept,
      prompt,
      options: cleanOptions,
      correct,
      hint,
      explanation,
      generated: true,
      // Provenance is carried into the UI so a student can see this came from a model.
      source: 'live-model',
    },
  }
}

/**
 * Light sanity check for a plain arithmetic answer: catches the most common
 * model slip where the stated answer is not one of the options.
 */
export function answerIsPresent(question) {
  if (!question || !Array.isArray(question.options)) return false
  return Boolean(question.options[question.correct])
}
