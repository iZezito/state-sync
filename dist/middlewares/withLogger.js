var withLogger = function (creator) {
    return function (set, get) {
        var setWithLogger = function (partial) {
            console.log('Previous State:', get());
            set(partial);
            console.log('Next State:', get());
        };
        return creator(setWithLogger, get);
    };
};
export default withLogger;
