import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppProvider } from './context/AppContext';

import Header from './components/header';
import Home from './pages/Home'
import Footer from './components/footer';

import 'bootstrap/dist/css/bootstrap.min.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <Header />
      <Home />
      <Footer />
    </AppProvider>
  </StrictMode>
)
