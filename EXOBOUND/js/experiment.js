/**
 * EXOBOUND: Tactical Fleet Command Research Study
 * © 2025 Azael Montejo Jr. | azaelmontejo.com | LinkedIn: @azaelmontejojr
 * Licensed under CC BY-NC 4.0 - Creative Commons Attribution-NonCommercial
 * 
 * Academic research study examining decision-making in complex tactical environments
 */

// Create global instances
const gameDataManager = new GameDataManager();
const globalSettings = new GlobalSettings();

// Initialize jsPsych
const jsPsych = initJsPsych({
    on_finish: function() {
        console.log('Experiment finished');
        const finalGameState = gameDataManager.getGameState();
        const campaignSummary = gameDataManager.getCampaignSummary();
        console.log('Final game state:', finalGameState);
        console.log('Campaign summary:', campaignSummary);
        // You could add code here to save the data to a server or database
    }
});

// --- Trial Definitions ---
const titleScreen = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <div style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; background: linear-gradient(135deg, #0c0c1a 0%, #1a0c2e 50%, #0c0c1a 100%); color: #fff; font-family: 'Orbitron', 'Arial', sans-serif; cursor: pointer; text-shadow: 0 0 10px rgba(102, 204, 255, 0.3);">
            <h1 style="color: #66ccff; font-size: 56px; text-shadow: 0 0 20px rgba(102, 204, 255, 0.8), 0 0 40px rgba(102, 204, 255, 0.4); margin-bottom: 10px; letter-spacing: 3px;">EXOBOUND</h1>
            <div style="color: #ff9900; font-size: 18px; font-weight: 300; letter-spacing: 8px; margin-bottom: 40px;">TACTICAL FLEET COMMAND</div>
            <div style="color: #888; font-size: 12px; margin-bottom: 80px; font-family: 'Arial', sans-serif;">© 2025 Azael Montejo Jr. | Academic Research Study</div>
            <p style="color: #ff9900; font-size: 24px; margin-top: 80px; animation: pulse 1.5s infinite; border: 1px solid #ff9900; padding: 15px 30px; border-radius: 25px; background: rgba(255, 153, 0, 0.1);">Click to Begin</p>
        </div>
        <style> 
            @keyframes pulse { 0% { opacity: 0.7; transform: scale(1); } 50% { opacity: 1; transform: scale(1.05); } 100% { opacity: 0.7; transform: scale(1); } } 
            body, html {width: 100%; height: 100%; margin: 0; padding: 0; font-family: 'Orbitron', 'Arial', sans-serif;} 
        </style>
    `,
    choices: 'NO_KEYS',
    on_load: function() {
        document.querySelector('#jspsych-content').addEventListener('click', () => jsPsych.finishTrial(), { once: true });
    }
};

const consentForm = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <div style="max-width: 800px; margin: auto; padding: 40px; text-align: left; font-family: 'Arial', sans-serif; line-height: 1.4; color: #333; background: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); font-size: 13px;">
            <!-- Princeton University Header -->
            <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #FF8C00; padding-bottom: 20px;">
                <div style="display: inline-block; margin-bottom: 15px;">
                    <img src="assets/Princeton seal.png" alt="Princeton University" style="width: 80px; height: 80px; object-fit: contain;">
                </div>
                <h1 style="color: #333; font-size: 20px; margin: 0; font-weight: bold;">ADULT CONSENT FORM</h1>
                <h2 style="color: #FF8C00; font-size: 16px; margin: 5px 0 0 0; font-weight: normal;">PRINCETON UNIVERSITY</h2>
            </div>
            
            <div style="margin-bottom: 20px;">
                <p><strong>TITLE OF RESEARCH:</strong> <em>Cognitive Foundations of Collaboration</em></p>
                <p><strong>PRINCIPAL INVESTIGATOR:</strong> Dr. Natalia Velez</p>
                <p><strong>PRINCIPAL INVESTIGATOR'S DEPARTMENT:</strong> Psychology</p>
            </div>
            
            <h3 style="color: #333; font-size: 14px; font-weight: bold; margin-top: 25px; text-decoration: underline;">Key information about the study:</h3>
            <p style="margin-bottom: 15px;">Please read this consent agreement carefully before deciding whether to participate in this experiment.</p>
            <p>This HIT is part of a scientific research project at Princeton University. Your decision to complete this HIT is voluntary. There is no way for us to identify you. The only information we will have, in addition to your responses, is the time at which you completed the survey. The results of the research may be presented at scientific meetings or published in scientific journals. Clicking on the "SUBMIT" button at the bottom of this page indicates that you are at least 18 years of age and agree to complete this HIT voluntarily.</p>
            
            <h3 style="color: #333; font-size: 14px; font-weight: bold; margin-top: 25px; text-decoration: underline;">Purpose of the research:</h3>
            <p>To study the cognitive capacities that enable people to reason, make decisions, and collaborate with others.</p>
            
            <h3 style="color: #333; font-size: 14px; font-weight: bold; margin-top: 25px; text-decoration: underline;">What you will do in this study:</h3>
            <p>Text, images and/or sounds will be presented on the computer and you will be asked to make choices.</p>
            
            <h3 style="color: #333; font-size: 14px; font-weight: bold; margin-top: 25px; text-decoration: underline;">Time required:</h3>
            <p>The duration will vary between 5 and 45 minutes.</p>
            
            <h3 style="color: #333; font-size: 14px; font-weight: bold; margin-top: 25px; text-decoration: underline;">Risks:</h3>
            <p>The effects of participating should be comparable to those you would experience from viewing a computer monitor for the task duration and using a mouse or keyboard.</p>
            
            <h3 style="color: #333; font-size: 14px; font-weight: bold; margin-top: 25px; text-decoration: underline;">Confidentiality:</h3>
            <p>We will not ask for any personally identifying information and will collect, analyze, and store your responses in a pseudonymous way. Your name or Worker IDs will never tie back to your responses in this study. However, we cannot guarantee the confidentiality of information transmitted over the Internet. To minimize this risk, data containing anything that might be personally identifiable (e.g., Worker IDs) will be encrypted on transfer and storage and will only be accessible to authorized research personnel. We will keep the data collected as part of this experiment indefinitely.</p>
            
            <h3 style="color: #333; font-size: 14px; font-weight: bold; margin-top: 25px; text-decoration: underline;">Benefits:</h3>
            <p>This study provides no direct benefits to you individually. The study provides important information about how people reason and collaborate. Others may benefit in the future from the results of this study.</p>
            
            <h3 style="color: #333; font-size: 14px; font-weight: bold; margin-top: 25px; text-decoration: underline;">Compensation:</h3>
            <p>For your participation, you will receive course credit for participation. Students completing the Research Engagement Assignment will receive course credit. If you have any questions about the study, feel free to contact the researcher or the Principal Investigator, Dr. Natalia Velez at nvelez@princeton.edu.</p>
            
            <h3 style="color: #333; font-size: 14px; font-weight: bold; margin-top: 25px; text-decoration: underline;">Participation and withdrawal:</h3>
            <p>Your participation in this study is completely voluntary and you may refuse to participate or you may choose to withdraw at any time without penalty or loss of benefits to which you are otherwise entitled.</p>
            
            <h3 style="color: #333; font-size: 14px; font-weight: bold; margin-top: 25px; text-decoration: underline;">Who to contact with questions:</h3>
            <p>If you have questions or concerns about your participation or want to request a summary of research findings, please contact the Principal Investigator:</p>
            <ul style="margin: 10px 0;">
                <li>Dr. Natalia Velez</li>
                <li>nvelez@princeton.edu</li>
                <li>Phone: (609) 258-7556</li>
            </ul>
            
            <p>If you have questions regarding your rights as a research subject, or if problems arise that you do not feel you can discuss with the Investigator, please contact the Institutional Review Board at:</p>
            <ul style="margin: 10px 0;">
                <li>Assistant Director, Research Integrity and Assurance</li>
                <li>Phone: (609) 258-8543</li>
                <li>Email: irb@princeton.edu</li>
            </ul>
            
            <h3 style="color: #333; font-size: 14px; font-weight: bold; margin-top: 25px; text-decoration: underline;">Summary:</h3>
            <p>I understand the information that was presented and that:</p>
            <ul style="margin: 10px 0;">
                <li>My participation is voluntary, and I may discontinue participation at any time without penalty or loss of benefits.</li>
                <li>My refusal to participate will involve no penalty or loss of benefits to which I am otherwise entitled.</li>
                <li>I do not give up any legal rights or release Princeton University or its agents from liability for negligence.</li>
                </ul>
                
            <p style="margin-top: 20px; margin-bottom: 20px;"><strong>I hereby give my consent to be the subject of the research.</strong></p>
            
            <div style="text-align: center; margin-top: 30px; margin-bottom: 20px;">
                <label style="display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; color: #333;">
                    <input type="checkbox" id="consent-checkbox" required style="margin-right: 10px; transform: scale(1.5);">
                    I have read and understood the above information and agree to participate in this study
                </label>
            </div>
            
            <div style="text-align: center; margin-top: 20px; margin-bottom: 30px;">
                <button id="consent-button" style="
                    background-color: #cccccc;
                    color: #666666;
                    border: none;
                    padding: 12px 30px;
                    font-size: 16px;
                    font-weight: bold;
                    border-radius: 5px;
                    cursor: not-allowed;
                    transition: all 0.3s ease;
                " disabled>
                    I Consent to Participate
                </button>
            </div>
        </div>
    `,
    choices: "NO_KEYS",
    on_load: function() {
        const consentButton = document.getElementById('consent-button');
        const consentCheckbox = document.getElementById('consent-checkbox');
        
        consentCheckbox.addEventListener('change', function() {
            if (this.checked) {
                consentButton.disabled = false;
                consentButton.style.backgroundColor = '#2c5aa0';
                consentButton.style.cursor = 'pointer';
                consentButton.style.color = 'white';
            } else {
                consentButton.disabled = true;
                consentButton.style.backgroundColor = '#cccccc';
                consentButton.style.cursor = 'not-allowed';
                consentButton.style.color = '#666666';
            }
        });
        
        consentButton.addEventListener('click', function() {
            if (!this.disabled) {
                jsPsych.finishTrial({
                    consent: consentCheckbox.checked
                });
            }
        });
    }
};

