"use client";

import { ChangeEvent, useEffect, useState } from "react";

export default function Home() {
  const [quantity, setQuantity] = useState<number>(1);
  const [wallet, setWallet] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const wallet: string | null = localStorage.getItem("wallet");

    if (wallet) {
      setMessage(wallet);
    }
  }, []);

  function btnLoginClick() {
    alert("login");
    setMessage("Login...");
    setWallet("0x123");
    localStorage.setItem("wallet", "0x123");
    setMessage("");
  }

  function btnLogoutClick() {
    alert("logout");
    setMessage("Logout...");
    setWallet("");
    localStorage.removeItem("wallet");
    setMessage("");
  }

  function btnMintClick() {
    alert("mint");
    setMessage("Minting...");
    setQuantity(1);
  }

  function onChangeQuantity(evt: ChangeEvent<HTMLInputElement>) {
    const quantity: number = parseInt(evt.target.value);

    if (quantity > 5) {
      setQuantity(5);
    } else {
      setQuantity(quantity);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1>Mint Page</h1>
        <p>
          {!wallet ? (
            <button id="btnLogin" onClick={btnLoginClick}>
              Login
            </button>
          ) : (
            <>
              <a href={`${process.env.OPENSEA_URL}/${wallet}`}>{wallet}</a>
              <button id="btnLogout" onClick={btnLogoutClick}>
                Logout
              </button>
            </>
          )}
        </p>

        {wallet ? (
          <>
            <p>
              <label>
                Quantity:
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={onChangeQuantity}
                />
              </label>
            </p>
            <p>
              <button id="btnMint" onClick={btnMintClick}>
                Mint
              </button>
            </p>
          </>
        ) : (
          <></>
        )}
        <p>{message}</p>
      </div>
    </main>
  );
}
