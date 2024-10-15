/*
    1. states ($Q$): ['seg-0','seg-1','start','end']
    2. events ($\Sigma$): ['NEXT', 'STOP', 'TO_0', 'TO_1']
    3. actions ($\Lambda$):
        - kbar_processor: processing incoming kbar (from event 'NEXT')
        - algo_state: 
    4. transition ($\delta$):
    5. initial state ($q_0$): q_0 = 'seg-0' if start new, otherwise depends on data from last processed.
    6. final state ($F$):

    ToDo:
    - schema for kbar
    - schema for nkbar
    - schema for events
 */
import { assign, createMachine, fromCallback } from "xstate";
//-------------------------------------------------------------------------------------------
// state specification
//-------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------
// utitlities
//-------------------------------------------------------------------------------------------
const rel = (d1, d2) => {
  if (d1.high === d2.high && d1.low === d2.low) return 5;
  else if (
    // the case of d1>d2
    (d1.high > d2.high && d1.low >= d2.low) ||
    (d1.high >= d2.high && d1.low > d2.low)
  )
    return 1;
  else if (
    // the case of d1<d2
    (d1.high < d2.high && d1.low <= d2.low) ||
    (d1.high <= d2.high && d1.low < d2.low)
  )
    return 2;
  else if (
    (d1.high < d2.high && d1.low >= d2.low) ||
    (d1.high <= d2.high && d1.low > d2.low)
  )
    return 3;
  else if (
    (d1.high > d2.high && d1.low <= d2.low) ||
    (d1.high >= d2.high && d1.low < d2.low)
  )
    return 4;
  else return -1;
};

const isNormal = (d1,d2) => {
  const r = rel(d1,d2);
  return r<3 && r>0;
}

const kbar2nkbar = (d) => {
  return {
    low: { time: d.time, value: d.low },
    high: { time: d.time, value: d.high },
  };
};

