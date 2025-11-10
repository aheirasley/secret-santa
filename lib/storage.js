const { getStore } = require('@netlify/blobs');

// Storage wrapper for Netlify Blobs
class Storage {
    async getGames() {
        try {
            // Use getStore without parameters - Netlify injects the context automatically
            const store = getStore({
                name: 'secret-santa',
                siteID: process.env.SITE_ID,
                token: process.env.NETLIFY_BLOBS_CONTEXT || process.env.NETLIFY_AUTH_TOKEN,
            });

            console.log('Getting games from blob store...');
            const data = await store.get('games', { type: 'json' });
            console.log('Games retrieved:', data);

            return data || { games: [] };
        } catch (error) {
            console.error('Error getting games:', error);
            console.error('Error details:', error.message);
            // Return empty games if there's an error or no data yet
            return { games: [] };
        }
    }

    async saveGames(gamesData) {
        try {
            const store = getStore({
                name: 'secret-santa',
                siteID: process.env.SITE_ID,
                token: process.env.NETLIFY_BLOBS_CONTEXT || process.env.NETLIFY_AUTH_TOKEN,
            });

            console.log('Saving games to blob store:', gamesData);
            await store.set('games', JSON.stringify(gamesData));
            console.log('Games saved successfully');
        } catch (error) {
            console.error('Error saving games:', error);
            console.error('Error details:', error.message);
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
