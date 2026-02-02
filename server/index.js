#!/usr/bin/env node
/**
 * server/index.js
 * - Servidor Express simples com endpoints de autenticação:
 *    POST /api/register  -> cria usuário (hash da senha)
 *    POST /api/login     -> valida credenciais e retorna JWT
 * - Conecta ao Postgres usando variável de ambiente `DATABASE_URL`.
 * - Cria tabela `users` automaticamente se não existir.
 */
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

dotenv.config()

const app = express()
app.use(express.json())
// CORS: aceita frontend em localhost:5173 ou 5174 (ou URL definida em env)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  process.env.FRONTEND_ORIGIN
].filter(Boolean)
app.use(cors({ origin: allowedOrigins || true }))

// Connection string: prefer env var, fall back to NEON link if provided directly
const DATABASE_URL = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || 'postgresql://neondb_owner:npg_zi21oPywSAVx@ep-bitter-pond-ac1tpt4t-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
const JWT_SECRET = process.env.JWT_SECRET || 'please-change-this-secret'

const pool = new Pool({ connectionString: DATABASE_URL })

async function ensureSchema() {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT now()
    );
  `
  await pool.query(sql)
}

// Inicializa esquema
ensureSchema().catch(err => {
  console.error('Error ensuring DB schema', err)
  process.exit(1)
})

// Helpers
function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
}

// Health check: verifica se o servidor está vivo e conectado ao DB
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ status: 'ok', database: 'connected' })
  } catch (err) {
    console.error('Health check DB error:', err.message)
    res.status(503).json({ status: 'error', database: 'disconnected', error: err.message })
  }
})

// Validação de senha: deve ter maiúscula, minúscula, número e caractere especial
function validatePassword(password) {
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  
  const isValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar
  return isValid
}

// Register endpoint: cria novo usuário com senha hasheada
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'email and password required' })
  
  // Valida força da senha
  if (!validatePassword(password)) {
    return res.status(400).json({ 
      error: 'Senha fraca. Deve conter letra maiúscula, minúscula, número e caractere especial' 
    })
  }

  try {
    const hashed = await bcrypt.hash(password, 10)
    const result = await pool.query('INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING id,email,name', [name || null, email, hashed])
    const user = result.rows[0]
    const token = signToken(user)
    res.json({ user, token })
  } catch (err) {
    if (err.code === '23505') { // unique_violation
      return res.status(409).json({ error: 'email already exists' })
    }
    console.error(err)
    res.status(500).json({ error: 'internal_error' })
  }
})

// Login endpoint: verifica credenciais e retorna JWT
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'email and password required' })
  try {
    const result = await pool.query('SELECT id, name, email, password FROM users WHERE email = $1', [email])
    const user = result.rows[0]
    if (!user) return res.status(401).json({ error: 'invalid_credentials' })
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ error: 'invalid_credentials' })
    const token = signToken(user)
    delete user.password
    res.json({ user, token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'internal_error' })
  }
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Auth server running on http://localhost:${PORT}`))
