const storage = require('../../lib/storage');
const { generateAssignments } = require('../../lib/secretSanta');

function isAuthenticated(event) {
    const authHeader = event.headers.authorization;
    return authHeader && authHeader.length > 0;
}

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Método no permitido' })
        };
    }

    if (!isAuthenticated(event)) {
        return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: 'No autorizado' })
        };
    }

    try {
        const { gameId } = JSON.parse(event.body);

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

        const game = await storage.getGame(gameId);

        if (!game) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Juego no encontrado'
                })
            };
        }

        if (game.isFinalized) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'El juego ya está finalizado'
                })
            };
        }

        if (!game.participants || game.participants.length < 2) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Se necesitan al menos 2 participantes'
                })
            };
        }

        // Generate assignments
        const assignedParticipants = generateAssignments(game.participants);

        game.participants = assignedParticipants;
        game.isFinalized = true;
        game.finalizedDate = new Date().toISOString();

        await storage.saveGame(game);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                game
            })
        };

    } catch (error) {
        console.error('Finalize error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message || 'Error del servidor'
            })
        };
    }
};
