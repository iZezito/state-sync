declare const withLogger: <T extends object>(creator: (set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void, get: () => T) => T) => (set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void, get: () => T) => T;
export default withLogger;
