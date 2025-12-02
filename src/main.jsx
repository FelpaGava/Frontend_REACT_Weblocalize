import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import Header from './components/header';
import Home from './pages/Home'
import Footer from './components/footer';

import 'bootstrap/dist/css/bootstrap.min.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Header />
    <Home />
    <Footer />
  </StrictMode>
)
