# 🔄 Project Awareness & Context

## 2025-07-03: Target Synchronization & Comms Integrity Architecture
- **All target positions and types (asteroid, raider) must be passed from HUDScene to FeedbackSceneV2.**
- The feedback scene must always use the exact X/Y and sprite key for each target as seen by the player in HUDScene.
- This ensures that comms integrity logic is always correct: if comms is 100%, all ships shoot at the player's chosen target, and the feedback scene visually matches the player's intent.
- This is now a core architectural rule for all future development.

- **Always read `PLANNING.md`**  at the start of a new conversation to understand the project's architecture, goals, style, and constraints.
- **Check `TASKv3.md`** before starting a new task. If the task isn't listed, add it with a brief description and today's date. **Update TASK.md as tasks are completed or added.**
- **Update PLANNING.md as new features or requirements are added.**
- **Use consistent naming conventions, file structure, and architecture patterns** as described below.
- **Keep the new README journal up to date with every major change.**
do not use '&&' in terminal as this is not a working function!

## 🚨 Current Priority Issue (2025-01-27)
**FeedbackScene Ship Movement Bug**: Allied ships in FeedbackScene are flying toward the center asteroid instead of their assigned targets. This creates the visual effect of ships crashing into the asteroid and exploding, which is incorrect behavior. Ships should fly toward their actual targets (raiders or asteroids based on coordination logic). This is the current priority task.

## 🎯 Core Objective

Continue building EXOBOUND: Currently functions online at https://azaelmontejo.com/EXOBOUND/ 
Never edit from "Original Experiment" folder. 

## 🧱 Code Structure & Modularity

- **Modularize all code**: Separate HTML, CSS, JS. Do not write JS, CSS on index.html.
- Use folders: keep current folder schema associated with Exobound. Do not put anything into C:\Local Home\Project Azael Montejo Jr\EXOBOUND - files\EXOBOUND\Original Experiment.
- **Each file must have a docstring** explaining its purpose and connections.
- Avoid redundancy: Remove duplicate logic after verifying functionality.
- Use `experiment.js` to define the timeline and load it via `<script src="...">` in `index.html`.
do not use '&&' in terminal as this is not a working function!
### 🆕 Input & Global Settings Architecture
- All input event listeners (keyboard, mouse) are managed by a reusable module/class.
- Input listeners are registered once and persist across trials, or are properly re-initialized/reset at the start of each trial.
- Reticle and HUD elements are reset to their default state at the start of each trial.
- A global settings/configuration object manages persistent settings (input mappings, reticle speed, boundaries, etc.).
- Only trial-specific parameters (UFO/raider position, reception, fleet size, etc.) are randomized or updated per trial.
- Proper cleanup/reset of Phaser scenes and objects is required between trials to avoid lingering state or event listeners.

### 🆕 Audio Feedback Reset
- All audio assets (e.g., laser sounds) must be reloaded or reset as needed between trials to ensure feedback works for every trial.

### 🆕 Ongoing Documentation
- The README journal must be updated with every major change, summarizing project evolution, decisions, and current focus.

## 🧪 Testing & Reliability

- **Use Pytest** for backend logic and unit tests.
- **Test game flow**: Add a dummy "Thanks for playing" trial to verify game doesn't freeze.
- **Test reticle controls**: Ensure keyboard and mouse input works on X-axis only.
- **Test scoring logic**: Match original experiment's formulas for environmental and social loss.
- **Test raider presence**: Ensure that every trial presents at least one raider as a selectable target.
- **Test input reliability for 5+ trials**: Confirm that input does not break after several trials and that event handlers are not duplicated or lost.

## 🎮 Game Design Logic

- **HUD Scene**: Player now allocates firepower between asteroid (standard) and raiders (ideal) using a continuous slider (0–100%).
- **Reception**: Reception is a core variable for each trial, displayed as an icon/value on the HUD and results, and explained in the tutorial/instructions. Reception determines the probability that each ally coordinates with the player's allocation.
- **Feedback Scene**: Visualizes team convergence via laser intensity and shows adaptation loss (distance from ideal), coordination loss (distance from standard), and bonus.
- **Scoring**:
  - Adaptation Loss: Based on distance from ideal allocation (e.g., all fire on raider if it's a big threat).
  - Coordination Loss: Based on distance from standard allocation (e.g., all fire on asteroid).
  - Bonus: Calculated as in the original experiment, based on total loss.
- **Multi-Trial System**: Each trial is generated with randomized parameters:
  - Random ideal allocation (e.g., raider threat level)
  - Random fleet size (`n_fleetsize`)
  - Random reception probability (`reception`)
  - Standard and ideal allocations can be randomized or set per trial
- **Visual Feedback**: Laser intensity, color, and width are now driven by bonus (coordination quality), not damage/HP.
- **Allies**: Allies are now shown in cockpit windows at the start of each trial.
- **KNOWN BUG (2025-06-30)**: Raiders are not being placed or shown in any trial, so the player cannot make a meaningful choice. This must be fixed for the experiment to function as intended.

## 🆕 Continuous Allocation Mechanic (Slider-Based Targeting)
- The binary choice system (asteroid vs. raider) is replaced by a continuous allocation mechanic.
- Players use a slider to allocate firepower between available targets (e.g., asteroid and raider).
- This restores the experimental value of the original experiment by introducing a trade-off between adaptation (ideal) and coordination (standard), and by allowing nuanced, non-binary choices.
- Teammates may or may not follow the player's allocation (simulating communication noise/reception).
- Feedback and scoring logic are updated to reflect adaptation loss, coordination loss, and bonus, as in the original experiment.
- See `TASKv3.md` for a detailed implementation plan and checklist.

## 📎 Style & Conventions

- Follow **PEP8**, use **type hints**, and format with `black`.
- Use **consistent jsPsych version** (preferably latest if stable).
- Use **clear, consistent naming** for all variables and files.

## 🔐 Data & Security

- Store trial data in a backend database.
- Use the original experiment's data structure as a model.
- Ensure consent form uses approved language from `Consent Form.docx.pdf`.

## 🧠 Experimental Design Alignment

- Match original parameters:
  - `ideal_size`, `standard_size`, `n_engineers`, `p_message`, and now, continuous allocation values.
- The new mechanic ensures the experiment continues to measure the trade-off between adaptation and coordination under uncertainty, as in the original design.
- All instructions, tutorials, and feedback must clearly explain the new allocation mechanic and its strategic implications.

## 🆕 Progress Update (2025-07-03)
- Allocation-based fleet targeting and feedback are now implemented in FeedbackSceneV2.js. To finish integration:
  1. Complete allocation-based data tracking in GameDataManager ✅
  2. Update ResultsDisplay and ScoreDisplay for allocation-based feedback ✅
  3. Update instructions and tutorial to teach the lever mechanic ✅
  4. Test all edge cases and remove legacy logic ✅
  5. Update documentation (README, TASKv3.md, PLANNING.md) ✅
  6. Final code cleanup ✅
  7. **NEXT:** Enhance the tutorial with a 5-trial onboarding wave that includes step-by-step dialogue and interactive teaching of the lever, comms, and FIRE button. This will make the first wave a true onboarding experience for new players.