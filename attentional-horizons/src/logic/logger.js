// Handles all data logging for the game

export class Logger {
    constructor() {
        this.logs = [];
    }
    
    logEvent(eventType, eventData) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            event_type: eventType,
            ...eventData
        };
        
        this.logs.push(logEntry);
        console.log('Logged Event:', logEntry);
        
        return logEntry;
    }
    
    getGameData() {
        return this.logs;
    }
    
    generateCSV() {
        // Create CSV header based on all possible fields
        const allFields = new Set();
        this.logs.forEach(log => {
            Object.keys(log).forEach(key => allFields.add(key));
        });
        
        const header = Array.from(allFields).join(',');
        let csvContent = header + '\n';
        
        // Add each log entry as a row
        this.logs.forEach(log => {
            const row = Array.from(allFields).map(field => {
                if (log[field] === undefined) return '';
                
                // Handle special cases like arrays or objects
                if (typeof log[field] === 'object') {
                    return JSON.stringify(log[field]).replace(/,/g, ';');
                }
                
                // Escape commas in strings
                if (typeof log[field] === 'string') {
                    return `"${log[field].replace(/"/g, '""')}"`;
                }
                
                return log[field];
            }).join(',');
            
            csvContent += row + '\n';
        });
        
        return csvContent;
    }
}
