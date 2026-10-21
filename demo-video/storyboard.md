# Storyboard — LearnWise AI (3:00)

Nine frames, one per scene. Each panel lists what is on screen, where the eye should go, and the motion that carries the cut. Frames are drawn as ASCII wireframes so they can be rebuilt in any editor (Figma, Keynote, slides).

---

## Frame 1 · 0:00–0:15 · "Learning that adapts to every student."

```
┌──────────────────────────────────────────────────────┐
│  ◉ LearnWise AI   Features  How it works  For teachers│  ← nav, static
├──────────────────────────────────────────────────────┤
│                                                      │
│  ● Code Kernel '26     Classes 6–10 · Mathematics    │
│                                                      │
│  LEARNING THAT ADAPTS                        ┌─────┐ │
│  TO EVERY STUDENT.                           │ A   │ │  ← product card
│  ─────────                                   │ 62% │ │    (mock UI,
│  Aarav, Class 8, gets a next step            │ ... │ │     not a photo)
│  chosen from his own answers.                └─────┘ │
│                                                      │
│  [ Start learning ]  [ Explore teacher dashboard ]   │
└──────────────────────────────────────────────────────┘
```

- **Eye path:** headline → green underline → the mock card.
- **Motion:** 200px scroll after the first sentence lands.
- **Colour:** navy type on off-white; one teal accent, one violet dot.

## Frame 2 · 0:15–0:35 · Fixed pace vs adaptive

```
┌───────────────────────────┬──────────────────────────┐
│ SAME LESSON FOR EVERYONE  │ NEXT STEP FROM EVIDENCE  │
│ ① ② ③ ④ ⑤ every student   │ answer → decide → move   │
│ moves together            │ (per student)            │
│         ✗                 │         ✓                │
└───────────────────────────┴──────────────────────────┘
        ↓ scroll
┌──────────────────────────────────────────────────────┐
│  diagnostic → teach → practise → adjust → repeat     │
│        (looping dotted arrow across five nodes)      │
└──────────────────────────────────────────────────────┘
```

- **Eye path:** left column, then right column, then the loop.
- **Motion:** scroll during the second sentence; stop with the loop centred.
- **Label on screen:** "Conceptual comparison — not a measured study."

## Frame 3 · 0:35–0:55 · Aarav's dashboard

```
┌──────────┬───────────────────────────────────────────┐
│ sidebar  │ Hello, Aarav                              │
│ Dashboard│ ┌───────────────────────────────────────┐ │
│ Diagnostic│ │ 15%  POINTS  STREAK  LEVEL  LESSONS   │ │
│ Tutor    │ │      empty until he answers           │ │
│ Practice │ └───────────────────────────────────────┘ │
│ Path     │ ┌ RECOMMENDED NEXT ──────┐ ┌ Revision ┐  │
│ Revision │ │ Start your diagnostic  │ │ due: —   │  │
│ Lessons  │ │ ▸ Why this?            │ └──────────┘  │
│ Badges   │ └────────────────────────┘               │
└──────────┴───────────────────────────────────────────┘
```

- **Action:** hover points → streak → level; click "Why this?" (opens the rule list).
- **Honesty beat:** the dark panel reads *"Take the diagnostic to start measuring this."*
- **Motion:** no camera moves; only the disclosure opening.

## Frame 4 · 0:55–1:20 · Diagnostic

```
┌──────────────────────────────────────────────────────┐
│  ▣ Diagnostic · 0 of 8 answered      Question 1 of 8 │
│  ▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░        │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Fractions   Level 1 · equivalent fractions       │ │
│ │ Which fraction is equivalent to 1/2?             │ │
│ │  [A 2/3]              [B 2/4]                    │ │
│ │  [C 3/5]              [D 1/4]                    │ │
│ │  💡 Hint (using a hint is recorded)              │ │
│ │  [ ← Back ]                           [ Next → ] │ │
│ └──────────────────────────────────────────────────┘ │
│  [1][2][3][4][5][6][7][8]   ← jump-to-question pips  │
└──────────────────────────────────────────────────────┘
```

- **Action:** click → Next ×3 with one deliberately wrong fraction answer → pips → Submit.
- **On-screen note:** a small caption reads *"answered wrong on purpose for this demo"*.
- **Motion:** cut on the click of Submit.

## Frame 5 · 1:20–1:45 · Personalisation

Three quick panels, same rhythm:

