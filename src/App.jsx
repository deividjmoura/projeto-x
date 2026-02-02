import { useState } from 'react'
import { Box, Flex, Heading, Spacer, Button, Container } from '@chakra-ui/react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Box as="header" bg="teal.500" color="white" px={6} py={4}>
        <Container maxW="container.xl">
          <Flex align="center">
            <Heading size="md">Projeto-X</Heading>
            <Spacer />
            <Button colorScheme="teal" variant="solid" size="sm">
              Acessar
            </Button>
          </Flex>
        </Container>
      </Box>

      <Container maxW="container.xl" mt={8}>
        <div>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.jsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </Container>
    </>
  )
}

export default App
