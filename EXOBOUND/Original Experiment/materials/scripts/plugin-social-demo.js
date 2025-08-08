var social_demo = (function (jspsych) {
    "use strict";

    const info = {
        name: "social_demo",
        parameters: {
            ideal_size: {
                type: jspsych.ParameterType.INT,
                default: 60,
            },
            standard_size: {
                type: jspsych.ParameterType.INT,
                default: 100,
            },
            n_engineers: {
                type: jspsych.ParameterType.INT,
                default: 1,
            },
            p_message: {
                type: jspsych.ParameterType.INT,
                default: 0,
            },
            prompt: {
                type: jspsych.ParameterType.HTML_STRING,
                default: undefined,
            },
            widget: {
                type: jspsych.ParameterType.IMAGE,
                default: 'images/widget_demo.jpg'
            }
        },
    };

    /**
     * **SOCIAL DEMO **
     *
     * ALLOWS PARTICIPANTS TO MOVE A SLIDER AROUND TO RESIZE A WIDGET AND
     * TEST THAT WIDGET'S SOCIAL SCORE
     *
     * @author NATALIA VELEZ
     */
    class SocialDemoPlugin {
        constructor(jsPsych) {

            this.jsPsych = jsPsych;
        }
        trial(display_element, trial) {
            var response = null;
            var loss_gradient = ['#ffffff', '#eecfcd', '#daa19e', '#c37370', '#a84446', '#8b0020'];

            // precompute loss function
            function loss_fun(val) {
                let ind_loss = Math.pow(val - trial.standard_size, 2);
                let social_loss = .05 * trial.n_engineers * ind_loss;
                return social_loss
            }

            // assign a color based on loss
            function color_idx(loss) {
                return Math.min(loss_gradient.length, Math.floor(Math.log10(loss + 1)));
            }

            // slider event handlers
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


                var widget = $(display_element).find('.widget');
                var init_loss = loss_fun(100);
                var init_color = loss_gradient[color_idx(init_loss)];

                widget.css(widget_size(50));

                $(display_element).find('#slider_size').html(100);
                $(display_element).find('#slider_score').html(loss_str(init_loss));
                $(display_element).find('#slider_score').css('background', init_color);
                $(display_element).find('.ui-slider').css('background', init_color);

            };

            function startSlider(event, ui) {

                var button = $(display_element).find('button');
                $(button).removeClass('inactive');
                $(button).unbind('click');
                $(button).one('click', function () {
                    $(this).unbind('click');

                    // data saving
                    var trial_data = jQuery.extend(info, {
                        val: response,
                        score: loss_fun(response)
                    });

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
                size_out.html(response);

                // Report score
                var score = loss_fun(response);
                var score_out = $(display_element).find('#slider_score');
                score_out.html(loss_str(score));

                // Update colors
                var bg_color = loss_gradient[color_idx(score)];
                $(display_element).find('#slider_score').css('background', bg_color);
                $(display_element).find('.ui-slider').css('background', bg_color);
            }

            // set up page
            $(display_element).load('templates/instructions_social_demo.html',
                function () {
                    // fill in content
                    $(display_element).find('#prompt').html(trial.prompt);
                    $(display_element).find('#std-size').html(trial.standard_size);
                    $(display_element).find('#ideal-size').html(trial.ideal_size);
                    $(display_element).find('#n-team').html(trial.n_engineers);
                    $(display_element).find('#p-message').html(sprintf('%i%%', trial.p_message * 100));
                    $(display_element).find('img').attr('src', trial.widget);

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
    SocialDemoPlugin.info = info;

    return SocialDemoPlugin;
})(jsPsychModule);