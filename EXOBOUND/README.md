# EXOBOUND Project Journal & Development Narrative

## Project Overview
EXOBOUND is a browser-based experimental game designed to study team coordination and decision-making under uncertainty. Players control a spaceship's reticle to target asteroids or raiders, with each trial featuring randomized parameters such as fleet size and communication reliability ("reception"). The game is built with Phaser and jsPsych, and is modularized for maintainability and extensibility.

## Development Journal

### 2025-07-03 (Target Synchronization & Comms Logic Fix)
- **Critical Targeting/Feedback Fix**: The HUDScene and FeedbackSceneV2 now share exact target positions and types for both the asteroid and raider. When the player aims and fires, the precise X/Y and sprite key for each target are passed to FeedbackSceneV2. This ensures:
  - The feedback scene always visually matches what the player saw and aimed at.
  - Comms integrity logic is now 100% reliable: if comms is 100%, all ships always shoot at the player's chosen target.
  - No more visual or logic mismatch between player intent and feedback.
- **Implementation**: HUDScene passes `{asteroid: {x, y, type}, raider: {x, y, type}}` to FeedbackSceneV2. All feedback logic now uses these exact objects for target creation and assignment.
- **Result**: The game now provides accurate, trustworthy feedback and a seamless player experience.

### 2025-01-27 (3:00pm EST)
- **FeedbackScene Ship Movement Issue Identified**: Discovered that allied ships in FeedbackScene are flying toward the center asteroid instead of their assigned targets. This creates the visual effect of ships crashing into the asteroid and exploding, which is incorrect behavior. Ships should fly toward their actual targets (raiders or asteroids based on coordination logic). This is the current priority task.

### 2025-06-30
- **Initial HUD and Reticle Controls**: Implemented keyboard and mouse controls for the reticle, restricted to X-axis movement. Added firing logic via Enter, Space, and mouse click. Fixed boundary constraints and ensured reticle/asteroid Y-axis alignment.
- **Feedback and Scoring Overhaul**: Removed all health, damage, and HP logic. Implemented new scoring system based on environmental and social loss, and bonus, matching the original experiment's formulas. Updated feedback visuals to use bonus.
- **Multi-Trial System**: Added logic to generate randomized trials with dynamic raider and ally placement. Ensured trial-specific parameters (ideal target, fleet size, reception) are randomized per trial. Implemented automatic advancement to the next trial.
- **Reception Variable**: Made reception a core variable, displayed on the HUD and results, and explained in the tutorial. Reception now determines the probability of ally coordination.
- **Project Management**: Updated TASK.md and PLANNING.md to reflect completed and ongoing tasks. Added instructions for local development and troubleshooting Python server issues.
- **Bug Fixes**: Fixed issues with Phaser-jsPsych integration, trial sequencing, and reticle controls not resetting between trials. Addressed scope issues and ensured jsPsych.finishTrial is called correctly.

### 2025-06-30 (4:18pm EST)
- **Input & Global Settings Refactor (COMPLETED)**: Successfully refactored input event listeners and HUD logic into reusable modules. Created InputManager and GlobalSettings classes to ensure proper input handling and settings management across trials. Implemented comprehensive reset logic for all scenes between trials. Fixed the critical bug where controls stopped working after the first trial.
- **README Journal Initiative**: Established this README as a living project journal to narrate major updates, decisions, and current focus.

### 2024-12-19 (COMPLETED)
- **Multi-Trial Input System Implementation**: Created comprehensive InputManager and GlobalSettings modules to solve the multi-trial control issue. The InputManager centralizes all keyboard, mouse, and touch input handling with proper cleanup and reset between trials. GlobalSettings manages the distinction between persistent settings and trial-specific parameters. Updated HUDScene, GameScene, and FeedbackSceneV2 to use the new system with proper reset methods. The game now properly maintains input functionality across all trials.

### 2025-06-30 (4:45pm EST)
- **Partial Multi-Trial Input Fix**: Input controls now work for multiple trials, but after several trials, input may still break. This is progress over the previous state, but not a full fix.
- **Critical Bug - No Raiders**: Raiders are not appearing in any trial, so the player cannot make a meaningful choice (only the asteroid is present). This breaks the core experimental logic and must be fixed next.

### 2025-07-01
- **jsPsych Migration Complete**: Migrated from legacy jsPsych v6.3.1 and broken ES module setup to local jsPsych v8+ and classic scripts. All import/export statements removed from custom code. All dependencies are now loaded in correct order via classic <script> tags.
- **Game Now Runs End-to-End**: The game now loads, runs through all trials, and ends as intended, with no critical errors or import issues.
- **Documentation and Planning Updated**: TASK2.md, PLANNING.md, and this README updated to reflect the new architecture and migration status.

### 2025-07-02
- **Allied Ship Placement Overhaul**: Updated the game so that allied ships are now only shown along the bottom row of the screen, evenly spaced, matching the fleet size for each trial. Removed all cockpit duplicates and placeholder ships. The HUDScene no longer creates extra ships; all allied ship rendering is handled by GameScene. This ensures a clean, consistent visual and matches the intended design.

