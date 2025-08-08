var environment_demo = (function (jspsych) {
  "use strict";

  const info = {
    name: "environment_demo",
    parameters: {
      ideal_size: {
        type: jspsych.ParameterType.INT,
        default: 60,
      },
    },
  };

  /**
   * **ENVIRONMENT DEMO **
   *
   * ALLOWS PARTICIPANTS TO MOVE A SLIDER AROUND TO RESIZE A WIDGET AND
   * TEST THAT WIDGET'S ENVIRONMENT SCORE
   *
   * @author NATALIA VELEZ
   */
  class EnvironmentDemoPlugin {
    constructor(jsPsych) {

      this.jsPsych = jsPsych;
    }
    trial(display_element, trial) {
        // precompute loss function
        function loss_fun(val) {
          return .1*Math.pow(val-trial.ideal_size, 2);
        }

        // var loss_gradient = ['#fafcf7', '#edf2df', '#dde6c7', '#cddba2', '#bfd18a'];
        var loss_gradient = ['#ffffff', '#eecfcd', '#daa19e', '#c37370', '#a84446', '#8b0020']
        var val_history = []; // values tested out
        var response = null;

        // slider event handlers
        function createSlider () {
          var widget = $(display_element).find('.widget');
          var init_loss = loss_fun(100);
          var init_color = loss_gradient[Math.floor(Math.log10(init_loss+1))];

          widget.css(widget_size(50));
          
          $(display_element).find('#slider_size').html(100);
          $(display_element).find('#slider_score').html(sprintf('-%i', Math.round(init_loss)));
          $(display_element).find('#slider_score').css('background', init_color);
          $(display_element).find('.ui-slider').css('background', init_color);

        };

        function startSlider(event, ui) {
          
          var button = $(display_element).find('button');
          $(button).removeClass('inactive');
          $(button).unbind('click');
          $(button).one('click', function(){
            $(this).unbind('click');
            
            // data saving
            var trial_data = {
              history: val_history,
              val: response
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
          size_out.html(response);

          // Report score
          var score = loss_fun(response);
          console.log(score);
          var score_out = $(display_element).find('#slider_score');
          score_out.html(loss_str(score));

          // Update colors
          var bg_color = loss_gradient[Math.floor(Math.log10(score+1))];
          $(display_element).find('#slider_score').css('background', bg_color);
          $(display_element).find('.ui-slider').css('background', bg_color);

          // Add to history 
          val_history.push(val);
        }

        // set up page
        $(display_element).load('templates/instructions_environmental_demo.html', 
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
  EnvironmentDemoPlugin.info = info;

  return EnvironmentDemoPlugin;
})(jsPsychModule);