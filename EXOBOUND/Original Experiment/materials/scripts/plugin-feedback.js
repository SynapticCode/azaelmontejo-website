var feedback_screen = (function (jspsych) {
    "use strict";
  
    const info = {
      name: "feedback",
      parameters: {
      },
    };
  
    /**
     * ** FEEDBACK SCREEN **
     *
     * CALCULATES PARTICIPANT'S ENVIRONMENT & SOCIAL SCORE
     *
     * @author NATALIA VELEZ
     */
    class FeedbackPlugin {
      constructor(jsPsych) {

        this.jsPsych = jsPsych;
      }
      trial(display_element, trial) {
        // show response from last trial in feedback screen
        var data = jsPsych.data.getLastTrialData().trials[0];

        var env_loss = null;
        var social_loss = null;
        var n_received = null;

          // slider event handler
          function createSlider(){
            // clear old tick marks
            var $slider =  $('#slider');
            $slider.find('.ui-slider-tick-mark').remove();
            $slider.find('.ui-slider-handle')
            
            // ideal size
            var ideal_color = '#f7ae02';
            var ideal_html = '<span class="ui-slider-tick-mark"></span>';
            var ideal_label = '<span class="ui-slider-tick-label">Ideal</span>';
            var ideal_pct = Math.round(data.ideal_size-50);
            var ideal_left = sprintf('%i%%', ideal_pct);
            $(ideal_html).css({left: ideal_left, background: ideal_color}).appendTo($slider);
            $(ideal_label).css({left: ideal_left, color: ideal_color}).appendTo($slider);
  
            // standard size
            var std_color = '#9888d9';
            var std_html = '<span class="ui-slider-tick-mark"></span>';
            var std_label = '<span class="ui-slider-tick-label">Standard</span>';
            var std_pct = Math.round(data.standard_size-50);
            var std_left = sprintf('%i%%', std_pct);
            $(std_html).css({left: std_left, background: std_color}).appendTo($slider);
            $(std_label).css({left: std_left, color: std_color}).appendTo($slider);  

            // participant choice
            var val_label = '<span class="ui-slider-val-label">Your Answer</span>';
            var val_pct = Math.round(data.val-50);
            var val_left = sprintf('%i%%', val_pct);
            $(val_label).css({left: val_left}).appendTo($slider);  
        }

          // set up page
          $(display_element).load('templates/feedback.html', function(){
            // calculate successes
            n_received = binom(data.n_engineers, data.p_message);
            $(display_element).find('#n_received').html(n_received);
            $(display_element).find('#n_failed').html(data.n_engineers-n_received);

            // fill in sizes
            $(display_element).find('#ideal').html(data.val);
            $(display_element).find('#std').html(data.standard_size);

            // environmental score
            env_loss = .1*Math.pow(data.val-data.ideal_size, 2);
            $(display_element).find('.env-score').html(-1*Math.round(env_loss));

            // social score
            var ind_loss = Math.pow(data.val-data.standard_size, 2);
            social_loss = .05*(data.n_engineers-n_received)*ind_loss;
            $(display_element).find('.social-score').html(-1*Math.round(social_loss));

            // total score
            var total_loss = env_loss + social_loss;
            $(display_element).find('.total-score').html(-1*Math.round(total_loss));

            // calculate bonus
            var max_bonus = 5/45;
            var raw_bonus = max_bonus - 1/2000*total_loss;
            var bounded_bonus = Math.min(max_bonus, Math.max(raw_bonus, 0));
            $(display_element).find('.bonus').html(sprintf('$%0.2f', bounded_bonus));

            $(display_element).find('#slider').slider({
                value: data.val,
                min: 50,
                max: 150,
                create: createSlider,
                slide: function(event, ui) { return false }
              });

            // advance trial
            var button = $(display_element).find('.progress-btn');
            $(button).addClass('active');
            setTimeout(function(){
              $(button).one('click', function(){
                $(this).unbind('click');
                var trial_data = {
                  'widget': data.widget,
                  'ideal_size': data.ideal_size,
                  'n_engineers': data.n_engineers,
                  'p_message': data.p_message,
                  'standard_size': data.standard_size,
                  'response': data.val,
                  'n_received': n_received,
                  'env_loss': env_loss,
                  'social_loss': social_loss,
                  'bonus': bounded_bonus
                };
                jsPsych.finishTrial(trial_data);
              });
            }, 1500);
          }); 
  
      }
    }
    FeedbackPlugin.info = info;
  
    return FeedbackPlugin;
  })(jsPsychModule);