import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  publicDir: false,
  plugins: [
    react(),
    tailwindcss(),
    dts({ 
      rollupTypes: true, 
      strictOutput: false
    })
  ],
  build: {
    sourcemap: false,
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AdaptiveErrorUI',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: [
        'react', 
        'react-dom', 
        'react/jsx-runtime',
        'lucide-react',
        'sonner',
        'zod',
        'clsx',
        'tailwind-merge',
        /^@radix-ui\// 
      ],
      output: { 
        globals: { react: 'React', 'react-dom': 'ReactDOM' },
        assetFileNames: "cognicatch-react.[ext]"
      }
    }
  }
});
