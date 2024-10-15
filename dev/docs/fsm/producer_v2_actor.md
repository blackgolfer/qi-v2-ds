@import "blur_table.css"
@import "table.css"

# The Producer Actor

## Definition

The producer actor is a quadruple _Mealy_ machine $M=\left<\Sigma,\Gamma,Q,\delta,\lambda\right>$, where:

- $Q$: the state space,
- $\Sigma$: the input space,
- $\Gamma$: the output space,
- $\delta$: the transition function, $\delta: Q\times\Sigma\rightarrow Q$,
- $\lambda$: the output function, $\lambda: Q\times\Sigma\rightarrow\Gamma$.

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

### The output space $\Gamma$

The **output word** $\Gamma=\{\gamma_1,\gamma_2,\gamma_3,\gamma_4,\gamma_5\}$, where,

- $\gamma_1=null$: a null output.
- $\gamma_2=\sigma_2$: event $DATA\_READY$.
- $\gamma_3=\sigma_3$: event $FETCH\_FAILURE$.
- $\gamma_4=\sigma_4$: event $PUBLISH\_SUCCESS$.
- $\gamma_5=\sigma_5$: event $PUBLISH\_FAILURE$.

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

### The next-output function $\lambda$

The **next-output function** $\lambda: Q\times\Sigma\rightarrow\Gamma$: We use $\Lambda$ for the set of _next-output_ functions, and $\Lambda=\{\lambda_1,\lambda_2,\lambda_3,\lambda_4\}$, where

- $\lambda_1=startFetch$: action to begin fetching data, output event $\gamma_2$ if fetching successfully or $\gamma_3$ if fetching failed.
- $\lambda_2=startPublish$: action to begin publishing data, output $\gamma_4$ if publishing successfully or $\gamma_5$ if publishing failed.
- $\lambda_3=errorHandler$: action to handle errors, output $\gamma_1$
- $\lambda_4=resetFromError$: action to reset from an error state, output $\gamma_1$

<div class="table">
  <div class="table-caption">
    <span class="table-number">Table 3:</span>
      The next-output function $\lambda$ for producer actor - a symbolic definition:
  </div>

| current state | event      | $\lambda\in\Lambda$ | $\gamma\in\Gamma$        |
| ------------- | ---------- | ------------------- | ------------------------ |
| $s_1$         | $\sigma_1$ | $\lambda_1$         | $\gamma_2$ or $\gamma_3$ |
| $s_2$         | $\sigma_2$ | $\lambda_2$         | $\gamma_4$ or $\gamma_5$ |
| $s_3$         | $\sigma_3$ | $\lambda_3$         | $\gamma_1$               |
| $s_3$         | $\sigma_5$ | $\lambda_3$         | $\gamma_1$               |
| $s_3$         | $\sigma_6$ | $\lambda_4$         | $\gamma_1$               |

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
| Error         | FETCH_FAILURE   | errorHandler   | null                              |
| Error         | PUBLISH_FAILURE | errorHandler   | null                              |
| Error         | RESET           | resetFromError | null                              |

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
\node[state]         (q1) at (A.corner 2) {$s_1$};
\node[state]         (q2) at (A.corner 3) {$s_2$};
\node[state]         (q3) at (A.corner 4) {$s_3$};

\path[->]
    (q0)  edge  node[el,above,sigma_1] {}          (q1)
    (q1)  edge  node[el,above,sigma_2] {}          (q2)
    (q1)  edge  node[el,above,pos=0.75,sigma_3] {} (q3)
    (q2)  edge  node[el,above,pos=0.75,sigma_4] {} (q0)
    (q2)  edge  node[el,above,sigma_5]  {}         (q3)
    (q3)  edge  node[el,above,sigma_6]  {}         (q0);
\end{tikzpicture}
\end{document}
```
