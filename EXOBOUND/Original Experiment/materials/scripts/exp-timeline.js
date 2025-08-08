/* global vars (needed to advance past instructions) */
var check_score = 0;
var total_bonus = 0;

/* initialize jsPsych */
var jsPsych = initJsPsych({
    on_finish: function() {
      // Submit data
      var urlParams = parseURLParams(window.location.href);

      data = {
        worker: urlParams.workerId[0],
        assignment: urlParams.assignmentId[0],
        hit: urlParams.hitId[0],
        timestamp: Date.now(),
        version: '2023-05-11_widgets_exp1_pilot',
        data: jsPsych.data.get().json()
      };

      $('body').load('templates/debrief.html', function(){
        $('#total-bonus').html(sprintf('$%0.2f', total_bonus));
      });

      if (urlParams.hasOwnProperty('debug')) {
        console.log(data);
      } else {
        save_data(data);
      }
    },
    show_progress_bar: true
  });

  /* preload images */
  const test_widgets = _.range(1,51).map(function(e) {return sprintf('images/widget_%02d.jpg', e)}); 
  const all_widgets = test_widgets.concat(['images/widget_demo.jpg']);
  const preload_images = all_widgets.concat([
    'images/nasa-yZygONrUBe8-unsplash.jpg',
    'images/the-new-york-public-library-kvHhSroTNPY-unsplash.jpg',
    'images/hero_reception-01.png'
  ]);
  var intro_timeline = [
    {
      type: jsPsychPreload,
      images: all_widgets
    },
    {
      type: consent
    },
    {
      type: jsPsychFullscreen
    }
];

  /* instructions */
  const instructions_timeline = [
    {
      type: instructions_html,
      hero: 'images/nasa-yZygONrUBe8-unsplash.jpg',
      prompt: `
      You are an aerospace engineer. Your task is to create machine parts, called "Widgets," that will
      help astronauts collect samples of meteor fragments in Earth's orbit. Each month, you will be
      responsible for picking the size of one Widget.</p>
      <p>Widgets have a standard size written in your company manual, but there is also an ideal size
       based on local environmental conditions. The ideal size differs each month, and is known to you,
       but NOT to other engineers on the space station who are making other machine parts that connect
       with yours.</p>
      `
    },
    {type: environment_demo},
    {type: environment_check},
    {
      type: instructions_html,
      hero: 'images/the-new-york-public-library-kvHhSroTNPY-unsplash.jpg',
      prompt: `
      Second, you'll also be given an <strong class="std-size-container">teamwork loss score</strong> based on 
      how many errors you accumulate while coordinating with
      engineers on the space station. The other engineers are building Connectors that will connect with
      your Widget. Each engineer will try to pick a Connector size that's as close as possible to the size
      of your Widget. Once you've built your Widget, its specifications will be sent to the other engineers
      to help them.
      `
    },
    {
      type: instructions_html,
      hero: 'images/hero_reception-01.png',
      prompt: `
      If engineers always knew the size of the Widget you made, then they would always be able to build
      Connectors that matched it perfectly. The problem is that it's hard to transmit messages through space.
      Your <strong>reception</strong> is the chance that any message you send to engineers will get through.
      Your reception changes randomly each month; for example, your messages may be more likely to get lost when
      there's a solar flare, or when the space station flies far away from your workshop on Earth.</p>
      <p>If your message successfully gets through to an engineer on the space station, they will build a
      Connector of <strong>exactly the right size for your Widget</strong>, and your teamwork loss score
      will be 0 (hooray!). But if your message fails to get through, the engineer will build a
      Connector that fits the <strong>standard size</strong> Widget, and your teamwork loss score will
      depend on how far your Widget is to the ideal size.</p>
      `
    },
    {
      type: social_demo,
      ideal_size: 60,
      n_engineers: 1,
      reception: 0,
      prompt: `
      On each trial, we'll tell you the <strong>number of engineers</strong> who are going to build connectors
      for your Widget. Your teamwork score will be affected by the number of engineers and the reception. The
      more engineers miss your message, the more your teamwork loss score will be affected moving away from the standard
      size.</p>

      <p>Let's try it out! In the example below, 1 engineer is waiting to build a connector for
      your Widget. The reception is at 0%, so this engineer will <emph>always</emph> miss your message and build
      a Connector in the standard size. Try moving the slider around, and see how moving away from the standard
      size affects your teamwork loss score.
      `
    },
    {
      type: social_demo,
      ideal_size: 60,
      n_engineers: 10,
      p_message: 0,
      prompt: `
      Now there are <strong>10</strong> engineers! Try moving the slider around, and see how moving away from
      the standard size affects your teamwork loss score.
      `
    },
    {
      type: instructions_html,
      prompt: `
      Try to customize the size of your Widget to balance your <strong class="ideal-size-container">environment</strong> and <strong class="std-size-container">teamwork</strong> losses! The smaller your total losses, the bigger your bonus will be.</p>
      <p>Next, you'll be given a quiz to make sure that you understand the game. <strong>Please answer the questions carefully. If you fail the quiz, you may have to repeat the instructions.</strong>
      `
    }
  ];

  /* check questions */
  const check_timeline = [
    {
      type: check_question,
      name: "ideal_size",
      prompt: "What is the ideal size for a widget?",
      options: [
        {
          opt_name: "different",
          label: "It's the best possible size, given current environmental conditions; this number can be different for every widget",
          correct: true
        },
        {
          opt_name: "same",
          label: "It's the standard size written in the company manual; this number is always the same"
        },
        {
          opt_name: "distractor",
          label: "About the size of a toaster"
        }
      ],
      n_questions: 5,
      q_index: 1,
      on_start: function() {
        console.log('Setting check question score back to 0...')
        check_score = 0;
      },
      on_finish: function(data) {
        if (data.correct) {
          check_score += 1;
        }
      }
    },
    {
      type: check_question,
      name: "env_score",
      prompt: "How do you minimize your <strong>environment losses</strong>?",
      options: [
        {
          opt_name: "standard",
          label: "By building a Widget that's as close as possible to the <strong>standard</strong> size"
        },
        {
          opt_name: "ideal",
          label: "By building a Widget that's as close as possible to the <strong>ideal</strong> size",
          correct: true
        },
        {
          opt_name: "distractor",
          label: "By recycling and taking my bike to work"
        }
      ],
      n_questions: 5,
      q_index: 2,
      on_finish: function(data) {
        if (data.correct) {
          check_score += 1;
        }
      }
    },
    {
      type: check_question,
      name: "reception",
      prompt: "How does <strong>reception</strong> affect your <strong>teamwork score</strong>?",
      options: [
        {
          opt_name: "low",
          label: "At <strong>low</strong> reception, more engineers will miss your message and build connectors in the standard size"
        },
        {
          opt_name: "high",
          label: "At <strong>high</strong> reception, more engineers will get your message and build connectors that are the exact size for your Widget",
        },
        {
          opt_name: "both",
          label: "All of the above",
          correct: true
        },
      ],
      n_questions: 5,
      q_index: 3,
      on_finish: function(data) {
        if (data.correct) {
          check_score += 1;
        }
      }
    },
    {
      type: check_question,
      name: "n_engineers",
      prompt: "How does the <strong>number of engineers</strong> affect your <strong>teamwork score</strong>?",
      options: [
        {
          opt_name: "standard",
          label: "The more engineers miss your message, the more teamwork points you'll lose by moving away from the standard size",
          correct: true
        },
        {
          opt_name: "always_higher",
          label: "The more engineers you have, the higher your teamwork score will be",
        },
        {
          opt_name: "snacks",
          label: "The more engineers you have, the more snacks you'll need to buy for the office"
        },
      ],
      n_questions: 5,
      q_index: 4,
      on_finish: function(data) {
        if (data.correct) {
          check_score += 1;
        }
      }
    },
    {
      type: check_question,
      name: "high_score",
      prompt: "How can you earn the biggest possible bonus?",
      options: [
        {
          opt_name: "always_ideal",
          label: "By always making Widgets in the <strong>ideal</strong> size",
        },
        {
          opt_name: "always_standard",
          label: "By always making Widgets in the <strong>standard</strong> size",
        },
        {
          opt_name: "balance",
          label: "By customizing the size of your Widget to minimize your environment and teamwork losses",
          correct: true
        },
      ],
      n_questions: 5,
      q_index: 5,
      on_finish: function(data) {
        if (data.correct) {
          check_score += 1;
        }
      }
    },
    {
      type: instructions_html,
      prompt: function() {
        var s = sprintf("Your final score is <strong>%i/5</strong></p>", check_score)
        if (check_score == 5) {
          s += "<p>Congratulations, you passed! The task will now begin."
        } else {
          s += "<p>Unfortunately, you have failed the check questions. You will now repeat the instructions."
        }
        return s
      }
    }
  ];

  const loop_node = {
    timeline: instructions_timeline.concat(check_timeline),
    loop_function: function() {
      return check_score < 5
    }
  };

  /* main task loop */
  // Experiment parameters (change this to run new experiments!)
  const exp = {
    standard_size: [100],
    ideal_size: [60, 70, 80, 90, 100, 110, 120, 130, 140],
    n_engineers: [3],
    p_message: [0, .25, .5, .75, 1]
  };

  // Shuffle all combinations of experiment parameters
  var trial_params = cartesian(exp.ideal_size, exp.standard_size, exp.n_engineers, exp.p_message);
  let widgets_sample = _.sample(test_widgets, trial_params.length);
  shuffleArray(trial_params);

  // Create trial timeline
  var trial_timeline = trial_params.map(function(t) {
    let widget = widgets_sample.pop();
    let keys = ['type', 'ideal_size', 'standard_size', 'n_engineers', 'p_message', 'widget'];
    let vals = [choice_screen].concat(t).concat([widget]);

    return _.object(keys,vals);
  });

  var feedback_timeline = _.times(trial_timeline.length, function(){return {
    type: feedback_screen,
    on_finish: function(data) {
      total_bonus += data.bonus
    }
  }});

  trial_timeline = $.map(trial_timeline, function(v, i) {
    var v_t = Object.assign({}, v);
    v_t['trial_no'] = i+1;
    v_t['n_trials'] = trial_params.length;
    return [v_t, feedback_timeline[i]]; 
  });

  const post_timeline = [
    {
      type: jsPsychSurveyText,
      questions: [
        {prompt: 'In 1-2 sentences, please describe the HIT you just completed.', rows: 5, required: true}
      ]
    },
    {
      type: post_survey
    }
  ]

  const timeline = intro_timeline.concat([loop_node], trial_timeline, post_timeline);

  /* start the experiment */
  jsPsych.run(timeline);


