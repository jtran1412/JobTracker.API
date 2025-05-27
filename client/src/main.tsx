import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, ColorModeScript, Flex } from '@chakra-ui/react';
import App from './App';
import './index.css';
import NightMode from './components/Nightmode';
import theme from './theme';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <Flex justify="flex-end" p={4}>
      <NightMode />
    </Flex>
    <App />
    </ChakraProvider>
  </React.StrictMode>
);
