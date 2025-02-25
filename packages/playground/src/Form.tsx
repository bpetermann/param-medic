import { useParams } from 'param-medic';
import { NavLink, useNavigate } from 'react-router';
import { Params } from './App';
import './App.css';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

const options = { replace: false };

function Form() {
  const navigate = useNavigate();

  const [params, setParams, resetParams] = useParams<Params>({
    count: 1,
    form: { name: '', email: '', password: '', agreement: false },
  });

  const handleFormChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    const isAgreement = name === 'agreement';

    setParams(
      (prev) => ({
        ...prev,
        form: {
          ...prev.form,
          [name]: isAgreement ? !prev.form.agreement : value,
        },
      }),
      options
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
              options
            )
          }
        >
          count is {params.count}
        </button>
      </div>

      <form>
        <div>
          <label htmlFor='name'>Your Name:</label>
          <input
            type='text'
            name='name'
            id='name'
            autoComplete=''
            value={params.form.name}
            onChange={handleFormChange}
          />
        </div>
        <div>
          <label htmlFor='email'>Your Email:</label>
          <input
            type='text'
            name='email'
            id='email'
            value={params.form.email}
            onChange={handleFormChange}
          />
        </div>
        <div>
          <label htmlFor='password'>Your Password:</label>
          <input
            type='password'
            name='password'
            id='password'
            value={params.form.password}
            onChange={handleFormChange}
          />
        </div>
        <div className='agreement'>
          <input
            type='checkbox'
            id='agreement'
            name='agreement'
            checked={params.form.agreement}
            onChange={handleFormChange}
          />
          <label htmlFor='agreement' className='read-the-docs'>
            I agree with the terms and conditions
          </label>
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
    </>
  );
}

export default Form;
