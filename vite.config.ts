import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // base를 './'로 설정하면 저장소 이름과 상관없이 상대 경로로 에셋을 불러옵니다.
  // 이렇게 하면 저장소 이름이 달라도 흰 화면이 뜨는 문제를 방지할 수 있습니다.
  base: './', 
})
