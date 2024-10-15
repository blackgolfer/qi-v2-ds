<!-- <style>
.blur-non-hovered body {
  background: #fafafa;
  color: #444;
  font: 100%/30px 'Helvetica Neue', helvetica, arial, sans-serif;
  text-shadow: 0 1px 0 #fff;
}
.blur-non-hovered strong {
  font-weight: bold;
}
.blur-non-hovered em {
  font-style: italic;
}
.blur-non-hovered table {
  background: #f5f5f5;
  border-collapse: separate;
  box-shadow: inset 0 1px 0 #fff;
  font-size: 12px;
  line-height: 24px;
  margin: 30px auto;
  text-align: left;
  width: 800px;
}
.blur-non-hovered th {
  background: linear-gradient(#777, #444);
  border-left: 1px solid #555;
  border-right: 1px solid #777;
  border-top: 1px solid #555;
  border-bottom: 1px solid #333;
  box-shadow: inset 0 1px 0 #999;
  color: #fff;
  font-weight: bold;
  padding: 10px 15px;
  position: relative;
  text-shadow: 0 1px 0 #000;
}
.blur-non-hovered th:after {
  background: linear-gradient(rgba(255,255,255,0), rgba(255,255,255,0.06));
  content: '';
  display: block;
  height: 25%;
  left: 0;
  margin: 1px 0 0 0;
  position: absolute;
  top: 25%;
  width: 100%;
}
.blur-non-hovered th:first-child {
  border-left: 1px solid #777;
  box-shadow: inset 1px 1px 0 #999;
}
.blur-non-hovered th:last-child {
  box-shadow: inset -1px 1px 0 #999;
}
.blur-non-hovered td {
  border-right: 1px solid #fff;
  border-left: 1px solid #e8e8e8;
  border-top: 1px solid #fff;
  border-bottom: 1px solid #e8e8e8;
  padding: 10px 15px;
  position: relative;
  transition: all 300ms;
}
.blur-non-hovered td:first-child {
  box-shadow: inset 1px 0 0 #fff;
}
.blur-non-hovered td:last-child {
  border-right: 1px solid #e8e8e8;
  box-shadow: inset -1px 0 0 #fff;
}
.blur-non-hovered tr:nth-child(odd) td {
  background: #f1f1f1;
}
.blur-non-hovered tr:last-of-type td {
  box-shadow: inset 0 -1px 0 #fff;
}
.blur-non-hovered tr:last-of-type td:first-child {
  box-shadow: inset 1px -1px 0 #fff;
}
.blur-non-hovered tr:last-of-type td:last-child {
  box-shadow: inset -1px -1px 0 #fff;
}
.blur-non-hovered tbody:hover td {
  color: transparent;
  text-shadow: 0 0 3px #aaa;
}
.blur-non-hovered tbody:hover tr:hover td {
  color: #444;
  text-shadow: 0 1px 0 #fff;
}
</style> -->

# xstate v5

## [Actors](https://stately.ai/docs/category/actors)

An _actor_ is a running process that can receive events, send events and change its behavior based on the events it receives, which can cause effects outside of the actor.

In state machines, actors can be _invoked_ or _spawned_. These are essentially the same, with the only difference being how the actor’s lifecycle is controlled.

- An `invoked` actor is started when its parent machine enters the state it is invoked in, and stopped when that state is exited.
- A `spawned` actor is started in a transition and stopped either with a `stop(...)` action or when its parent machine is stopped.

The workflow in using actor consists of three steps:

1. create actor logic
2. create actor
3. use actor (actor start, stop, among others).

### Actor model

In the actor model, actors are objects that can communicate with each other. They are independent “live” entities that communicate via asynchronous message passing. In XState, these messages are referred to as [_events_](https://stately.ai/docs/transitions).

- An actor has its own internal, encapsulated state that can only be updated by the actor itself. An actor may choose to update its internal state in response to a message it receives, but it cannot be updated by any other entity.
- Actors communicate with other actors by sending and receiving events asynchronously.
- Actors process one message at a time. They have an internal “mailbox” that acts like an event queue, processing events sequentially.
- Internal actor state is not shared between actors. The only way for an actor to share any part of its internal state is by:
  - Sending events to other actors
  - Or emitting snapshots, which can be considered implicit events sent to subscribers.
- Actors can create (spawn/invoke) new actors.

### Actor logic

Actor logic is the actor’s logical “model” (brain, blueprint, DNA, etc.) It describes how the actor should change behavior when receiving an event.

Actor logic is defined by an object implementing the `ActorLogic` interface, containing methods like `.transition(...)`, `.getInitialSnapshot()`, `.getPersistedSnapshot()`, and more. This object tells an interpreter how to update an actor’s internal state when it receives an event and which effects to execute (if any).

#### Actor logic creators

The types of actor logic you can create from XState are:

- [State machine logic (`createMachine(...)`)](https://stately.ai/docs/actors#createmachine)
- [Promise logic (`fromPromise(...)`)](https://stately.ai/docs/actors#frompromise)
- [Transition function logic (`fromTransition(...)`)](https://stately.ai/docs/actors#fromtransition)
- [Observable logic (`fromObservable(...)`)](https://stately.ai/docs/actors#fromobservable)
- [Event observable logic (`fromEventObservable(...)`)](https://stately.ai/docs/actors#fromeventobservable)
- [Callback logic (`fromCallback(...)`)](https://stately.ai/docs/actors#fromcallback)

<div class="ox-hugo-table blur-non-hovered">
<div class="table-caption">
  <span class="table-number">Table 1:</span>
  Actor logic capabilities
</div>

|                      | receive event | send event | spawn actors | input | output |
| -------------------- | ------------- | ---------- | ------------ | ----- | ------ |
| state machine actors | yes           | yes        | yes          | yes   | yes    |
| promise actors       | no            | yes        | no           | yes   | yes    |
| transition actors    | yes           | yes        | no           | yes   | no     |
| observable actors    | no            | yes        | no           | yes   | no     |
| callable actors      | yes           | yes        | no           | yes   | no     |

</div>

##### State machine logic (`createMachine(...)`)

You can describe actor logic as a state machine. Actors created from state machine actor logic can:

- Receive events
- Send events to other actors
- Invoke/spawn child actors
- Emit snapshots of its state
- Output a value when the machine reaches its top-level final state

The following state machine logic is a practical example on how to invoke/spawn a child actor:
```js
{
  {
    ...
    states:{
      ...
      workflowReady: {
        entry: "logWorkflowReady",
        invoke: {
          id: "spawnSalesforceActor",
          src: "spawnSalesforceActor",
          onDone: {
            target: "running",
            actions: "assignSalesforceActorRef",
          },
          onError: {
            target: "error",
            actions: "handleActorSpawnError",
          },
        },
        on: {
          START_WORKFLOW: "running",
        },
      },
      ...
    }
  }
},
{
  actions: {
    ...
    assignSalesforceActorRef: assign({
      salesforceActorRef: (context, event) => {
        if (event.type === "done.invoke.spawnSalesforceActor") {
          logger.info("SalesforceActor spawned.");
          return event.data.actorRef;
        }
        return context.salesforceActorRef;
      },
    }),

    handleActorSpawnError: assign({
      error: (_, event) => {
        if (event.type === "error.platform.spawnSalesforceActor") {
          return event.data.message || "Failed to spawn SalesforceActor";
        }
        return "Unknown actor spawn error";
      },
    }),
    ...
  },
},
{
  services: {
    ...
    spawnSalesforceActor: () => {
      return new Promise<{ actorRef: ActorRefFrom<typeof SalesforceActor> }>((resolve, reject) => {
        try {
          const actorRef = spawn(SalesforceActor);
          resolve({ actorRef });
        } catch (error) {
          reject(error);
        }
      });
    },
    ...
  }
}
```
In this example, the state `workflowReady` first spawn a `SalesforceActor` through service `spawnSalesforceActor`, when the service is successful, it firs an `onDone` 
event, otherwise, it fires the `onError` event. The `onDone` listener picks up the result and put the `SalesforceActor` reference (returned from the 
`spawnSalesforceActor`) to `context.salesforceActorRef`, this is accomplished through the action `assignSalesforceActorRef`; while the `onError` listener (`handleActorSpawnError`) picks up the error and put the message into `context.error`. After this, the state `workflowReady` goes on to listen to event 
`START_WORKFLOW`.

##### Promise logic (`fromPromise(...)`)

Promise actor logic is described by an async process that resolves or rejects after some time. Actors created from promise logic (“promise actors”) can:

- Emit the resolved value of the promise
- Output the resolved value of the promise

Sending events to promise actors will have no effect.



### Creating actors

You can create an actor, which is a “live” instance of some actor logic, via `createActor(actorLogic, options?)`. The `createActor(...)` function takes the following arguments:

- _actorLogic_: the actor logic to create an actor from
- _options_ (optional): actor options

When you create an actor from actor logic via `createActor(actorLogic)`, you implicitly create an actor system where the created actor is the root actor. Any actors spawned from this root actor and its descendants are part of that actor system. The actor must be started by calling `actor.start()`, which will also start the actor system. You can stop root actors by calling `actor.stop()`, which will also stop the actor system and all actors in that system.

#### Invoking and spawning actors

An `invoked` actor represents a _state-based_ actor, so it is stopped when the invoking state is exited. Invoked actors are used for a finite/known number of actors.

A `spawned` actor represents multiple entities that can be started at any time and stopped at any time. Spawned actors are _action-based_ and used for a dynamic or unknown number of actors.

An example of the difference between invoking and spawning actors could occur in a todo app. When loading todos, a loadTodos actor would be an invoked actor; it represents a single state-based task. In comparison, each of the todos can themselves be spawned actors, and there can be a dynamic number of these actors.

#### Actor snapshots

When an actor receives an event, its internal state may change. An actor may emit a snapshot when a state transition occurs. You can read an actor’s snapshot synchronously via actor.getSnapshot(), or you can subscribe to snapshots via actor.subscribe(observer).

#### Subscriptions

You can subscribe to an actor’s snapshot values via `actor.subscribe(observer)`. The `observer` will receive the actor’s snapshot value when it is emitted. The observer can be:

- A plain function that receives the latest snapshot, or
- An observer object whose `.next(snapshot)` method receives the latest snapshot

```js
// Observer as a plain function
const subscription = actor.subscribe((snapshot) => {
  console.log(snapshot);
});
```

```js
// Observer as an object
const subscription = actor.subscribe({
  next(snapshot) {
    console.log(snapshot);
  },
  error(err) {
    // ...
  },
  complete() {
    // ...
  },
});
```

The return value of `actor.subscribe(observer)` is a `subscription` object that has an `.unsubscribe()` method. You can call `subscription.unsubscribe()` to unsubscribe the observer.

When the actor is stopped, all of its observers will automatically be unsubscribed.
