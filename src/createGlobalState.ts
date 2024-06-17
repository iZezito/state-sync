import { useSyncExternalStore } from 'react';

type StateCreator<T> = (set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void, get: () => T) => T;

class GlobalState<T> {
    private state: T;
    private listeners: Set<(state: T) => void> = new Set();
    private history: T[] = [];
    private future: T[] = [];

    constructor(initialState: T) {
        this.state = initialState;
        this.history.push(initialState);
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
            this.history.push(this.state);
            this.future = [];
            this.notify();
        }
    }

    undo() {
        if (this.history.length > 1) {
            this.future.push(this.history.pop()!);
            this.state = this.history[this.history.length - 1];
            this.notify();
        }
    }

    redo() {
        if (this.future.length > 0) {
            this.history.push(this.future.pop()!);
            this.state = this.history[this.history.length - 1];
            this.notify();
        }
    }
}

function createGlobalState<T>(creator: StateCreator<T>) {
    const globalState: GlobalState<T> = new GlobalState<T>(creator(
        (partial) => globalState.setState(partial),
        () => globalState.getState()
    ));

    function useGlobalState(): T {
        const subscribe = (listener: () => void) => globalState.subscribe(listener);
        const getState = () => globalState.getState();

        return useSyncExternalStore(subscribe, getState);
    }

    useGlobalState.useUndo = () => () => globalState.undo();
    useGlobalState.useRedo = () => () => globalState.redo();

    return useGlobalState;
}

export default createGlobalState;
