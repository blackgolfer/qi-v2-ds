import { createMachine, interpret } from "xstate";
export const machine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QCECWAFATgewMZ1m0wDpUIAbMAYnQCUB5AYQFEBlVgfQGkANASQCCAOQDaABgC6iUAAdssVABdU2AHbSQAD0QAmAOwBOYgDYAHHoAsBi6YCMpgMwBWMRYA0IAJ67LxB6f1TOydbAx0xYwBfSI80LDwCImJcTDAAQ2VVKBoGFnZufmFxKSQQOQVlNQ1tBBs9YidjHQtQ5osHY1cPbwRwh2IDCNCHWysbc2jYjBx8WEISFPTM7LomNk5eQVFbEtl5JRV1UpqLJuIxAwc9CINTCycRq+7EO2IrAwMnA1sdDptbByTEBxGaJBapDKoLJUABifCEAgAMnwAFrMYoacoHKrHF4WCzEPTGJxOCyWMSWezuLyIByuPxfHSXHQ-b4-aIxECqbAQOAaEEJOZETH7SpHUA1AC0xmeCGlQIFs3mpAoYBFFUO1UQFh0sv0BNsFwcOk6YjETLCCumguVi0hWXV2PFWkQjLeTLMHQeV1usrpBNMX2NxkuFgielsVviSqSuHI8kgjrFWoQBl8tgjbLETkc9xlNIQdP6nUuGbDplcAI5kSAA */
    predictableActionArguments: true,
    id: "BiProcessor",
    initial: "idle",
    context: {
      bis: [],
      currentBi: null,
      biIdCounter: 1,
    },
    states: {
      idle: {
        entry: {
          type: "initializeProcessor",
        },
        on: {
          PROCESS_KXIAN: [
            {
              target: "creating",
              actions: [
                {
                  type: "startNewBi",
                },
              ],
            },
          ],
        },
      },
      creating: {
        on: {
          PROCESS_KXIAN: [
            {
              //guard: "isSameDirection",
              cond: "isSameDirection",
              actions: [
                {
                  type: "mergeKxian",
                },
              ],
            },
            {
              //target: "finalizing",
              //guard: "isDifferentDirection",
              cond: "isDifferentDirection",
              actions: [
                {
                  type: "finalizeBi",
                },
                {
                  type: "startNewBiWithIncomingKxian",
                },
              ],
            },
          ],
          FINALIZE: [
            {
              target: "closed",
              actions: { type: "finalizeBi" },
            },
          ],
        },
      },
      closed: {
        type: "final",
      },
    },
  },
  {
    actions: {
      //initializeProcessor: ({ context, event }) => {
      initializeProcessor: (context, event) => {
        console.log("BiProcessor initialized.");
        context.bis = [];
        context.currentBi = null;
        context.biIdCounter = 1;
      },
      //startNewBi: ({ context, event }) => {
      startNewBi: (context, event) => {
        const { kxian } = event;
        context.currentBi = {
          id: context.biIdCounter++,
          direction: kxian.direction,
          kxians: [kxian],
        };
      },
      //mergeKxian: ({ context, event }) => {
      mergeKxian: (context, event) => {
        const { kxian } = event;
        context.currentBi.kxians.push(kxian);
      },
      //finalizeBi: ({ context, event }) => {
      finalizeBi: (context, event) => {
        context.bis.push(context.currentBi);
      },
      //startNewBiWithIncomingKxian: ({ context, event }) => {
      startNewBiWithIncomingKxian: (context, event) => {
        const { kxian } = event;
        // Start a new Bi with the incoming Kxian
        context.currentBi = {
          id: context.biIdCounter++,
          direction: kxian.direction,
          kxians: [kxian],
        };
      },
    },
    actors: {},
    guards: {
      //isSameDirection: ({ context, event }) => {
      isSameDirection: (context, event) => {
        if (!context.currentBi) return false;
        return context.currentBi.direction === event.kxian.direction;
      },
      //isDifferentDirection: ({ context, event }) => {
      isDifferentDirection: (context, event) => {
        if (!context.currentBi) return false;
        return context.currentBi.direction !== event.kxian.direction;
      },
    },
    delays: {},
  }
);

/* for v5
const biProcessorService = createActor(
  machine,
  {
    inspect: (inspEvent) => {
      if (inspEvent.type === "@xstate.event") {
        console.log(inspEvent.event);
      }
    },
  }
);
*/
const biProcessorService = interpret(machine);
biProcessorService.subscribe((state) => {
  console.log(
    `Event: ${JSON.stringify(state.event)}`
    //`Current State: ${state.value}, Context:, ${JSON.stringify(state.context)}`
  );
});

biProcessorService.start();

// Sample Kxian data
const sampleKxianData = [
  { id: "K1", direction: true }, // Up
  { id: "K2", direction: true }, // Up
  { id: "K3", direction: false }, // Down
  { id: "K4", direction: true }, // Up
  { id: "K5", direction: true }, // Up
  { id: "K6", direction: false }, // Down
  { id: "K7", direction: true }, // Up
  { id: "K8", direction: true }, // Up
  { id: "K9", direction: true }, // Up
];

// Simulate processing of Kxian data
sampleKxianData.forEach((kxian) => {
  biProcessorService.send({ type: "PROCESS_KXIAN", kxian });
});

// Finalize the last Bi after all Kxians are processed
biProcessorService.send("FINALIZE");

// Output the finalized Bi list
console.log(
  "\nFinal Bi list:",
  JSON.stringify(biProcessorService.getSnapshot().context.bis)
);
