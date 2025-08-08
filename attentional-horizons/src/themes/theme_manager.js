// Manages visual styles, colors, and UI appearance for each act

export class ThemeManager {
    constructor(scene) {
        this.scene = scene;
        this.currentTheme = "startup";
        
        // Define theme color palettes
        this.themes = {
            startup: {
                primary: 0x4a6fa5,
                secondary: 0xa54a6f,
                accent: 0x6a4aa5,
                background: 0x333333,
                text: "#ffffff",
                dialogBackground: 0x1565c0,
                dialogTitle: 0x003c8f,
                buttonBackground: 0x003c8f
            },
            growth: {
                primary: 0x4aa56f,
                secondary: 0xa54a4a,
                accent: 0x4aa5a5,
                background: 0x2d3d3d,
                text: "#f0f0f0",
                dialogBackground: 0x15a57f,
                dialogTitle: 0x00805f,
                buttonBackground: 0x00805f
            },
            corporate: {
                primary: 0x4a4aa5,
                secondary: 0xa5a54a,
                accent: 0xa54aa5,
                background: 0x2d2d3d,
                text: "#f5f5f5",
                dialogBackground: 0x1e1e5c,
                dialogTitle: 0x0f0f3d,
                buttonBackground: 0x0f0f3d
            },
            finale: {
                primary: 0xa5a5a5,
                secondary: 0xd4af37,
                accent: 0xff5555,
                background: 0x1a1a1a,
                text: "#ffffff",
                dialogBackground: 0x3d3d3d,
                dialogTitle: 0x2a2a2a,
                buttonBackground: 0x2a2a2a
            }
        };
    }
    
    setTheme(themeName) {
        if (this.themes[themeName]) {
            this.currentTheme = themeName;
            return this.themes[themeName];
        }
        return this.themes.startup; // Default fallback
    }
    
    getThemeForAct(act) {
        switch(act) {
            case 1: return this.setTheme("startup");
            case 2: return this.setTheme("growth");
            case 3: return this.setTheme("corporate");
            case 4: return this.setTheme("finale");
            default: return this.setTheme("startup");
        }
    }
    
    getDialogColors() {
        const theme = this.themes[this.currentTheme];
        return {
            background: theme.dialogBackground,
            title: theme.dialogTitle,
            button: theme.buttonBackground,
            text: theme.text
        };
    }
}
