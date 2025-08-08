var check_question = (function (jspsych) {
    "use strict";

    const info = {
        name: "check_question",
        parameters: {
            name: {
                type: jspsych.ParameterType.STRING,
                default: ""
            },
            prompt: {
                type: jspsych.ParameterType.HTML_STRING,
                default: null,
                pretty_name: "Prompt"
            },
            options: {
                type: jspsych.ParameterType.COMPLEX,
                pretty_name: "Options",
                array: true,
                nested: {
                    correct: {
                        type: jspsych.ParameterType.BOOL,
                        default: false,
                    },
                    label: {
                        type: jspsych.ParameterType.STRING,
                        default: null
                    },
                    opt_name: {
                        type: jspsych.ParameterType.STRING,
                        default: null
                    },
                }
            },
            shuffle_options: {
                type: jspsych.ParameterType.BOOL,
                default: false
            },
            n_questions: {
                type: jspsych.ParameterType.INT,
                default: null
            },
            q_index: {
                type: jspsych.ParameterType.INT,
                default: null
            }
        },
    };

    /**
     * ** Check question **
     *
     * Presents multiple-choice check questions and, optionally, provides feedback
     *
     * @author Natalia Velez
     */
    class CheckQPlugin {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
        }
        trial(display_element, trial) {
            const opt_bullets = ['A', 'B', 'C', 'D'];

                // Initialize form
                const form_template = `
            <div class="jspsych-survey-multi-choice-question" data-name="%s">
            `;
                var html = sprintf(form_template, trial.name);
                
                // Add question prompt
                const prompt_template = "<p>Question %i/%i</p><h3>%s</h3>";
                html += sprintf(prompt_template, trial.q_index, trial.n_questions, trial.prompt);

                // Add choice options (TODO: add support for randomization)
                const radio_template = `
            <div id="%s" class="jspsych-survey-multi-choice-option">
            <label class="jspsych-survey-multi-choice-text" for="%s">
            <input type="radio" name="%s" id="%s" value="%s" required></input>
            <strong>%s)</strong> %s</label>
            </div>
            `;

            let options = [...trial.options];
            if (trial.shuffle_options) {
                shuffleArray(options)
            }

            options.forEach(function (opt,i) {
                    html += sprintf(radio_template, opt.opt_name, trial.name,
                        trial.name, opt.opt_name, opt.opt_name, opt_bullets[i], opt.label)

            });

            // Create answer key
            let answer_key = _.object(
                options.map(e => e['opt_name']),
                options.map(e => e['correct']),
            );

            // Add button & render page
            const button_label = trial.q_index == trial.n_questions ? "Check score" : "Next";
            const check_button = sprintf("<button class='check-btn inactive'>%s</button>", button_label);
            html += check_button;
            html += "</div>"
            $(display_element).html(html);

            // Event: Activate button when an option is first selected
            $('input[type=radio]').change(function(){
                let button = $(display_element).find('button');
                $(button).removeClass('inactive');
                $(button).unbind('click');
                $(button).one('click', function(){
                    $(this).unbind('click');

                    let response = $('input[type="radio"]:checked').attr('value');
                    const data ={
                        name: trial.name,
                        prompt: trial.prompt,
                        options: trial.options,
                        response: response,
                        correct: answer_key[response]
                    };
                    jsPsych.finishTrial(data);
                });
            });

        };

    }

    CheckQPlugin.info = info;

    return CheckQPlugin;
})(jsPsychModule);