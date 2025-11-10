const { getStore } = require('@netlify/blobs');

// Storage wrapper for Netlify Blobs
class Storage {
    constructor() {
        this.store = null;
    }

    async init() {
        if (!this.store) {
            this.store = getStore('secret-santa-data');
        }
    }

    async getGames() {
        await this.init();
        const data = await this.store.get('games', { type: 'json' });
        return data || { games: [] };
    }

    async saveGames(gamesData) {
        await this.init();
        await this.store.set('games', JSON.stringify(gamesData));
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
