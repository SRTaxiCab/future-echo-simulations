
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Production optimizations
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: mode === 'development',
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-switch'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-charts': ['recharts', 'd3'],
          'vendor-utils': ['lucide-react', 'clsx', 'tailwind-merge', 'date-fns'],
          
          // App chunks
          'pages-main': [
            './src/pages/Dashboard.tsx',
            './src/pages/Index.tsx'
          ],
          'pages-auth': [
            './src/pages/Login.tsx',
            './src/pages/Auth.tsx',
            './src/pages/Setup.tsx'
          ],
          'pages-features': [
            './src/pages/TimelineViewer.tsx',
            './src/pages/ScenarioBuilder.tsx',
            './src/pages/DataFeeds.tsx',
            './src/pages/Settings.tsx'
          ]
        },
        // Optimize chunk file names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? path.basename(chunkInfo.facadeModuleId, path.extname(chunkInfo.facadeModuleId))
            : 'unknown';
          return `js/${facadeModuleId}-[hash].js`;
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name!.split('.');
          const ext = info[info.length - 1];
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name!)) {
            return `images/[name]-[hash].${ext}`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name!)) {
            return `fonts/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        }
      }
    },
    // Optimize for production
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    // Enable CSS minification
    cssMinify: true,
    reportCompressedSize: false,
    // Preload optimization
    modulePreload: {
      polyfill: false
    }
  },
  // Performance optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'lucide-react'
    ],
    exclude: ['@supabase/supabase-js']
  },
  // Enable esbuild for faster builds
  esbuild: {
    target: 'esnext',
    platform: 'browser',
    format: 'esm',
    ...(mode === 'production' && {
      drop: ['console', 'debugger'],
      pure: ['console.log', 'console.warn']
    })
  }
}));
