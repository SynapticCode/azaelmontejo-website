---

# **TRIALDEVELOPMENTPLAN.md: EXOBOUND - Operation Juicification**

## **1. High-Level Overview**

The goal is to enhance the existing EXOBOUND game by implementing two key systems:
1.  **A "Galactic Campaign" Narrative System (Method 1):** Wrap the 50 trials in a compelling story, presenting the player as a Tactical Officer on a critical mission. This involves creating a full script with mission briefings and performance-based outcomes.
2.  **A "Sensory 'Juice'" Feedback System (Method 4):** Overhaul the feedback phase to provide rich, impactful, and satisfying audiovisual feedback based on the player's performance in each trial, without altering the underlying scoring mathematics.

[cite_start]The project will adhere to the core experimental logic from the original study [cite: 65][cite_start], ensuring all variables (`ideal_size`, `standard_size`, `n_fleetsize`, `p_message`) are used correctly and data collection remains valid[cite: 85, 129].

## **2. Game Flow & State Management**

The game will proceed through a sequence of 50 trials, structured as a 10-wave campaign.

1.  **`TitleScene`**: Shows the game title and a "Start" button.
2.  **`CampaignIntroScene`**: Displays the opening narrative sequence (dialogue 0.1, 0.2).
3.  **`TutorialWave` (Wave 0 - Interactive Tutorial)**:
    * `BriefingScene`: Displays tutorial briefing (dialogue T.1).
    * `GameScene`: Player plays through one interactive trial where they are guided to understand the choices.
    * `FeedbackScene`: Provides detailed explanatory feedback.
4.  **`MainCampaignLoop` (Waves 1-10)**: This loop runs 10 times.
    * `BriefingScene`: Displays the mission briefing for the current wave (e.g., dialogue 1.1). Communicates trial parameters (`Fleet Size`, `Comms Integrity`, etc.) narratively.
    * `TrialLoop` (5 trials per wave):
        * `GameScene`: Player makes their choice for the trial.
        * `FeedbackScene`: Player receives immediate, "juicy" feedback on their performance for that single trial.
    * `WaveOutcomeScene`: After 5 trials, this scene displays the narrative outcome (success/failure dialogue, e.g., 1.2 or 1.3) based on the cumulative `bonus` score from that wave.
5.  **`CampaignEndScene`**: Displays the final campaign outcome message (dialogue E.1).
6.  **`DataSubmission`**: Final jsPsych data is processed and saved.

## **3. Trial Generation and Randomization Logic**

This logic should be handled by `GameDataManager.js`.

* **Total Trials**: 50 main trials + 1 tutorial trial.
* **Wave 1 (Trials 1-5)**: These 5 trials will be **staged and fixed**. The parameters should be hand-picked to create a clear learning curve.
    * *Example*: Start with high reception, then introduce lower reception to teach the trade-off.
* **Waves 2-10 (Trials 6-50)**: These 45 trials will be **randomized**.
    * [cite_start]**Parameter Pool (based on original experiment [cite: 156, 160, 162]):**
        * `ideal_size`: [60, 70, 80, 120, 130, 140] (mapped to Raider X-position)
        * [cite_start]`standard_size`: [100] (mapped to Asteroid X-position [cite: 158])
        * `n_fleetsize`: [3, 6, 9] (number of friendly ships)
        * `p_message` (reception): [0.25, 0.5, 0.75, 1.0]
    * **Generation Steps:**
        1.  Create the full Cartesian product of all possible parameter combinations from the pool above. This will generate more than 45 unique trials.
        2.  Randomly sample 45 unique trial configurations from this master list.
        3.  Group these 45 trials into 9 waves of 5 trials each.
        4.  **Crucially, randomize the order of trials *within* each wave, AND randomize the order in which these 9 waves are presented to the player.** This ensures no two playthroughs are identical.

## **4. Campaign Narrative & Full Script**

This script should be stored in a separate JSON or JS file (e.g., `narrative.js`) for easy management.

**(Character: FLEETCOM - a calm, professional mission commander)**

* **Dialogue 0.1 (Campaign Intro):** "Welcome, Tactical Officer. Let's begin your mission briefing."
* **Dialogue 0.2 (Campaign Intro):** "You are in command of our defensive fleet. Your decisions will determine our survival."
* **Dialogue T.1 (Tutorial Briefing):** "First, let's run a simulation. We'll walk you through targeting protocols. Pay attention, your performance matters."

---

* **Wave 1: The Proving Ground (Staged Trials)**
    * **Dialogue 1.1 (Briefing):** "This is Operation EXOBOUND. Your first live-fire mission. Conditions are stable. Comms integrity is high. Show us what you've got."
    * **Dialogue 1.2 (Success Outcome):** "Solid performance, Officer. You've proven you can handle the basics. Don't get cocky."
    * **Dialogue 1.3 (Failure Outcome):** "A messy start. Coordination was sloppy. The fleet needs a commander, not a gambler. Review the data and learn from your mistakes."

* **Wave 2: Communication Blackout**
    * **Dialogue 2.1 (Briefing):** "Intel reports a solar flare is disrupting communications. Expect significant signal degradation. You'll have to rely on standard fleet doctrine more often."
    * **Dialogue 2.2 (Success Outcome):** "Impressive work under pressure. You balanced risk and discipline perfectly. The fleet is intact."
    * **Dialogue 2.3 (Failure Outcome):** "That was chaotic. The comms blackout led to heavy losses. You need to adapt to changing conditions."

