let db;

// Initialize IndexedDB
function initDB() {
    const request = indexedDB.open("TaskDB", 1);
    
    request.onerror = function() {
        showNotification('Error opening database', 'error');
    };
    
    request.onsuccess = function(event) {
        db = event.target.result;
        loadTasks();
    };
    
    request.onupgradeneeded = function(event) {
        db = event.target.result;
        
        if (!db.objectStoreNames.contains('tasks')) {
            const objectStore = db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });
            objectStore.createIndex('completed', 'completed', { unique: false });
        }
    };
}

// Toggle help modal
function toggleHelp() {
    const modal = document.getElementById('helpModal');
    modal.classList.toggle('active');
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('helpModal');
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

// Add a new task
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        showNotification('Please enter a task', 'error');
        return;
    }
    
    const transaction = db.transaction(['tasks'], 'readwrite');
    const objectStore = transaction.objectStore('tasks');
    
    const task = {
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    const request = objectStore.add(task);
    
    request.onsuccess = function() {
        taskInput.value = '';
        loadTasks();
        showNotification('Task added successfully', 'success');
    };
    
    request.onerror = function() {
        showNotification('Error adding task', 'error');
    };
}

// Load all tasks
function loadTasks() {
    const transaction = db.transaction(['tasks'], 'readonly');
    const objectStore = transaction.objectStore('tasks');
    const request = objectStore.getAll();
    
    request.onsuccess = function(event) {
        const tasks = event.target.result;
        displayTasks(tasks);
        updateStats(tasks);
    };
}

// Display tasks in the UI
function displayTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <div class="empty-state-text">No tasks yet. Add your first task above.</div>
            </div>
        `;
        return;
    }
    
    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item' + (task.completed ? ' completed' : '');
        
        taskItem.innerHTML = `
            <span class="task-text">${task.text}</span>
            <div class="task-actions">
                <button class="btn btn-secondary" onclick="toggleComplete(${task.id})">
                    ${task.completed ? 'Undo' : 'Complete'}
                </button>
                <button class="btn btn-delete" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
        
        taskList.appendChild(taskItem);
    });
}

// Toggle task completion
function toggleComplete(taskId) {
    const transaction = db.transaction(['tasks'], 'readwrite');
    const objectStore = transaction.objectStore('tasks');
    const request = objectStore.get(taskId);
    
    request.onsuccess = function(event) {
        const task = event.target.result;
        task.completed = !task.completed;
        
        const updateRequest = objectStore.put(task);
        updateRequest.onsuccess = function() {
            loadTasks();
        };
    };
}

// Delete a specific task
function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    const transaction = db.transaction(['tasks'], 'readwrite');
    const objectStore = transaction.objectStore('tasks');
    const request = objectStore.delete(taskId);
    
    request.onsuccess = function() {
        loadTasks();
        showNotification('Task deleted', 'success');
    };
}

// Delete all tasks
function deleteAllTasks() {
    if (!confirm('Are you sure you want to delete ALL tasks? This cannot be undone.')) {
        return;
    }
    
    const transaction = db.transaction(['tasks'], 'readwrite');
    const objectStore = transaction.objectStore('tasks');
    const request = objectStore.clear();
    
    request.onsuccess = function() {
        loadTasks();
        showNotification('All tasks deleted', 'success');
    };
}

// Update statistics
function updateStats(tasks) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    
    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('pendingTasks').textContent = pending;
}

// Handle Enter key press
document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 28px;
        background: ${type === 'success' ? '#000000' : '#333333'};
        color: white;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 2px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid ${type === 'success' ? '#000000' : '#333333'};
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-10px)';
        notification.style.transition = 'all 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize database when page loads
window.addEventListener('DOMContentLoaded', () => {
    initDB();
});
