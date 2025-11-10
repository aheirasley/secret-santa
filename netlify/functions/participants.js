const storage = require('../../lib/storage');
const { generateParticipantId } = require('../../lib/secretSanta');

function isAuthenticated(event) {
    const authHeader = event.headers.authorization;
    return authHeader && authHeader.length > 0;
}

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
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
        // POST - Add participant
        if (event.httpMethod === 'POST') {
            const { gameId, name } = JSON.parse(event.body);

            if (!gameId || !name || name.trim().length === 0) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({
                        success: false,
                        error: 'gameId y name son requeridos'
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
                        error: 'No se pueden agregar participantes a un juego finalizado'
                    })
                };
            }

            const newParticipant = {
                id: generateParticipantId(),
                name: name.trim(),
                assignedTo: null,
                token: null
            };

            game.participants.push(newParticipant);
            await storage.saveGame(game);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    participant: newParticipant
                })
            };
        }

        // DELETE - Remove participant
        if (event.httpMethod === 'DELETE') {
            const { gameId, participantId } = event.queryStringParameters || {};

            if (!gameId || !participantId) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({
                        success: false,
                        error: 'gameId y participantId son requeridos'
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
                        error: 'No se pueden eliminar participantes de un juego finalizado'
                    })
                };
            }

            game.participants = game.participants.filter(p => p.id !== participantId);
            await storage.saveGame(game);

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
        console.error('Participants error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Error del servidor'
            })
        };
    }
};
