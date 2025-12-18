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
            // React and react-dom must be together
            if (id.includes('react') || id.includes('react-dom')) {
              // Exclude lucide-react from react-vendor
              if (!id.includes('lucide')) {
                return 'react-vendor';
              }
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
  optimizeDeps: {
    include: ['lucide-react', 'react', 'react-dom'],
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      'react': 'react',
      'react-dom': 'react-dom',
    },
  },
});
