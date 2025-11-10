// Admin panel logic
let currentGameId = null;
let games = [];

// Check authentication
if (!sessionStorage.getItem('adminSession')) {
    window.location.href = 'index.html';
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem('adminSession');
    window.location.href = 'index.html';
});

// Create game
document.getElementById('createGameForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const gameName = document.getElementById('gameName').value;

    try {
        const result = await api.createGame(gameName);
        if (result.success) {
            document.getElementById('gameName').value = '';
            await loadGames();
        } else {
            alert('Error al crear el juego');
        }
    } catch (error) {
        alert('Error al crear el juego');
    }
});

// Load games
async function loadGames() {
    try {
        const result = await api.getGames();
        if (result.success) {
            games = result.games;
            renderGames();
        }
    } catch (error) {
        console.error('Error loading games:', error);
    }
}

// Render games
function renderGames() {
    const gamesList = document.getElementById('gamesList');

    if (games.length === 0) {
        gamesList.innerHTML = '<p style="color: #666;">No hay juegos creados todavía. ¡Crea tu primer juego arriba!</p>';
        return;
    }

    gamesList.innerHTML = games.map(game => {
        const participantCount = game.participants?.length || 0;
        const statusBadge = game.isFinalized
            ? '<span class="badge badge-success">Finalizado</span>'
            : '<span class="badge badge-warning">En Progreso</span>';

        return `
            <div class="game-card">
                <h3>${game.name} ${statusBadge}</h3>
                <div class="game-info">
                    <p>📅 Creado: ${new Date(game.createdDate).toLocaleDateString('es-MX')}</p>
                    <p>👥 Participantes: ${participantCount}</p>
                </div>
                <div class="game-actions">
                    <button class="btn btn-primary" onclick="openParticipantModal('${game.id}')">
                        ${game.isFinalized ? 'Ver Enlaces' : 'Gestionar Participantes'}
                    </button>
                    <button class="btn btn-danger" onclick="deleteGame('${game.id}')">
                        Eliminar Juego
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Delete game
async function deleteGame(gameId) {
    if (!confirm('¿Estás seguro de eliminar este juego?')) {
        return;
    }

    try {
        const result = await api.deleteGame(gameId);
        if (result.success) {
            await loadGames();
        } else {
            alert('Error al eliminar el juego');
        }
    } catch (error) {
        alert('Error al eliminar el juego');
    }
}

// Modal management
const modal = document.getElementById('participantModal');
const closeBtn = document.querySelector('.close');

closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    currentGameId = null;
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        currentGameId = null;
    }
});

// Open participant modal
function openParticipantModal(gameId) {
    currentGameId = gameId;
    const game = games.find(g => g.id === gameId);

    document.getElementById('modalGameName').textContent = game.name;
    document.getElementById('participantName').value = '';

    renderParticipants(game);

    if (game.isFinalized) {
        document.getElementById('addParticipantForm').style.display = 'none';
        document.getElementById('finalizeGameBtn').style.display = 'none';
        document.getElementById('generatedLinks').style.display = 'block';
        renderLinks(game);
    } else {
        document.getElementById('addParticipantForm').style.display = 'block';
        document.getElementById('finalizeGameBtn').style.display = 'block';
        document.getElementById('generatedLinks').style.display = 'none';
    }

    modal.classList.add('active');
}

// Render participants
function renderParticipants(game) {
    const participantsList = document.getElementById('participantsList');
    const participants = game.participants || [];

    if (participants.length === 0) {
        participantsList.innerHTML = '<li style="color: #666;">No hay participantes todavía</li>';
        return;
    }

    participantsList.innerHTML = participants.map(p => `
        <li>
            <span>${p.name}</span>
            ${!game.isFinalized ? `<button class="btn btn-danger" onclick="removeParticipant('${p.id}')">Eliminar</button>` : ''}
        </li>
    `).join('');
}

// Add participant
document.getElementById('addParticipantForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const participantName = document.getElementById('participantName').value;

    try {
        const result = await api.addParticipant(currentGameId, participantName);
        if (result.success) {
            document.getElementById('participantName').value = '';
            await loadGames();
            const game = games.find(g => g.id === currentGameId);
            renderParticipants(game);
        } else {
            alert('Error al agregar participante');
        }
    } catch (error) {
        alert('Error al agregar participante');
    }
});

// Remove participant
async function removeParticipant(participantId) {
    if (!confirm('¿Eliminar este participante?')) {
        return;
    }

    try {
        const result = await api.removeParticipant(currentGameId, participantId);
        if (result.success) {
            await loadGames();
            const game = games.find(g => g.id === currentGameId);
            renderParticipants(game);
        } else {
            alert('Error al eliminar participante');
        }
    } catch (error) {
        alert('Error al eliminar participante');
    }
}

// Finalize game
document.getElementById('finalizeGameBtn').addEventListener('click', async () => {
    const game = games.find(g => g.id === currentGameId);

    if (!game.participants || game.participants.length < 2) {
        alert('Necesitas al menos 2 participantes para finalizar el juego');
        return;
    }

    if (!confirm(`¿Finalizar el juego y generar enlaces? Una vez finalizado, no podrás agregar más participantes.`)) {
        return;
    }

    try {
        const result = await api.finalizeGame(currentGameId);
        if (result.success) {
            await loadGames();
            const updatedGame = games.find(g => g.id === currentGameId);
            openParticipantModal(currentGameId);
        } else {
            alert('Error al finalizar el juego');
        }
    } catch (error) {
        alert('Error al finalizar el juego');
    }
});

// Render links
function renderLinks(game) {
    const linksList = document.getElementById('linksList');
    const baseUrl = window.location.origin;

    linksList.innerHTML = game.participants.map(p => `
        <div class="link-item">
            <strong>${p.name}</strong>
            <a href="${baseUrl}/participant.html?token=${p.token}" target="_blank">
                ${baseUrl}/participant.html?token=${p.token}
            </a>
            <button class="copy-btn" onclick="copyToClipboard('${baseUrl}/participant.html?token=${p.token}', this)">
                📋 Copiar
            </button>
        </div>
    `).join('');
}

// Copy to clipboard
function copyToClipboard(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = btn.textContent;
        btn.textContent = '✅ Copiado';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    }).catch(() => {
        alert('No se pudo copiar al portapapeles');
    });
}

// Export CSV
document.getElementById('exportCsvBtn').addEventListener('click', async () => {
    try {
        const blob = await api.exportCsv(currentGameId);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `intercambio-secreto-${currentGameId}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        alert('Error al exportar CSV');
    }
});

// Initial load
loadGames();
