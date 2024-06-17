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
        this.history = [];
        this.future = [];
        this.state = initialState;
        this.history.push(initialState);
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
            this.history.push(this.state);
            this.future = [];
            this.notify();
        }
    };
    GlobalState.prototype.undo = function () {
        if (this.history.length > 1) {
            this.future.push(this.history.pop());
            this.state = this.history[this.history.length - 1];
            this.notify();
        }
    };
    GlobalState.prototype.redo = function () {
        if (this.future.length > 0) {
            this.history.push(this.future.pop());
            this.state = this.history[this.history.length - 1];
            this.notify();
        }
    };
    return GlobalState;
}());
function createGlobalState(creator) {
    var globalState = new GlobalState(creator(function (partial) { return globalState.setState(partial); }, function () { return globalState.getState(); }));
    function useGlobalState() {
        var subscribe = function (listener) { return globalState.subscribe(listener); };
        var getState = function () { return globalState.getState(); };
        return useSyncExternalStore(subscribe, getState);
    }
    useGlobalState.useUndo = function () { return function () { return globalState.undo(); }; };
    useGlobalState.useRedo = function () { return function () { return globalState.redo(); }; };
    return useGlobalState;
}
export default createGlobalState;
