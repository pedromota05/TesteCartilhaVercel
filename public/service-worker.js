// service-worker.js
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js');

workbox.routing.registerRoute(
    // Define a rota da sua API, incluindo os parâmetros de consulta
    new RegExp('https://api-cartilha.onrender.com/api/capitulos\\?populate=.*'),
    // Use a estratégia de cache-first
    new workbox.strategies.CacheFirst({
      cacheName: 'api-cache',
      plugins: [
        // Configura o cache para armazenar apenas respostas com status 200 (OK)
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [200],
        }),
      ],
    })
  );

// Define outras rotas para arquivos estáticos, como ícones e assets
workbox.routing.registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif|ico|css)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'static-cache',
  })
);

// Define a estratégia para o arquivo de manifest
workbox.routing.registerRoute(
  /manifest.json$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'manifest-cache',
  })
);

// Define a estratégia para outras rotas (página principal, etc.)
workbox.routing.registerRoute(
  ({ url }) => url.origin === self.location.origin,
  new workbox.strategies.StaleWhileRevalidate()
);
