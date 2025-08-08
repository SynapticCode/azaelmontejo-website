// Component for managing fleet display in the tactical view
function FleetManager(scene) {
    this.scene = scene;
    this.gameDataManager = scene.gameDataManager;
    
    // Create containers for ships
    this.playerFleetContainer = scene.add.container(0, 0);
    this.enemyFleetContainer = scene.add.container(0, 0);
    
    // Set up asteroid
    this.asteroidContainer = scene.add.container(0, 0);
    
    // Screen dimensions
    this.screenWidth = scene.cameras.main.width;
    this.screenHeight = scene.cameras.main.height;
}

FleetManager.prototype.createPlayerFleet = function() {
    const playerShips = [];
    
    // Check if we have a valid gameDataManager with playerFleet
    if (!this.gameDataManager || !this.gameDataManager.playerFleet) {
        console.warn('GameDataManager or playerFleet not available');
        return playerShips;
    }
    
    // Get player fleet data
    const fleetData = this.gameDataManager.playerFleet;
    
    // Position settings
    const baseY = this.screenHeight * 0.85; // Position near bottom
    const spacing = this.screenWidth * 0.15;
    const centerX = this.screenWidth / 2;
    
    // Create ships based on fleet data
    fleetData.forEach((shipData, index) => {
        try {
            // Calculate position (spread ships horizontally)
            const offset = (index - (fleetData.length - 1) / 2) * spacing;
            const x = centerX + offset;
            const y = baseY;
            
            // Check if we have the required texture
            const textureKey = shipData.type || 'allied_ship_green';
            if (!this.scene.textures.exists(textureKey)) {
                console.warn(`Texture ${textureKey} not found, using fallback`);
            }
            
            // Create ship sprite with fallback texture if needed
            const ship = this.scene.add.image(
                x, y, 
                this.scene.textures.exists(textureKey) ? textureKey : 'allied_ship_green'
            );
            
            // Set ship properties
            ship.setScale(0.5);
            ship.setAngle(-50); // Angle ships to face upward and to the right
            ship.setDepth(5);
            ship.id = shipData.id;
            ship.status = shipData.status;
            
            // If ship is destroyed, make it invisible
            if (shipData.status === 'destroyed') {
                ship.setVisible(false);
            }
            
            // Add to container and array
            this.playerFleetContainer.add(ship);
            playerShips.push(ship);
        } catch (error) {
            console.error('Error creating player ship:', error);
        }
    });
    
    return playerShips;
}

FleetManager.prototype.createEnemyFleet = function() {
    const enemyShips = [];
    
    // Check if we have a valid gameDataManager with alienFleet
    if (!this.gameDataManager || !this.gameDataManager.alienFleet) {
        console.warn('GameDataManager or alienFleet not available');
        return enemyShips;
    }
    
    // Get enemy fleet data
    const fleetData = this.gameDataManager.alienFleet;
    
    // Position settings
    const baseY = this.screenHeight * 0.3; // Position near top
    const spacing = this.screenWidth * 0.2;
    const centerX = this.screenWidth / 2;
    
    // Create ships based on fleet data
    fleetData.forEach((shipData, index) => {
        try {
            // Only create active ships
            if (shipData.status !== 'active') return;
            
            // Calculate position (spread ships horizontally)
            const offset = (index - (fleetData.length - 1) / 2) * spacing;
            const x = centerX + offset;
            const y = baseY;
            
            // Check if we have the required texture
            const textureKey = shipData.type || 'raider_red';
            if (!this.scene.textures.exists(textureKey)) {
                console.warn(`Texture ${textureKey} not found, using fallback`);
            }
            
            // Create ship sprite with fallback texture if needed
            const ship = this.scene.add.image(
                x, y, 
                this.scene.textures.exists(textureKey) ? textureKey : 'raider_red'
            );
            
            // Set ship properties
            ship.setScale(0.4);
            ship.setAngle(50); // Angle ships to face downward and to the right
            ship.setDepth(5);
            ship.id = shipData.id;
            ship.status = shipData.status;
            ship.health = shipData.health || 1;
            
            // Add to container and array
            this.enemyFleetContainer.add(ship);
            enemyShips.push(ship);
        } catch (error) {
            console.error('Error creating enemy ship:', error);
        }
    });
    
    return enemyShips;
}

FleetManager.prototype.createAsteroid = function() {
    try {
        // Create asteroid in the center top area
        const asteroid = this.scene.add.image(
            this.screenWidth / 2,
            this.screenHeight * 0.15,
            'asteroid'
        );
        
        // Set asteroid properties
        asteroid.setScale(0.7);
        asteroid.setDepth(4);
        
        // Add to container
        this.asteroidContainer.add(asteroid);
        
        return asteroid;
    } catch (error) {
        console.error('Error creating asteroid:', error);
        return null;
    }
}

FleetManager.prototype.getAsteroid = function() {
    // Create asteroid if it doesn't exist yet
    if (this.asteroidContainer.length === 0) {
        return this.createAsteroid();
    }
    
    // Return the existing asteroid
    return this.asteroidContainer.getAt(0);
}
