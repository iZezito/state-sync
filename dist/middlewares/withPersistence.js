var withPersistence = function (key, creator) {
    return function (set, get) {
        var persistedState = localStorage.getItem(key);
        var initialState = persistedState ? JSON.parse(persistedState) : undefined;
        var setWithPersistence = function (partial) {
            set(partial);
            localStorage.setItem(key, JSON.stringify(get()));
        };
        var state = creator(setWithPersistence, get);
        if (initialState) {
            set(initialState);
        }
        return state;
    };
};
export default withPersistence;
