const { v4: uuidv4 } = require('uuid');

// Secret Santa assignment algorithm
function generateAssignments(participants) {
    if (participants.length < 2) {
        throw new Error('Se necesitan al menos 2 participantes');
    }

    let assigned = false;
    let assignments = [];
    let attempts = 0;
    const maxAttempts = 100;

    while (!assigned && attempts < maxAttempts) {
        attempts++;

        // Create a shuffled copy
        const shuffled = [...participants].sort(() => Math.random() - 0.5);

        // Assign each person to the next in the shuffled list
        assignments = participants.map((participant, index) => {
            const nextIndex = (index + 1) % shuffled.length;
            return {
                ...participant,
                assignedTo: shuffled[nextIndex].name,
                token: generateUniqueToken()
            };
        });

        // Verify no one got themselves
        assigned = assignments.every(p => p.name !== p.assignedTo);
    }

    if (!assigned) {
        throw new Error('No se pudo generar una asignación válida después de múltiples intentos');
    }

    return assignments;
}

function generateUniqueToken() {
    return uuidv4();
}

function generateParticipantId() {
    return uuidv4();
}

module.exports = {
    generateAssignments,
    generateUniqueToken,
    generateParticipantId
};
