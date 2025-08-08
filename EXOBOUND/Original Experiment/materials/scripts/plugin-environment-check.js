var environment_check = (function (jspsych) {
    "use strict";
  
    const info = {
      name: "environment_check",
      parameters: {
        ideal_size: {
          type: jspsych.ParameterType.INT,
          default: 60,
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
    class EnvironmentCheckPlugin {
      constructor(jsPsych) {
  
        this.jsPsych = jsPsych;
      }
      trial(display_element, trial) {
          // precompute loss function
          function loss_fun(val) {
            return .1*Math.pow(val-trial.ideal_size, 2);
          }
  
          var response = null;
          var score = null;
  
          // slider event handlers
          function createSlider () {
            var widget = $(display_element).find('.widget');
            var init_loss = loss_fun(100);
  
            widget.css(widget_size(50));
            
            $(display_element).find('#slider_size').html(100);
  
          };
  
          function startSlider(event, ui) {
            
            var button = $(display_element).find('button');
            $(button).removeClass('inactive');
            $(button).unbind('click');
            $(button).one('click', function(){
              $(this).unbind('click');
  
              // data saving
              var trial_data = {
                val: response,
                score: score
              };
  
              jsPsych.finishTrial(trial_data);
            });
          }
  
          function updateSlider(event, ui) {
            var val = ui.value;
            response = val+50;
  
            // Update widget size
            var widget = $(display_element).find('.widget');
            widget.css(widget_size(val));
  
            // Report size
            var size_out = $(display_element).find('#slider_size');
            size_out.html(val+50);
  
            // Report score
            score = loss_fun(response);

            var button = $(display_element).find('button');
            $(button).removeClass('inactive');
            $(button).unbind('click');
            $(button).one('click', function(){
              $(this).unbind('click');
  
              // data saving
              var trial_data = {
                val: response,
                score: score
              };
  
              jsPsych.finishTrial(trial_data);
            });
          }
  
          // set up page
          $(display_element).load('templates/instructions_environmental_demo_check.html', 
          function(){
              // initialize slider
              $(display_element).find('#slider').slider({
                value: 50,
                min: 0,
                max: 100,
                step: 5,
                create: createSlider,
                slide: updateSlider,
                start: startSlider
              });
            }
            );
  
      }
    }
    EnvironmentCheckPlugin.info = info;
  
    return EnvironmentCheckPlugin;
  })(jsPsychModule);