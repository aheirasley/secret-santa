const storage = require('../../lib/storage');

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json'
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

    try {
        const token = event.queryStringParameters?.token;

        if (!token) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Token es requerido'
                })
            };
        }

        const result = await storage.getParticipantByToken(token);

        if (!result) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Token inválido'
                })
            };
        }

        const { participant, game } = result;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                isFinalized: game.isFinalized,
                participantName: participant.name,
                assignedTo: participant.assignedTo,
                gameName: game.name
            })
        };

    } catch (error) {
        console.error('Get assignment error:', error);
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
