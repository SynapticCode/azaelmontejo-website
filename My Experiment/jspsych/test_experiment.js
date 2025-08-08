import { initJsPsych } from 'jspsych';
import jsPsychExternalHtml from '@jspsych/plugin-external-html';

const jsPsych = initJsPsych({
  on_finish: function() {
    document.body.innerHTML = '<h1>Experiment Complete!</h1>';
  }
});

const test_trial = {
  type: jsPsychExternalHtml,
  url: "./test.html",
  cont_btn: "continue-button",
  execute_script: true
};

jsPsych.run([test_trial]);
