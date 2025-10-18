// Name: Mustafa Hamad
// CMS: 455095
// Section: BESE14A


// Global memory variable for calculator
let M = null;
let currentInput = '0';
let lastResult = null;

// Get display element
const display = document.getElementById('display');
const memoryIndicator = document.getElementById('memoryIndicator');

// Initialize calculator
function init() {
    updateDisplay();
    updateMemoryIndicator();
}

// Update display
function updateDisplay() {
    display.value = currentInput;
}

// Update memory indicator
function updateMemoryIndicator() {
    if (M !== null && M !== 0) {
        memoryIndicator.textContent = 'M';
        memoryIndicator.classList.add('active');
    } else {
        memoryIndicator.textContent = '';
        memoryIndicator.classList.remove('active');
    }
}

// Handle number input
function handleNumber(num) {
    if (currentInput === '0' || lastResult !== null) {
        currentInput = num;
        lastResult = null;
    } else {
        currentInput += num;
    }
    updateDisplay();
}

// Handle operator input
function handleOperator(operator) {
    // If the last character is already an operator, replace it
    const lastChar = currentInput.slice(-1);
    if (['+', '-', '*', '/'].includes(lastChar)) {
        currentInput = currentInput.slice(0, -1) + operator;
    } else {
        currentInput += operator;
    }
    lastResult = null;
    updateDisplay();
}

// Handle decimal point
function handleDecimal() {
    // Get the last number in the expression
    const parts = currentInput.split(/[\+\-\*\/]/);
    const lastNumber = parts[parts.length - 1];
    
    // Check if the last number already has a decimal point
    if (!lastNumber.includes('.')) {
        // If input is '0' or we just got a result, start fresh with '0.'
        if (currentInput === '0' || lastResult !== null) {
            currentInput = '0.0';
            lastResult = null;
        } else {
            // Add '.0' to the end as per requirement (a '0' must be added at the end)
            currentInput += '.0';
        }
        updateDisplay();
    }
}

// Handle toggle sign (±)
function handleToggleSign() {
    try {
        // If there's an equation, don't toggle
        if (currentInput.match(/[\+\-\*\/]/)) {
            return;
        }
        
        // Parse the current value
        let value = parseFloat(currentInput);
        
        if (!isNaN(value)) {
            value = -value;
            currentInput = value.toString();
            updateDisplay();
        }
    } catch (error) {
        console.error('Error toggling sign:', error);
    }
}

// Handle equals
function handleEquals() {
    try {
        // Evaluate the expression using eval()
        const result = eval(currentInput);
        
        if (isFinite(result)) {
            currentInput = result.toString();
            lastResult = result;
            
            // Add animation effect
            display.classList.add('result-animation');
            setTimeout(() => {
                display.classList.remove('result-animation');
            }, 500);
            
            updateDisplay();
        } else {
            currentInput = 'Error';
            updateDisplay();
        }
    } catch (error) {
        currentInput = 'Error';
        updateDisplay();
    }
}

// Handle clear
function handleClear() {
    currentInput = '0';
    lastResult = null;
    // Clear memory as well when C button is pressed (reset everything)
    M = null;
    updateDisplay();
    updateMemoryIndicator();
}

// Handle square (x²)
function handleSquare() {
    try {
        // Only work with single numbers, not equations
        const value = parseFloat(currentInput);
        
        if (!isNaN(value) && !currentInput.match(/[\+\-\*\/]/)) {
            const result = value * value;
            currentInput = result.toString();
            lastResult = result;
            updateDisplay();
        }
    } catch (error) {
        currentInput = 'Error';
        updateDisplay();
    }
}

// Handle reciprocal (1/x)
function handleReciprocal() {
    try {
        // Only work with single numbers, not equations
        const value = parseFloat(currentInput);
        
        if (!isNaN(value) && value !== 0 && !currentInput.match(/[\+\-\*\/]/)) {
            const result = 1 / value;
            currentInput = result.toString();
            lastResult = result;
            updateDisplay();
        } else if (value === 0) {
            currentInput = 'Error';
            updateDisplay();
        }
    } catch (error) {
        currentInput = 'Error';
        updateDisplay();
    }
}

// Handle square root (√)
function handleSquareRoot() {
    try {
        // Only work with single numbers, not equations
        const value = parseFloat(currentInput);
        
        if (!isNaN(value) && value >= 0 && !currentInput.match(/[\+\-\*\/]/)) {
            const result = Math.sqrt(value);
            currentInput = result.toString();
            lastResult = result;
            updateDisplay();
        } else if (value < 0) {
            currentInput = 'Error';
            updateDisplay();
        }
    } catch (error) {
        currentInput = 'Error';
        updateDisplay();
    }
}

// Handle Memory Store (MS)
function handleMemoryStore() {
    try {
        // Only store if it's a pure numeric value, not an equation
        // In case of an equation, it should not store anything
        if (!currentInput.match(/[\+\-\*\/]/) && currentInput !== 'Error') {
            const value = parseFloat(currentInput);
            if (!isNaN(value)) {
                M = value;
                updateMemoryIndicator();
                
                // Visual feedback
                memoryIndicator.style.animation = 'none';
                setTimeout(() => {
                    memoryIndicator.style.animation = 'pulse 0.3s ease';
                }, 10);
            }
        }
        // If there's an equation in the display, do nothing (don't store)
    } catch (error) {
        console.error('Error storing memory:', error);
    }
}

// Handle Memory Clear (MC)
function handleMemoryClear() {
    M = null;
    updateMemoryIndicator();
}

// Handle Memory Recall (MR)
function handleMemoryRecall() {
    if (M !== null) {
        currentInput = M.toString();
        lastResult = null;
        updateDisplay();
    }
}

// Handle Memory Add (M+)
function handleMemoryAdd() {
    try {
        // Only add if it's a pure numeric value, not an equation
        if (!currentInput.match(/[\+\-\*\/]/) && currentInput !== 'Error') {
            const value = parseFloat(currentInput);
            if (!isNaN(value)) {
                // Initialize memory to 0 if it's null
                if (M === null) {
                    M = 0;
                }
                // Add the input value to the stored value in memory
                M += value;
                updateMemoryIndicator();
                
                // Visual feedback
                memoryIndicator.style.animation = 'none';
                setTimeout(() => {
                    memoryIndicator.style.animation = 'pulse 0.3s ease';
                }, 10);
            }
        }
    } catch (error) {
        console.error('Error adding to memory:', error);
    }
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
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
    else if (key === '*') {
        handleOperator('*');
    }
    else if (key === '/') {
        event.preventDefault(); // Prevent browser's quick search
        handleOperator('/');
    }
    // Decimal
    else if (key === '.') {
        handleDecimal();
    }
    // Equals
    else if (key === 'Enter' || key === '=') {
        handleEquals();
    }
    // Clear
    else if (key === 'Escape' || key === 'c' || key === 'C') {
        handleClear();
    }
    // Backspace
    else if (key === 'Backspace') {
        if (currentInput.length > 1) {
            currentInput = currentInput.slice(0, -1);
        } else {
            currentInput = '0';
        }
        updateDisplay();
    }
});

// Add pulse animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(1.2);
            opacity: 0.8;
        }
    }
`;
document.head.appendChild(style);

// Initialize on load
window.addEventListener('load', init);
