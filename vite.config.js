import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

function hideMacosVersion(server) {
  server.middlewares.use((request, response, next) => {
    const pathname = request.url?.split('?')[0];
    if (pathname === '/macos' || pathname?.startsWith('/macos/')) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }
    next();
  });
}

export default defineConfig({
  esbuild: { jsx: 'automatic' },
  plugins: [{
    name: 'hide-macos-version',
    configureServer: hideMacosVersion,
    configurePreviewServer: hideMacosVersion,
  }],
  build: {
    rollupOptions: {
      input: {
        portfolio: fileURLToPath(new URL('./index.html', import.meta.url)),
      },
      output: { manualChunks: { three: ['three'] } },
    },
  },
});
