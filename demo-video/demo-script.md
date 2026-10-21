# LearnWise AI — demo script (3:00)

**Format:** screen recording of the running app, 1280×720 (or 1920×1080), plus voiceover.
**Audience:** judges at Code Kernel '26 who will not read the code.
**Tone:** calm, specific, honest. No performance claims, no invented numbers, no "revolutionary".

**Before recording**

1. `npm run dev` → open `http://localhost:5173`
2. Reset demo data (sidebar → *Reset demo data*) so Aarav is at his starting state.
3. Language: English. Low-data mode: off. Browser zoom 100%.
4. Close other tabs; hide the bookmarks bar; turn off notifications.
5. Keep the mouse slow. One action per beat.

**Golden rule for the voiceover:** every sentence must be true of what is on screen at that moment. If a capability is simulated, the words say so.

---

## Scene 1 — Opening (0:00 – 0:15) · 15s

- **Screen:** Landing page, hero visible.
- **Action:** none for 4 seconds, then a slow scroll of 200px as the voiceover lands the headline.
- **On-screen text:** "Learning that adapts to every student." / "Classes 6–10 · Mathematics"
- **Voiceover:** "Every student in a Class 8 classroom is at a different place in the same chapter. LearnWise AI adapts to where each one actually is — and shows the teacher what that looks like."
- **Transition:** straight cut to the comparison section.

## Scene 2 — The problem (0:15 – 0:35) · 20s

- **Screen:** "Fixed pace vs adaptive" comparison on the landing page, then the adaptive-cycle diagram.
- **Action:** scroll to the comparison; hold on the two columns; scroll to the five-step cycle.
- **On-screen text:** "Same lesson for everyone" / "Next step chosen from evidence"
- **Voiceover:** "A fixed lesson moves on at one speed. Adaptive learning uses the answers a student just gave to choose the next question. Diagnostic, teach, practise, adjust, repeat. In this prototype those choices come from written rules — not a black box."
- **Transition:** click "Start learning".

## Scene 3 — Student dashboard (0:35 – 0:55) · 20s

- **Screen:** `/student` — Aarav's dashboard.
- **Action:** hover the points, streak and level tiles; open "Why this?" under the recommendation.
- **On-screen text:** "Aarav Sharma · Class 8-B" / "Recommended next: Start your diagnostic" / "Why this?"
- **Voiceover:** "This is Aarav, a sample Class 8 student — not a real child. His dashboard shows points, a streak, his current level and one recommended next step. The 'why this?' panel shows the rule that produced it."
- **Transition:** cut to the diagnostic.

## Scene 4 — Diagnostic (0:55 – 1:20) · 25s

- **Screen:** `/student/assessment`.
- **Action:** click "Begin diagnostic". Answer question 1. Answer the two fraction questions **incorrectly on purpose** (the app tells you this is fine for a demo). Move with *Next*, use the question pips once. Submit.
- **On-screen text:** "8 questions · no pass or fail" / "Answering these wrong on purpose"
- **Voiceover:** "Eight questions on fractions, variables and equations. To show the adaptivity, I am going to get the fraction questions wrong on purpose. Nothing is timed, and the score that follows is calculated only from the answers I actually chose."
- **Transition:** submit → results.

## Scene 5 — Personalisation (1:20 – 1:45) · 25s

- **Screen:** `/student/results` → brief cut to `/student/practice?topic=fractions` → `/student/tutor?topic=fractions`.
- **Action:** results: point at the score ring and the flagged concept. Practice: answer one question, then stop on the adaptation line. Tutor: show the pizza model.
- **On-screen text:** "3 of 8 correct · flagged: adding and subtracting fractions" / "Adaptation: …" / "1/2 + 1/3 = 5/6"
- **Voiceover:** "The result is computed from those answers, and fractions is flagged as the gap. Practice starts there. Every answer produces a visible adaptation line. And the tutor explains the same idea with a pizza — why one half plus one third is five sixths, not two fifths."
- **Transition:** cut to the learning path.

## Scene 6 — Learning path (1:45 – 2:05) · 20s

- **Screen:** `/student/path`.
- **Action:** scroll the roadmap slowly from Fractions to Word problems; hover a locked node to show the prerequisite line; click the open topic.
- **On-screen text:** "Fractions · needs practice" / "Locked — needs 60% in fractions"
- **Voiceover:** "The path enforces prerequisites. Fractions is below sixty percent, so the later topics stay locked and say why. That is how a gap gets closed instead of carried forward."
- **Transition:** switch role to Teacher.

## Scene 7 — Teacher (2:05 – 2:30) · 25s

- **Screen:** `/teacher`, then the *Students* tab and *Lesson plan* tab.
- **Action:** show class average, fractions donut, "needs support" list. Open Students, point at Aarav's row (`—` where he has no evidence). Open Lesson plan and show the four blocks. Do not claim the class is real.
- **On-screen text:** "24 students · sample data" / "Suggestions only — the teacher decides."
- **Voiceover:** "The teacher sees the same evidence at class level: where the class is strong, who needs support, and which misconception is most common. Aarav's row shows a dash where he has not answered yet, so missing work is never counted as failure. Plans and activities are labelled suggestions — the teacher decides."
- **Transition:** cut to accessibility.

## Scene 8 — Accessibility and languages (2:30 – 2:45) · 15s

- **Screen:** `/student/tutor?topic=fractions` with the language selector, then the coverage table; low-data toggle in the top bar.
- **Action:** switch to हिन्दी (text and the explanation change), open the coverage table. Toggle low-data mode on. Briefly show the lessons page saved-offline label.
- **On-screen text:** "English · हिन्दी · ગુજરાતી" / "What is actually translated"
- **Voiceover:** "The language switch changes the interface and the teaching text, not just a label. The coverage table states exactly which topics are translated. Low-data mode trims animation, and saved lessons read offline — live tutoring does not."
- **Transition:** cut to closing.

## Scene 9 — Closing (2:45 – 3:00) · 15s

- **Screen:** `/about` (what is real vs simulated), then the landing page headline.
- **Action:** slow scroll of the "genuinely implemented / labelled stand-ins" pair, then cut to the hero.
- **On-screen text:** "LearnWise AI — Code Kernel '26" / "Every student learns differently. Now, learning does too."
- **Voiceover:** "LearnWise AI helps every student learn at their own pace while giving teachers better insight into how to support them. Rules over real answers, three languages, and an honest label on everything simulated. Built for Code Kernel '26."
- **Transition:** fade to the logo.

---

## Timing check

| Scene | Window | Length | Cumulative |
| --- | --- | --- | --- |
| 1 Opening | 0:00–0:15 | 15s | 0:15 |
| 2 Problem | 0:15–0:35 | 20s | 0:35 |
| 3 Student dashboard | 0:35–0:55 | 20s | 0:55 |
| 4 Assessment | 0:55–1:20 | 25s | 1:20 |
| 5 Personalisation | 1:20–1:45 | 25s | 1:45 |
| 6 Learning path | 1:45–2:05 | 20s | 2:05 |
| 7 Teacher | 2:05–2:30 | 25s | 2:30 |
| 8 Accessibility | 2:30–2:45 | 15s | 2:45 |
| 9 Closing | 2:45–3:00 | 15s | 3:00 |

## Words the voiceover must never say

"revolutionary", "AI-powered personalisation for every child", "improves results by X%", "used by N schools", "real-time AI tutor" (unless the live endpoint is genuinely running), "works offline" (for anything cloud-based), "guaranteed".
