const localtunnel = require("localtunnel")

const startTunnel = async () => {
  const tunnel = await localtunnel({
    port: 3000,
    subdomain: "kabirsh",
  });

  console.log(`Tunnel started at: ${tunnel.url}`);

  tunnel.on("close", () => {
    console.log("Tunnel closed. Restarting...");
    setTimeout(startTunnel, 1000);
  });

  tunnel.on("error", (err) => {
    console.error("Tunnel error:", err);
    setTimeout(startTunnel, 1000);
  });
};

startTunnel();
