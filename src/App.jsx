/*
  App.jsx
  - Componente principal da aplicação React.
  - Gerencia roteamento entre telas de login/cadastro e página inicial.
  - Verifica se há token salvo no localStorage ao iniciar.
*/
import { useState, useEffect } from 'react'
import LoginRegister from './LoginRegister'
import Home from './Home'
import './App.css'

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  // Verifica se há token e usuário salvos ao iniciar
  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser))
        setIsLoggedIn(true)
      } catch (err) {
        console.error('Erro ao carregar usuário salvo:', err)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
  }, [])

  // Função chamada quando login/cadastro é bem-sucedido
  function handleLoginSuccess(userData, token) {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    setIsLoggedIn(true)
  }

  // Função para fazer logout
  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsLoggedIn(false)
  }

  // Renderiza Home se autenticado, senão renderiza Login/Cadastro
  return isLoggedIn && user ? (
    <Home user={user} onLogout={handleLogout} />
  ) : (
    <LoginRegister onLoginSuccess={handleLoginSuccess} />
  )
}
