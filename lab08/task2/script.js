// Load saved quote on page load
window.addEventListener('DOMContentLoaded', () => {
    loadQuote();
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

// Save quote to sessionStorage
function saveQuote() {
    const quoteText = document.getElementById('quoteText').value;
    
    if (quoteText.trim() === '') {
        showNotification('Please enter a quote', 'error');
        return;
    }
    
    // Store in sessionStorage
    sessionStorage.setItem('quote', quoteText);
    
    showNotification('Quote saved to session', 'success');
    displaySavedQuote(quoteText);
}

// Load quote from sessionStorage
function loadQuote() {
    const savedQuote = sessionStorage.getItem('quote');
    
    if (savedQuote) {
        document.getElementById('quoteText').value = savedQuote;
        displaySavedQuote(savedQuote);
    }
}

// Display saved quote
function displaySavedQuote(quote) {
    const displayDiv = document.getElementById('displayQuote');
    displayDiv.innerHTML = `<strong>Saved Quote</strong><div style="margin-top: 8px; font-style: italic;">"${quote}"</div>`;
    displayDiv.style.display = 'block';
}

// Clear quote from sessionStorage
function clearQuote() {
    if (!confirm('Are you sure you want to clear the saved quote?')) {
        return;
    }
    
    sessionStorage.removeItem('quote');
    
    document.getElementById('quoteText').value = '';
    document.getElementById('displayQuote').style.display = 'none';
    
    showNotification('Quote cleared', 'success');
}

// Auto-save as user types
document.getElementById('quoteText').addEventListener('input', function() {
    if (this.value.trim() !== '') {
        sessionStorage.setItem('quote', this.value);
    }
});

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
