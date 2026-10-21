# Recording instructions — LearnWise AI demo video

Two ways to get the 3-minute video:

- **Path A — record it from this repo (recommended).** If you have a browser and a screen recorder, you can produce the video without any other asset.
- **Path B — slide-based fallback.** If screen capture is not available, build the same nine scenes from the wireframes in `storyboard.md`.

> **Status of the committed MP4:** see `README-video.md` in this folder. No video file is committed unless a real recording was actually produced and played back — the repo does not ship a fabricated one.

---

## 1. Install and start

```bash
cd learnwise-ai
node -v            # 18 or newer
npm install
npm run dev        # http://localhost:5173
```

Open **http://localhost:5173** (not the Vite network IP) so every route and asset is same-origin.

If the port is taken, Vite prints the real one — use exactly that URL.

## 2. Prepare the browser

1. Chrome or Edge, one window, **1920×1080** display or **1280×720** capture area.
2. Hide the bookmarks bar (`Ctrl/Cmd+Shift+B`), close DevTools, close other tabs.
3. Zoom 100% (`Ctrl/Cmd+0`). Hide the OS dock/taskbar if it overlaps the frame.
4. Turn on Do Not Disturb.
5. Set the recorder to capture the **browser window**, 30fps, system audio off (narration is recorded separately).

## 3. Reset the demo data

Sidebar → **Reset demo data** → confirm. Aarav returns to:
- 15 points (from the one lesson he finished), 3-day streak, Level 1
- no attempts, no practice sessions, no revisions due
- one badge (Steady learner), one saved lesson

If the sidebar is collapsed on a small window, open the page at `/student` and use the same button in the mobile drawer. Resetting before every full take keeps the numbers in the voiceover correct: the demo mentions **3 of 8 correct** after the diagnostic, which only holds from a clean start.

## 4. Run the sequence

Follow `demo-script.md` scene by scene. Short version:

1. Landing — hero, comparison, adaptive cycle → **Start learning**
2. Dashboard — hover tiles, open **Why this?**
3. **Start diagnostic** → answer 8, getting the two fraction questions wrong → **Submit**
4. Results → **Start practice** → answer one question, pause on the adaptation line
5. Tutor → scroll to the pizza model
6. Learning path → scroll, hover a locked topic
7. Switch role to **Teacher** → overview → Students tab → Lesson plan tab
8. Tutor → language → हिन्दी → coverage table → low-data toggle
9. About → real vs simulated → cut back to the hero

**Tip:** the toast notifications fade after a few seconds. If a toast lands while you are reading a score, pause for two seconds and continue — the edit can hide the gap.

## 5. Capture screen and microphone

**macOS — QuickTime:** File → New Screen Recording → record selected portion → after recording, choose *Show Movie Inspector* and confirm 30fps. Record narration separately in Voice Memos to keep audio clean.

**macOS / Windows — OBS (better):**
- Sources: *Display Capture* (or Window Capture) + *Audio Input Capture* (mic).
- Output: 1920×1080, 30fps, CQP 20, MP4 (or MKV, remux to MP4 after).
- Audio: 48kHz, −12 dB peaks, apply a noise gate only if the room is noisy.

**Windows — Xbox Game Bar** works in a pinch (`Win+G`), but it cannot capture a single window cleanly; prefer OBS.

**Linux:** `wf-recorder` or OBS with PipeWire; check that fonts for Devanagari and Gujarati are installed, or the Hindi/Gujarati scene renders as boxes.

## 6. Export an MP4

If you recorded MKV or a PNG sequence:

```bash
# remux without re-encoding (fast, no quality loss)
ffmpeg -i capture.mkv -c copy learnwise-ai-demo.mp4

# if you have separate narration, mux it (keep video length, pad/trim audio to 180s)
ffmpeg -i capture.mp4 -i narration.wav \
  -filter_complex "[1:a]apad,atrim=0:180[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 160k learnwise-ai-demo.mp4

# normalise loudness for judges on laptop speakers
ffmpeg -i learnwise-ai-demo.mp4 -af loudnorm=I=-16:TP=-1.5:LRA=11 -c:v copy final.mp4
```

Target: H.264, yuv420p, 1280×720 or 1920×1080, 30fps, AAC 160kbps, under 60 MB.

## 7. Captions

`captions.srt` is timed to the script (36 cues, 0:00–3:00). Attach it as a sidecar file, or burn it in:

```bash
ffmpeg -i final.mp4 -vf "subtitles=captions.srt:force_style='FontName=Inter,FontSize=20,PrimaryColour=&HFFFFFF,BackColour=&H990A1730,BorderStyle=4,MarginV=40'" \
  -c:a copy learnwise-ai-demo-captioned.mp4
```

If your take drifts from the script, re-time in HandBrake/Subtitle Edit rather than rewriting the cues. Keep captions inside the bottom 15% so they never cover the score ring or the adaptation line.

## 8. Final error check before submitting

- [ ] The video is exactly 3:00 ±5s and plays start to finish in VLC **and** in a browser
- [ ] Audio is audible on laptop speakers at 50% volume; no clipping, no room echo
- [ ] Every score on screen matches the voiceover ("three of eight")
- [ ] Captions match the spoken words, including "5/6" and "60 percent"
- [ ] No personal data on screen: no real names, no tabs, no email notifications, no file paths
- [ ] The words "sample data", "demo mode" or "suggestions only" are visible at least once in scenes 3, 7 and 9
- [ ] No claim of live AI unless `VITE_ENABLE_AI=true` was genuinely running
- [ ] File name: `demo-video/learnwise-ai-demo.mp4`
- [ ] A copy of `captions.srt` sits next to it

## 9. If recording is impossible

Do not invent a video. Instead submit:

1. `demo-script.md` + `storyboard.md` + `shot-list.md` + `voiceover.md` + `captions.srt` (all in this folder).
2. A slide deck built from the nine frames in `storyboard.md`.
3. A live 3-minute walkthrough at the judging table, following `demo-script.md`.

State plainly in the submission that no MP4 was produced and why. A honest gap costs less than a fabricated demo.
