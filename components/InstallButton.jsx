import React, { useState, useEffect } from 'react';

function InstallButton() {
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    });
  }, []);
    
  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Usuário aceitou a instalação');
        } else {
          console.log('Usuário recusou a instalação');
        }
        setDeferredPrompt(null);
      });
    }
  };
    return (
      <>           
        {showInstallButton && (
          <div>
            <button id='btn-instalar' className='btn' onClick={handleInstallClick}>
              Instalar
            </button>
          </div>
        )}       
      </>
    );
}

export default InstallButton;