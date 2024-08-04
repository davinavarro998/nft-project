"use client";

import { ChangeEvent, useEffect, useState } from "react"; 
import { login, mint } from "@/services/Web3Service";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

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
    login()
      .then((wallet) => {
        setMessage("Login...");
        setWallet(wallet);
        localStorage.setItem("wallet", wallet);
        setMessage("");
      })
      .catch((err) => {
        setMessage(err.message);
      });
  }

  function btnLogoutClick() {
    alert("logout");
    setMessage("Logout...");
    setWallet("");
    localStorage.removeItem("wallet");
    setMessage("");
  }

  function btnMintClick() {
    setMessage("Minting...");
    mint(quantity)
      .then((tx) => {
        setMessage("Tx ID" + (tx || "error"));
        setQuantity(1);
      })
      .catch((err) => {
        setMessage(err.message);
      });
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
    <main className="d-flex flex-column align-items-center justify-content-center min-vh-100 p-4">
      <div className="card p-4 w-100" style={{ maxWidth: "500px" }}>
        <h1 className="text-center mb-4">Mint Page</h1>
        <p className="text-center">
          {!wallet ? (
            <button id="btnLogin" className="btn btn-primary" onClick={btnLoginClick}>
              Login
            </button>
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-center">
                <a
                  href={`${process.env.OPENSEA_URL}/${wallet}`}
                  className="text-truncate text-dark"
                  style={{ maxWidth: "70%", textDecoration: "none" }}
                >
                  {wallet}
                </a>
                <button id="btnLogout" className="btn btn-outline-secondary ms-2" onClick={btnLogoutClick}>
                  Logout
                </button>
              </div>
            </>
          )}
        </p>

        {wallet ? (
          <>
            <p className="form-group">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                className="form-control"
                value={quantity}
                onChange={onChangeQuantity}
                max={5}
                min={1}
              />
            </p>
            <p className="text-center">
              <button id="btnMint" className="btn btn-success" onClick={btnMintClick}>
                Mint
              </button>
            </p>
          </>
        ) : null}
        <p className="text-center text-muted mt-3">{message}</p>
      </div>
    </main>
  );
}
