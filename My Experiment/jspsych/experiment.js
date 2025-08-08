// This is the jsPsych plugin that allows us to run external HTML, like our game
import { initJsPsych } from 'jspsych'; 
import jsPsychExternalHtml from '@jspsych/plugin-external-html';
import jsPsychHtmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';

// This function sends data to our PHP script to be saved
function saveData(filename, filedata) {
  fetch('save_data.php', {
    method: 'POST',
    cache: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: filename, filedata: filedata })
  });
}

// Initialize jsPsych
const jsPsych = initJsPsych({
  display_element: 'jspsych-target',
  on_finish: function() {
    // When the whole experiment is over, save all data
    const participant_id = jsPsych.randomization.randomID(10);
    const filename = `${participant_id}_exobound.csv`;
    const csv_data = jsPsych.data.get().csv();
    saveData(filename, csv_data);

    // Show a final thank you message
    document.body.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif; text-align: center; color: #eee; background-color: #1a1a1a;">
        <div>
          <h2 style="color: #0ff;">Recovery Protocol Complete</h2>
          <p>Thank you for your service, Captain. Your mission data has been logged.</p>
          <p>Your Debriefing Code is: <strong>${participant_id}</strong></p>
        </div>
      </div>`;
  }
});

// Welcome screen
const welcome = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <div style="text-align: center; max-width: 800px; margin: 0 auto;">
      <h1 style="color: #0ff;">EXOBOUND: Recovery Protocol</h1>
      <p>Welcome, Captain. Your mission is to navigate to one of two decision terminals:</p>
      <p><span style="color: #00ff00;">COORDINATE</span> with your team (slower but more reliable)</p>
      <p>or</p>
      <p><span style="color: #ff0000;">ADAPT</span> to the situation independently (faster but riskier)</p>
      <p>Use the arrow keys to move your ship.</p>
      <p style="margin-top: 30px; font-size: 1.2em;">Press any key to begin the mission.</p>
    </div>
  `,
  post_trial_gap: 500
};

// Define the Phaser Game Trial
const phaser_game_trial = {
  type: jsPsychExternalHtml,
  url: "exobound_game.html", // The file containing our Phaser game
  cont_btn: "jspsych-external-html-continue", // This matches the hidden button in exobound_game.html
  execute_script: true,
  // We can pass trial data into the game like this in the future:
  data: {
      trial_type: 'game',
      team_size: 5,
      coordination_cost: 0.4
  }
};

// The Full Experiment Timeline
const timeline = [welcome, phaser_game_trial];

// Start the experiment
jsPsych.run(timeline);
