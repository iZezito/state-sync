import createGlobalState from '../src/createGlobalState';

interface TestState {
    count: number;
    increment: () => void;
}

const useTestStore = createGlobalState<TestState>((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
}));

test('initial state', () => {
    const { count } = useTestStore();
    expect(count).toBe(0);
});

test('increment', () => {
    const { increment } = useTestStore();
    increment();
    const { count } = useTestStore();
    expect(count).toBe(1);
});
