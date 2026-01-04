 // Registramos el service worker para PWA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").then(() => {
    console.log("Service Worker registrado para la PWA de cuentos.");
  });
}
