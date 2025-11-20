// Load saved preferences on page load
window.addEventListener('DOMContentLoaded', () => {
    loadPreferences();
});

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

// Save preferences to localStorage
function savePreferences() {
    const userName = document.getElementById('userName').value;
    const themeColor = document.getElementById('themeColor').value;

    if (userName.trim() === '') {
        showNotification('Please enter your name', 'error');
        return;
    }

    // Store in localStorage
    console.log('Saving preferences:', { userName, themeColor });
    localStorage.setItem('userName', userName);
    localStorage.setItem('themeColor', themeColor);

    showNotification('Preferences saved successfully', 'success');
    loadPreferences();
}

// Load preferences from localStorage
function loadPreferences() {
    const savedName = localStorage.getItem('userName');
    const savedColor = localStorage.getItem('themeColor');

    console.log('Loading preferences:', { savedName, savedColor });
    if (savedName) {
        document.getElementById('userName').value = savedName;
        const welcomeMsg = document.getElementById('welcomeMessage');
        welcomeMsg.textContent = `Welcome back, ${savedName}`;
        welcomeMsg.style.display = 'block';
    }

    if (savedColor) {
        document.getElementById('themeColor').value = savedColor;
        document.body.style.background = savedColor;
        document.body.style.backgroundImage = 'none';
    }
}

// Clear data from localStorage
function clearData() {
    if (!confirm('Are you sure you want to clear all saved data?')) {
        return;
    }

    localStorage.removeItem('userName');
    localStorage.removeItem('themeColor');

    document.getElementById('userName').value = '';
    document.getElementById('themeColor').value = '#2c3e50';
    // Restore the original gradient background
    document.body.style.background = '';
    document.body.style.backgroundImage = '';
    document.getElementById('welcomeMessage').style.display = 'none';

    showNotification('All data cleared', 'success');
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = 'notification';
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