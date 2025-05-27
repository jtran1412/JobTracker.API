import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import App from './App';
import theme from './theme'; 
import './index.css';
import NightMode from './components/Nightmode';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
        <NightMode />
      </div>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
