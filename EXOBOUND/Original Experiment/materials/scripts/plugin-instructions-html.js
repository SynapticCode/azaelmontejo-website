var instructions_html = (function (jspsych) {
    "use strict";
  
    const info = {
      name: "instructions_html",
      parameters: {
        prompt: {
          type: jspsych.ParameterType.HTML_STRING,
          default: undefined,
        },
        hero: {
            type: jspsych.ParameterType.IMAGE,
            default: ''
        },

      },
    };
  
    /**
     * **ENVIRONMENT CHECK **
     *
     * ALLOWS PARTICIPANTS TO MOVE A SLIDER AROUND TO RESIZE A WIDGET AND
     * TEST THAT WIDGET'S ENVIRONMENT SCORE
     *
     * @author NATALIA VELEZ
     */
    class InstructionsHTMLPlugin {
      constructor(jsPsych) {
  
        this.jsPsych = jsPsych;
      }
      trial(display_element, trial) {
          // set up page
          $(display_element).load('templates/instructions.html', function(){
              // fill in content
              $(display_element).find('#prompt').html(trial.prompt);
              $(display_element).find('#hero').attr('src', trial.hero);

              // initialize button
              // advance trial
            var button = $(display_element).find('.progress-btn');
            $(button).addClass('active');
            setTimeout(function(){
              $(button).one('click', function(){
                $(this).unbind('click');
                jsPsych.finishTrial();
              });
            }, 1500);
          }); 
            }
  
      }
    InstructionsHTMLPlugin.info = info;
  
    return InstructionsHTMLPlugin;
  })(jsPsychModule);