import { useParams } from 'param-medic';
import { NavLink, useNavigate } from 'react-router';
import { MyParams } from './App';
import './App.css';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

function Form() {
  const navigate = useNavigate();

  const [params, setParams, resetParams] = useParams<MyParams>({
    count: 1,
    form: { name: '', email: '', password: '' },
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
      <NavLink to={`/?${new URLSearchParams(window.location.search)}`}>
        Home
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

      <form>
        <div>
          <label>Your Name:</label>
          <input
            type='text'
            name='name'
            value={params.form.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Your Email:</label>
          <input
            type='text'
            name='email'
            value={params.form.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Your Password:</label>
          <input
            type='password'
            name='password'
            value={params.form.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <button
            onClick={(e) => {
              e.preventDefault();
              navigate(`/?${new URLSearchParams(window.location.search)}`);
            }}
            type='submit'
            className='submit'
          >
            Save
          </button>
          <button
            className='reset'
            onClick={(e) => {
              e.preventDefault();
              resetParams();
            }}
          >
            Reset
          </button>
        </div>
      </form>

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
