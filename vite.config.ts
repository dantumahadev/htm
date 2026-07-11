import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { vertexAiProxyPlugin } from './server/aiProxyPlugin';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3001,
        host: '0.0.0.0',
      },
      plugins: [react(), vertexAiProxyPlugin()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.API_KEY),
        'process.env.MEDIA_API_KEY': JSON.stringify(env.MEDIA_API_KEY),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
