import { buildUrlWithParams, useParams } from 'param-medic';
import { NavLink } from 'react-router';
import { MyParams } from './App';
import './App.css';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

function App() {
  const [params] = useParams<MyParams>({ count: 1, form: {} });

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
      <NavLink to={buildUrlWithParams('/', params)}>Home</NavLink>
      <div className='card'>
        <p>count is {params.count}</p>
        <p>name is {params.form.name}</p>
        <p>age is {params.form.age}</p>
      </div>

      <div className='card'>
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
