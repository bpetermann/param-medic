import { buildUrlWithParams, useParams } from 'param-medic';
import { NavLink, useNavigate } from 'react-router';
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

const initialValue = {
  count: 1,
  form: {
    name: '',
    age: 0,
  },
};

function App() {
  const navigate = useNavigate();

  const [params, setParams] = useParams<MyParams>(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams(
      (prev) => ({
        ...prev,
        form: { ...prev.form, [e.target.name]: e.target.value },
      }),
      {
        replace: true,
      }
    );
  };

  console.log(params.form);

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
      <h1>App</h1>
      <NavLink to={buildUrlWithParams('home', params)}>Home</NavLink>
      <div className='card'>
        <button
          onClick={() =>
            setParams(
              (prev) => ({
                ...prev,
                count: prev.count + 1,
              }),
              {
                replace: true,
              }
            )
          }
        >
          increase
        </button>
        <form>
          <div>
            <label>Name:</label>
            <input
              type='text'
              name='name'
              value={params.form.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Age:</label>
            <input
              type='number'
              name='age'
              value={params.form.age}
              onChange={handleChange}
            />
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              navigate(buildUrlWithParams('home', params));
            }}
            type='button'
          >
            Save
          </button>
        </form>
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
