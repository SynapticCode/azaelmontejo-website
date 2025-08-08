// Handles the creation and management of dialogue UI elements

export class DialogueUI {
    constructor(scene, themeManager) {
        this.scene = scene;
        this.themeManager = themeManager;
        this.dialog = null;
    }
    
    createDialogue(npcId, text, choices, callback) {
        // Prevent creating multiple dialogues
        if (this.dialog) {
            return;
        }
        
        // Get theme colors
        const colors = this.themeManager.getDialogColors();
        
        // Create dialog using rexUI
        const dialogConfig = {
            x: 400,
            y: 300,
            width: 500,
            
            background: this.scene.rexUI.add.roundRectangle(0, 0, 100, 100, 20, colors.background),
            
            title: this.scene.rexUI.add.label({
                background: this.scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, colors.title),
                text: this.scene.add.text(0, 0, npcId, { fontSize: '24px', color: colors.text }),
                space: { left: 15, right: 15, top: 10, bottom: 10 }
            }),
            
            content: this.scene.add.text(0, 0, text, { 
                fontSize: '20px', 
                wordWrap: { width: 480 }, 
                align: 'center',
                color: colors.text
            }),
            
            actions: choices.map(choice => this.createButton(choice.text, colors)),
            
            space: { 
                title: 25, 
                content: 25, 
                action: 15, 
                left: 20, 
                right: 20, 
                top: 20, 
                bottom: 20 
            },
            align: { actions: 'center' },
            expand: { content: false }
        };
        
        this.dialog = this.scene.rexUI.add.dialog(dialogConfig)
            .layout()
            .popUp(500);
            
        this.dialog
            .on('button.click', (button, groupName, index) => {
                const choice = choices[index];
                callback(choice);
                this.dialog.scaleDownDestroy(100);
                this.dialog = null;
            })
            .on('button.over', (button, groupName, index) => {
                button.getElement('background').setStrokeStyle(1, 0xffffff);
            })
            .on('button.out', (button, groupName, index) => {
                button.getElement('background').setStrokeStyle();
            });
    }
    
    createButton(text, colors) {
        return this.scene.rexUI.add.label({
            background: this.scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, colors.button),
            text: this.scene.add.text(0, 0, text, { fontSize: '20px', color: colors.text }),
            space: { left: 10, right: 10, top: 10, bottom: 10 }
        });
    }
    
    showFeedback(text, isPositive = true) {
        const feedback = this.scene.add.text(400, 400, text, {
            fontSize: '24px',
            color: isPositive ? '#00ff00' : '#ff0000',
            backgroundColor: '#000000'
        }).setOrigin(0.5);
        
        this.scene.time.delayedCall(2000, () => {
            feedback.destroy();
        });
    }
}
