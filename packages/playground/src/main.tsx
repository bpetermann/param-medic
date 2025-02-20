import { ParamContextProvider } from 'param-medic';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import App from './App.tsx';
import Home from './Home.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ParamContextProvider keys={['count', 'form']}>
      <BrowserRouter>
        <Routes>
          <Route path='/home' element={<Home />} />
          <Route path='/' element={<App />} />
        </Routes>
      </BrowserRouter>
    </ParamContextProvider>
  </StrictMode>
);
