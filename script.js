let memoryValue = null;
let currentExpression = '0';
let lastResult = null;
let calculationHistory = [];

const displayElement = document.getElementById('display');
const memoryIndicator = document.getElementById('memoryIndicator');

function init() {
    refreshDisplay();
    updateMemoryIndicator();
    console.log('Royal Purple Calculator initialized! 🟣');
}

function refreshDisplay() {
    let displayText = currentExpression;
    
    const errorMessages = ['Error', 'Invalid Input', 'Overflow', 'Cannot divide by 0', 'Math Error'];
    
    if (!errorMessages.includes(currentExpression) && 
        !currentExpression.match(/[\+\-\*\/]/) && 
        !isNaN(currentExpression)) {
        const num = parseFloat(currentExpression);
        if (isFinite(num)) {
            if (Math.abs(num) >= 1000 && Number.isInteger(num)) {
                displayText = num.toLocaleString('en-US');
            } else if (Math.abs(num) >= 1000 && !Number.isInteger(num)) {
                const parts = num.toString().split('.');
                parts[0] = parseInt(parts[0]).toLocaleString('en-US');
                displayText = parts.join('.');
            }
        }
    }
    
    displayElement.value = displayText;
    displayElement.scrollLeft = displayElement.scrollWidth;
    
    const length = displayText.length;
    displayElement.classList.remove('small-text', 'smaller-text', 'smallest-text');
    
    if (length > 20) {
        displayElement.classList.add('smallest-text');
    } else if (length > 15) {
        displayElement.classList.add('smaller-text');
    } else if (length > 12) {
        displayElement.classList.add('small-text');
    }
}

function updateMemoryIndicator() {
    if (memoryValue !== null && memoryValue !== 0) {
        memoryIndicator.textContent = 'M';
        memoryIndicator.classList.add('active');
    } else {
        memoryIndicator.textContent = '';
        memoryIndicator.classList.remove('active');
    }
}

function handleNumber(num) {
    if (currentExpression === '0' || lastResult !== null) {
        currentExpression = num;
        lastResult = null;
    } else {
        if (currentExpression.length < 30) {
            currentExpression += num;
        }
    }
    refreshDisplay();
}

function handleOperator(operator) {
    const lastChar = currentExpression.slice(-1);
    if (['+', '-', '*', '/'].includes(lastChar)) {
        currentExpression = currentExpression.slice(0, -1) + operator;
    } else if (currentExpression !== '0') {
        currentExpression += operator;
    }
    lastResult = null;
    refreshDisplay();
}

function handleDecimal() {
    const parts = currentExpression.split(/[\+\-\*\/]/);
    const lastNumber = parts[parts.length - 1];
    
    if (!lastNumber.includes('.')) {
        if (currentExpression === '0' || lastResult !== null) {
            currentExpression = '0.0';
            lastResult = null;
        } else {
            currentExpression += '.0';
        }
        refreshDisplay();
    }
}

function handleToggleSign() {
    if (!currentExpression.match(/[\+\-\*\/]/)) {
        const value = parseFloat(currentExpression);
        if (!isNaN(value) && value !== 0) {
            currentExpression = String(-value);
            refreshDisplay();
        }
    }
}

function handleEquals() {
    try {
        let expression = currentExpression.trim();
        const lastChar = expression.slice(-1);
        if (['+', '-', '*', '/'].includes(lastChar)) {
            expression = expression.slice(0, -1);
        }
        
        if (!expression || expression === '0' || expression.match(/^[\+\-\*\/]+$/)) {
            return;
        }
        
        if (expression.match(/\/\s*0(?!\d)/)) {
            currentExpression = 'Cannot divide by 0';
            refreshDisplay();
            setTimeout(() => {
                currentExpression = '0';
                lastResult = null;
                refreshDisplay();
            }, 1500);
            return;
        }
        
        const result = Function('"use strict"; return (' + expression + ')')();
        
        if (!isFinite(result) || isNaN(result)) {
            if (result === Infinity || result === -Infinity) {
                currentExpression = 'Overflow';
            } else {
                currentExpression = 'Error';
            }
            refreshDisplay();
            setTimeout(() => {
                currentExpression = '0';
                lastResult = null;
                refreshDisplay();
            }, 1500);
            return;
        }
        
        calculationHistory.push({
            expression: expression,
            result: result
        });
        
        const roundedResult = Math.round(result * 100000000) / 100000000;
        currentExpression = String(roundedResult);
        lastResult = roundedResult;
        
        displayElement.classList.add('result-animation');
        setTimeout(() => {
            displayElement.classList.remove('result-animation');
        }, 600);
        
        refreshDisplay();
        
    } catch (error) {
        console.error('Calculation error:', error);
        currentExpression = 'Invalid Input';
        refreshDisplay();
        setTimeout(() => {
            currentExpression = '0';
            lastResult = null;
            refreshDisplay();
        }, 1500);
    }
}

function handleClear() {
    currentExpression = '0';
    lastResult = null;
    refreshDisplay();
}

