import { ParamContextProvider } from 'param-medic';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import App from './App.tsx';
import Form from './Form.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ParamContextProvider
      keys={['count', { name: 'form', hide: true, secret: 'secret-key' }]}
    >
      <BrowserRouter>
        <Routes>
          <Route path='/form' element={<Form />} />
          <Route path='/' element={<App />} />
        </Routes>
      </BrowserRouter>
    </ParamContextProvider>
  </StrictMode>
);
