var choice_screen = (function (jspsych) {
  "use strict";

  const info = {
    name: "choice_screen",
    parameters: {
      ideal_size: {
        type: jspsych.ParameterType.INT,
        default: 30,
      },
      standard_size: {
        type: jspsych.ParameterType.INT,
        default: 60,
      },
      n_engineers: {
        type: jspsych.ParameterType.INT,
        default: 3,
      },
      p_message: {
        type: jspsych.ParameterType.INT,
        default: .5,
      },
      widget: {
        type: jspsych.ParameterType.IMAGE,
        default: 'images/widget_demo.jpg'
      },
      trial_no: {
        type: jspsych.ParameterType.INT,
        default: 1,
      },
      n_trials: {
        type: jspsych.ParameterType.INT,
        default: 1
      },
    },
  };

  /**
   * ** CHOICE SCREEN **
   *
   * ALLOWS PARTICIPANTS TO MOVE A SLIDER AROUND TO RESIZE A WIDGET,
   * BASED ON THAT WIDGET'S IDEAL AND STANDARD SIZE, AND CURRENT RECEPTION
   *
   * @author NATALIA VELEZ
   */
  class ChoiceScreenPlugin {
    constructor(jsPsych) {

      this.jsPsych = jsPsych;
    }
    trial(display_element, trial) {
      var starting_point = 50;
      var response = starting_point + 50;

      // Helper function: make tick marks
      function createSlider() {
        // clear old tick marks
        var $slider = $('#slider');
        $slider.find('.ui-slider-tick-mark').remove();

        // ideal size
        var ideal_color = '#f7ae02';
        var ideal_html = '<span class="ui-slider-tick-mark"></span>';
        var ideal_label = '<span class="ui-slider-tick-label">Ideal</span>';
        var ideal_pct = Math.round(trial.ideal_size - 50);
        var ideal_left = sprintf('%i%%', ideal_pct)
        $(ideal_html).css({ left: ideal_left, background: ideal_color }).appendTo($slider);
        $(ideal_label).css({ left: ideal_left, color: ideal_color }).appendTo($slider);

        // standard size
        var std_color = '#9888d9';
        var std_html = '<span class="ui-slider-tick-mark"></span>';
        var std_label = '<span class="ui-slider-tick-label">Standard</span>';
        var std_pct = Math.round(trial.standard_size - 50);
        var std_left = sprintf('%i%%', std_pct)
        $(std_html).css({ left: std_left, background: std_color }).appendTo($slider);
        $(std_label).css({ left: std_left, color: std_color }).appendTo($slider);

        // set starting widget size
        var starting_size = widget_size(starting_point);
        var widget = $(display_element).find('.widget');
        widget.css(starting_size);
        $(display_element).find('#slider_size').html(starting_point + 50);
      }

      function startSlider(event, ui) {

        var button = $(display_element).find('button');
        $(button).removeClass('inactive');
        $(button).unbind('click');
        $(button).one('click', function () {
          $(this).unbind('click');

          // data saving
          var trial_data = {
            'widget': trial.widget,
            'ideal_size': trial.ideal_size,
            'n_engineers': trial.n_engineers,
            'p_message': trial.p_message,
            'standard_size': trial.standard_size,
            'val': response
          };

          jsPsych.finishTrial(trial_data);
        });
      }

      function updateSlider(event, ui) {
        var val = ui.value;
        response = val + 50;

        // Update widget size
        var widget = $(display_element).find('.widget');
        widget.css(widget_size(val));

        // Report size
        var size_out = $(display_element).find('#slider_size');
        size_out.html(val + 50);
      }

      // set up page
      $(display_element).load('templates/choice_screen.html', function () {
        // Fill in content
        $(display_element).find('#trial-counter').html(trial.trial_no);
        $(display_element).find('#counter-total').html(trial.n_trials);
        $(display_element).find('#std-size').html(trial.standard_size);
        $(display_element).find('#ideal-size').html(trial.ideal_size);
        $(display_element).find('#n-team').html(trial.n_engineers);
        $(display_element).find('#p-message').html(sprintf('%i%%', trial.p_message * 100));
        $(display_element).find('img').attr('src', trial.widget);

        // Initialize slider
        $(display_element).find('#slider').slider({
          value: starting_point,
          min: 0,
          max: 100,
          create: createSlider,
          start: startSlider,
          slide: updateSlider
        });
      });

    }
  }
  ChoiceScreenPlugin.info = info;

  return ChoiceScreenPlugin;
})(jsPsychModule);