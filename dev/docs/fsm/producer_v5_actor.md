@import "table.css"

# The Producer Actor

## Definition

We can not model the producer as a Mealy machine due to the non-deterministic nature, we need state be able to emit events. This leads to the actor model, which is more suitable for the producer.
Formally, the producer actor is a quadruple state machine with sextuple $M=\left<Q,\Sigma,\delta,\lambda, q_0, F\right>$, where:

- $Q$: the state space,
- $\Sigma$: the input space,
- $\delta$: the transition function, $\delta: Q\times\Sigma\rightarrow Q$,
- $\lambda$: action, $\lambda: Q\times\Sigma\rightarrow\Sigma$.
- $q_0$: the initial state.
- $F$: the acceptor or the final states.

A running input words $\Sigma^*$ is the set of events for the system, each element in $\Sigma^*$ is a finite set of $\Sigma$.

This model conform to the actor model but differ from the Mealy machine in the following way:

1. Output word space $\Gamma$ is removed.
2. The running input word $\Sigma^*$ is composed of outside input word and input word that is generated from actions, both inputs conform with $\Sigma$.

### State space $Q$

The **state space** $Q=\{s_0,s_1,s_2,s_3\}$, where

- $s_0 = Idle$: Awaiting commands to fetch or publish data.
- $s_1 = FetchingData$: Actively retrieving data from CryptoCompare.
- $s_2 = Publishing$: Publishing aggregated data to Kafka/Redpanda.
- $s_3 = Error$: Handling any errors during operations.

The initial state $q_0=s_0$ and the acceptor $F={s_0}$.

### The input space $\Sigma$

$\Sigma=\{\sigma_1,\sigma_2,\sigma_3,\sigma_4,\sigma_5,\sigma_6\}$, where

- $\sigma_1 = FETCH\_DATA$: signal to initiate the data fetching.
- $\sigma_2 = DATA\_READY$: notification that data has been successfully fetched.
- $\sigma_3 = FETCH\_FAILURE$: notification that data fetched failed.
- $\sigma_4 = PUBLISH\_SUCCESS$: confirmation that data has been successfully published.
- $\sigma_5 = PUBLISH\_FAILURE$: notification of a failure in publishing data.
- $\sigma_6 = RESET$: signal to reset the actor from an error state.

In our platform, the elements in $\Sigma$ are called events. By convention, $\Sigma^*$ denote the space for sequence of events, . A word $w=\sigma_1\sigma_2\ldots\sigma_n\in\Sigma^*$ is an accepting word if

### The transition function $\delta$

**Transition function** $\delta: Q\times\Sigma\rightarrow Q$ is defined as

  <div class="table">
    <div class="table-caption">
      <span class="table-number">Table 1:</span>
      Transition function $\delta$ for producer actor - a symbolic definition:
    </div>

| current state | event      | next state |
| ------------- | ---------- | ---------- |
| $s_0$         | $\sigma_1$ | $s_1$      |
| $s_1$         | $\sigma_2$ | $s_2$      |
| $s_1$         | $\sigma_3$ | $s_3$      |
| $s_2$         | $\sigma_4$ | $s_0$      |
| $s_2$         | $\sigma_5$ | $s_3$      |
| $s_3$         | $\sigma_6$ | $s_0$      |

  </div>

  <div class="table">
    <div class="table-caption">
      <span class="table-number">Table 2:</span>
      Transition function $\delta$ for producer actor - a descriptive definition:
    </div>

| current state | event           | next state   |
| ------------- | --------------- | ------------ |
| Idle          | FETCH_DATA      | FetchingData |
| FetchingData  | DATA_READY      | Publishing   |
| FetchingData  | FETCH_FAILURE   | Error        |
| Publishing    | PUBLISH_SUCCESS | Idle         |
| Publishing    | PUBLISH_FAILURE | Error        |
| Error         | RESET           | Idle         |

  </div>

### The action $\lambda$

The **next-output function** $\lambda: Q\times\Sigma\rightarrow\Gamma$: We use $\Lambda$ for the set of _next-output_ functions, and $\Lambda=\{\lambda_1,\lambda_2,\lambda_3,\lambda_4\}$, where

- $\lambda_1=startFetch$: action to begin fetching data, output event $\sigma_2$ if fetching successfully or $\sigma_3$ if fetching failed.
- $\lambda_2=startPublish$: action to begin publishing data, output $\sigma_4$ if publishing successfully or $\sigma_5$ if publishing failed.
- $\lambda_3=errorHandler$: action to handle errors, output $\sigma_6$

<div class="table">
  <div class="table-caption">
    <span class="table-number">Table 3:</span>
      The next-output function $\lambda$ for producer actor - a symbolic definition:
  </div>

