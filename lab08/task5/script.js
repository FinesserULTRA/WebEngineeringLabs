let db;

// Initialize IndexedDB
function initDB() {
    const request = indexedDB.open("ComparisonDB", 1);
    
    request.onerror = () => console.error("Database error");
    
    request.onsuccess = (event) => {
        db = event.target.result;
        loadAllData();
    };
    
    request.onupgradeneeded = (event) => {
        db = event.target.result;
        if (!db.objectStoreNames.contains('items')) {
            db.createObjectStore('items', { keyPath: 'id', autoIncrement: true });
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

// localStorage functions
function saveToLocalStorage() {
    const input = document.getElementById('localStorageInput');
    const value = input.value.trim();
    
    if (value === '') {
        showNotification('Please enter some data', 'error');
        return;
    }
    
    const timestamp = new Date().toLocaleString();
    const data = { value, timestamp };
    
    localStorage.setItem('comparisonData', JSON.stringify(data));
    input.value = '';
    loadAllData();
    showNotification('Data saved to localStorage', 'success');
}

function clearLocalStorage() {
    localStorage.removeItem('comparisonData');
    loadAllData();
    showNotification('localStorage cleared', 'success');
}

// sessionStorage functions
function saveToSessionStorage() {
    const input = document.getElementById('sessionStorageInput');
    const value = input.value.trim();
    
    if (value === '') {
        showNotification('Please enter some data', 'error');
        return;
    }
    
    const timestamp = new Date().toLocaleString();
    const data = { value, timestamp };
    
    sessionStorage.setItem('comparisonData', JSON.stringify(data));
    input.value = '';
    loadAllData();
    showNotification('Data saved to sessionStorage', 'success');
}

function clearSessionStorage() {
    sessionStorage.removeItem('comparisonData');
    loadAllData();
    showNotification('sessionStorage cleared', 'success');
}

// IndexedDB functions
function saveToIndexedDB() {
    const input = document.getElementById('indexedDBInput');
    const value = input.value.trim();
    
    if (value === '') {
        showNotification('Please enter some data', 'error');
        return;
    }
    
    const transaction = db.transaction(['items'], 'readwrite');
    const objectStore = transaction.objectStore('items');
    
    const data = {
        value: value,
        timestamp: new Date().toLocaleString()
    };
    
    objectStore.add(data);
    
    transaction.oncomplete = () => {
        input.value = '';
        loadAllData();
        showNotification('Data saved to IndexedDB', 'success');
    };
}

function clearIndexedDB() {
    const transaction = db.transaction(['items'], 'readwrite');
    const objectStore = transaction.objectStore('items');
    objectStore.clear();
    
    transaction.oncomplete = () => {
        loadAllData();
        showNotification('IndexedDB cleared', 'success');
    };
}

// Load all data
function loadAllData() {
    // Load localStorage
    const localData = localStorage.getItem('comparisonData');
    const localDisplay = document.getElementById('localStorageDisplay');
    
    if (localData) {
        const parsed = JSON.parse(localData);
        localDisplay.innerHTML = `
            <strong>Value:</strong> ${parsed.value}<br>
            <strong>Saved:</strong> ${parsed.timestamp}
        `;
        localDisplay.classList.remove('empty');
    } else {
        localDisplay.textContent = 'No data stored';
        localDisplay.classList.add('empty');
    }
    
    // Load sessionStorage
    const sessionData = sessionStorage.getItem('comparisonData');
    const sessionDisplay = document.getElementById('sessionStorageDisplay');
    
    if (sessionData) {
        const parsed = JSON.parse(sessionData);
        sessionDisplay.innerHTML = `
            <strong>Value:</strong> ${parsed.value}<br>
            <strong>Saved:</strong> ${parsed.timestamp}
        `;
        sessionDisplay.classList.remove('empty');
    } else {
        sessionDisplay.textContent = 'No data stored';
        sessionDisplay.classList.add('empty');
    }
    
    // Load IndexedDB
    if (db) {
        const transaction = db.transaction(['items'], 'readonly');
        const objectStore = transaction.objectStore('items');
        const request = objectStore.getAll();
        
        request.onsuccess = (event) => {
            const items = event.target.result;
            const indexedDBDisplay = document.getElementById('indexedDBDisplay');
            
            if (items.length > 0) {
                let html = '';
                items.forEach((item, index) => {
                    html += `
                        <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--border-color);">
                            <strong>Item ${index + 1}:</strong> ${item.value}<br>
                            <small style="color: var(--text-secondary);">${item.timestamp}</small>
                        </div>
                    `;
                });
                indexedDBDisplay.innerHTML = html;
                indexedDBDisplay.classList.remove('empty');
            } else {
                indexedDBDisplay.textContent = 'No data stored';
                indexedDBDisplay.classList.add('empty');
            }
            
            updateStats(localData, sessionData, items.length);
        };
    }
}

// Update statistics
function updateStats(localData, sessionData, indexedDBCount) {
    document.getElementById('localStorageCount').textContent = localData ? '1' : '0';
    document.getElementById('sessionStorageCount').textContent = sessionData ? '1' : '0';
    document.getElementById('indexedDBCount').textContent = indexedDBCount;
}

// Clear all storage
function clearAllStorage() {
    if (!confirm('Are you sure you want to clear ALL storage data? This action cannot be undone.')) {
        return;
    }
    
    localStorage.removeItem('comparisonData');
    sessionStorage.removeItem('comparisonData');
    
    if (db) {
        const transaction = db.transaction(['items'], 'readwrite');
        const objectStore = transaction.objectStore('items');
        objectStore.clear();
        
        transaction.oncomplete = () => {
            loadAllData();
            showNotification('All storage cleared successfully', 'success');
        };
    }
}

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

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    initDB();
});
