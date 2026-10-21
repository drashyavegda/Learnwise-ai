# LearnWise AI

**Every student learns differently. Now, learning does too.**

An interactive adaptive-learning prototype for Indian students in Classes 6–10, built for **Code Kernel '26**. It is not a landing page mockup: you can take a diagnostic, get real results, be taught, practise with rule-based difficulty, watch a learning path unlock, and then look at the same evidence from a teacher's and a parent's point of view.

Sample student: **Aarav Sharma, Class 8-B, Mathematics** — fictional. All teacher and parent records are fictional too.

---

## 1. Quick start

```bash
cd learnwise-ai
npm install          # installs React, Vite, Tailwind, lucide-react, Recharts, fonts
npm run dev          # http://localhost:5173
```

Requirements: Node 18+ (tested on Node 20) and npm. No API key, no paid service, no database needed.

Other commands:

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on `0.0.0.0:5173` (works from a phone on the same network) |
| `npm run build` | Type-checks (`tsc -b`) then builds to `dist/` |
| `npm run preview` | Serves the production build on `:4173` — use this to test the service worker |
| `npm run typecheck` | TypeScript only |
| `npm run server` | Optional AI endpoint on `127.0.0.1:8787` (see §5) |

---

## 2. The five-minute demo route

Open `/student` and follow this order. Every step writes to the same local record, so the story carries forward.

| # | Screen | Route | What to look for |
| --- | --- | --- | --- |
| 1 | Student dashboard | `/student` | Points, streak, current level, the recommended next activity and *why* |
| 2 | Diagnostic | `/student/assessment` | 8 MCQs. Deliberately answer the two fraction questions wrong |
| 3 | Results | `/student/results` | Score computed from those answers, topic breakdown, flagged concepts, every explanation |
| 4 | Tutor | `/student/tutor?topic=fractions` | The pizza model: why 1/2 + 1/3 = 5/6. Demo-mode label, language switch |
| 5 | Practice | `/student/practice?topic=fractions` | 6 questions, hints, and the adaptation line after every answer |
| 6 | Learning path | `/student/path` | Fractions sits below 60%, so later topics stay locked with the reason shown |
| 7 | Teacher | `/teacher` | Class mastery, students needing support, misconceptions, drill builder, lesson plan |
| 8 | Parent | `/parent` | Plain-language summary, home-support ideas, privacy note |

**Reset between runs:** sidebar → *Reset demo data*, or the *Reset demo* dialog. It restores Aarav to his starting state (15 points from one completed lesson, no attempts).

---

## 3. What is genuinely implemented

- **Adaptive engine (rules, not a model).** `src/lib/adapt.ts` holds every decision: two correct answers in a row without a hint → level up (cap 3); a correct answer with a hint → hold; two wrong answers in a row → step back one level and re-explain; Level 3 accuracy → topic marked mastered. Each decision returns a bilingual `reason` string that the UI shows.
- **Real scoring.** `scoreAssessment()` and topic mastery are computed from the answers actually chosen. Nothing is random, nothing is seeded per-session.
- **Learning path with real prerequisites.** A topic opens when its prerequisite reaches 60% (`UNLOCK_THRESHOLD`). Locked rows name the prerequisite and its score.
- **Points and badges that cannot be farmed.** Points are awarded once per first-correct answer, guarded by the attempt history; badges have visible unlock rules; streaks count distinct active days.
- **Multilingual UI.** English, Hindi and Gujarati. The selector changes navigation, page headings, question prompts, hints, explanations and feedback — not just the label. Coverage is stated per topic on the tutor page and in the language table, because word problems are English-only in this build.
- **Teacher analytics from real data.** `analyseClass()` merges 23 fictional peers with Aarav's live scores. Topic averages, "below 60%" counts, risk ordering and misconceptions all derive from that record. A topic Aarav has not answered shows `—`, not 0%, so unassessed work is never reported as failure.
- **Offline-ready shell and lessons.** A service worker (production only) caches the app shell; lessons and their questions can be saved for offline reading; answers written while offline queue locally and flush with a "simulated sync" message.
- **Persistence.** One versioned `localStorage` key (`learnwise.demo.v1`) that survives refresh, with export, raw inspection and deletion on `/parent/privacy`.

## 4. What is simulated — and labelled as such

| Area | Reality |
| --- | --- |
| Tutor answers | A predefined, hand-written content pack (`src/data/tutor.ts`, `src/lib/tutor.ts`). The UI says *demo mode · no model connected*. |
| The 23 classmates | Fixed sample records. Only Aarav's numbers are live, and only in this browser. |
| Revision reminders | Dates are stored locally and shown in-app. No push, email or SMS is sent. |
| Offline sync | Queued progress is written to local state. There is no server to sync with. |
| Lesson plans / activities | A fixed four-part template scaled to chosen minutes. No model is called. |
| Live AI | Only when you configure the optional server in §5. Until then `aiMode` is `demo` and the badge says so. |

Nothing in the app claims a statistic, school, pilot, partner or accuracy figure that does not exist.

---

## 5. Optional live AI (server-side key only)

Demo mode is the default and needs nothing. To enable a real model:

```bash
cp .env.example .env          # then fill in LEARNWISE_AI_KEY
set -a && . ./.env && set +a  # export it for the server process only
npm run server                # http://127.0.0.1:8787
npm run dev                   # Vite proxies /api/* to the server
```

Then start the client with the live flag exported so the app stops labelling itself as demo:

