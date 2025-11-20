import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // This exposes the API_KEY environment variable to the client-side code
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});