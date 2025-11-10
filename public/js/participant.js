// Participant page logic

// Get token from URL
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

const loadingMessage = document.getElementById('loadingMessage');
const errorMessage = document.getElementById('errorMessage');
const assignmentMessage = document.getElementById('assignmentMessage');
const notFinalizedMessage = document.getElementById('notFinalizedMessage');

// Load assignment
async function loadAssignment() {
    if (!token) {
        showError();
        return;
    }

    try {
        const result = await api.getAssignment(token);

        if (result.success) {
            if (result.isFinalized) {
                showAssignment(result.participantName, result.assignedTo);
            } else {
                showNotFinalized();
            }
        } else {
            showError();
        }
    } catch (error) {
        console.error('Error loading assignment:', error);
        showError();
    }
}

function showAssignment(participantName, assignedTo) {
    loadingMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    notFinalizedMessage.style.display = 'none';
    assignmentMessage.style.display = 'block';

    document.getElementById('participantName').textContent = participantName;
    document.getElementById('assignedName').textContent = assignedTo;
}

function showError() {
    loadingMessage.style.display = 'none';
    assignmentMessage.style.display = 'none';
    notFinalizedMessage.style.display = 'none';
    errorMessage.style.display = 'block';
}

function showNotFinalized() {
    loadingMessage.style.display = 'none';
    assignmentMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    notFinalizedMessage.style.display = 'block';
}

// Load on page load
loadAssignment();
