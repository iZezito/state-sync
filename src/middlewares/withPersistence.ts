const withPersistence = <T extends object>(key: string, creator: (set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void, get: () => T) => T) => {
    return (set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void, get: () => T): T => {
        const persistedState = localStorage.getItem(key);
        const initialState = persistedState ? JSON.parse(persistedState) : undefined;

        const setWithPersistence = (partial: Partial<T> | ((state: T) => Partial<T>)) => {
            set(partial);
            localStorage.setItem(key, JSON.stringify(get()));
        };

        const state = creator(setWithPersistence, get);

        if (initialState) {
            set(initialState);
        }

        return state;
    };
};

export default withPersistence;
