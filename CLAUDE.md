# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

FitPulse: offline-first gym/fat-loss PWA. React 19 + TypeScript (strict) + Vite 6 + Tailwind CSS v4 (via `@tailwindcss/vite`, no config file) + `vite-plugin-pwa`. No backend: all persistence is `localStorage`. All user-facing text (UI strings, exercise data, type literal values) is in **Italian** — keep it that way.

## Commands

```bash
npm run dev       # vite --host (dev server on :5173, exposed on LAN for phone testing)
npm run build     # tsc -b && vite build  → dist/
npm run preview   # serve dist/ on :4173, exposed on LAN
npm run check:figures  # verifies every exercise animation (bone lengths constant, hands/feet reach their targets)
```

No test runner, linter, or formatter. Verification = `npm run check:figures` + `npm run build` (`tsc -b` with `noUnusedLocals`/`noUnusedParameters`). `check:figures` bundles `scripts/checkFigures.ts` with esbuild (a Vite dependency) and runs it with Node.

Deploy: `.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to `main` (repo `davideginna/pt`). It sets `BASE_PATH=/<repo>/`, read by `vite.config.ts` as Vite `base`; locally base is `/`. Never hardcode absolute asset paths — use paths Vite rewrites (index.html, imports, `public/`).

The app must be served over HTTP (not opened via `file://`), otherwise the service worker/scripts fail and the page is blank.

## Architecture

- **`src/App.tsx`** is the single state owner: active tab, routine list, active workout, selected exercise, builder modal, PWA install prompt, online/offline status. No router and no global state library — navigation is a `TabType` switch (`workout | exercises | timer | progress`) rendered by `Navbar`.
- **Active workout takes over the whole screen**: when `activeWorkout` is set, `App` returns `ActiveWorkoutView` instead of the tabbed layout. Finishing a workout calls `saveWorkoutHistory`, reloads routines and jumps to the `progress` tab. "Start single exercise" from the detail modal builds an ad-hoc `Routine` (`id: 'quick_<timestamp>'`) and reuses the same view.
- **Data layer** (`src/data/`) is static TS: `EXERCISES` (catalog), `PRESET_ROUTINES` (reference exercises by `exerciseId`), `TRAINING_GOALS` (`goals.ts`), `FAT_LOSS_PILLARS` (guide content). All shapes are in `src/types/index.ts`.
- **Goals**: the Allenati tab has a goal selector (persisted as `fitpulse_selected_goal`). A preset routine lists its goals in `Routine.goals`; routines without `goals` (user-created / quick-start) show for every goal. "Mostra tutte le schede" lifts the filter.
- **Muscles**: each exercise has `primaryMuscles` / `secondaryMuscles` (`MuscleRegion` ids) — the single source for both the muscle map (`src/components/muscleMap/`, shapes in `muscleShapes.ts`, left half drawn and mirrored) and the figure's muscle colors (`REGION_TO_PART` in `ExerciseFigure.tsx`). `targetMuscles` is free display text only.
- **Free timer** (Timer tab): state lives in `src/hooks/useFreeTimer.ts`, called in `App` so it survives tab switches; countdowns store an absolute `endsAt` (persisted as `fitpulse_free_timer_state`).
- **Persistence** (`src/utils/storage.ts`): `fitpulse_*` localStorage keys for history, user stats and custom routines. `getAllRoutines()` = presets + custom routines. `saveWorkoutHistory` also updates aggregate `UserStats`. The `ACTIVE_WORKOUT` key is declared but currently unused (in-progress workouts are not persisted).
- **Audio** (`src/utils/audio.ts`): beeps/chimes synthesized with Web Audio API (no audio files), used by `RestTimerModal`, `FreeTimerTab`, `ActiveWorkoutView`.
- **Exercise animations** (`src/components/exerciseFigure/`): a stick figure driven by 2-bone inverse kinematics, so limbs keep constant length and never detach (the old per-segment SMIL animation did).
  - `kinematics.ts`: geometry + `solveTwoBone`; `BendDirection` decides which side elbow/knee bends.
  - `skeleton.ts`: body proportions, `PoseSpec` (hip, torso angle, hand/foot *targets*), `solvePose`, `mixPose`, `keyframePose`.
  - `animations.tsx`: one `ExerciseAnimation` per `svgType` — `pose(t)` for t∈[0,1) (strength: `repCurve(t)`, t=0 start, t=0.5 peak; cardio: continuous cycle), plus `behind`/`inFront` equipment drawings. Unknown keys fall back to a generic figure. `squat_dumbbell` is a variant key chosen by the UI toggle.
  - `ExerciseFigure.tsx`: pure renderer for a given `t` (tapered limb capsules, shaped torso, eye showing facing direction, dashed trace of the hand/foot that moves most). `ExerciseIllustration.tsx` owns the clock (requestAnimationFrame), play/pause, 0.5x, "Partenza" (t=0) / "Picco" (t=0.5); `compact` = static thumbnail, no animation loop.
  - Figures face right in side view; `view: 'front'` is used for jumping jacks / lateral raises.
- **Themes**: `src/utils/theme.ts` (list, persistence key `fitpulse_theme`, `applyTheme` sets `<html data-theme>` + meta theme-color; applied in `main.tsx` before first render). Colors live in `src/index.css`: each theme redefines Tailwind v4 palette variables (`--color-emerald-*` = accent, `--color-cyan-*` = secondary, `--color-slate-*` = surfaces/text). Components therefore just use normal `slate/emerald/cyan` classes — don't hardcode hex colors. Figure colors are `--fig-*` variables derived from those palettes. The "chiaro" theme inverts slate with literal values (a self-referencing `var()` would be circular).

### Adding an exercise

1. Add the entry to `EXERCISES` in `src/data/exercises.ts` (category/equipment must match the `MuscleGroup`/`Equipment` unions; fill `primaryMuscles`/`secondaryMuscles`).
2. Add the `svgType` literal in `src/types/index.ts` and an entry in `ANIMATIONS` (`animations.tsx`).
3. Run `npm run check:figures`; to look at it, open the exercise in the app (`npm run dev`).
4. Reference it from routines by `id` (and set `goals` on new preset routines).

## Notes

- `dist/` is generated build output (git-ignored).
- PWA manifest/icons are configured in `vite.config.ts`; icons live in `public/` as SVG.
- UI is mobile-first: content is constrained to `max-w-md`, dark slate palette with emerald accents.
