var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { useSyncExternalStore } from 'react';
var GlobalState = /** @class */ (function () {
    function GlobalState(initialState) {
        this.listeners = new Set();
        this.state = initialState;
        this.previousState = initialState;
    }
    GlobalState.prototype.notify = function () {
        var _this = this;
        this.listeners.forEach(function (listener) { return listener(_this.state); });
    };
    GlobalState.prototype.subscribe = function (listener) {
        var _this = this;
        this.listeners.add(listener);
        listener(this.state); // Notify immediately with current state
        return function () {
            _this.listeners.delete(listener);
        };
    };
    GlobalState.prototype.getState = function () {
        return this.state;
    };
    GlobalState.prototype.setState = function (partial) {
        var nextState = typeof partial === 'function' ? partial(this.state) : partial;
        if (nextState !== this.state) {
            this.state = __assign(__assign({}, this.state), nextState);
            this.previousState = this.state;
            this.notify();
        }
    };
    GlobalState.prototype.undo = function () {
        this.state = this.previousState;
        this.notify();
    };
    GlobalState.prototype.redo = function () {
        // For redo functionality, you would typically need to implement a mechanism to store future states
        // However, since we're simplifying to only maintain previousState, redo might not be directly supported
        // without additional complexity.
    };
    return GlobalState;
}());
function initState(creator) {
    var globalState = new GlobalState(creator(function (partial) { return globalState.setState(partial); }, function () { return globalState.getState(); }));
    function useGlobalState(selector, equalityFn) {
        if (equalityFn === void 0) { equalityFn = Object.is; }
        var subscribe = function (listener) {
            var prevState = selector(globalState.getState());
            return globalState.subscribe(function (state) {
                var nextState = selector(state);
                if (!equalityFn(prevState, nextState)) {
                    prevState = nextState;
                    listener();
                }
            });
        };
        var getState = function () { return selector(globalState.getState()); };
        return useSyncExternalStore(subscribe, getState);
    }
    useGlobalState.useUndo = function () { return function () { return globalState.undo(); }; };
    // Redo functionality would need to be re-implemented if required
    return useGlobalState;
}
export default initState;
