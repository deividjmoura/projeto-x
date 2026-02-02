/**
 * src/LoginRegister.jsx
 * - Componente que fornece tela de login e cadastro usando Chakra UI.
 * - Envia requisições para `/api/register` e `/api/login` no backend.
 * - Valida senha com critérios: maiúscula, minúscula, número, caractere especial.
 * - Redireciona para tela de login após cadastro bem-sucedido.
 */
import { useState, useEffect } from 'react'
import {
  Box,
  Heading,
  Input,
  Button,
  VStack,
  Text,
} from '@chakra-ui/react'

// URL base para a API — no desenvolvimento o servidor estará em :4000
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

// Validação de senha: deve ter maiúscula, minúscula, número e caractere especial
function validatePassword(password) {
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  
  const isValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar
  const missing = []
  
  if (!hasUpperCase) missing.push('letra maiúscula')
  if (!hasLowerCase) missing.push('letra minúscula')
  if (!hasNumber) missing.push('número')
  if (!hasSpecialChar) missing.push('caractere especial')
  
  return { isValid, missing }
}

export default function LoginRegister({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)
  const [apiReady, setApiReady] = useState(false)
  const [successMsg, setSuccessMsg] = useState(null)
  const [passwordError, setPasswordError] = useState(null)

  // Testa conexão com a API ao montar o componente
  useEffect(() => {
    async function checkAPI() {
      try {
        const res = await fetch(`${API_BASE}/api/health`)
        if (res.ok) {
          const data = await res.json()
          setApiReady(data.status === 'ok')
          setApiError(null)
        } else {
          setApiError(`API respondeu com status ${res.status}`)
        }
      } catch (err) {
        setApiError(`Não consegui conectar ao servidor: ${err.message}. API_BASE: ${API_BASE}`)
        setApiReady(false)
      }
    }
    checkAPI()
  }, [])

  // Valida senha em tempo real quando registrando
  useEffect(() => {
    if (isRegister && password) {
      const { isValid, missing } = validatePassword(password)
      if (!isValid) {
        setPasswordError(`Falta: ${missing.join(', ')}`)
      } else {
        setPasswordError(null)
      }
    } else {
      setPasswordError(null)
    }
  }, [password, isRegister])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setApiError(null)
    setSuccessMsg(null)

    // Validação de senha no cadastro
    if (isRegister) {
      const { isValid, missing } = validatePassword(password)
      if (!isValid) {
        setApiError(`Senha inválida. Falta: ${missing.join(', ')}`)
        setLoading(false)
        return
      }
    }

    try {
      const url = (isRegister ? '/api/register' : '/api/login')
      const fullUrl = `${API_BASE}${url}`
      const res = await fetch(fullUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: isRegister ? name : undefined, email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw data

      if (isRegister) {
        // Após cadastro, volta para login automaticamente
        setSuccessMsg('✓ Cadastro realizado! Redirecionando para login...')
        setTimeout(() => {
          setIsRegister(false)
          setEmail('')
          setPassword('')
          setName('')
          setSuccessMsg(null)
        }, 2000)
      } else {
        // Login bem-sucedido: chama callback e redireciona para Home
        if (data.token && data.user) {
          onLoginSuccess(data.user, data.token)
        }
      }
    } catch (err) {
      const errorMsg = err?.error || err?.message || String(err)
      setApiError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box maxW="md" mx="auto" mt={12} p={6} borderRadius="md" boxShadow="lg" bg="white">
      {/* Mostra erro de conexão com a API */}
      {apiError && (
        <Box mb={6} p={4} borderRadius="md" bg="red.50" borderLeft="4px" borderColor="red.500">
          <Text fontWeight="bold" color="red.700" mb={1}>Erro</Text>
          <Text fontSize="sm" color="red.600">
            {apiError}
          </Text>
        </Box>
      )}

      {/* Mostra sucesso */}
      {successMsg && (
        <Box mb={6} p={4} borderRadius="md" bg="green.50" borderLeft="4px" borderColor="green.500">
          <Text fontWeight="bold" color="green.700" mb={1}>Sucesso!</Text>
          <Text fontSize="sm" color="green.600">
            {successMsg}
          </Text>
        </Box>
      )}

      {/* Status da API */}
      {!apiReady && !apiError && (
        <Box mb={6} p={4} borderRadius="md" bg="yellow.50" borderLeft="4px" borderColor="yellow.500">
          <Text fontSize="sm" color="yellow.700">
            ⏳ Conectando ao servidor...
          </Text>
        </Box>
      )}
      {apiReady && !apiError && !successMsg && (
        <Box mb={6} p={4} borderRadius="md" bg="blue.50" borderLeft="4px" borderColor="blue.500">
          <Text fontSize="sm" color="blue.700" fontWeight="bold">
            ✓ Servidor conectado
          </Text>
        </Box>
      )}

      <Heading size="md" mb={6} textAlign="center">
        {isRegister ? 'Cadastro' : 'Login'}
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          {isRegister && (
            <Box>
              <Text fontWeight="500" mb={2}>Nome</Text>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" color="black" />
            </Box>
          )}

          <Box>
            <Text fontWeight="500" mb={2}>Email</Text>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@exemplo.com" color="black" required />
          </Box>

          <Box>
            <Text fontWeight="500" mb={2}>Senha</Text>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="********" color="black" required />
            {/* Mostra erro de validação de senha */}
            {passwordError && (
              <Text fontSize="xs" color="red.600" mt={2}>
                ⚠️ {passwordError}
              </Text>
            )}
            {/* Dicas de requisitos de senha */}
            {isRegister && (
              <Box fontSize="xs" color="gray.600" mt={2} p={2} bg="gray.100" borderRadius="md">
                <Text fontWeight="bold" mb={1}>Requisitos:</Text>
                <Text>• Letra maiúscula (A-Z)</Text>
                <Text>• Letra minúscula (a-z)</Text>
                <Text>• Número (0-9)</Text>
                <Text>• Caractere especial (!@#$%^&*...)</Text>
              </Box>
            )}
          </Box>

          <Button type="submit" colorScheme="teal" isLoading={loading} loadingText="Enviando" isDisabled={!apiReady || (isRegister && passwordError)}>
            {isRegister ? 'Cadastrar' : 'Entrar'}
          </Button>

          <Text textAlign="center" fontSize="sm">
            <Button variant="link" onClick={() => setIsRegister(v => !v)}>
              {isRegister ? 'Já tem conta? Faça login' : 'Não tem conta? Cadastre-se'}
            </Button>
          </Text>
        </VStack>
      </form>
    </Box>
  )
}
