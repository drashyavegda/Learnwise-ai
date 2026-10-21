# Demo video — what is actually in this folder

## The file

| Property | Value |
| --- | --- |
| File | `learnwise-ai-demo.mp4` |
| Length | 2 min 59.9 s |
| Picture | H.264, 1280×720, 30 fps, yuv420p, ~388 kbps |
| Sound | AAC 48 kHz stereo, −16 LUFS, synthesized narration |
| Size | 8.4 MB |
| Captions | Burned in from `captions.srt` (36 cues, English) |

It was recorded from the running app in this repository — not from slides, not from mockups. Open it and you will see the real diagnostic being answered, the real score that follows, the real adaptation line, the real roadmap, the live teacher dashboard and the real Hindi switch.

## How it was made

1. `npm run dev` on `http://localhost:5173`, fresh demo data.
2. A scripted headless Chromium session (`playwright-core`, supplied by the build environment) rendered each of the nine scenes at 1280×720 and recorded them separately, with a small injected cursor dot so the pointer is visible in the frame.
3. Each scene clip was cut to its exact scripted length (15 / 20 / 20 / 25 / 25 / 20 / 25 / 15 / 15 s) and concatenated to exactly 180 s.
4. Narration was synthesized per scene from `voiceover.md`, placed at each scene's start, and normalised to −16 LUFS. Scene 9 was sped up 1.18× to fit its 15-second window; every other scene plays at natural pace.
5. `captions.srt` was burned in with libass, then the file was encoded to H.264 + AAC with a fast-start index.

Scene-to-runtime map (verified against the finished file):

| Scene | Window | Content |
| --- | --- | --- |
| 1 | 0:00–0:15 | Landing hero, "Learning that adapts to every student." |
| 2 | 0:15–0:35 | Fixed-pace vs adaptive comparison, adaptive cycle |
| 3 | 0:35–0:55 | Aarav's dashboard, "Why this?" rule panel |
| 4 | 0:55–1:20 | Diagnostic: 8 questions, two fraction answers deliberately wrong, submit |
| 5 | 1:20–1:45 | Results (3 of 8), practice adaptation line, pizza model 1/2 + 1/3 = 5/6 |
| 6 | 1:45–2:05 | Learning path with locked prerequisites |
| 7 | 2:05–2:30 | Teacher overview → Students → Lesson plan |
| 8 | 2:30–2:45 | Hindi switch, language coverage table, low-data mode |
| 9 | 2:45–3:00 | Real vs simulated, central message |

## Honest notes about this recording

- **The narration is synthesized, not a human voice.** The script in `voiceover.md` is the intended human read; if a team member records it, remux their audio over the video — the cut points do not change.
- **The app was in demo mode.** No model was called at any point, and the video does not claim otherwise; the "Demo mode · no model connected" label is visible in scene 8.
- **Aarav and the 23 classmates are fictional.** The "Sample data" pill is on screen throughout the teacher section.
- **One take per scene, no cuts inside a scene.** Whatever the app did live is what you see — including the point where the diagnostic's answered-pips fill in.
- **No performance claims appear on screen or in the voiceover.** There are no invented statistics, schools or accuracy figures.
- **The cursor is an injected dot**, because headless Chromium does not record the system pointer. It is a real indicator of where the scripted click landed, not a decoration.
- **Re-recording is easy.** The steps in `recording-instructions.md` reproduce this exactly; only the browser version and font rendering may differ by a pixel or two.

## Files in this folder

| File | Purpose |
| --- | --- |
| `learnwise-ai-demo.mp4` | The finished 3-minute video |
| `captions.srt` | Sidecar captions, identical to the burned-in track |
| `demo-script.md` | Master script: scenes, actions, on-screen text, timings |
| `storyboard.md` | Nine ASCII wireframes with the visual system |
| `shot-list.md` | Shot-by-shot edit plan with routes and cut points |
| `voiceover.md` | Word-counted narration script and delivery notes |
| `recording-instructions.md` | Install → reset → record → export → caption → final checks |
