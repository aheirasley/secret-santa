const { getStore } = require('@netlify/blobs');

// Storage wrapper for Netlify Blobs
class Storage {
    getStoreInstance() {
        // Netlify automatically provides context in the serverless environment
        return getStore('secret-santa-data');
    }

    async getGames() {
        try {
            const store = this.getStoreInstance();
            const data = await store.get('games', { type: 'json' });
            return data || { games: [] };
        } catch (error) {
            console.error('Error getting games:', error);
            return { games: [] };
        }
    }

    async saveGames(gamesData) {
        try {
            const store = this.getStoreInstance();
            await store.set('games', JSON.stringify(gamesData));
        } catch (error) {
            console.error('Error saving games:', error);
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
