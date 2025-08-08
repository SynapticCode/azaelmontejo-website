export class PhaserGamePlugin {
    static info = {
        name: "phaser-game",
        parameters: {
            // The configuration object for the Phaser game.
            game_config: {
                type: Object,
                pretty_name: "Game Configuration",
                default: null,
            },
            // The ID of the div element where the game will be rendered.
            target_element_id: {
                type: String,
                pretty_name: "Target Element ID",
                default: "phaser-game-container",
            },
            // The width of the game canvas.
            width: {
                type: Number,
                pretty_name: "Width",
                default: 800,
            },
            // The height of the game canvas.
            height: {
                type: Number,
                pretty_name: "Height",
                default: 600,
            },
        },
    };

    constructor(jsPsych) {
        this.jsPsych = jsPsych;
    }

    trial(display_element, trial) {
        // Create a container for the game
        const gameContainer = document.createElement("div");
        gameContainer.id = trial.target_element_id;
        display_element.appendChild(gameContainer);

        // This promise will resolve when the Phaser game signals that it is finished.
        return new Promise((resolve, reject) => {
            // A global function for Phaser to call when the trial is over.
            // This is the bridge from Phaser back to jsPsych.
            window.endPhaserTrial = (data) => {
                // Clean up the global function to avoid conflicts
                delete window.endPhaserTrial;

                // Prepare the final data object for jsPsych
                const trial_data = {
                   ...data, // Include all data passed from the Phaser game
                };

                // End the jsPsych trial
                this.jsPsych.finishTrial(trial_data);

                // Resolve the promise to let jsPsych know this async trial is done
                resolve(); 
            };

            // Configure and start the Phaser game
            const gameConfig = {
               ...trial.game_config, // Pass in the main game config
                width: trial.width,
                height: trial.height,
                parent: trial.target_element_id, // Tell Phaser where to render
            };

            // The Phaser game instance is created here.
            try {
                // This assumes a global `MyGame` constructor is available
                new window.MyGame(gameConfig);
            } catch (error) {
                console.error("Failed to start Phaser game:", error);
                reject(error);
            }
        });
    }
}
