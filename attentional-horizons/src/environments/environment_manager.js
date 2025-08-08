// Manages the visual appearance and layout of each act's environment

export class EnvironmentManager {
    constructor(scene) {
        this.scene = scene;
    }
    
    // Load the appropriate environment based on act number
    loadEnvironment(act) {
        switch(act) {
            case 1:
                return this.loadStartupOffice();
            case 2:
                return this.loadExpandingOffice();
            case 3:
                return this.loadCorporateOffice();
            case 4:
                return this.loadFinalShowdown();
            default:
                return this.loadStartupOffice();
        }
    }
    
    loadStartupOffice() {
        // Create the startup environment - small, scrappy office
        const map = {
            width: 800,
            height: 600,
            areas: [
                { name: "Engineering", x: 200, y: 200, width: 250, height: 180, color: 0x4a6fa5 },
                { name: "R&D", x: 600, y: 200, width: 250, height: 180, color: 0x6a4aa5 },
                { name: "Marketing", x: 200, y: 450, width: 250, height: 180, color: 0xa54a6f },
                { name: "CEO", x: 600, y: 450, width: 250, height: 180, color: 0xa56f4a }
            ],
            npcPositions: {
                "Engineer": { x: 200, y: 200 },
                "Scientist": { x: 600, y: 200 },
                "Marketer": { x: 200, y: 450 },
                "CEO": { x: 600, y: 450 }
            },
            playerStart: { x: 400, y: 300 },
            theme: "startup"
        };
        
        return map;
    }
    
    loadExpandingOffice() {
        // Create the expanding company environment - medium office with more space
        const map = {
            width: 800,
            height: 600,
            areas: [
                { name: "Engineering", x: 150, y: 150, width: 280, height: 200, color: 0x4aa56f },
                { name: "R&D", x: 650, y: 150, width: 280, height: 200, color: 0x4aa5a5 },
                { name: "Marketing", x: 150, y: 450, width: 280, height: 200, color: 0xa54a4a },
                { name: "CEO", x: 650, y: 450, width: 280, height: 200, color: 0xa5a54a }
            ],
            npcPositions: {
                "Engineer": { x: 150, y: 150 },
                "Scientist": { x: 650, y: 150 },
                "Marketer": { x: 150, y: 450 },
                "CEO": { x: 650, y: 450 }
            },
            playerStart: { x: 400, y: 300 },
            theme: "growth"
        };
        
        return map;
    }
    
    loadCorporateOffice() {
        // Create the corporate environment - large, professional office
        const map = {
            width: 800,
            height: 600,
            areas: [
                { name: "Engineering", x: 120, y: 120, width: 300, height: 220, color: 0x4a4aa5 },
                { name: "R&D", x: 680, y: 120, width: 300, height: 220, color: 0xa54aa5 },
                { name: "Marketing", x: 120, y: 480, width: 300, height: 220, color: 0xa5a54a },
                { name: "CEO", x: 680, y: 480, width: 300, height: 220, color: 0x4aa5a5 }
            ],
            npcPositions: {
                "Engineer": { x: 120, y: 120 },
                "Scientist": { x: 680, y: 120 },
                "Marketer": { x: 120, y: 480 },
                "CEO": { x: 680, y: 480 }
            },
            playerStart: { x: 400, y: 300 },
            theme: "corporate"
        };
        
        return map;
    }
    
    loadFinalShowdown() {
        // Create the final environment - dramatic boardroom/presentation space
        const map = {
            width: 800,
            height: 600,
            areas: [
                { name: "Engineering", x: 200, y: 150, width: 200, height: 150, color: 0xa5a5a5 },
                { name: "R&D", x: 600, y: 150, width: 200, height: 150, color: 0xa5a5a5 },
                { name: "Marketing", x: 200, y: 450, width: 200, height: 150, color: 0xa5a5a5 },
                { name: "CEO", x: 400, y: 300, width: 300, height: 200, color: 0xd4af37 }
            ],
            npcPositions: {
                "Engineer": { x: 200, y: 150 },
                "Scientist": { x: 600, y: 150 },
                "Marketer": { x: 200, y: 450 },
                "CEO": { x: 400, y: 300 }
            },
            playerStart: { x: 400, y: 500 },
            theme: "finale"
        };
        
        return map;
    }
    
    // Create the actual visual elements based on the map configuration
    buildEnvironment(map) {
        // Create background
        this.scene.add.rectangle(400, 300, 800, 600, 0x333333);
        
        // Create each area
        map.areas.forEach(area => {
            // Create the area rectangle
            this.scene.add.rectangle(area.x, area.y, area.width, area.height, area.color, 0.7);
            
            // Add area label
            this.scene.add.text(area.x, area.y, area.name, { 
                fontSize: "24px", 
                color: "#ffffff" 
            }).setOrigin(0.5);
        });
        
        return map;
    }
}
