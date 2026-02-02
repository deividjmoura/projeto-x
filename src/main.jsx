/*
  main.jsx
  - Ponto de entrada da aplicação React.
  - Responsável por montar a árvore de componentes dentro de <div id="root">.
  - Envolve o App com `ChakraProvider` para disponibilizar o tema e componentes do Chakra UI.
  - Usa `React.StrictMode` para ajudar a identificar problemas durante o desenvolvimento.
*/
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import App from './App'
import './index.css'

// Cria a raiz do React e renderiza o componente App.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider value={defaultSystem}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
)
