import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import Home from './pages/Home'
import Header from './components/header';

import 'bootstrap/dist/css/bootstrap.min.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Header />
    <Home />
  </StrictMode>,
)
