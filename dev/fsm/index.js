import { createActor } from "xstate";
import { LocalStorage } from "node-localstorage";
import { formatJsonWithColor } from "qi/common/utils";
import { kline_normalizer } from "./kline_normalization.js";

let restoredState;
try {
  const localStorage = new LocalStorage('./scratch');
  JSON.parse(localStorage.getItem('kn_state'));
  if (!restoredState) {
    console.log('no persisted state found in db. starting from scratch.');
  }
  console.log('restored state: ', restoredState);

  const kn_actor = createActor(kline_normalizer,{
    data: restoredState?.persistedState,
    inspect: (inspEvent) => {
      if (inspEvent.type === '@xstate.event') {
        console.log(inspEvent.event);
      }
    }
  });
  /*
  kn_actor.subscribe((state) => {
    console.log(
      `Event: ${JSON.stringify(state.event)}`
      //`Current State: ${state.value}, Context:, ${JSON.stringify(state.context)}`
    );
  });
  */
 /*
  kn_actor.subscribe({
    next: (snapshot) => {
      // ...
    },
    error: (err) => {
      // Handle the error here
      console.error(err);
    }
  });
  */
  kn_actor.start();
  /*
  process.stdin.on("data", (data) => {
    const cmds = data.toString().trim().split(" ");
    kn_actor.send(cmds);
  });
  */
  kn_actor.send({ type: "RUN", q_0: 1 });
  //kn_actor.send({ type: "END" });
  console.log(kn_actor.getSnapshot().context.q_0);
  localStorage.setItem('kn_state',JSON.stringify(kn_actor.getPersistedSnapshot()));
  //console.log(formatJsonWithColor(JSON.parse(localStorage.getItem('kn_state'))));
  //localStorage.removeItem('kn_state');
} catch (e) {
  console.log("error details: ", e);
}
