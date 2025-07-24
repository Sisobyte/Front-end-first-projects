// calculator programme

let justCalculated = false;

const display = document.getElementById("display");

function appendToDisplay(input) {
  const operators = ['+', '-', '*', '/', '**', '%'];

  // If result was just calculated
  if (justCalculated) {
    if (operators.includes(input)) {
      display.value += input; // continue with result
    } else {
      display.value = input; // start fresh with new number
    }
    justCalculated = false;
  } else {
    display.value += input;
  }
}

function clearDisplay() {
  display.value = "";
  justCalculated = false;
}

function backspace() {
  display.value = display.value.slice(0, -1); // Remove last character
}

function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}

function calculate() {
  try {
    let expression = display.value;

    // Replace custom functions
    expression = expression.replace(/sin\(([^)]+)\)/g, 'Math.sin(degToRad($1))');
    expression = expression.replace(/cos\(([^)]+)\)/g, 'Math.cos(degToRad($1))');
    expression = expression.replace(/tan\(([^)]+)\)/g, 'Math.tan(degToRad($1))');
    expression = expression.replace(/log\(/g, 'Math.log10(');
    expression = expression.replace(/abs\(/g, 'Math.abs(');
    expression = expression.replace(/√\(/g, 'Math.sqrt(');
    expression = expression.replace(/\^/g, '**');

    // Convert percentages like 25% to (25/100)
    expression = expression.replace(/(\d+(\.\d+)?)%/g, '($1/100)');

    display.value = eval(expression);
    justCalculated = true; // Set flag so next input is handled properly
  } catch (error) {
    display.value = "Error";
    justCalculated = false;
  }
}

// Polyfill for Math.log10 (for older browsers)
if (!Math.log10) {
  Math.log10 = function(x) {
    return Math.log(x) / Math.LN10;
  };
}

function toggleDropdown() {
  const dropdown = document.getElementById("dropdownMenu");
  dropdown.classList.toggle("show");

  // Toggle visibility using inline style (optional cleanup)
  if (dropdown.style.display === "block") {
    dropdown.style.display = "none";
  } else {
    dropdown.style.display = "block";
  }
}
