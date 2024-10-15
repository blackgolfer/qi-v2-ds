# FSM Using XState

## Machine structure
```js
Machine({
 // The initial state of your application.
  initialState: "The initial state",
 // `states` is a object with the expected states of your app as `keys`.
  states: {
       stateName: {
           // `on` is a object with keys as the event name 
           // and the value is the name of the state to transition or action(s).
            on: {
                  "Event_Name": "State_Name_to_transition_to"
            }
       },
  }
})
```

---

## Comprehensive Example

Let's consider a **Trade Execution FSM** where:

- **States**:
  - `idle`: Waiting for trade initiation.
  - `executing`: Executing the trade.
  - `completed`: Trade completed successfully.
  - `failed`: Trade execution failed.
  
- **Transitions**:
  - `INITIATE`: From `idle` to `executing`.
  - `COMPLETE`: From `executing` to `completed`.
  - `FAIL`: From `executing` to `failed`.
  - `RESET`: From `failed` to `idle`.
  
- **Actions**:
  - **Entry Actions**:
    - `idle`: `initializeTradeSystem`
    - `executing`: `sendTradeOrder`
    - `completed`: `logTradeCompletion`
    - `failed`: `notifyFailure`
  - **Exit Actions**:
    - `executing`: `clearOrderQueue`
    - `failed`: `resetTradeState`

#### **Graphical Representation**

```latex
\begin{tikzpicture}[node distance=3cm, auto]
  \node[state, initial] (idle) {idle \\ \textbf{entry}: initializeTradeSystem};
  \node[state] (executing) [right of=idle] {executing \\ \textbf{entry}: sendTradeOrder \\ \textbf{exit}: clearOrderQueue};
  \node[state] (completed) [right of=executing] {completed \\ \textbf{entry}: logTradeCompletion};
  \node[state] (failed) [below of=executing] {failed \\ \textbf{entry}: notifyFailure \\ \textbf{exit}: resetTradeState};
  
  \path[->]
    (idle) edge node {INITIATE} (executing)
    (executing) edge node {COMPLETE} (completed)
    (executing) edge node {FAIL} (failed)
    (failed) edge node {RESET} (idle);
\end{tikzpicture}
```

*(Note: To render the diagram, compile the LaTeX code with TikZ.)*

#### **Implementation with XState**

```javascript
const { Machine, interpret } = require('xstate');

// Define the Trade Execution FSM
const tradeMachine = Machine({
  id: 'tradeExecution',
  initial: 'idle',
  states: {
    idle: {
      entry: 'initializeTradeSystem',
      on: {
        INITIATE: 'executing'
      }
    },
    executing: {
      entry: 'sendTradeOrder',
      exit: 'clearOrderQueue',
      on: {
        COMPLETE: 'completed',
        FAIL: 'failed'
      }
    },
    completed: {
      entry: 'logTradeCompletion',
      type: 'final'
    },
    failed: {
      entry: 'notifyFailure',
      exit: 'resetTradeState',
      on: {
        RESET: 'idle'
      }
    }
  }
},
{
  actions: {
    initializeTradeSystem: () => console.log('Initializing Trade System...'),
    sendTradeOrder: () => console.log('Sending Trade Order...'),
    clearOrderQueue: () => console.log('Clearing Order Queue...'),
    logTradeCompletion: () => console.log('Trade Completed Successfully.'),
    notifyFailure: () => console.log('Trade Execution Failed. Notifying Failure...'),
    resetTradeState: () => console.log('Resetting Trade State...')
  }
});

// Interpret and run the FSM
const tradeService = interpret(tradeMachine)
  .onTransition((state) => {
    console.log(`Current State: ${state.value}`);
  })
  .onDone(() => console.log('FSM has reached the completed state.'))
  .start();

// Simulate trade process
tradeService.send('INITIATE');    // Transition from idle to executing
tradeService.send('FAIL');        // Transition from executing to failed
tradeService.send('RESET');       // Transition from failed to idle
tradeService.send('INITIATE');    // Transition from idle to executing
tradeService.send('COMPLETE');    // Transition from executing to completed
```

**Expected Output:**
```
Initializing Trade System...
Current State: idle
Sending Trade Order...
Current State: executing
Exiting executing: Clearing Order Queue...
Trade Execution Failed. Notifying Failure...
Current State: failed
Resetting Trade State...
Current State: idle
Initializing Trade System...
Current State: idle
Sending Trade Order...
Current State: executing
Exiting executing: Clearing Order Queue...
Trade Completed Successfully.
Current State: completed
FSM has reached the completed state.
```

---