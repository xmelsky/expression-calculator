function eval() {
  // Do not use eval!!!
  return;
}

function getSubExpr(str) {
  let count = 0;
  for (let i = 0; i < str.length; ++i) {
    if (str[i] == "(") count++;
    else if (str[i] == ")") {
      if (count) count--;
      if (!count) return str.slice(0, i + 1);
    }
  }
}

const getMath = {
  "+": (a, b) => +a + +b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => {
    if (b == 0) throw new Error("TypeError: Division by zero.");
    return a / b;
  }
};

function calculate({ operands, operators }) {
  const weight = { "*": 1, "/": 1, "+": 0, "-": 0 };
  if (!operators.length) return operands[0];
  const mathOrder = [...operators].sort((a, b) => weight[b] - weight[a]);
  for (const math of mathOrder) {
    const index = operators.indexOf(math);
    operators.splice(index, 1);
    let left = operands[index];
    let right = operands[index + 1];
    if (typeof left === "object") left = calculate(left);
    if (typeof right === "object") right = calculate(right);
    operands.splice(index, 2, getMath[math](left, right));
  }
  return operands[0];
}

function expressionCalculator(expr) {
  expr = expr.replace(/\s*/g, "");
  const parentheses = expr.match(/\(|\)/g);
  if (parentheses) {
    let count = 0;
    for (const char of parentheses) {
      if (char === "(") count++;
      else count--;
      if (count < 0) throw new Error("ExpressionError: Brackets must be paired");
    }
    if (count > 0) throw new Error("ExpressionError: Brackets must be paired");
  }
  return calculate(exprToAST(expr));
}

function exprToAST(expr) {
  const operands = [];
  const operators = [];
  let str = expr;

  do {
    const operand = str[0] == "(" ? getSubExpr(str) : str.match(/^-?[\d.]+/)[0];
    operands.push(operand[0] == "(" ? exprToAST(operand.slice(1, -1)) : +operand);
    str = str.slice(operand.length);
    if (!str) break;
    operators.push(str[0]);
    str = str.slice(1);
  } while (true);

  return { operands, operators };
}

module.exports = {
  expressionCalculator
};
