import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('lucide-react')) {
              return 'lucide-vendor';
            }
            if (id.includes('recharts')) {
              return 'recharts-vendor';
            }
            // Other node_modules
            return 'vendor';
          }
          // Component chunks
          if (id.includes('/components/')) {
            const componentName = id.split('/components/')[1]?.split('.')[0];
            if (componentName) {
              return `component-${componentName}`;
            }
          }
        },
      },
    },
  },
});
