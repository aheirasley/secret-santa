const { neon } = require('@netlify/neon');

// Storage using Netlify DB (Neon) - Built-in Netlify database
// No configuration needed! Works automatically

class Storage {
    constructor() {
        this.db = null;
        this.tableName = 'games';
    }

    async getDb() {
        if (!this.db) {
            console.log('Initializing Netlify DB connection...');
            // Netlify provides DATABASE_URL automatically
            this.db = neon(process.env.DATABASE_URL);
            console.log('✅ Netlify DB initialized');

            // Create table if not exists
            await this.initTable();
        }
        return this.db;
    }

    async initTable() {
        try {
            const sql = this.db;
            await sql`
                CREATE TABLE IF NOT EXISTS games (
                    id TEXT PRIMARY KEY,
                    data TEXT NOT NULL,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `;
            console.log('✅ Table initialized');
        } catch (error) {
            console.error('Error initializing table:', error.message);
        }
    }

    async getGames() {
        try {
            console.log('Getting games from Netlify DB...');
            const sql = await this.getDb();

            const result = await sql`
                SELECT data FROM games WHERE id = 'all-games' LIMIT 1
            `;

            if (!result || result.length === 0) {
                console.log('No games found, returning empty array');
                return { games: [] };
            }

            const data = JSON.parse(result[0].data);
            console.log('✅ Games retrieved:', data.games?.length || 0, 'games');
            return data;
        } catch (error) {
            console.error('Error getting games:', error.message);
            return { games: [] };
        }
    }

    async saveGames(gamesData) {
        try {
            console.log('Saving games to Netlify DB...');
            const sql = await this.getDb();

            await sql`
                INSERT INTO games (id, data, updated_at)
                VALUES ('all-games', ${JSON.stringify(gamesData)}, CURRENT_TIMESTAMP)
                ON CONFLICT (id)
                DO UPDATE SET data = ${JSON.stringify(gamesData)}, updated_at = CURRENT_TIMESTAMP
            `;

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
