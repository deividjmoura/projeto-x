/*
  File: vite.config.js
  - Cabeçalho automático: descreve o propósito do arquivo
*/


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
