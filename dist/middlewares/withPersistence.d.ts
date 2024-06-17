declare const withPersistence: <T extends object>(key: string, creator: (set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void, get: () => T) => T) => (set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void, get: () => T) => T;
export default withPersistence;
