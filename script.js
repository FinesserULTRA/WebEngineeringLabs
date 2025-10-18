// Name: Mustafa Hamad
// CMS: 455095
// Section: BESE14A


let memoryValue = null;
let displayValue = '0';
let previousValue = null;
let currentOperator = null;
let shouldResetDisplay = false;
let calculationHistory = [];

// Get display element
const displayElement = document.getElementById('display');
const memoryIndicator = document.getElementById('memoryIndicator');

// Initialize calculator
function init() {
    refreshDisplay();
    updateMemoryIndicator();
    console.log('Royal Purple Calculator initialized! 🟣');
}

// Update display with formatting
function refreshDisplay() {
    // Format large numbers with commas
    let formattedValue = displayValue;
    
    // Only format if it's a valid number and not too long
    if (!isNaN(displayValue) && displayValue.length < 15 && !displayValue.includes('e')) {
        const num = parseFloat(displayValue);
        if (Math.abs(num) >= 1000 && Number.isInteger(num)) {
            formattedValue = num.toLocaleString('en-US');
        }
    }
    
    displayElement.value = formattedValue;
}

function updateMemoryIndicator() {
    if (memoryValue !== null && memoryValue !== 0) {
        const memValue = Math.abs(memoryValue);
        if (memValue >= 1000000) {
            memoryIndicator.textContent = 'M';
        } else if (memValue >= 1000) {
            memoryIndicator.textContent = 'M';
        } else {
            memoryIndicator.textContent = 'M';
        }
        memoryIndicator.classList.add('active');
    } else {
        memoryIndicator.textContent = '';
        memoryIndicator.classList.remove('active');
    }
}

function handleNumber(num) {
    if (shouldResetDisplay || displayValue === '0') {
        displayValue = num;
        shouldResetDisplay = false;
    } else {
        if (displayValue.length < 12) {
            displayValue += num;
        }
    }
    refreshDisplay();
}

// Handle operator input with calculation chaining
function handleOperator(operator) {
    const inputValue = parseFloat(displayValue.replace(/,/g, ''));
    
    if (previousValue === null) {
        previousValue = inputValue;
    } else if (currentOperator && !shouldResetDisplay) {
        const result = performCalculation();
        displayValue = String(result);
        previousValue = result;
        refreshDisplay();
    }
    
    shouldResetDisplay = true;
    currentOperator = operator;
}

function performCalculation() {
    const prev = previousValue;
    const current = parseFloat(displayValue.replace(/,/g, ''));
    
    if (isNaN(prev) || isNaN(current)) return current;
    
    let result;
    switch (currentOperator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            result = current !== 0 ? prev / current : NaN;
            break;
        default:
            return current;
    }
    
    // Round to avoid floating point errors
    return Math.round(result * 100000000) / 100000000;
}

// Handle decimal point with smarter logic
function handleDecimal() {
    if (shouldResetDisplay) {
        displayValue = '0.';
        shouldResetDisplay = false;
    } else if (!displayValue.includes('.')) {
        displayValue += '.';
    }
    refreshDisplay();
}

// Handle toggle sign (±) with state awareness
function handleToggleSign() {
    const value = parseFloat(displayValue.replace(/,/g, ''));
    
    if (!isNaN(value) && value !== 0) {
        displayValue = String(-value);
        refreshDisplay();
    }
}

// Handle equals with animation and history
function handleEquals() {
    if (currentOperator && previousValue !== null) {
        const result = performCalculation();
        
        // Store calculation in history
        calculationHistory.push({
            expression: `${previousValue} ${currentOperator} ${displayValue}`,
            result: result
        });
        
        if (!isNaN(result) && isFinite(result)) {
            displayValue = String(result);
            
            // Add visual feedback animation
            displayElement.classList.add('result-animation');
            setTimeout(() => {
                displayElement.classList.remove('result-animation');
            }, 600);
            
            refreshDisplay();
        } else {
            displayValue = 'Error';
            refreshDisplay();
            resetCalculator();
        }
        
        previousValue = null;
        currentOperator = null;
        shouldResetDisplay = true;
    }
}

// Reset calculator state
function resetCalculator() {
    previousValue = null;
    currentOperator = null;
    shouldResetDisplay = false;
}

function handleClear() {
    displayValue = '0';
    previousValue = null;
    currentOperator = null;
    shouldResetDisplay = false;
    refreshDisplay();
}

function handleSquare() {
    const value = parseFloat(displayValue.replace(/,/g, ''));
    
    if (!isNaN(value)) {
        const result = value * value;
        displayValue = String(result);
        shouldResetDisplay = true;
        refreshDisplay();
    }
}

