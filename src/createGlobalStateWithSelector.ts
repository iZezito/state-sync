import { useSyncExternalStore } from 'react';

type StateCreator<T> = (set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void, get: () => T) => T;

class GlobalState<T> {
    private state: T;
    private listeners: Set<(state: T) => void> = new Set();
    private previousState: T;

    constructor(initialState: T) {
        this.state = initialState;
        this.previousState = initialState;
    }

    private notify() {
        this.listeners.forEach(listener => listener(this.state));
    }

    subscribe(listener: (state: T) => void): () => void {
        this.listeners.add(listener);
        listener(this.state); // Notify immediately with current state

        return () => {
            this.listeners.delete(listener);
        };
    }

    getState(): T {
        return this.state;
    }

    setState(partial: Partial<T> | ((state: T) => Partial<T>)) {
        const nextState = typeof partial === 'function' ? partial(this.state) : partial;
        if (nextState !== this.state) {
            this.state = { ...this.state, ...nextState };
            this.previousState = this.state;
            this.notify();
        }
    }

    undo() {
        this.state = this.previousState;
        this.notify();
    }

    redo() {
        // For redo functionality, you would typically need to implement a mechanism to store future states
        // However, since we're simplifying to only maintain previousState, redo might not be directly supported
        // without additional complexity.
    }
}

function initState<T>(creator: StateCreator<T>) {
    const globalState: GlobalState<T> = new GlobalState<T>(creator(
        (partial) => globalState.setState(partial),
        () => globalState.getState()
    ));

    function useGlobalState<U>(selector: (state: T) => U, equalityFn: (a: U, b: U) => boolean = Object.is): U {
        const subscribe = (listener: () => void) => {
            let prevState = selector(globalState.getState());
            return globalState.subscribe((state) => {
                const nextState = selector(state);
                if (!equalityFn(prevState, nextState)) {
                    prevState = nextState;
                    listener();
                }
            });
        };
        const getState = () => selector(globalState.getState());

        return useSyncExternalStore(subscribe, getState);
    }

    useGlobalState.useUndo = () => () => globalState.undo();
    // Redo functionality would need to be re-implemented if required

    return useGlobalState;
}

export default initState;
