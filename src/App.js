import React, { useState } from 'react';
import './App.css';

const Calculator = () => {
  const [input, setInput] = useState('');
  const [hasResult, setHasResult] = useState(false);

  const handleButtonClick = (value) => {
    if (hasResult && !isNaN(value)) {
      // Si hay un resultado y se presiona un número, inicia una nueva operación
      setInput(value);
      setHasResult(false);
    } else {
      // Si no hay resultado o se presiona un operador, agrega el valor al input
      if (isNaN(value) && input === 'Error') {
        return;
      }
      setInput((prevInput) => prevInput + value);
      setHasResult(false);
    }
  };

  const handleCalculate = () => {
    try {
      const result = evaluateExpression(input);
      setInput(result.toString());
      setHasResult(true);
    } catch (error) {
      setInput('Error');
      setHasResult(true);
    }
  };

  const handleClear = () => {
    setInput('');
    setHasResult(false);
  };

  const handleDelete = () => {
    if (hasResult) {
      // Si hay un resultado, limpia la pantalla
      setInput('');
      setHasResult(false);
    } else {
      // Si no hay resultado, elimina el último carácter del input
      setInput((prevInput) => prevInput.slice(0, -1));
    }
  };

  const evaluateExpression = (expression) => {
    // Expresión regular para validar la expresión
    const operators = new Set(['+', '-', '*', '/', 'MOD']);

    // Manejar el signo negativo al inicio de la expresión
    const expressionWithSign = expression.startsWith('-') ? `0${expression}` : expression;

    // Obtener los tokens de la expresión
    const tokens = expressionWithSign.match(/(\d+(\.\d+)?%?|[+\-*/MOD])/g);

    // Validar que la expresión sea válida
    if (!tokens) {
      throw new Error('Expresión inválida');
    }

    if (tokens.length === 1) {
      // Da como resultado el equivalente decimal al ingresar un porcentaje
      let result = parseFloat(tokens[0]);

      // Si el token termina con %, dividir entre 100
      if (tokens[0].endsWith('%')) {
        result /= 100;
      }

      return result;
    }

    // Inicializar el resultado con el primer número
    let result = parseFloat(tokens[0]);
    let currentOperator = null;

    // Iterar sobre los tokens para realizar las operaciones
    for (let i = 1; i < tokens.length; i++) {
      const token = tokens[i];

      if (operators.has(token)) {
        currentOperator = token;
      } else {
        let operand = parseFloat(token);

        if (token.endsWith('%')) {
          operand /= 100;
        }

        if (currentOperator === null) {
          throw new Error('Operador faltante');
        }

        // Realizar la operación correspondiente
        switch (currentOperator) {
          case '+':
            result += operand;
            break;
          case '-':
            result -= operand;
            break;
          case '*':
            result *= operand;
            break;
          case '/':
            if (operand !== 0) {
              result /= operand;
            } else {
              throw new Error('División por cero');
            }
            break;
          case 'MOD':
            result = result % operand;
            break;
          default:
            throw new Error('Operador no reconocido');
        }

        // Resetear el operador actual después de procesar el operando
        currentOperator = null;
      }
    }

    return result;
  };


  return (
    <div className='scene'>
      <div className="calculator">
        <div className="header">
          <div className="input">{input}</div>
        </div>
        <div className="keys">
          <div className="row">
            <div className="action" onClick={handleClear}>
              <span className="dull">AC</span>
            </div>
            <div className="action" onClick={handleDelete}>
              <span>&#8629;</span>
            </div>
            <div className="action" onClick={() => handleButtonClick('MOD')}>
              <span className="dull">MOD</span>
            </div>
            <div className="symbol" onClick={() => handleButtonClick('/')}>
              <span>&#247;</span>
            </div>
          </div>
          <div className="row">
            <div className="number" onClick={() => handleButtonClick('7')}>
              <span>7</span>
            </div>
            <div className="number" onClick={() => handleButtonClick('8')}>
              <span>8</span>
            </div>
            <div className="number" onClick={() => handleButtonClick('9')}>
              <span>9</span>
            </div>
            <div className="symbol" onClick={() => handleButtonClick('*')}>
              <span>&#215;</span>
            </div>
          </div>
          <div className="row">
            <div className="number" onClick={() => handleButtonClick('4')}>
              <span>4</span>
            </div>
            <div className="number" onClick={() => handleButtonClick('5')}>
              <span>5</span>
            </div>
            <div className="number" onClick={() => handleButtonClick('6')}>
              <span>6</span>
            </div>
            <div className="symbol" onClick={() => handleButtonClick('-')}>
              <span>-</span>
            </div>
          </div>
          <div className="row">
            <div className="number" onClick={() => handleButtonClick('1')}>
              <span>1</span>
            </div>
            <div className="number" onClick={() => handleButtonClick('2')}>
              <span>2</span>
            </div>
            <div className="number" onClick={() => handleButtonClick('3')}>
              <span>3</span>
            </div>
            <div className="symbol" onClick={() => handleButtonClick('+')}>
              <span>+</span>
            </div>
          </div>
          <div className="row">
            <div className="number" onClick={() => handleButtonClick('%')}>
              <span>%</span>
            </div>
            <div className="number" onClick={() => handleButtonClick('0')}>
              <span>0</span>
            </div>
            <div className="number" onClick={() => handleButtonClick('.')}>
              <span>.</span>
            </div>
            <div className="symbol action" onClick={handleCalculate}>
              <span>=</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
