import { buildUrlWithParams, useParams } from 'param-medic';
import { NavLink, useNavigate } from 'react-router';
import { MyParams } from './App';
import './App.css';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

function Form() {
  const navigate = useNavigate();

  const [params, setParams, resetParams] = useParams<MyParams>({
    count: 1,
    form: { name: '', age: 0 },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams(
      (prev) => ({
        ...prev,
        form: { ...prev.form, [e.target.name]: e.target.value },
      }),
      {
        replace: false,
      }
    );
  };

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
      <h1>Form</h1>
      <NavLink to={buildUrlWithParams('/', params)}>Home</NavLink>
      <div className='card'>
        <p>Name is: {params.form.name}</p>
        <p>Age is: {params.form.age}</p>
        <p>Count is: {params.count}</p>
      </div>
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
            navigate(buildUrlWithParams('/', params));
          }}
          type='button'
        >
          Save
        </button>
      </form>
      <button onClick={resetParams}>Reset</button>

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

export default Form;
