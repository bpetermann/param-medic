# Param Medic

**Param-medic** helps you manage your state in React SPAs using URL parameters and provides a hook for easy retrieval, updating, and deletion.

## Features

- **useParams** – Retrieve, update, and reset state via URL parameters.
- **ParamContextProvider** – Define expected keys to filter URL parameters.
- **Seamless State Syncing** – Keeps state in sync with browser navigation (Back/Forward).

## Usage

The **useParams** hook returns an array with three values:

1. **Params** – The current state derived from URL parameters.
2. **setParams** – Updates the state. Accepts a function and an optional `{ replace: boolean }` object to determine if the browser history should be replaced or pushed.
3. **resetParams** – Resets the state to its initial value.

> **Note:** If no initial state is provided, params may be `undefined`. Ensure your logic accounts for this.

### Example

A URL of `/?count=5` correctly displays `count: 5` and overrides the initial value. If `/` is visited without parameters, it falls back to the initial state `{ count: 1 }`. With `replace: true`, the counter decreases when clicking the back button.

```jsx
import { useParams } from 'param-medic';

function App() {
  const [params, setParams] = useParams < { count: number } > { count: 1 };

  return (
    <button
      onClick={() =>
        setParams((prev) => ({ ...prev, count: prev.count + 1 }), {
          replace: false,
        })
      }
    >
      Count is {params.count}
    </button>
  );
}

export default App;
```

## Context-Based Parameter Filtering

Wrap components inside `ParamContextProvider` to specify which URL parameters should be managed.

- Only listed keys are used.
- Other URL parameters remain unchanged until an update occurs.
- On updates, only listed keys persist, and unlisted ones are removed.

### Example

Wrap your components into the **ParamContextProvider** to specify the keys which you expect. The context ensures that only these keys are used, while other parameters are ignored and removed from the url during an update.

```jsx
import { ParamContextProvider } from 'param-medic';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ParamContextProvider keys={['count']}>
      <App />
    </ParamContextProvider>
  </StrictMode>
);
```

You cann add and delete keys dynamically using the `useParamContext` hook.

## Contributing

Create a branch on your fork, add commits to your fork, and open a pull request from your fork to this repository.

## Changelog

To check full changelog click [here](https://github.com/bpetermann/param-medic/blob/main/CHANGELOG.md)

## License

[MIT][github-license-url]

[github-license-url]: https://github.com/bpetermann/param-medic/blob/main/LICENSE