* **Wave 3: The Swarm**
    * **Dialogue 3.1 (Briefing):** "We've detected an unusually large fleet of Raiders. We're deploying more of our own ships to match them. Managing a larger fleet requires greater care."
    * **Dialogue 3.2 (Success Outcome):** "Excellent command of a large fleet. Your clear orders punched a hole right through their formation."
    * **Dialogue 3.3 (Failure Outcome):** "A larger fleet means larger consequences for error. We lost too many friendlies due to mis-coordination."

* **... (Continue this pattern for all 10 waves, with themes like "Stealth Raiders" (ideal target is harder to see), "Volatile Asteroids" (standard target is visually larger/more threatening), etc.)**

* **Wave 10: The Final Stand**
    * **Dialogue 10.1 (Briefing):** "This is it, Officer. The Raider command ship has been located. All our forces are committed. The conditions are unstable, but the target is critical. Everything comes down to this."
    * **Dialogue 10.2 (Success Outcome):** "Victory! Your command decisions were flawless. The Raider threat has been neutralized. Exceptional work."
    * **Dialogue 10.3 (Failure Outcome):** "We drove them off, but the cost was too high. The command ship escaped. We survived, but did not win."

* **Dialogue E.1 (Campaign End):** "Your tour of duty is complete, Tactical Officer. Your final performance has been logged. Thank you for your service."

## **5. Scene-by-Scene Implementation Plan**

### **`BriefingScene.js`**

* **Objective:** Display the narrative briefing and trial parameters for the upcoming wave.
* **Implementation:**
    1.  Display the `FLEETCOM` character's dialogue (e.g., "Dialogue 2.1").
    2.  Display the wave's parameters in a narrative format:
        * "**Fleet Size:** {`n_fleetsize`} ships"
        * "**Comms Integrity:** {`p_message` * 100}%"
        * "**Intel:** Our long-range scans are tracking multiple targets. Analyze the field and choose your priority."
    3.  Use the transparent side windows of the cockpit to show status indicators. A "Comms Integrity" bar could be on the left window, visually representing the `p_message` value.

### **`GameScene.js`**

* **Objective:** Enhance the visual representation of the trial parameters.
* **Implementation:**
    1.  **Friendly Ships (`n_fleetsize`):** Dynamically add/remove friendly ship sprites at the bottom of the screen to match the `n_fleetsize` for the current trial. Arrange them in a fleet formation.
    2.  **Asteroid (`standard_size`):** The asteroid's X-position should correspond to `standard_size`. Consider slightly scaling its size up or down to provide another visual cue.
    3.  **Raider (`ideal_size`):** The Raider's X-position should correspond to `ideal_size`.
    4.  **Reticle:** The player-controlled reticle moves ONLY on the X-axis. Its final X-position when the player fires is the `val` for the trial.

### **`FeedbackScene.js` (The "Juice" Implementation)**

* **Objective:** Provide immediate, powerful, and satisfying audiovisual feedback. This scene uses the grid-view background (`image_156adc.png`).
* **Implementation:**
    1.  The scene starts by showing the friendly ships at the bottom and the asteroid/raider targets at their respective `standard_size` and `ideal_size` positions.
    2.  [cite_start]Calculate `total_loss`, `env_loss`, and `social_loss` using the formulas from the original experiment[cite: 18, 29, 33].
    3.  **Create a function `fireLasers(outcomeData)` that triggers the following logic:**
    4.  **Laser Visualization:**
        * [cite_start]Determine the number of coordinated ships (`n_received`)[cite: 26].
        * Animate `n_received` lasers firing from friendly ships towards the player's actual target (`val`).
        * Animate `n_fleetsize - n_received` lasers firing towards the `standard_size` target (the asteroid).
    5.  **Conditional Feedback Logic:**
        * Define a `LOW_LOSS_THRESHOLD`.
        * **IF `total_loss` < `LOW_LOSS_THRESHOLD`:**
            * **Audio:** Play a loud, booming "KRAKOOM" sound effect. Play a positive "SUCCESS" musical sting.
            * **Visuals:**
                * Make the laser beams thick, bright, and powerful.
                * Trigger a large, screen-filling particle explosion on the primary target.
                * Execute a short, intense camera shake (`camera.shake(100, 0.01)`).
        * **ELSE (High Loss):**
            * **Audio:** Play a weak, fizzling "pfft" sound. Play a dissonant, "FAILURE" musical chord.
            * **Visuals:**
                * Make the laser beams thin, dim, and misaligned.
                * Trigger a small, smoky puff particle effect on the targets.
                * No camera shake.
    6.  After the effects, display the numerical scores (`Environmental Loss`, `Teamwork Loss`, `Bonus`) as before.

## **6. Asset Requirements**

* **Audio:**
    * `success_sting.mp3` (short, heroic musical sting)
    * `failure_chord.mp3` (short, dissonant musical chord)
    * `powerful_laser_explosion.wav`
    * `weak_laser_fizzle.wav`
    * `ui_click.wav`
* **Sprites:**
    * Additional Raider ship sprites (to vary per wave, optional but recommended).
    * Particle effects for large explosion (fiery, bright).
    * Particle effects for small explosion (smoky, dim).

---

## Progress Update (2025-07-01)

- The game now loads multiple trials and waves successfully, following the planned campaign structure.
- Tutorial and wave system are implemented and working as intended.

### Current Status (2025-01-27)
- **Reticle Y position:** ✅ Fixed - Reticle now positioned at correct aiming location
- **Raider sprite display:** ✅ Fixed - Raiders now show correct Alien_raider_* images
- **Multi-trial system:** ✅ Working - Game successfully loads and runs multiple trials with proper randomization
- **Input system:** ✅ Stable - Input controls work reliably across all trials