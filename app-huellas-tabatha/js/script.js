 // Registramos el service worker para PWA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./sw.js", { scope: "./" })
    .then(() => console.log("SW registrado correctamente"))
    .catch(err => console.error("SW error:", err));
}