function handleReciprocal() {
    const value = parseFloat(displayValue.replace(/,/g, ''));
    
    if (!isNaN(value) && value !== 0) {
        const result = 1 / value;
        displayValue = String(result);
        shouldResetDisplay = true;
        refreshDisplay();
    } else {
        displayValue = 'Cannot divide by 0';
        setTimeout(() => {
            displayValue = '0';
            refreshDisplay();
        }, 1500);
        refreshDisplay();
    }
}

function handleSquareRoot() {
    const value = parseFloat(displayValue.replace(/,/g, ''));
    
    if (!isNaN(value)) {
        if (value >= 0) {
            const result = Math.sqrt(value);
            displayValue = String(result);
            shouldResetDisplay = true;
            refreshDisplay();
        } else {
            displayValue = 'Invalid Input';
            setTimeout(() => {
                displayValue = '0';
                refreshDisplay();
            }, 1500);
            refreshDisplay();
        }
    }
}

function handleMemoryStore() {
    const value = parseFloat(displayValue.replace(/,/g, ''));
    
    if (!isNaN(value) && displayValue !== 'Error') {
        memoryValue = value;
        updateMemoryIndicator();
        
        memoryIndicator.style.animation = 'none';
        memoryIndicator.offsetHeight; // Trigger reflow
        memoryIndicator.style.animation = 'pulse 0.4s ease-out';
        
        displayElement.style.borderColor = 'rgba(251, 191, 36, 0.6)';
        setTimeout(() => {
            displayElement.style.borderColor = '';
        }, 300);
    }
}

// Handle Memory Clear (MC)
function handleMemoryClear() {
    memoryValue = null;
    updateMemoryIndicator();
    
    // Visual feedback
    displayElement.style.borderColor = 'rgba(220, 38, 38, 0.4)';
    setTimeout(() => {
        displayElement.style.borderColor = '';
    }, 300);
}

// Handle Memory Recall (MR)
function handleMemoryRecall() {
    if (memoryValue !== null) {
        displayValue = String(memoryValue);
        shouldResetDisplay = true;
        refreshDisplay();
        
        // Visual feedback
        displayElement.classList.add('result-animation');
        setTimeout(() => {
            displayElement.classList.remove('result-animation');
        }, 400);
    }
}

// Handle Memory Add (M+) with accumulation
function handleMemoryAdd() {
    const value = parseFloat(displayValue.replace(/,/g, ''));
    
    if (!isNaN(value) && displayValue !== 'Error') {
        if (memoryValue === null) {
            memoryValue = 0;
        }
        memoryValue += value;
        updateMemoryIndicator();
        
        memoryIndicator.style.animation = 'none';
        memoryIndicator.offsetHeight; // Trigger reflow
        memoryIndicator.style.animation = 'pulse 0.4s ease-out';
    }
}

document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Prevent default for certain keys
    if (['/', 'Enter'].includes(key)) {
        event.preventDefault();
    }
    
    // Numbers
    if (key >= '0' && key <= '9') {
        handleNumber(key);
    }
    // Operators
    else if (key === '+') {
        handleOperator('+');
    }
    else if (key === '-') {
        handleOperator('-');
    }
    else if (key === '*' || key === 'x' || key === 'X') {
        handleOperator('*');
    }
    else if (key === '/') {
        handleOperator('/');
    }
    // Decimal
    else if (key === '.' || key === ',') {
        handleDecimal();
    }
    // Equals
    else if (key === 'Enter' || key === '=') {
        handleEquals();
    }
    // Clear
    else if (key === 'Escape' || key.toLowerCase() === 'c') {
        handleClear();
    }
    // Backspace
    else if (key === 'Backspace') {
        if (displayValue.length > 1 && !shouldResetDisplay) {
            displayValue = displayValue.slice(0, -1).replace(/,/g, '');
        } else {
            displayValue = '0';
        }
        refreshDisplay();
    }
    // Special functions
    else if (key === 's' || key === 'S') {
        handleSquare();
    }
    else if (key === 'r' || key === 'R') {
        handleSquareRoot();
    }
});

// Add visual feedback for button presses
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 100);
    });
});

const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
            opacity: 1;
            filter: brightness(1);
        }
        50% {
            transform: scale(1.15);
            opacity: 0.85;
            filter: brightness(1.2);
        }
    }
`;
document.head.appendChild(style);

// Initialize on load with welcome message
window.addEventListener('load', () => {
    init();
    console.log('✨ Royal Purple Calculator Ready! ✨');
    console.log('🎹 Keyboard shortcuts: S for square, R for square root');
});

// Prevent context menu on calculator
document.querySelector('.calculator')?.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});