```
A · RESULTS                     B · PRACTICE                C · TUTOR
┌──────────────┐                ┌──────────────┐            ┌──────────────┐
│   ( 3/8 )    │                │ Which is …?  │            │  ◕ + ◔ = ◕   │
│ 38% ring     │  →             │ A  B  C  D   │   →        │  1/2  1/3  5/6│
│ flagged:     │                │ ✓ checked    │            │ pizza model  │
│  adding/sub  │                │ Adaptation:… │            │ 6 slices each│
└──────────────┘                └──────────────┘            └──────────────┘
```

- **Eye path:** ring → flagged chip → adaptation line → pizza.
- **Motion:** hard cuts, no transitions longer than 200ms.
- **Zoom:** 110% on the adaptation line and on the pizza, so text is legible on a phone screen.

## Frame 6 · 1:45–2:05 · Learning path

```
┌──────────────────────────────────────────────────────┐
│ ●─── Fractions            38%   [needs practice]     │
│ │                                                    │
│ ○─── Variables            —     🔒 needs 60% in frac │
│ │                                                    │
│ ○─── Algebraic expr.      —     🔒                    │
│ │                                                    │
│ ○─── Simple equations     —     🔒                    │
│ │                                                    │
│ ○─── Advanced problems    —     🔒                    │
└──────────────────────────────────────────────────────┘
```

- **Action:** slow vertical scroll; hover the first locked node to reveal the prerequisite score; click the open topic.
- **Motion:** the connector line draws as it scrolls (the page already animates width on progress bars).

## Frame 7 · 2:05–2:30 · Teacher

```
┌──────────┬───────────────────────────────────────────┐
│ sidebar  │ Class 8 B · Mathematics   24 students ·   │
│ Class    │                            sample data    │
│ overview │ [71% avg] [20 below 60%] [16 active] [62%]│
│ Planner  │ ┌ topic bars ─────────┐ ┌ fractions ────┐│
│ Insights │ │ Fractions   62%     │ │ donut 4/11/9  ││
│          │ │ Variables   72%     │ └───────────────┘│
│          │ │ …                   │ Top six by risk  │
│          │ └─────────────────────┘ ┌ students table ┐│
│          │                         │ Aarav  —  —    ││
└──────────┴─────────────────────────┴────────────────┘
```

- **Action:** pointer traces the bars → donut → support list → Students tab → Lesson plan tab.
- **Honesty beat:** the "Sample data" pill stays visible in every frame.

## Frame 8 · 2:30–2:45 · Accessibility and languages

```
┌──────────────────────────────────────────────────────┐
│ [EN English ▾]   [Low-data off]   Student Teacher …  │
│ ─────────────────────────────────────────────────── │
│  निजी शिक्षक                                          │
│  पूछो इस बारे में: भिन्न                                │
│  भिन्न किसी पूरी वस्तु का एक हिस्सा दिखाती है…          │
│                                                      │
│  LANGUAGE COVERAGE    EN   हिन्दी   ગુજરાતી             │
│  Fractions            ✓    ✓       ✓                 │
│  Word problems        ✓    —       —                 │
└──────────────────────────────────────────────────────┘
```

- **Action:** open the language menu → हिन्दी → the heading and explanation change → open the coverage table → toggle low-data on.
- **Motion:** one cut, no swooshes.

## Frame 9 · 2:45–3:00 · Closing

```
┌──────────────────────────────────────────────────────┐
│ GENUINELY IMPLEMENTED      LABELLED STAND-INS        │
│ ✓ adaptive rules           · predefined tutor        │
│ ✓ real scoring             · fictional classmates    │
│ ✓ 3 languages              · in-app reminders only   │
└──────────────────────────────────────────────────────┘
                 ↓ cut
┌──────────────────────────────────────────────────────┐
│        LEARNING THAT ADAPTS TO EVERY STUDENT.        │
│        ◉ LearnWise AI · Code Kernel '26              │
└──────────────────────────────────────────────────────┘
```

- **Motion:** 600ms fade to the logo, no end-card music swell.

---

## Visual system used in every frame

| Element | Value |
| --- | --- |
| Background | `#F6F8FC` app shell, `#FFFFFF` cards |
| Ink | `#0A1730` headings, `#5B6B8C` body |
| Accents | teal `#0FA98F`, violet `#6C4CF1`, amber `#E0A64B` |
| Type | Inter (UI), Noto Sans Devanagari / Gujarati for translated text |
| Radii | 12–18px cards, 999px pills |
| Caption band | bottom 12%, `#0A1730` at 78% opacity, white text 20px |
| Safe margins | 64px left/right, 48px bottom so captions never cover UI |
