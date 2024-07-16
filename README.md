# State Sync

Uma biblioteca para gerenciamento de estado global que usa seletores para evitar renderizações desnecessárias, cache(em construção) e undo.

## Instalação
1. Instale o pacote via npm:
   ```sh
   npm i @emerson_/state-sync
    ```

## Exemplo básico de uso
`@/stores/counterStore.ts`
```typescript
import { initState } from '@emerson_/state-sync';

type StateProps = {
    counter: number;
    incremente: () => void
};

const counterStore = initState<StateProps>((set) => ({
    counter: 0,
    incremente: () => set((state) => ({counter: state.counter + 1}))}))

export { counterStore };
```
`@/src/App.tsx`
```tsx
import { counterStore } from './stores/counterStore';

const App: React.FC = () => {
    const {counter, incremente} = counterStore((state) => state);
    
    return (
       <>
        <span>contador: {counter}</span>
        <button onClick={incremente}>Incrementar</button>
        </>
    );
};

export default App;
```
### Resultado
![exemplo](https://github.com/user-attachments/assets/87ce8b55-4f63-449d-9782-d313eedab35a)

