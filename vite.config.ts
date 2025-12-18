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
          // Vendor chunks - ensure proper separation
          if (id.includes('node_modules')) {
            // Separate lucide-react completely
            if (id.includes('lucide-react')) {
              return 'lucide-vendor';
            }
            // React and react-dom must be together - don't split them
            if (id.includes('react/') || id.includes('react-dom/') || 
                id === 'node_modules/react/index.js' || 
                id === 'node_modules/react-dom/index.js' ||
                (id.includes('react') && !id.includes('lucide') && !id.includes('recharts'))) {
              return 'react-vendor';
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
        // Ensure proper chunk loading order
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: (chunkInfo) => {
          // Prioritize react-vendor to load first
          const chunkName = chunkInfo.name || '';
          if (chunkName === 'react-vendor') {
            return 'assets/00-react-vendor-[hash].js';
          }
          if (chunkName === 'lucide-vendor') {
            return 'assets/01-lucide-vendor-[hash].js';
          }
          return 'assets/[name]-[hash].js';
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react'],
    force: true,
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      'react': 'react',
      'react-dom': 'react-dom',
    },
  },
});