function handleSquare() {
    if (!currentExpression.match(/[\+\-\*\/]/)) {
        const value = parseFloat(currentExpression);
        if (!isNaN(value) && isFinite(value)) {
            const result = value * value;
            if (isFinite(result)) {
                currentExpression = String(result);
                lastResult = result;
                refreshDisplay();
            } else {
                currentExpression = 'Overflow';
                refreshDisplay();
                setTimeout(() => {
                    currentExpression = '0';
                    lastResult = null;
                    refreshDisplay();
                }, 1500);
            }
        }
    }
}

function handleReciprocal() {
    if (!currentExpression.match(/[\+\-\*\/]/)) {
        const value = parseFloat(currentExpression);
        if (!isNaN(value) && isFinite(value)) {
            if (value === 0) {
                currentExpression = 'Cannot divide by 0';
                refreshDisplay();
                setTimeout(() => {
                    currentExpression = '0';
                    lastResult = null;
                    refreshDisplay();
                }, 1500);
            } else {
                const result = 1 / value;
                if (isFinite(result)) {
                    currentExpression = String(result);
                    lastResult = result;
                    refreshDisplay();
                } else {
                    currentExpression = 'Overflow';
                    refreshDisplay();
                    setTimeout(() => {
                        currentExpression = '0';
                        lastResult = null;
                        refreshDisplay();
                    }, 1500);
                }
            }
        }
    }
}

function handleSquareRoot() {
    if (!currentExpression.match(/[\+\-\*\/]/)) {
        const value = parseFloat(currentExpression);
        if (!isNaN(value) && isFinite(value)) {
            if (value < 0) {
                currentExpression = 'Math Error';
                refreshDisplay();
                setTimeout(() => {
                    currentExpression = '0';
                    lastResult = null;
                    refreshDisplay();
                }, 1500);
            } else {
                const result = Math.sqrt(value);
                if (isFinite(result)) {
                    currentExpression = String(result);
                    lastResult = result;
                    refreshDisplay();
                } else {
                    currentExpression = 'Error';
                    refreshDisplay();
                    setTimeout(() => {
                        currentExpression = '0';
                        lastResult = null;
                        refreshDisplay();
                    }, 1500);
                }
            }
        }
    }
}

function handleMemoryStore() {
    const errorMessages = ['Error', 'Invalid Input', 'Overflow', 'Cannot divide by 0', 'Math Error'];
    if (!currentExpression.match(/[\+\-\*\/]/) && !errorMessages.includes(currentExpression)) {
        const value = parseFloat(currentExpression);
        if (!isNaN(value) && isFinite(value)) {
            memoryValue = value;
            updateMemoryIndicator();
            
            memoryIndicator.style.animation = 'none';
            memoryIndicator.offsetHeight;
            memoryIndicator.style.animation = 'pulse 0.4s ease-out';
            
            displayElement.style.borderColor = 'rgba(251, 191, 36, 0.6)';
            setTimeout(() => {
                displayElement.style.borderColor = '';
            }, 300);
        }
    }
}

function handleMemoryClear() {
    memoryValue = null;
    updateMemoryIndicator();
    
    displayElement.style.borderColor = 'rgba(220, 38, 38, 0.4)';
    setTimeout(() => {
        displayElement.style.borderColor = '';
    }, 300);
}

function handleMemoryRecall() {
    if (memoryValue !== null) {
        currentExpression = String(memoryValue);
        lastResult = null;
        refreshDisplay();
        
        displayElement.classList.add('result-animation');
        setTimeout(() => {
            displayElement.classList.remove('result-animation');
        }, 400);
    }
}

function handleMemoryAdd() {
    const errorMessages = ['Error', 'Invalid Input', 'Overflow', 'Cannot divide by 0', 'Math Error'];
    if (!currentExpression.match(/[\+\-\*\/]/) && !errorMessages.includes(currentExpression)) {
        const value = parseFloat(currentExpression);
        if (!isNaN(value) && isFinite(value)) {
            if (memoryValue === null) {
                memoryValue = 0;
            }
            memoryValue += value;
            if (!isFinite(memoryValue)) {
                memoryValue = null;
                updateMemoryIndicator();
                return;
            }
            updateMemoryIndicator();
            
            memoryIndicator.style.animation = 'none';
            memoryIndicator.offsetHeight;
            memoryIndicator.style.animation = 'pulse 0.4s ease-out';
        }
    }
}

document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (['/', 'Enter'].includes(key)) {
        event.preventDefault();
    }
    
    if (key >= '0' && key <= '9') {
        handleNumber(key);
    }
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
    else if (key === '.' || key === ',') {
        handleDecimal();
    }
    else if (key === 'Enter' || key === '=') {
        handleEquals();
    }
    else if (key === 'Escape' || key.toLowerCase() === 'c') {
        handleClear();
    }
    else if (key === 'Backspace') {
        if (currentExpression.length > 1 && lastResult === null) {
            currentExpression = currentExpression.slice(0, -1);
        } else {
            currentExpression = '0';
        }
        refreshDisplay();
    }
    else if (key === 's' || key === 'S') {
        handleSquare();
    }
    else if (key === 'r' || key === 'R') {
        handleSquareRoot();
    }
});

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

window.addEventListener('load', () => {
    init();
    console.log('✨ Royal Purple Calculator Ready! ✨');
    console.log('🎹 Keyboard shortcuts: S for square, R for square root');
});

document.querySelector('.calculator')?.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});