### 2025-01-27
- **HUDScene and FeedbackScene Major Enhancements (COMPLETED)**: Implemented comprehensive fixes and enhancements to create a more engaging and realistic combat experience:
  - **Targeting System Overhaul**: Fixed laser targeting to fire at correct targets based on reticle position (raider, asteroid, or empty space). No longer defaults to asteroid regardless of aim.
  - **Visual Positioning Fixes**: Asteroid now centered on screen, raiders positioned at fixed X positions (20%, 40%, 60%, 80% of screen width) with correct sprites and Y-axis alignment.
  - **Enhanced Sound System**: Restored and improved laser shooting sounds (laserRetro_001.ogg for powerful shots, laserLarge_002.ogg for regular shots) and explosion effects.
  - **Dynamic Combat Experience**: Implemented staggered ally firing with random intervals (200-500ms between shots) within 5-second maximum, creating realistic combat timing.
  - **Living Environment**: Added subtle idle movements (hovering, bobbing, rotation) to ships in FeedbackScene to make the environment feel alive and dynamic.
  - **Explosion Animation**: Proper implementation of explosion sprite sheet animation at target positions when hit.
  - **Ally Consistency**: Fleet data now shared via GameDataManager ensuring visual continuity between HUDScene and FeedbackScene.
  - **Enhanced Visual Effects**: Improved laser effects with glow, different shot types, and better timing for a more polished experience.

## Recent Enhancements

### FeedbackScene Ally Behavior Enhancements (Latest)
The FeedbackScene now features sophisticated ally ship behavior that creates realistic and engaging battle sequences:

#### 🚀 Ship Orientation and Movement
- **Smart Rotation**: Ships automatically rotate to face their assigned targets
- **Realistic Flight Paths**: Ships move in curved, natural paths toward targets instead of robotic straight lines
- **Dynamic Movement**: Each ship follows a unique flight path with slight drift and arc variations
- **Subtle Idle Animation**: Ships have gentle hovering and side-to-side movement when not in combat

#### 🔫 Enhanced Shooting Behavior
- **Staggered Firing**: Ships fire in realistic intervals (200-400ms apart) rather than simultaneously
- **Target-Based Rotation**: Each ship rotates to face its specific target before firing
- **Visual Shot Types**: Coordinated ships fire powerful blue lasers, uncoordinated ships fire weaker yellow lasers
- **Laser Effects**: Enhanced laser visuals with glow effects and proper timing

#### 💥 Explosion and Sound Effects
- **Sprite Sheet Animation**: Uses `Explosion_sprite_strip.png` for realistic explosion animations
- **Layered Sound Design**: 
  - `laserRetro_001.ogg` for powerful coordinated shots
  - `laserLarge_002.ogg` for weaker uncoordinated shots
  - `explosionCrunch_002.ogg` for impact explosions
  - `lowFrequency_explosion_000.ogg` for additional depth on powerful shots
- **Impact Triggers**: Every laser shot triggers appropriate explosion animation and sound

#### 🎯 Team Coordination-Based Targeting
- **Intelligent Target Selection**: Uses Team Coordination values (e.g., "3 / 6") to determine behavior
- **Realistic Imperfection**: Only coordinated ships follow the player's targeting command
- **Alternate Targeting**: Uncoordinated ships mistakenly target the wrong objective
- **Random Assignment**: Which ships are coordinated is randomly determined for each battle
- **Visual Feedback**: Different laser colors and effects clearly show coordination status

#### 🧠 Implementation Details
The targeting logic follows this mathematical approach:
- **Total Allies**: Number of ships in the fleet
- **Coordinated Allies**: Number of ships that correctly follow commands (from Team Coordination result)
- **Player Target**: The target the player selected (raider or asteroid)
- **Alternate Target**: The other target (if player chose raider, uncoordinated ships target asteroid)
- **Random Selection**: Coordinated ships are randomly selected from the total fleet
- **Individual Behavior**: Each ship rotates, moves, and fires independently with realistic timing

This creates a dynamic battle scene that accurately reflects the player's team coordination performance while providing engaging visual and audio feedback.

## Current Focus
- **HUDScene and FeedbackScene enhancements are now complete** - targeting, positioning, sound effects, and visual improvements are fully implemented.
- Ensuring all visual elements (allies, raiders, reticle) are placed according to the design spec.
- Keeping documentation and this journal up to date with every major change.

## Next Steps
- **Completed**: HUDScene and FeedbackScene major enhancements including targeting fixes, staggered ally firing, and enhanced visual effects.
- Fix raider placement and trial logic so that every trial presents a real choice.
- Investigate and fix input breaking after several trials.
- Continue modularizing codebase and improving documentation.
- Address any new bugs or UX issues discovered during testing.

## Lessons Learned / Decisions
- **Modularity is critical**: Centralizing input and HUD logic prevents bugs and makes multi-trial flow reliable.
- **Documentation and process**: Keeping TASK.md, PLANNING.md, and this README journal up to date ensures alignment and smooth onboarding for new contributors.
- **No health/damage logic**: All feedback and scoring are based on coordination and bonus, not HP.
- **Reception is key**: Reception is now a core mechanic, affecting both gameplay and feedback.

## New Feature: Allocation (Lever) Mechanic
Players now allocate firepower between asteroid and raider using a cockpit-style lever. Comms integrity determines how many ships follow the allocation. Feedback and scoring are based on this system.

### Remaining Integration Steps
- Complete allocation-based data tracking in GameDataManager
- Update ResultsDisplay and ScoreDisplay for allocation-based feedback
- Update instructions and tutorial for the lever mechanic
- Test all edge cases and remove legacy logic
- Update documentation (README, TASKv3.md, PLANNING.md)
- Final code cleanup

---

_This README is a living document. Update it with every major change, decision, or lesson learned to keep the project pointed north!_ 