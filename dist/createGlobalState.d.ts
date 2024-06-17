type StateCreator<T> = (set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void, get: () => T) => T;
declare function createGlobalState<T>(creator: StateCreator<T>): {
    (): T;
    useUndo(): () => void;
    useRedo(): () => void;
};
export default createGlobalState;
