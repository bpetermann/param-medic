import { buildUrlWithParams, useParams } from 'param-medic';
import { NavLink } from 'react-router';
import './App.css';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

export type MyParams = {
  count: number;
  form: {
    name?: string;
    age?: number;
  };
};

function App() {
  const [params, setParams] = useParams<MyParams>({
    count: 1,
    form: { name: '', age: 0 },
  });

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
      <h1>Home</h1>
      <NavLink to={buildUrlWithParams('/form', params)}>Form</NavLink>
      <div className='card'>
        <button
          onClick={() =>
            setParams(
              (prev) => ({
                ...prev,
                count: prev.count + 1,
              }),
              {
                replace: false,
              }
            )
          }
        >
          count is {params.count}
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
