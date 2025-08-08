# EXOBOUND Task List (Active)

*All completed tasks have been moved to `completed tasks.md` for clarity and historical reference.*

- [ ] Keep README journal up to date with every major change
- [ ] Regularly review and update PLANNING.md as architecture evolves
- [ ] Replace all uses of `n_engineers` with `n_fleetsize` in code and data
- [ ] Update all trial generation, feedback, and UI logic to use `n_fleetsize`
- [ ] Ensure all data output and jsPsych records use `n_fleetsize`
- [ ] Implement multiple valid target points (asteroid, raider, and empty space if needed)

- 

- [ ] The player's reticle X position (`val`) should determine the actual target for each trial
- [ ] Ensure all trial and wave data is recorded with the correct variables (`n_fleetsize`, `ideal_size`, `standard_size`, `p_message`, `val`, `trialType`)
- [ ] Update all instructional text and UI to use the correct variable names and logic
- [ ] Test the full campaign flow: tutorial, 10 waves, 5 trials per wave, correct feedback, and data recording

- ✅ **COMPLETED: Dynamic Campaign Dialogue System** 
  - ✅ Created modular performance tracking (PerformanceTracker.js)
  - ✅ Created dynamic dialogue selection (DialogueSelector.js) 
  - ✅ Created dialogue for all waves 2-10 with performance-based content
  - ✅ Integrated with existing Wave 1 dialogue system
  - ✅ Added to index.html loading sequence
  - ✅ Updated HUDScene to use dynamic dialogue selector
- [ ] Ensure correct enemy (raider) spawning and game logic for each trial


- [ ] Add clearer explanations of environmental vs teamwork loss in tutorial




- [ ] Update the consent form with the official language
- [ ] Implement the core scoring logic
- [ ] Create a post-game survey
- [ ] Align `HUDScene` parameters with `plugin-choice-screen.js`
- [ ] Ensure `gameDataManager` correctly stores and passes trial data
- [ ] Clarify Phaser-jsPsych integration and trial sequencing
- [ ] Gather Audio Assets (musical stings, explosion, fizzle, UI click)
- [ ] Gather Visual Assets (explosion, puff, new raider sprites)
- [ ] Implement rich feedback in FeedbackScene.js (laser firing, conditional feedback, success/failure effects)
- [ ] Create the narrative within the narrative data file for the remainder 45 trials(narrative.js)
- [ ] Complete the dialogue and game dynamics to the rest of the trials after tutorial trial (1 - 5 as it is completed) generation in GameDataManager.js (5 staged trials for Wave 1, 45 randomized for Waves 2-10)
- [ ] Update GameScene and BriefingScene for narrative integration
- [ ] Implement the main game loop (Intro -> Briefing -> 5x[Game -> Feedback] -> Wave Outcome -> ... -> End)
- [ ] Create WaveOutcomeScene.js for displaying wave results

- [ ] Playtest the entire 50-trial campaign
- [ ] Verify all randomization and data output
- [ ] Proofread all narrative text
- [ ] Update README.md with every major change or decision
- [ ] Update PLANNING.md as new features or requirements are added
- [ ] Add new sub-tasks or TODOs discovered during development to this file
