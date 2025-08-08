var post_survey = (function (jspsych) {
    "use strict";
  
    const info = {
      name: "post_survey",
      parameters: {
      },
    };
  
    /**
     * ** POST-TEST SURVEY **
     *
     * DISPLAYS A DEMOGRAPHIC SURVEY AT THE END OF THE TASK
     *
     * @author NATALIA VELEZ
     */
    class PostSurveyPlugin {
      constructor(jsPsych) {
  
        this.jsPsych = jsPsych;
      }
      trial(display_element, trial) {
          // set up page
          $(display_element).load('templates/survey.html', function(){

              // initialize button
              $(display_element).find('button').one('click', function(){
                $(this).unbind('click');
                
                var trial_data = {
                    language : $(display_element).find('#survey-language').val(),
                    enjoyment : $(display_element).find('input[name="survey-enjoy"]:checked').val(),
                    assess : $(display_element).find('input[name="survey-instructions"]:checked').val(),
                    age : $(display_element).find("#survey-age").val(),
                    gender_cat : $(display_element).find('input[name="survey-gender"]:checked').val(),
                    gender_text: $(display_element).find('#gender-other').val(),
                    education : $(display_element).find('input[name="survey-education"]:checked').val(),
                    comments : $(display_element).find("#survey-comments").val(),
                };

                jsPsych.finishTrial(trial_data);
              })
            }
            );
  
      }
    }
    PostSurveyPlugin.info = info;
  
    return PostSurveyPlugin;
  })(jsPsychModule);