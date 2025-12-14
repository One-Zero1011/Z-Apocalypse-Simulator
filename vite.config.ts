import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 중요: GitHub 리포지토리 이름과 앞뒤 슬래시(/)를 정확히 맞춰주세요.
  // 예: 리포지토리 이름이 'my-game'이면 base: '/my-game/'
  base: '/z-Apocalypse-Simulator/', 
})