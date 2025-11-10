// API wrapper for backend calls
const api = {
    baseUrl: '/.netlify/functions',

    async login(username, password) {
        const response = await fetch(`${this.baseUrl}/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        return await response.json();
    },

    async getGames() {
        const response = await fetch(`${this.baseUrl}/games`, {
            method: 'GET',
            headers: {
                'Authorization': sessionStorage.getItem('adminSession'),
            },
        });
        return await response.json();
    },

    async createGame(name) {
        const response = await fetch(`${this.baseUrl}/games`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('adminSession'),
            },
            body: JSON.stringify({ name }),
        });
        return await response.json();
    },

    async deleteGame(gameId) {
        const response = await fetch(`${this.baseUrl}/games?gameId=${gameId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': sessionStorage.getItem('adminSession'),
            },
        });
        return await response.json();
    },

    async addParticipant(gameId, name) {
        const response = await fetch(`${this.baseUrl}/participants`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('adminSession'),
            },
            body: JSON.stringify({ gameId, name }),
        });
        return await response.json();
    },

    async removeParticipant(gameId, participantId) {
        const response = await fetch(`${this.baseUrl}/participants?gameId=${gameId}&participantId=${participantId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': sessionStorage.getItem('adminSession'),
            },
        });
        return await response.json();
    },

    async finalizeGame(gameId) {
        const response = await fetch(`${this.baseUrl}/finalize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('adminSession'),
            },
            body: JSON.stringify({ gameId }),
        });
        return await response.json();
    },

    async getAssignment(token) {
        const response = await fetch(`${this.baseUrl}/getAssignment?token=${token}`, {
            method: 'GET',
        });
        return await response.json();
    },

    async exportCsv(gameId) {
        const response = await fetch(`${this.baseUrl}/export?gameId=${gameId}`, {
            method: 'GET',
            headers: {
                'Authorization': sessionStorage.getItem('adminSession'),
            },
        });
        const blob = await response.blob();
        return blob;
    }
};
