import { useParams } from 'param-medic';
import { NavLink } from 'react-router';
import './App.css';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

export type Params = {
  count: number;
  form: {
    name: string;
    email: string;
    password: string;
    agreement: boolean;
  };
};

function App() {
  const [params, setParams] = useParams<Params>({
    count: 1,
    form: { name: '', email: '', password: '', agreement: false },
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
      <NavLink to={`/form?${new URLSearchParams(window.location.search)}`}>
        Form
      </NavLink>
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
      </div>
    </>
  );
}

export default App;
