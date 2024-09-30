import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";

const token = new URL(window.location.href).searchParams.get("token");
const logDiv = document.getElementById("log");
console.log("token:", token);
const verifyButton = document.getElementById("verify-btn");
verifyButton.addEventListener("click", handleVerify, false);

async function verify() {
  if (!token) {
    console.warn(
      "Oh great, another user trying to verify without a token. Let's just print some error messages and see if they notice🙄"
    );
    logDiv.style.color = "#ffc107"; // visisble yellow
    logDiv.innerHTML = "⚠ No JWT token provided. Please use the link provided by DisGuard Bot";
    return;
  }

  if (!window.ethereum) {
    logDiv.style.color = "#ffc107";
    logDiv.innerHTML = "⚠ Please use a Web3 browser like MetaMask to connect your wallet";
    return;
  }

  try {
    const [address] = await window.ethereum.request({
      method: "eth_requestAccounts"
    });

    document.getElementById("address").innerHTML = `Your wallet address: <strong>${address}</strong>`;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const message = [
      "Welcome to DisGuard Portal. This site is requesting your signature to approve login authorization!",
      "Click to sign in and accept the terms and conditions (https://example.org/) of this app.",
      "This request will not trigger a blockchain transaction or cost any gas fees.",
      `Wallet Address: ${address}`,
      `Timestamp: ${new Date().toISOString()}`,
      `Id: ${Math.random().toString(36).slice(-10)}`
    ].join("\n\n");

    const signature = await signer.signMessage(message);

    logDiv.innerHTML = "ⓘ Please wait while we authorize your request... We've sent out our highly trained monkeys to get the job done. They're currently working on it, so just sit back and relax for a moment! 🐒🍌";

    const data = { token, address, message, signature };
    const response = await fetch("/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      logDiv.style.color = "green";
      logDiv.innerHTML = "✔ Verification successful! You can now close this tab and return to Discord.";
      return;
    }

    const result = await response.json();

    if (result.code === "ok" && result.message === "Success") {
      logDiv.style.color = "green";
      logDiv.innerHTML = "✔ Verification successful! You can now close this tab and return to Discord.";
    } else {
      logDiv.style.color = "red";
      logDiv.innerHTML = `⮾ Verification failed! ${result.message}`;
    }
  } catch (err) {
    console.error("Failed to verify wallet:", err);
    const truncatedErrorMessage = err.message.length > 95 ? err.message.substring(0, 95) + "..." : err.message;
    logDiv.style.color = "red";
    logDiv.innerHTML = `⮾ Something went wrong! ${truncatedErrorMessage}`;
  }
}

function handleVerify() {
  logDiv.style.color = "#333";
  logDiv.innerHTML = "ⓘ Please wait while we verify your wallet...";
  verifyButton.disabled = true;
  verifyButton.innerHTML = "🛡️ Verifying...";
  verify().finally(() => {
    verifyButton.disabled = false;
    verifyButton.innerHTML = "🛡️ Verify Wallet";
  });
}
