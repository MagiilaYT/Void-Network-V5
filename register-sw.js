const stockSW = "/worker.js";
const swAllowedHostnames = ["localhost", "127.0.0.1"];

async function registerSW() {
  if (location.protocol !== "https:" && !swAllowedHostnames.includes(location.hostname)) {
    throw new Error("Service workers cannot be registered without https.");
  }

  if (!navigator.serviceWorker) {
    throw new Error("Your browser doesn't support service workers.");
  }

  const reg = await navigator.serviceWorker.register(stockSW, {
    scope: __uv$config.prefix,
    updateViaCache: "none"
  });

  if (reg.installing) {
    await new Promise((resolve, reject) => {
      reg.installing.addEventListener('statechange', e => {
        if (e.target.state === 'activated') resolve();
        else if (e.target.state === 'redundant') reject(new Error('Service worker became redundant'));
      });
    });
  }

  await navigator.serviceWorker.ready;
}
