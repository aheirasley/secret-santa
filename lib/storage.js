const fetch = require('node-fetch');

// Storage using JSONBin.io - Free JSON storage service
// Set JSONBIN_API_KEY and JSONBIN_BIN_ID in Netlify environment variables

// Shared state across all instances (singleton pattern)
let sharedBinId = null;

class Storage {
    constructor() {
        this.apiKey = process.env.JSONBIN_API_KEY || '$2a$10$dummyKeyForTesting123456789012345678901234567890';
        // Try to get from env or use shared state
        this.binId = process.env.JSONBIN_BIN_ID || sharedBinId;
        this.baseUrl = 'https://api.jsonbin.io/v3';
        this.cache = null;
        this.cacheTime = null;
        this.cacheDuration = 5000; // 5 seconds cache
    }

    setBinId(id) {
        this.binId = id;
        sharedBinId = id; // Share across instances
        console.log('BIN ID updated globally:', id);
    }

    async getGames() {
        try {
            // Return cache if recent
            if (this.cache && this.cacheTime && (Date.now() - this.cacheTime < this.cacheDuration)) {
                console.log('Returning cached games');
                return this.cache;
            }

            console.log('Getting games from JSONBin...');

            // If no bin ID set, return empty (first time)
            if (!this.binId) {
                console.log('No bin ID configured, returning empty games');
                return { games: [] };
            }

            const response = await fetch(`${this.baseUrl}/b/${this.binId}/latest`, {
                headers: {
                    'X-Master-Key': this.apiKey,
                    'X-Bin-Meta': 'false'
                }
            });

            if (!response.ok) {
                if (response.status === 404) {
                    console.log('Bin not found, returning empty');
                    return { games: [] };
                }
                throw new Error(`JSONBin error: ${response.status}`);
            }

            const data = await response.json();
            console.log('Games retrieved from JSONBin');

            this.cache = data;
            this.cacheTime = Date.now();

            return data;
        } catch (error) {
            console.error('Error getting games:', error.message);
            // Return cache if available even if stale
            if (this.cache) {
                console.log('Returning stale cache due to error');
                return this.cache;
            }
            return { games: [] };
        }
    }

    async saveGames(gamesData) {
        try {
            console.log('Saving games to JSONBin...');

            // Update cache immediately
            this.cache = gamesData;
            this.cacheTime = Date.now();

            // If no bin ID, create new bin
            if (!this.binId) {
                const response = await fetch(`${this.baseUrl}/b`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Master-Key': this.apiKey,
                        'X-Bin-Name': 'secret-santa-data'
                    },
                    body: JSON.stringify(gamesData)
                });

                if (!response.ok) {
                    throw new Error(`JSONBin create error: ${response.status}`);
                }

                const result = await response.json();
                const newBinId = result.metadata.id;

                // Update both instance and shared state
                this.setBinId(newBinId);

                console.log('===========================================');
                console.log('IMPORTANT: New bin created!');
                console.log('Add this to Netlify Environment Variables:');
                console.log('JSONBIN_BIN_ID =', newBinId);
                console.log('===========================================');

                return true;
            }

            // Update existing bin
            const response = await fetch(`${this.baseUrl}/b/${this.binId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': this.apiKey
                },
                body: JSON.stringify(gamesData)
            });

            if (!response.ok) {
                throw new Error(`JSONBin update error: ${response.status}`);
            }

            console.log('Games saved successfully to JSONBin');
            return true;
        } catch (error) {
            console.error('Error saving games:', error.message);
            // Still update cache even if save fails
            this.cache = gamesData;
            this.cacheTime = Date.now();
            throw error;
        }
    }

    async getGame(gameId) {
        const { games } = await this.getGames();
        return games.find(g => g.id === gameId);
    }

    async saveGame(game) {
        const gamesData = await this.getGames();
        const index = gamesData.games.findIndex(g => g.id === game.id);

        if (index !== -1) {
            gamesData.games[index] = game;
        } else {
            gamesData.games.push(game);
        }

        await this.saveGames(gamesData);
    }

    async deleteGame(gameId) {
        const gamesData = await this.getGames();
        gamesData.games = gamesData.games.filter(g => g.id !== gameId);
        await this.saveGames(gamesData);
    }

    async getParticipantByToken(token) {
        const { games } = await this.getGames();

        for (const game of games) {
            if (game.participants) {
                const participant = game.participants.find(p => p.token === token);
                if (participant) {
                    return {
                        participant,
                        game
                    };
                }
            }
        }

        return null;
    }
}

module.exports = new Storage();