const missionBriefing = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <div style="max-width: 800px; margin: auto; text-align: left; cursor: pointer;">
            <h1>Mission Briefing</h1>
            <p>Your mission is to command a tactical fleet defending against alien threats.</p>
            <p>You will control a targeting reticle with your mouse. Use it to choose between targeting the Main Asteroid (standard approach) or the Raider ships (ideal approach).</p>
            <p><strong>Campaign Structure:</strong></p>
            <ul>
                <li><strong>Tutorial Wave:</strong> Interactive training to learn the basics</li>
                <li><strong>10 Mission Waves:</strong> Each wave contains 5 trials with varying conditions</li>
                <li><strong>Wave Outcomes:</strong> Your performance determines success or failure for each wave</li>
            </ul>
            <p><strong>Key Concepts:</strong></p>
            <ul>
                <li><strong>Environmental Loss:</strong> Minimized by targeting the ideal raider position</li>
                <li><strong>Teamwork Loss:</strong> Affected by how many allies coordinate with your choice</li>
                <li><strong>Reception:</strong> The probability that your allies will follow your targeting choice</li>
            </ul>
            <p style="color: #ff9900; font-size: 18px; margin-top: 30px; text-align: center;">Click to begin the tutorial wave</p>
        </div>
    `,
    choices: 'NO_KEYS',
    on_load: function() {
        document.querySelector('#jspsych-content').addEventListener('click', () => jsPsych.finishTrial(), { once: true });
    }
};

// Generate complete campaign with tutorial wave + 10 main waves
const completeCampaign = gameDataManager.generateCompleteCampaign(); // 51 total trials (1 tutorial + 50 campaign)
// Initialize GameDataManager with all trials
gameDataManager.initialize(completeCampaign);

// Create a jsPsych trial for each campaign trial
const phaserTrials = completeCampaign.map((trial, idx) => {
    return {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: '<div id="jspsych-phaser-game-container" style="width:1024px; height:768px; margin:auto;"></div>',
        choices: "NO_KEYS",
        trial_duration: null, // Let Phaser control when the trial ends
        on_load: function() {
            // Set up the correct trial in GameDataManager
            gameDataManager.setupTrial(idx);
            // Optionally update global settings here if needed
            // Launch Phaser game for this trial
            const config = {
                type: Phaser.AUTO,
                width: 1024,
                height: 768,
                parent: 'jspsych-phaser-game-container',
                backgroundColor: '#0c0c0c',
                scene: [BootScene, BriefingScene, GameScene, TutorialUIScene, HUDScene, FeedbackSceneV2, WaveOutcomeScene],
                callbacks: {
                    preBoot: function(game) {
                        game.registry.set('gameDataManager', gameDataManager);
                        game.registry.set('globalSettings', globalSettings);
                        game.registry.set('jsPsych', jsPsych); // Make jsPsych instance available to scenes
                    }
                }
            };
            // Destroy any previous Phaser game instance if needed
            if (window.Phaser && window.Phaser.GAMES && window.Phaser.GAMES.length > 0) {
                window.Phaser.GAMES.forEach(g => { if (g && g.destroy) g.destroy(true); });
            }
            const game = new Phaser.Game(config);
        }
    };
});

const thanksTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <div id="jspsych-phaser-game-container" style="width:1024px; height:768px; margin:auto;"></div>
    `,
    choices: "NO_KEYS",
    trial_duration: null,
    on_load: function() {
        // Launch PostSurveyScene
        const config = {
            type: Phaser.AUTO,
            width: 1024,
            height: 768,
            parent: 'jspsych-phaser-game-container',
            backgroundColor: '#0c0c0c',
            scene: [PostSurveyScene],
            callbacks: {
                preBoot: function(game) {
                    game.registry.set('gameDataManager', gameDataManager);
                    game.registry.set('globalSettings', globalSettings);
                    game.registry.set('jsPsych', jsPsych);
                }
            }
        };
        
        // Destroy any previous Phaser game instance
        if (window.Phaser && window.Phaser.GAMES && window.Phaser.GAMES.length > 0) {
            window.Phaser.GAMES.forEach(g => { if (g && g.destroy) g.destroy(true); });
        }
        
        const game = new Phaser.Game(config);
    }
};

// Build timeline and run jsPsych with one Phaser trial per campaign trial
const timeline = [titleScreen, consentForm, missionBriefing, ...phaserTrials, thanksTrial];

// Initialize experiment once all resources are loaded
function initializeExperiment() {
    console.log('EXOBOUND: All resources loaded, starting experiment...');
    
    // Hide loading screen
    const loadingScreen = document.getElementById('loading');
    if (loadingScreen) {
        loadingScreen.style.transition = 'opacity 0.5s ease-out';
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
    
    // Start jsPsych experiment
    jsPsych.run(timeline);
}

// Wait for DOM and all resources to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initializeExperiment, 1000); // Small delay to ensure all scripts loaded
    });
} else {
    setTimeout(initializeExperiment, 1000);
}
