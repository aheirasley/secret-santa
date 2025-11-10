const { v4: uuidv4 } = require('uuid');
const storage = require('../../lib/storage');

// Simple auth check (in production, use proper JWT)
function isAuthenticated(event) {
    const authHeader = event.headers.authorization;
    return authHeader && authHeader.length > 0;
}

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (!isAuthenticated(event)) {
        return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: 'No autorizado' })
        };
    }

    try {
        // GET - List all games
        if (event.httpMethod === 'GET') {
            const gamesData = await storage.getGames();

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    games: gamesData.games
                })
            };
        }

        // POST - Create new game
        if (event.httpMethod === 'POST') {
            const { name } = JSON.parse(event.body);

            if (!name || name.trim().length === 0) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({
                        success: false,
                        error: 'El nombre del juego es requerido'
                    })
                };
            }

            const newGame = {
                id: uuidv4(),
                name: name.trim(),
                createdDate: new Date().toISOString(),
                isFinalized: false,
                participants: []
            };

            await storage.saveGame(newGame);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    game: newGame
                })
            };
        }

        // DELETE - Delete game
        if (event.httpMethod === 'DELETE') {
            const gameId = event.queryStringParameters?.gameId;

            if (!gameId) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({
                        success: false,
                        error: 'gameId es requerido'
                    })
                };
            }

            await storage.deleteGame(gameId);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true
                })
            };
        }

        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Método no permitido' })
        };

    } catch (error) {
        console.error('Games error:', error);
        console.error('Error stack:', error.stack);
        console.error('Error message:', error.message);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Error del servidor',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            })
        };
    }
};
