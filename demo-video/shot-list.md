# Shot list — LearnWise AI demo

33 shots, 3:00 total. Record at 1280×720 (or 1920×1080), 30fps, cursor visible, no browser chrome.
Each shot names the route, the action, and what must be readable in the frame.

| # | In | Out | Route | Action (exact) | Must be readable | Cut |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 0:00.0 | 0:02.5 | `/` | Hold on hero | "Learning that adapts to every student." | hold |
| 2 | 0:02.5 | 0:06.0 | `/` | Slow scroll 120px | nav, Code Kernel '26 pill | smooth |
| 3 | 0:06.0 | 0:10.0 | `/` | Scroll 120px more | mock student card (62% / level) | smooth |
| 4 | 0:10.0 | 0:15.0 | `/` | Hold, cursor to "Start learning" | both hero buttons | cut |
| 5 | 0:15.0 | 0:20.0 | `/` | Scroll to comparison | "Same lesson for everyone" | hold |
| 6 | 0:20.0 | 0:26.0 | `/` | Hold on comparison | "Next step from evidence" | cut |
| 7 | 0:26.0 | 0:31.0 | `/` | Scroll to five-step cycle | diagnostic → teach → practise | smooth |
| 8 | 0:31.0 | 0:35.0 | `/` | Hold, cursor over "Start learning" | CTA | click |
| 9 | 0:35.0 | 0:40.0 | `/student` | Land on dashboard | "Hello, Aarav", Class 8-B | hold |
| 10 | 0:40.0 | 0:45.0 | `/student` | Hover points → streak → level tiles | 15 points · 3-day streak · Level 1 | smooth |
| 11 | 0:45.0 | 0:50.0 | `/student` | Click "Why this?" | the three numbered rules | hold |
| 12 | 0:50.0 | 0:55.0 | `/student` | Cursor to "Start diagnostic" | recommendation card | click |
| 13 | 0:55.0 | 1:00.0 | `/student/assessment` | Land on intro | "8 questions", honesty callouts | hold |
| 14 | 1:00.0 | 1:04.0 | `/student/assessment` | Click "Begin diagnostic" | Question 1 of 8 | cut |
| 15 | 1:04.0 | 1:09.0 | `/student/assessment` | Answer Q1 correctly, Next | option states | smooth |
| 16 | 1:09.0 | 1:13.0 | `/student/assessment` | Answer fraction Q wrong, Next | "answered" counter rises | smooth |
| 17 | 1:13.0 | 1:17.0 | `/student/assessment` | Answer second fraction Q wrong, Next | 8 of 8 answered | smooth |
| 18 | 1:17.0 | 1:20.0 | `/student/assessment` | Click "Submit diagnostic" | submit button | cut |
| 19 | 1:20.0 | 1:25.0 | `/student/results` | Land, hold on ring | "3 of 8 correct · 38%" | hold |
| 20 | 1:25.0 | 1:28.0 | `/student/results` | Cursor to flagged concept | "adding and subtracting fractions" | cut |
| 21 | 1:28.0 | 1:33.0 | `/student/practice?topic=fractions` | Answer one question, Check answer | adaptation line | hold |
| 22 | 1:33.0 | 1:36.0 | `/student/practice?topic=fractions` | Cursor on adaptation sentence | "Adaptation: …" | cut |
| 23 | 1:36.0 | 1:41.0 | `/student/tutor?topic=fractions` | Scroll to pizza model | 1/2 + 1/3 = 5/6 diagram | hold |
| 24 | 1:41.0 | 1:45.0 | `/student/tutor?topic=fractions` | Cursor along the four worked steps | "6 equal slices" | cut |
| 25 | 1:45.0 | 1:50.0 | `/student/path` | Land, hold on Fractions row | "needs practice · 38%" | hold |
| 26 | 1:50.0 | 1:56.0 | `/student/path` | Slow scroll to Variables | "Locked — needs 60% in fractions" | smooth |
| 27 | 1:56.0 | 2:00.0 | `/student/path` | Hover locked node, then continue to Advanced problems | all five nodes | cut |
| 28 | 2:00.0 | 2:05.0 | `/student/path` | Click the open Fractions topic | "Learn / Practise" links | cut |
| 29 | 2:05.0 | 2:11.0 | `/teacher` | Switch role, land on overview | "24 students · sample data" | hold |
| 30 | 2:11.0 | 2:16.0 | `/teacher` | Hover bars → donut → support list | 62% fractions · 4/11/9 | smooth |
| 31 | 2:16.0 | 2:21.0 | `/teacher` + Students tab | Point at Aarav's row | dash in unassessed cells | hold |
| 32 | 2:21.0 | 2:25.0 | `/teacher` + Lesson plan tab | Show four blocks | "draft, not assigned" | cut |
| 33 | 2:25.0 | 2:30.0 | `/teacher` | Hold on the suggestion callout | "Suggestions only" | cut |
| 34 | 2:30.0 | 2:34.0 | `/student/tutor?topic=fractions` | Open language menu → हिन्दी | heading turns Hindi | hold |
| 35 | 2:34.0 | 2:38.0 | `/student/tutor?topic=fractions` | Scroll to coverage table | EN / हिन्दी / ગુજરાતી columns | smooth |
| 36 | 2:38.0 | 2:42.0 | `/student/tutor?topic=fractions` | Toggle low-data mode | toggle state change | cut |
| 37 | 2:42.0 | 2:45.0 | `/student/lessons` | Show a saved lesson chip | "Saved offline" | cut |
| 38 | 2:45.0 | 2:50.0 | `/about` | Scroll to real-vs-simulated pair | both columns | smooth |
| 39 | 2:50.0 | 2:55.0 | `/about` | Scroll to the message line | central message | cut |
| 40 | 2:55.0 | 3:00.0 | `/` | Cut to hero, hold, fade | logo + tagline | fade out |

> Shots 1–40 are listed for a 30fps editor; several are holds that can be merged. If you record live in one pass, follow `demo-script.md` instead — the shot list is the edit plan, not the click order.

## Recording checklist per shot

- [ ] Cursor parked away from text you want read
- [ ] No toast overlays mid-shot (wait for toasts to fade, or reset first)
- [ ] Language is English except shot 34–35
- [ ] Low-data mode off until shot 36
- [ ] Demo data reset at the start of every full take
- [ ] Frame contains the route's primary heading (proof of which screen it is)
