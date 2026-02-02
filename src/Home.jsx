/**
 * src/Home.jsx
 * - Página inicial exibida após login bem-sucedido.
 * - Mostra dados do usuário autenticado e botão de logout.
 */
import { Box, Heading, Text, Button, VStack, Container } from '@chakra-ui/react'

export default function Home({ user, onLogout }) {
  return (
    <Box minH="100vh" bg="gray.50">
      {/* Cabeçalho */}
      <Box as="header" bg="teal.500" color="white" px={6} py={4} boxShadow="sm">
        <Container maxW="container.md">
          <Heading size="md">Projeto-X</Heading>
        </Container>
      </Box>

      {/* Conteúdo principal */}
      <Container maxW="container.md" mt={12}>
        <Box maxW="md" mx="auto" p={6} borderRadius="md" boxShadow="lg" bg="white">
          <Heading size="md" mb={6} textAlign="center">
            Bem-vindo!
          </Heading>

          {/* Informações do usuário */}
          <VStack spacing={4} align="start" mb={8} p={4} bg="blue.50" borderRadius="md">
            <Box>
              <Text fontWeight="bold" color="blue.800">Nome:</Text>
              <Text color="blue.700">{user?.name || 'Usuário'}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold" color="blue.800">Email:</Text>
              <Text color="blue.700">{user?.email}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold" color="blue.800">ID:</Text>
              <Text color="blue.700">{user?.id}</Text>
            </Box>
          </VStack>

          {/* Token salvo */}
          <Box mb={6} p={4} bg="gray.100" borderRadius="md">
            <Text fontSize="sm" fontWeight="bold" mb={2}>
              🔐 Token JWT (salvo localmente):
            </Text>
            <Text fontSize="xs" color="gray.600" wordBreak="break-all" fontFamily="monospace">
              {localStorage.getItem('token')?.substring(0, 50)}...
            </Text>
          </Box>

          {/* Botão de logout */}
          <Button
            colorScheme="red"
            width="100%"
            onClick={onLogout}
          >
            Logout
          </Button>
        </Box>
      </Container>

      {/* Rodapé */}
      <Box as="footer" bg="gray.100" py={4} mt={12} textAlign="center">
        <Text fontSize="sm" color="gray.600">
          v0.0.0 | Login com JWT + PostgreSQL
        </Text>
      </Box>
    </Box>
  )
}
