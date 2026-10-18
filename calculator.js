const display = document.getElementById("display");

function appendValue(value) {
display.value += value;
}

function clearDisplay() {
display.value = "";
}

function deleteLast() {
display.value = display.value.slice(0, -1);
}

function calculateResult() {
try {
const expression = display.value;


    // Allow only numbers, operators, decimal points, spaces and brackets
    if (!/^[0-9+\-*/.() ]+$/.test(expression)) {
        display.value = "Error";
        return;
    }

    const result = Function('"use strict"; return (' + expression + ')')();

    if (!Number.isFinite(result)) {
        display.value = "Error";
        return;
    }

    display.value = result;
} catch (error) {
    display.value = "Error";
}


}
