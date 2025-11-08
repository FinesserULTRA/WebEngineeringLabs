// Register Service Worker
if ('serviceWorker' in navigator) {
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname === '[::1]';
    const isHTTPS = window.location.protocol === 'https:';
    const isFileProtocol = window.location.protocol === 'file:';

    if (isFileProtocol) {
        updateSWStatus('Service Workers require a web server. Please refer to the help guide for setup instructions.');
        document.getElementById('cachedFiles').innerHTML = `
            <div class="cache-list-header">Setup Required</div>
            <div class="cache-list-item" style="color: #e74c3c;">Cannot use Service Workers with file:// protocol</div>
            <div class="cache-list-item">1. Use VS Code Live Server extension</div>
            <div class="cache-list-item">2. Or run: python -m http.server 8000</div>
            <div class="cache-list-item">3. Or run: npx http-server</div>
            <div class="cache-list-item">Click the help button for detailed instructions</div>
        `;
    } else if (isLocalhost || isHTTPS) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(registration => {
                    updateSWStatus('Service Worker registered and active');
                    checkCacheStatus();
                })
                .catch(error => {
                    updateSWStatus('Service Worker registration failed: ' + error.message);
                });
        });
    } else {
        updateSWStatus('Service Workers require HTTPS or localhost');
    }
} else {
    updateSWStatus('Service Workers not supported in this browser');
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

// Update service worker status
function updateSWStatus(message) {
    document.getElementById('swStatus').textContent = message;
}

// Check cache status
async function checkCacheStatus() {
    if ('caches' in window) {
        try {
            const cacheNames = await caches.keys();
            const cachedFilesList = document.getElementById('cachedFiles');
            cachedFilesList.innerHTML = '';

            if (cacheNames.length === 0) {
                cachedFilesList.innerHTML = '<div class="cache-list-item">No caches found. Try refreshing the page.</div>';
                return;
            }

            for (const cacheName of cacheNames) {
                const cache = await caches.open(cacheName);
                const requests = await cache.keys();
                
                const headerDiv = document.createElement('div');
                headerDiv.className = 'cache-list-header';
                headerDiv.textContent = `Cache: ${cacheName}`;
                cachedFilesList.appendChild(headerDiv);

                requests.forEach(request => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'cache-list-item';
                    itemDiv.textContent = request.url.split('/').pop() || request.url;
                    cachedFilesList.appendChild(itemDiv);
                });
            }
        } catch (error) {
            document.getElementById('cachedFiles').innerHTML = '<div class="cache-list-item">Error loading cache information</div>';
        }
    }
}

// Unregister service worker
async function unregisterSW() {
    if (!confirm('Are you sure you want to unregister the Service Worker and clear all caches?')) {
        return;
    }

    if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (let registration of registrations) {
            await registration.unregister();
        }
        
        const cacheNames = await caches.keys();
        for (let cacheName of cacheNames) {
            await caches.delete(cacheName);
        }
        
        showNotification('Service Worker unregistered and caches cleared. Refresh the page.', 'success');
        updateSWStatus('Service Worker unregistered');
        document.getElementById('cachedFiles').innerHTML = '<div class="cache-list-item">Caches cleared</div>';
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
