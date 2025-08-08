// Component for displaying battle results
class ResultsDisplay {
    constructor(scene) {
        this.scene = scene;
    }
    
    displayResults(trialResult) {
        // trialResult: { allocation, fleetToRaider, fleetToAsteroid, adaptationLoss, coordinationLoss, bonus, n_fleetsize }
        const { allocation, fleetToRaider, fleetToAsteroid, adaptationLoss, coordinationLoss, bonus, n_fleetsize } = trialResult;
        const raiderPercent = Math.round((allocation || 0) * 100);
        const asteroidPercent = 100 - raiderPercent;

        // Show allocation chosen
        this.scene.add.text(this.scene.cameras.main.width * 0.5, this.scene.cameras.main.height * 0.32,
            `You allocated ${raiderPercent}% to raider, ${asteroidPercent}% to asteroid`, {
                fontFamily: 'Arial',
                fontSize: '20px',
                color: '#00ffcc'
            }).setOrigin(0.5, 0);

        // Show actual fleet assignments
        this.scene.add.text(this.scene.cameras.main.width * 0.5, this.scene.cameras.main.height * 0.38,
            `Fleet Attacking Raider: ${fleetToRaider}/${n_fleetsize} | Asteroid: ${fleetToAsteroid}/${n_fleetsize}`,
            {
                fontFamily: 'Arial',
                fontSize: '20px',
                color: '#00ffcc'
            }).setOrigin(0.5, 0);

        // Show scoring
        this.scene.add.text(this.scene.cameras.main.width * 0.5, this.scene.cameras.main.height * 0.45,
            `Adaptation Loss: ${adaptationLoss.toFixed(2)} | Coordination Loss: ${coordinationLoss.toFixed(2)} | Bonus: ${bonus}`,
            {
                fontFamily: 'Arial',
                fontSize: '20px',
                color: '#ffff00'
            }).setOrigin(0.5, 0);
    }
    
    addContinueButton(callback) {
        // Add continue button
        const continueButton = this.scene.add.text(
            this.scene.cameras.main.width / 2, 
            this.scene.cameras.main.height * 0.9, 
            'CONTINUE', {
                fontFamily: 'Arial',
                fontSize: '24px',
                color: '#ffffff',
                backgroundColor: '#004466',
                padding: { x: 20, y: 10 }
            }
        ).setOrigin(0.5, 0.5);
        
        // Make button interactive
        continueButton.setInteractive({ useHandCursor: true });
        
        // Add hover effect
        continueButton.on('pointerover', () => {
            continueButton.setStyle({ backgroundColor: '#0066aa' });
        });
        
        continueButton.on('pointerout', () => {
            continueButton.setStyle({ backgroundColor: '#004466' });
        });
        
        // Add click handler
        continueButton.on('pointerdown', () => {
            // Play click sound if available
            if (this.scene.sound.get('click')) {
                this.scene.sound.play('click');
            }
            
            // Execute callback
            if (callback && typeof callback === 'function') {
                callback();
            }
        });
        
        return continueButton;
    }
}