```bash
VITE_ENABLE_AI=true npm run dev
```

- `POST /api/tutor` — `{ topicId, lang, question }` → `{ answer, source: 'live-model' }`
- `POST /api/generate-question` — `{ topicId, level, concept }` → a validated question, or `422` with reasons
- `GET /api/health` — reports whether a key is configured

Rules the server enforces:

1. The key lives only in `LEARNWISE_AI_KEY` on the server; it is never sent to the browser and never committed.
2. Generated questions are validated in `server/lib/questionValidator.mjs` (four unique options, one valid correct index, known concept, level match, length and HTML checks). An invalid question is rejected — the app keeps the verified bank question instead.
3. Rate limiting, a 20-second upstream timeout, and a 8 KB request cap.
4. With no key every AI route answers `503 ai-not-configured` and the client stays in demo mode.

---

## 6. Accessibility, low-data mode and languages

- Semantic landmarks, `role="radiogroup"`/`role="radio"` on quiz options, `aria-checked`, labelled progress bars, visible focus states, 44px touch targets on the main actions, and body copy at 12–15px with AA-contrast navy/teal pairings.
- **Low-data mode** (top bar) removes chart animation and heavy transitions for slow connections.
- **Languages:** English, हिन्दी, ગુજરાતી. Explanations cover fractions, variables and equations in all three; simplifying is EN+HI; word problems are EN-only. `/student/tutor` shows this coverage in a table rather than implying full parity.

---

## 7. Project structure

```
learnwise-ai/
├── index.html
├── package.json                 # scripts: dev, build, preview, server, typecheck
├── vite.config.ts               # host 0.0.0.0, /api proxy to :8787, allowedHosts
├── tailwind.config.js           # navy/teal/violet tokens, shadows, fonts
├── public/
│   ├── logo.svg  manifest.webmanifest  offline.html
│   └── sw.js                    # app-shell cache; never caches /api
├── server/
│   ├── index.mjs                # optional AI endpoint, key stays here
│   └── lib/questionValidator.mjs
├── src/
│   ├── App.tsx                  # routes + lazy pages + 404
│   ├── main.tsx                 # entry, registers sw.js in production only
│   ├── index.css                # design tokens and utilities
│   ├── components/              # Layout, ui kit, Charts, DemoControls, ThemeCycle
│   ├── data/                    # curriculum + questions, tutor pack, seed records
│   ├── lib/                     # adapt (rules), store (state+persistence), i18n, tutor
│   └── pages/                   # Landing, StudentDashboard, Assessment, Results, Tutor,
│                                # Practice, LearningPath, Revision, Lessons, Achievements,
│                                # Teacher, Planner, Insights, Parent, Privacy, About
└── demo-video/                  # script, storyboard, shot list, voiceover, captions, how to record
```

Data flow: pages call `useApp()` → `src/lib/store.tsx` writes the versioned record to `localStorage` → mastery, path status, recommendations and badges are **derived** from `Attempt[]` on every read, so they can never drift from the evidence.

---

## 8. Demo video

`demo-video/learnwise-ai-demo.mp4` is a real 2:59 recording of this app (H.264 1280×720, AAC narration, burned-in English captions), made from a scripted browser session — see `demo-video/README-video.md` for how it was produced and what is honest to say about it. `demo-video/` also holds the script, storyboard, shot list, voiceover script, captions and recording instructions.

## 9. Testing performed

Manual and scripted checks run against the dev build (Chromium, 1440×940 and 390×844):

- `npm run build` — type-check plus production bundle, no errors.
- Full student flow: dashboard → diagnostic (8 answers) → results (score matched the answers chosen) → practice (6 answers, session recorded) → path → revision.
- Teacher: all four tabs, class table search/filter/sort, revision suggestion to Aarav, drill copy, plan generation.
- Parent and privacy pages, including raw JSON inspection and delete-and-reset.
- Language switch EN → HI → GU on tutor, dashboard, practice and path; question text and explanations changed, coverage table unchanged in meaning.
- Refresh persistence (points and attempts identical after reload) and demo reset (back to starting state).
- Mobile layout at 390×844 for dashboard, quiz, practice, teacher.
- Console: zero errors and zero unhandled promise rejections across every route.

Known gaps: no automated test suite is included; the browser checks above were run manually/with a throwaway script.

## 10. Limitations (stated plainly)

1. One subject (Class 8 Mathematics), one class, five topics. Other subjects are marked "later".
2. No accounts, no server database, no multi-device sync. Clearing site data removes the record.
3. Tutor answers are predefined unless §5 is configured; the live path is optional and untested against a specific vendor.
4. Language coverage is partial by design (see the table on the tutor page); some descriptive sentences on teacher/parent pages remain in English.
5. Offline covers the app shell, saved lessons and local progress — **not** cloud tutoring.
6. Revision scheduling is in-app only; there are no notifications.
7. Teacher risk scores and plans are decision aids, never decisions.
8. The demo video is genuine but its narration is synthesized, scene 9 is played 1.18× faster to fit its 15-second window, and the cursor is an injected dot. Re-record a human voice with `demo-video/recording-instructions.md` if you want a studio version.

## 11. Credits

Built for **Code Kernel '26** by team X-Kernel. Libraries: React, Vite, TypeScript, Tailwind CSS, lucide-react, Recharts. Fonts: Inter, Noto Sans Devanagari, Noto Sans Gujarati (self-hosted via Fontsource).
