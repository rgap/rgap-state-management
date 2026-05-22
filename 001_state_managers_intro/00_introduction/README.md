# Introduction to State

---

## State

**state** *(n.)* — the particular condition that something is in at a specific time.

In computing, that "something" is a running program, and that "condition" is the set of values it currently holds in memory — what it will read when deciding what to do next.

> "A system is described as **stateful** if it is designed to remember preceding events or user interactions; the remembered information is called the **state** of the system."
> — Wikipedia, *State (computer science)*

> "The output of a sequential circuit or computer program at any time is completely determined by its current inputs and **current state**."
> — Wikipedia, *State (computer science)*

At each instant the program holds a set of values that represent what is currently true. Events do not *become* state; they **cause transitions** from one set of values to the next. The values are what stay; the event is what passes.

The opposite is a **stateless** system — one that starts fresh on every interaction, with no memory of what came before. Each request carries everything the program needs; nothing is retained between calls. HTTP is stateless by design: the server treats every request independently unless something (a session, a cookie, a token) explicitly re-attaches context.

---

## Input and output

**Input** is transient (a signal, a request). **Output** is produced by reading state and expressing it outward. Neither replaces the need to store the values. If you only change output and never update state, the program's internal picture of the world is wrong on the next read.

---

## Read and write

Behavior is **read → decide → write → (maybe) output**. Reads use the current values; writes replace them. When writes are scattered, the system has no clear moment where "now" changed — debugging is tracing which values you thought you were looking at.

---

## Lifetime

State may last only while a process runs, or survive in storage across runs. Same role; different duration.

---

## Kinds of state

**Initial state** — the values the program starts with before any input has arrived. Often a hardcoded default (`count: 0`, `user: null`). Everything begins here.

**Derived state** — a value computed from other state rather than stored directly. If you have `items` in a cart and always calculate `total` from them, `total` is derived. Storing it separately means two parts of state can contradict each other.

**Stale state** — state that no longer reflects reality because something changed elsewhere (another process, another tab, the server) and the update has not arrived yet. A program that acts on stale state produces wrong output.

**Reset state** — returning to the initial values intentionally. Not a special mechanism; just a transition that sets values back to their starting point.

**Persisted state** — state that has been written to storage (file, database, browser storage) so it can be loaded back after the process restarts. The in-memory values and the stored copy are kept in sync by writing on every update.

---

## Example

```
state = { count: 0 }
apply(new_count)  →  state.count := new_count
show()            →  output from state
```

See `example.py` for three transitions printed in order.
