import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 중요: 로컬 실행 시에는 base 설정을 주석 처리하거나 삭제해야 합니다.
  // GitHub Pages 배포 시에만 '/z-Apocalypse-Simulator/'를 사용하세요.
  base: '/z-Apocalypse-Simulator/', 
})