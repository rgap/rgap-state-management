# The entire program state lives in one place — a variable in memory (RAM).
# It exists only while this process runs. When the process ends, it is gone.
# Nothing is written to disk, a database, or any persistent storage.
state = {
    "count": 0,
    "last_action": None,
}


def apply(action, new_count):
    # A transition: move from the current snapshot to a new one.
    # The old snapshot is discarded; the new one replaces it.
    state["count"] = new_count
    state["last_action"] = action
    show()


def show():
    # Output is derived from state, not stored in parallel.
    # If state changes, calling show() again gives the correct picture.
    print(f"count={state['count']}  last_action={state['last_action']}")


# Initial snapshot — nothing has happened yet.
show()

# Each call is a transition with a named reason.
apply("increment", 1)
apply("increment", 2)
apply("decrement", 1)
apply("reset", 0)
