/**
 * GlobalSettings - Manages persistent settings and trial-specific parameters for EXOBOUND
 * Handles the distinction between global settings that persist across trials and trial-specific parameters
 */
class GlobalSettings {
    constructor() {
        // Global settings that persist across trials
        this.global = {
            // Input settings
            reticleSpeed: 5,
            reticleBounds: {
                minX: 50,
                maxX: 974
            },
            
            // Audio settings
            masterVolume: 0.7,
            sfxVolume: 0.7,
            
            // Visual settings
            screenWidth: 1024,
            screenHeight: 768,
            
            // Game settings
            tutorialMode: true
        };
        
        // Trial-specific parameters (reset each trial)
        this.trial = {
            currentTrialIndex: 0,
            ideal_size: 50,
            standard_size: 50,
            n_fleetsize: 3,
            reception: 0.7,
            raiderType: 'red',
            raiderPosition: { x: 0.5, y: 0.3 },
            spawnRaider: true
        };
        
        console.log('GlobalSettings initialized');
    }
    
    /**
     * Set global setting
     */
    setGlobal(key, value) {
        if (key in this.global) {
            this.global[key] = value;
            console.log(`GlobalSettings: Set global.${key} =`, value);
        } else {
            console.warn(`GlobalSettings: Unknown global setting: ${key}`);
        }
    }
    
    /**
     * Get global setting
     */
    getGlobal(key) {
        if (key in this.global) {
            return this.global[key];
        } else {
            console.warn(`GlobalSettings: Unknown global setting: ${key}`);
            return null;
        }
    }
    
    /**
     * Set trial parameter
     */
    setTrial(key, value) {
        if (key in this.trial) {
            this.trial[key] = value;
            console.log(`GlobalSettings: Set trial.${key} =`, value);
        } else {
            console.warn(`GlobalSettings: Unknown trial parameter: ${key}`);
        }
    }
    
    /**
     * Get trial parameter
     */
    getTrial(key) {
        if (key in this.trial) {
            return this.trial[key];
        } else {
            console.warn(`GlobalSettings: Unknown trial parameter: ${key}`);
            return null;
        }
    }
    
    /**
     * Update trial parameters from trial data
     */
    updateTrialFromData(trialData) {
        if (!trialData) return;
        
        // Update trial parameters from provided data
        Object.keys(trialData).forEach(key => {
            if (key in this.trial) {
                this.trial[key] = trialData[key];
            }
        });
        
        console.log('GlobalSettings: Trial parameters updated from data:', trialData);
    }
    
    /**
     * Reset trial parameters to defaults
     */
    resetTrialParameters() {
        this.trial = {
            currentTrialIndex: 0,
            ideal_size: 50,
            standard_size: 50,
            n_fleetsize: 3,
            reception: 0.7,
            raiderType: 'red',
            raiderPosition: { x: 0.5, y: 0.3 },
            spawnRaider: true
        };
        
        console.log('GlobalSettings: Trial parameters reset to defaults');
    }
    
    /**
     * Get all current settings as a combined object
     */
    getAllSettings() {
        return {
            global: { ...this.global },
            trial: { ...this.trial }
        };
    }
    
    /**
     * Export settings for debugging
     */
    exportSettings() {
        return {
            global: JSON.parse(JSON.stringify(this.global)),
            trial: JSON.parse(JSON.stringify(this.trial))
        };
    }
} 