const mergingOperator = (d1, d2, direction) => {
  let r = rel(d1, d2);
  if (r < 3)
    // this is not the case for merging
    return null;
  if (direction === 1) {
    // merging for direction up: high=max(d1,high,d2,high), low=max(d1,low,d2.low)
    if (r === 3) {
      // the case of d2 contains d1, so
      return {
        low: { time: d1.time, value: d1.low },
        high: { time: d2.time, value: d2.high },
      };
    } else if (r === 4) {
      // the case of d1 contains d2
      return {
        low: { time: d2.time, value: d2.low },
        high: { time: d1.time, value: d1.high },
      };
    } else if (r === 5)
      // the case of d1===d2
      return {
        low: { time: d2.time, value: d2.low },
        high: { time: d2.time, value: d2.high },
      };
    else return null; // should not be here
  } else {
    // merging for direction down: low=min(d1.low,d2.low), high=min(d1.high,d2.high)
    switch (r) {
      case 3: // the case of d2 contains d1
        return {
          low: { time: d2.time, value: d2.low },
          high: { time: d1.time, valaue: d1.high },
        };
      case 4: // the case of d1 contains d2
        return {
          low: { time: d1.time, value: d1.low },
          high: { time: d2.time, value: d2.high },
        };
      case 5: // the case of d1===d2
        return {
          low: { time: d2.time, value: d2.low },
          high: { time: d2.time, value: d2.high },
        };
      default:
        return null;
    }
  }
};
//-------------------------------------------------------------------------------------------
// actors
//-------------------------------------------------------------------------------------------
const statInitializedLogic = fromCallback(({ sendBack, receive, input }) => {
  if (input.q_0 === 0) sendBack("START_SEG_0");
  else input.q_0 === 1;
  sendBack("START_SEG_1");
});
//-------------------------------------------------------------------------------------------
// actions and guard
//-------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------
// fsm
//-------------------------------------------------------------------------------------------
//export const kline_normalizer = createMachine(states, actions);
export const kline_normalizer = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QGkA2BLAdmAcgewCcBbAQwwC8wCA6WAFxILoGIAlAVRwG0AGAXUSgADnljo66PJkEgAHogCMAJgDMAVmpKAbGq1K1AGhABPRFq0BOagHYeK5WoC+jo2iy5CpClVoMmzAFEcABFeASQQETEJKRl5BAU1FQAOagcjUwRrLQAWahU7B2dXDGx8YjJ0ShpUPBIIAH0scXQyZioCQmohVBI6ADNPalr6gElMFrIAZQY6MDCZKJbYiPiVHKVqZKVk9JNEawsFagskopcQNzLPSurhusbmiTapgBUAQVZXhqmAgHEGjwFhEljFpKtEOtNttdvoMooLFY7Lk1MkVOiMSprMVLqUPBVvDUHk0Js9UMw3p9vrB-g0FMDhKJluDQGsNlsdntMjkeNCzvocVd8V4qj5YGAoIDmDgAgANV4MyJMsFxRBJayaWGGfYIXbUJwXIXlEV3cWSnjSuUKhThRnRSQsuQHLSpdQWLHazKqY5aQpKHKIwOI5KCvHG25iiVS1gBX4K-iLZUO1VZF35NTu6yexA7TYKP0GkrucOE2hRi1BUIJkFJlas52ujMe+EJArUX32f1BwMhw1hm6ls10y3yxWg5MQhI8aft5JZlv6LSaQu44sD0U0IcKEfW21K+11p2pxuZ7MJPX5zsB7sWXtF64EjdlyXbmNxse1x3xZQKKz8s85AoxzWMkKJopi6LYn2a6PqaUbbpWH4Hl+ihKL++qdmeKhaMcOxgRBkHOBcmB4BAcAyEa67VImyEpgAtFoLYMaGMEmmKfh0DRzIpgo6g8Gkuhwjq1iAfkBYsQ+bFEvUJKTKgXEqpOGwtloKTtmcOF6Pm7p3qukkRpu5YKRO9YIGoSRpConJCZkCjbNQOT-hJwoGc+dLGYe348AoS45L6p4tuoGpKOJ0H6aWYCYBAHkoQkuSbGhc5ntYdntiB5zOEAA */
    predictableActionArguments: true,
    id: "KlineNormalizer",
    initial: "start",
    context: {
      q_0: undefined,
      current_kbar: undefined, // current kbar
      current_nkbar: undefined, // current normalized kbar
      current_operator_output: {
        segment: {
          start: undefined,
          end: undefined,
        },
        tao: undefined,
        low: {
          value: undefined,
          time: undefined,
        },
        high: {
          value: undefined,
          time: undefined,
        },
        direction: undefined, // initial direction for the segment
      },
      segments: [], // history of the operator output
      normalized_kline: [],
    },
    states: {
      start: {
        entry: { type: "startEntry" },
        on: {
          RUN: { target: "load_initial" },
          END: "end",
        },
      },
      load_initial: {
        invoke: {
          id: "loadInitialState",
          src: "stateInit",
          input: ({ context, event }) => ({ q_0: event.q_0 }),
          onError: {
            target: "start",
          },
        },
        on: {
          START_SEG_0: { target: "seg_0" },
          START_SEG_1: { target: "seg_1" },
        },
      },
      seg_0: {
        entry: { type: "seg0Entry" },
        exit: { type: "seg0Exit" },
        on: {
          NEXT: [
            {
              // if isSegType0==true
              guard: "isSegType0",
              actions: [{ type: "kbarHandler", seg_type: "seg_0" }],
            },
            {
              // else go to seg_1
              target: "seg_1",
            },
          ],
          RESET: "start", // for visualization purpose
          END: "end",
        },
      },
      seg_1: {
        entry: { type: "seg1Entry" },
        exit: { type: "seg1Exit" },
        on: {
          NEXT: [
            {
              // if isSegType0==true
              guard: "isSegType1",
              actions: [{ type: "kbarHandler", seg_type: "seg_1" }],
            },
            {
              // else go to seg_1
              target: "seg_0",
            },
          ],
          RESET: "start", // for visualization purpose
          END: "end",
        },
      },
      end: {
        //type: "final",
        entry: { type: "endEntry" },
      },
    },
  },
  {
    actions: {
      startEntry: ({context, event}) => {
        console.log("Kline normalizing maching started");
      },
      seg0Entry: ({context, event}) => {
        console.log("entering seg_0");
      },
      seg0Exit: ({context, event}) => {
        console.log("exiting seg_0");
      },
      seg1Entry: ({context, event}) => {
        console.log("entering seg1");
      },
      seg1Exit: ({context, event}) => {
        console.log("exiting seg1");
      },
      kbarHandler: ({context, event}, param) => {
        const type = param.seg_type;
        let nkbar;
        if (type === "seg_1") {
          // a normal segment
          nkbar = kbar2nkbar(event.kbar);
        } else {
        }
        context.current_kbar = event.kbar;
        context.current_nkbar = nkbar;
      },
      endEntry: ({context, event}) => {
        console.log("entering end state");
      },
    },
    guards: {
      isSegType0: ({context, event}) => {
        if (context.c_kbar === undefined) return true;
        return !isNormal(context.c_kbar, event.kbar);
      },
      isSegType1: ({context, event}) => {
        if (context.c_kbar === undefined) return true;
        return isNormal(context.c_kbar, event.kbar);
      },
    },
    actors: {
      stateInit: fromCallback(({ sendBack, receive, input }) => {
        if (input.q_0 === 0) sendBack({type: "START_SEG_0"});
        else if (input.q_0 === 1) sendBack({type: "START_SEG_1"});
        else sendBack({type: "onError"});
      }),
    },
    delays: {},
  }
);
