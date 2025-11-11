const { getStore } = require('@netlify/data-stores-sdk');

// Storage using Netlify DB - Built-in Netlify database
// No configuration needed! Works automatically

class Storage {
    constructor() {
        this.storeName = 'secret-santa';
        this.store = null;
    }

    async getStoreInstance() {
        if (!this.store) {
            console.log('Initializing Netlify DB store...');
            this.store = await getStore(this.storeName);
            console.log('✅ Netlify DB store initialized');
        }
        return this.store;
    }

    async getGames() {
        try {
            console.log('Getting games from Netlify DB...');
            const store = await this.getStoreInstance();

            const data = await store.get('games');

            if (!data) {
                console.log('No games found, returning empty array');
                return { games: [] };
            }

            console.log('✅ Games retrieved:', data.games?.length || 0, 'games');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error getting games:', error.message);
            return { games: [] };
        }
    }

    async saveGames(gamesData) {
        try {
            console.log('Saving games to Netlify DB...');
            const store = await this.getStoreInstance();

            await store.set('games', JSON.stringify(gamesData));

            console.log('✅ Games saved successfully:', gamesData.games?.length || 0, 'games');
            return true;
        } catch (error) {
            console.error('Error saving games:', error.message);
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
            console.log('Updating existing game:', game.id);
        } else {
            gamesData.games.push(game);
            console.log('Adding new game:', game.id);
        }

        await this.saveGames(gamesData);
    }

    async deleteGame(gameId) {
        const gamesData = await this.getGames();
        gamesData.games = gamesData.games.filter(g => g.id !== gameId);
        console.log('Deleting game:', gameId);
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
