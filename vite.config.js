import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        formatter: 'json-formatter.html',
        validator: 'json-validator.html',
        xmlFormatter: 'xml-formatter.html',
        howTo: 'how-to-open-json-file.html'
      }
    }
  },
  server: {
    port: 5173,
    open: true
  },
  plugins: [{
    name: 'handle-html-urls',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const routes = {
          '/': '/index.html',
          '/json-formatter': '/json-formatter.html',
          '/json-validator': '/json-validator.html',
          '/json-editor': '/json-editor.html',
          '/xml-formatter': '/xml-formatter.html',
          '/how-to-open-json-file': '/how-to-open-json-file.html'
        };

        const targetPath = routes[req.url];
        if (targetPath) {
          req.url = targetPath;
        }
        
        next();
      });
    }
  }],
  publicDir: 'public'
})