| current state | event      | $\lambda\in\Lambda$ | output                   |
| ------------- | ---------- | ------------------- | ------------------------ |
| $s_1$         | $\sigma_1$ | $\lambda_1$         | $\sigma_2$ or $\sigma_3$ |
| $s_2$         | $\sigma_2$ | $\lambda_2$         | $\sigma_4$ or $\sigma_5$ |
| $s_3$         | $\sigma_3$ | $\lambda_3$         | $\sigma_6$               |
| $s_3$         | $\sigma_5$ | $\lambda_3$         | $\sigma_6$               |
| $s_3$         | $\sigma_6$ | $\lambda_4$         | $\sigma_6$               |

  </div>

<div class="table">
  <div class="table-caption">
    <span class="table-number">Table 4:</span>
      Descriptive Output Function \( \lambda \)
  </div>

| Current State | Input Event     | Action         | Output                            |
| ------------- | --------------- | -------------- | --------------------------------- |
| FetchingData  | FETCH_DATA      | startFetch     | DATA_READY / FETCH_FAILURE        |
| Publishing    | DATA_READY      | startPublish   | PUBLISH_SUCCESS / PUBLISH_FAILURE |
| Error         | FETCH_FAILURE   | errorHandler   | RESET                             |
| Error         | PUBLISH_FAILURE | errorHandler   | RESET                             |
| Error         | RESET           | resetFromError | RESET                             |

  </div>

## Diagram

```latex {cmd, latex_zoom=2}
\documentclass{standalone}
\usepackage[svgnames]{xcolor} % Enables a wide range of color names
\usepackage{tikz}
\usetikzlibrary{arrows,automata,positioning,shapes}
\usepackage{amsmath,amssymb,amsfonts}

\begin{document}
\begin{tikzpicture}[>=stealth',
                    shorten > = 1pt,
                    node distance = 1cm and 2cm,
                    el/.style = {inner sep=2pt, align=left, sloped, color=black, font=\tiny},
                    every label/.append style = {font=\tiny},
                    every node/.append style ={font=\normalsize},
                    every state/.append style={fill=LightBlue},
                    every edge/.append style={color=orange},
                    state/.style=state with output,
                    square/.style={regular polygon, regular polygon sides=4, minimum size=6cm, outer sep=0pt}
                    ]
\tikzset{
  sigma_1/.style={node contents=FETCH\_DATA},
  sigma_2/.style={node contents=DATA\_READY},
  sigma_3/.style={node contents=FETCH\_FAILURE},
  sigma_4/.style={node contents=PUBLISH\_SUCCESS},
  sigma_5/.style={node contents=PUBLISH\_FAILURE},
  sigma_6/.style={node contents=RESET}
}

\node[square] (A) {};

\node[state,accepting,
      initial right] (q0) at (A.corner 1) {$s_0$};
\node[state]         (q1) at (A.corner 2) {$s_1$\nodepart{lower} action: $\lambda_1$};
\node[state]         (q2) at (A.corner 3) {$s_2$\nodepart{lower} action: $\lambda_2$};
\node[state]         (q3) at (A.corner 4) {$s_3$\nodepart{lower} action: $\lambda_3$};

\path[->]
    (q0) edge [loop above] node[el] {other}        (q0)
    (q0)  edge  node[el,above,sigma_1] {}          (q1)
    (q1)  edge  node[el,above,sigma_2] {}          (q2)
    (q1)  edge  node[el,above,pos=0.75,sigma_3] {} (q3)
    (q2)  edge  node[el,above,pos=0.75,sigma_4] {} (q0)
    (q2)  edge  node[el,above,sigma_5]  {}         (q3)
    (q3)  edge  node[el,above,sigma_6]  {}         (q0);
\end{tikzpicture}
\end{document}
```

## Simulation

The transition function $\delta$ is extended inductively into $\bar\delta: Q\times\Sigma^*\rightarrow Q$ to describe the machine's behavior when fed whole input words. For the empty string $\varepsilon$, $\bar\delta(q,\varepsilon)=q$ for all states $q$, and for strings $wa$ where $a$ is the last symbol and $w$ is the (possibly empty) rest of the string, $\bar\delta(q,wa)=\delta(\bar\delta(q,w),a)$. The output function $\lambda$ may be extended similarly into $\bar\lambda(q,w)$, which gives the complete output of the machine when run on word $w$ from state $q$.

This allows the following to be defined:

#### Accepting word
A word $w=a_1a_2,\ldots a_n\in\Sigma^*$ is an accepting word for the automaton if $\bar\delta(q_0,w)\in F$, that is, if after consuming the whole string $w$ the machine is in an accept state.

#### Recognized language
The language $L\subseteq\Sigma^*$ *recognized* by a machine is the set of all the words that are accepted by the machine, $L=\{w\in\Sigma^*\mid\bar\delta(q_0,w)\in F\}$.

### Simulation 1
Assuming we mute all the actions, let the input word $w$ be $w=\sigma_1\sigma_2\sigma_4$, $\bar\delta(q_0,w)=q_0$, so $w$ is an accepting word.

Obviously, in this case, $\forall w\in\Sigma^*$, if the first event is not $\sigma_1$, $w$ is an accepting word.

### Simulation 2
Without muting the action, there is no way to know if a word is accepting or not, this is a draw-back of our model.