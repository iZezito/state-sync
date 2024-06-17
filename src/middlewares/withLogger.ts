const withLogger = <T extends object>(creator: (set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void, get: () => T) => T) => {
    return (set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void, get: () => T): T => {
        const setWithLogger = (partial: Partial<T> | ((state: T) => Partial<T>)) => {
            console.log('Previous State:', get());
            set(partial);
            console.log('Next State:', get());
        };
        return creator(setWithLogger, get);
    };
};

export default withLogger;
