type StateCreator<T> = (set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void, get: () => T) => T;
declare function createGlobalStateWithSelector<T>(creator: StateCreator<T>): {
    <U>(selector: (state: T) => U, equalityFn?: (a: U, b: U) => boolean): U;
    useUndo(): () => void;
    useRedo(): () => void;
};
export default createGlobalStateWithSelector;
