import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // base를 './'로 설정하면 저장소 이름이 무엇이든 상관없이 자동으로 경로를 찾습니다.
  // 흰 화면 오류를 방지하는 가장 확실한 방법입니다.
  base: './', 
})