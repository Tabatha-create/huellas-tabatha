
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/app-huellas-tabatha/sw-v2.js', { scope: './' })
    .then(reg => console.log('Service Worker registrado con scope:', reg.scope))
    .catch(err => console.error('Error al registrar SW:', err));
}

