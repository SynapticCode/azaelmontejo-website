/**
 * InputManager - Centralized input handling for EXOBOUND
 * Manages keyboard, mouse, and touch input with proper cleanup and reset between trials
 */
class InputManager {
    constructor(scene) {
        this.scene = scene;
        this.isActive = false;
        this.reticleSpeed = 5;
        this.reticleBounds = {
            minX: 50,
            maxX: 974
        };
        
        // Input state
        this.cursors = null;
        this.keyA = null;
        this.keyD = null;
        this.keySpace = null;
        
        // Event handlers
        this.pointerMoveHandler = null;
        this.pointerDownHandler = null;
        
        // Callbacks
        this.onReticleMove = null;
        this.onPlayerShot = null;
        
        // Add: this.allocation = 0.5 (default)
        this.allocation = 0.5;
        
        console.log('InputManager initialized for scene:', scene.scene.key);
    }
    
    /**
     * Initialize input controls for the scene
     */
    initialize(onReticleMove, onPlayerShot) {
        console.log('InputManager: Initializing input controls');
        
        this.onReticleMove = onReticleMove;
        this.onPlayerShot = onPlayerShot;
        
        // Set up keyboard controls
        this.setupKeyboardControls();
        
        // Set up mouse/touch controls
        this.setupPointerControls();
        
        this.isActive = true;
        console.log('InputManager: Input controls initialized');
    }
    
    /**
     * Set up keyboard controls
     */
    setupKeyboardControls() {
        // Create cursor keys for keyboard input
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        
        // Add A/D keys as alternative controls
        this.keyA = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        
        // Add spacebar for firing
        this.keySpace = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        console.log('InputManager: Keyboard controls set up');
    }
    
    /**
     * Set up mouse/touch controls
     */
    setupPointerControls() {
        // Remove pointermove and pointerdown handlers for reticle and firing
        // No longer needed since lever and FIRE button handle all input
    }
    
    /**
     * Handle mouse movement
     */
    handleMouseMove(pointer) {
        // No longer needed
    }
    
    /**
     * Handle player shot
     */
    handlePlayerShot(pointer) {
        // No longer needed
    }
    
    /**
     * Update method for keyboard input (called from scene update)
     */
    update(reticle) {
        // No reticle movement or spacebar firing
    }
    
    /**
     * Deactivate input temporarily
     */
    deactivate() {
        this.isActive = false;
        console.log('InputManager: Input deactivated');
    }
    
    /**
     * Reactivate input
     */
    activate() {
        this.isActive = true;
        console.log('InputManager: Input activated');
    }
    
    /**
     * Clean up all input handlers
     */
    cleanup(clearCallbacks = true) {
        console.log('InputManager: Cleaning up input handlers');
        
        // Remove event listeners
        if (this.pointerMoveHandler) {
            this.scene.input.off('pointermove', this.pointerMoveHandler);
            this.pointerMoveHandler = null;
        }
        
        if (this.pointerDownHandler) {
            this.scene.input.off('pointerdown', this.pointerDownHandler);
            this.pointerDownHandler = null;
        }
        
        // Clear keyboard references
        this.cursors = null;
        this.keyA = null;
        this.keyD = null;
        this.keySpace = null;
        
        // Optionally clear callbacks
        if (clearCallbacks) {
            this.onReticleMove = null;
            this.onPlayerShot = null;
        }
        
        this.isActive = false;
        console.log('InputManager: Input handlers cleaned up');
    }
    
    /**
     * Reset input state for a new trial
     */
    reset() {
        console.log('InputManager: Resetting input state');
        // Save callbacks
        const onReticleMove = this.onReticleMove;
        const onPlayerShot = this.onPlayerShot;
        // Clean up existing handlers (but do NOT clear callbacks)
        this.cleanup(false);
        // Re-initialize if callbacks are available
        if (onReticleMove && onPlayerShot) {
            this.initialize(onReticleMove, onPlayerShot);
        }
    }
} 