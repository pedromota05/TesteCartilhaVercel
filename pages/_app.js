// Importação dos CSS
import '../styles/globals.css'
import '../styles/custom.css'
import '../styles/capitulos.css'

//Impotação do Framework Bootstrap
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'mdb-ui-kit/css/mdb.min.css'
import { useEffect } from 'react';


//Importação dos Icones
import '@fortawesome/fontawesome-free/css/all.min.css'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registrado com sucesso:', registration);
        })
        .catch(error => {
          console.error('Erro ao registrar o Service Worker:', error);
        });
    }
  }, []);
  return <Component {...pageProps} />
}

export default MyApp
