'use strict';

// Solution not using `eval` and not keeping the calculator's state in DOM.
// Result in DOM is just a representation of the calculator's inner state.

(function () {
  const uiResult = document.getElementById('res')
  const uiBtns = document.getElementById('btns')

  const calculator = (() => {
    let memory = []
    let operations = []
    let result = null

    const clear = (opts = { withMemory: false }) => {
      memory = opts.withMemory ? [result || ''] : []
      operations = []
      result = null
    }

    const inputOperand = num => {
      if (result) {
        clear({ withMemory: true })
      }

      const memLength = memory.length
      const opsLength = operations.length

      if (memLength === opsLength) {
        memory.push(num)
      } else {
        memory[memLength - 1] += num
      }
    }

    const setOperation = operation => {
      if (result) {
        clear({ withMemory: true })
      }

      const memLength = memory.length
      const opsLength = operations.length

      if (memLength > opsLength) {
        operations.push(operation)
      } else if (memLength === opsLength) {
        operations[opsLength - 1] = operation
      }
    }

    const calculate = () => {
      const dropLastOperation = memory.length === operations.length
      const expression = memory.reduce((expression, number, index) => {
        const operand = parseInt(number, 2)
        const operation = operations[index] || ''

        return expression + `${operand}${operation}`
      }, '')

      result = Math.floor(
        eval(dropLastOperation ? expression.slice(0, -1) : expression)
      ).toString(2)
    }

    const render = () => result
    ? result
    : memory.reduce((expression, operand, index) =>
    expression + ` ${operand}<br>${operations[index] || ''}`, '')

    return {
      render,
      eql: calculate,
      clr: clear,
      one: () => inputOperand('1'),
      zero: () => inputOperand('0'),
      add: () => setOperation('+'),
      sub: () => setOperation('-'),
      mul: () => setOperation('*'),
      div: () => setOperation('/'),
    }
  })()

  function dispatcher (evt) {
    switch(evt.target.id) {
      case 'btn0':
      calculator.zero()
      break
      case 'btn1':
      calculator.one()
      break
      case 'btnClr':
      calculator.clr()
      break
      case 'btnEql':
      calculator.eql()
      break
      case 'btnSum':
      calculator.add()
      break
      case 'btnSub':
      calculator.sub()
      break
      case 'btnMul':
      calculator.mul()
      break
      case 'btnDiv':
      calculator.div()
      break
    }

    uiResult.innerHTML = calculator.render()
  }

  uiBtns.addEventListener('click', dispatcher)
})();
