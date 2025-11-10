const storage = require('../../lib/storage');

function isAuthenticated(event) {
    const authHeader = event.headers.authorization;
    return authHeader && authHeader.length > 0;
}

function generateCSV(game) {
    const header = 'GameID,GameName,CreatedDate,ParticipantID,ParticipantName,AssignedTo,Token\n';

    const rows = game.participants.map(p => {
        return [
            game.id,
            `"${game.name}"`,
            game.createdDate,
            p.id,
            `"${p.name}"`,
            `"${p.assignedTo || ''}"`,
            p.token || ''
        ].join(',');
    }).join('\n');

    return header + rows;
}

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'GET') {
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

        const csv = generateCSV(game);

        return {
            statusCode: 200,
            headers: {
                ...headers,
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="intercambio-secreto-${game.id}.csv"`
            },
            body: csv
        };

    } catch (error) {
        console.error('Export error:', error);
        return {
            statusCode: 500,
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: false,
                error: 'Error del servidor'
            })
        };
    }
};
