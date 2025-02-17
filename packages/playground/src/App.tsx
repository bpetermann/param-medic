import { useParams } from 'param-medic';
import { useState } from 'react';
import './App.css';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

type Params = {
  count?: number;
};

function App() {
  const [count, setCount] = useState(0);
  const [params, setSearchParams] = useParams<Params>();

  console.log(params);

  return (
    <>
      <div>
        <a href='https://vite.dev' target='_blank'>
          <img src={viteLogo} className='logo' alt='Vite logo' />
        </a>
        <a href='https://react.dev' target='_blank'>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className='card'>
        <button
          onClick={() => {
            setCount((prevCount) => {
              const newCount = prevCount + 1;

              setSearchParams((prevParams) => ({
                ...prevParams,
                count: newCount,
              }));

              return newCount;
            });
          }}
        >
          count is {count}
        </button>

        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className='read-the-docs'>
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
