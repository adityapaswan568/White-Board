const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('color-picker');
const brushSize = document.getElementById('brush-size');
const toolPencil = document.getElementById('tool-pencil');
const toolEraser = document.getElementById('tool-eraser');
const btnClear = document.getElementById('btn-clear');
const btnSave = document.getElementById('btn-save');
const btnNew = document.getElementById('btn-new');
const btnMenu = document.getElementById('btn-menu');
const saveModal = document.getElementById('save-modal');
const closeModalSpans = document.querySelectorAll('.close-modal');
const confirmSaveBtn = document.getElementById('confirm-save-btn');
const boardNameInput = document.getElementById('board-name-input');
const sidebar = document.getElementById('sidebar');
const closeSidebarBtn = document.getElementById('close-sidebar');
const savedBoardsList = document.getElementById('saved-boards-list');

// State
let isDrawing = false;
let currentTool = 'pencil'; // 'pencil' or 'eraser'
let currentColor = '#000000';
let currentLineWidth = 5;
let savedBoards = JSON.parse(localStorage.getItem('savedBoards')) || [];

// Initialization
function resizeCanvas() {
    // Store current image data to restore after resize
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCtx.drawImage(canvas, 0, 0);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Restore image
    // Note: This naive restoration might stretch/scale if we just drawImage.
    // Better to just keep what was there or center it. 
    // For this simple version, we'll repaint.
    // Actually, on resize, we usually just clear or we can try to preserve.
    // Let's preserve top-left.
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.drawImage(tempCanvas, 0, 0);
}

// Initial set up
resizeCanvas(); // Set initial size
// We call resizeCanvas again on window resize, but dealing with persistence on resize is tricky.
// For now, let's just update width/height and re-apply context settings.
window.addEventListener('resize', () => {
    // Basic resize handling that might clear canvas, improved version would buffer.
    // Just setting width/height clears canvas. 
    // Let's simple-save content.
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.putImageData(imageData, 0, 0);
    
    // Re-apply context settings that get reset on resize
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
});

// Canvas Drawing Logic
function startPosition(e) {
    isDrawing = true;
    draw(e);
}

function stopPosition() {
    isDrawing = false;
    ctx.beginPath(); // Reset path so lines don't connect
}

function draw(e) {
    if (!isDrawing) return;

    // Support touch events
    const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const y = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

    ctx.lineWidth = currentLineWidth;
    ctx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : currentColor;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// Event Listeners for Drawing
canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', stopPosition);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseleave', stopPosition);

// Touch support
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent scrolling
    startPosition(e);
});
canvas.addEventListener('touchend', stopPosition);
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    draw(e);
});


// Tool Helpers
function setActiveTool(tool) {
    currentTool = tool;
    if (tool === 'pencil') {
        toolPencil.classList.add('active');
        toolEraser.classList.remove('active');
    } else {
        toolPencil.classList.remove('active');
        toolEraser.classList.add('active');
    }
}

// UI Event Listeners
colorPicker.addEventListener('change', (e) => {
    currentColor = e.target.value;
    setActiveTool('pencil'); // Switch back to pencil if color changes
});

brushSize.addEventListener('input', (e) => {
    currentLineWidth = e.target.value;
});

toolPencil.addEventListener('click', () => setActiveTool('pencil'));
toolEraser.addEventListener('click', () => setActiveTool('eraser'));

btnClear.addEventListener('click', () => {
    if(confirm('Are you sure you want to clear the canvas?')) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});

btnNew.addEventListener('click', () => {
    if(confirm('Create new board? Unsaved changes will be lost.')) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        boardNameInput.value = ''; // Reset name input
    }
});


// Save Functionality
btnSave.addEventListener('click', () => {
    saveModal.classList.add('show');
    // Pre-fill date as default name if empty
    if (!boardNameInput.value) {
        boardNameInput.value = `Board ${new Date().toLocaleString()}`;
    }
    boardNameInput.focus();
});

function closeModal() {
    saveModal.classList.remove('show');
}

closeModalSpans.forEach(span => {
    span.addEventListener('click', closeModal);
});

window.addEventListener('click', (e) => {
    if (e.target === saveModal) {
        closeModal();
    }
});

confirmSaveBtn.addEventListener('click', () => {
    const name = boardNameInput.value.trim() || `Untitled ${new Date().toLocaleDateString()}`;
    const dataURL = canvas.toDataURL();
    
    const newBoard = {
        id: Date.now(),
        name: name,
        data: dataURL,
        date: new Date().toLocaleDateString()
    };

    savedBoards.push(newBoard);
    localStorage.setItem('savedBoards', JSON.stringify(savedBoards));
    
    closeModal();
    renderBoardsList();
    alert('Board Saved Successfully!');
});


// Sidebar & Loading
function renderBoardsList() {
    savedBoardsList.innerHTML = '';
    savedBoards = JSON.parse(localStorage.getItem('savedBoards')) || []; // Refresh from storage

    if (savedBoards.length === 0) {
        savedBoardsList.innerHTML = '<li style="padding:1rem; text-align:center; color: #888;">No saved boards yet.</li>';
        return;
    }

    // Sort by newest first
    savedBoards.slice().reverse().forEach(board => {
        const li = document.createElement('li');
        li.className = 'board-item';
        li.innerHTML = `
            <div class="board-info">
                <span class="board-name">${board.name}</span>
                <span class="board-date">${board.date}</span>
            </div>
            <button class="delete-board-btn" data-id="${board.id}" title="Delete">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
        `;
        
        // Load board on click
        li.addEventListener('click', (e) => {
            // Prevent loading if delete button was clicked
            if (e.target.closest('.delete-board-btn')) return;
            loadBoard(board);
        });

        // Delete handler
        const deleteBtn = li.querySelector('.delete-board-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent li click
            deleteBoard(board.id);
        });

        savedBoardsList.appendChild(li);
    });
}

function loadBoard(board) {
    const img = new Image();
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        // Close sidebar on mobile/desktop after load
        sidebar.classList.remove('open');
    };
    img.src = board.data;
}

function deleteBoard(id) {
    if(confirm('Delete this saved board?')) {
        savedBoards = savedBoards.filter(b => b.id !== id);
        localStorage.setItem('savedBoards', JSON.stringify(savedBoards));
        renderBoardsList();
    }
}

btnMenu.addEventListener('click', () => {
    renderBoardsList();
    sidebar.classList.add('open');
});

closeSidebarBtn.addEventListener('click', () => {
    sidebar.classList.remove('open');
});

// Close sidebar if clicking outside of it (on the main content)
canvas.addEventListener('click', () => {
    if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
    }
});
