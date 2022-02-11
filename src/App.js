import "./App.css";
import { useState } from "react";
var CryptoJS = require("crypto-js");

function App() {
  const state = {
    button: 1
  };

  var type = "card";
  var successful = "";
  var failure = "";

  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [reference, setReference] = useState("");
  const [message, setMessage] = useState("");

  let handleSubmit = async (e) => {
    e.preventDefault();
    if (state.button === 1) {
      console.log("Button 1 clicked!");
    }
    if (state.button === 2) {
      type = "giropay";
      successful = "http://localhost/success";
      failure = "http://localhost/failure";
      console.log("Button 2 clicked!");
    }
    try {

      var key = CryptoJS.enc.Utf8.parse('8080808080808080');
      var iv = CryptoJS.enc.Utf8.parse('8080808080808080');

      var encryptedCardNumber = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(cardNumber), key,
        {
          keySize: 128 / 8,
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        });

      let res = await fetch("http://localhost:5036/payment", {
        method: "POST",
        headers: new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Origin': '',
        }),
        body: JSON.stringify({
          type: type,
          encryptedCardNumber: encryptedCardNumber.toString(),
          cardExpiryMonth: expiryMonth,
          cardExpiryYear: expiryYear,
          cvv: cvv,
          amount: amount,
          currency: currency,
          orderRef: reference,
          purpose: "Tshirts", // Hardcoded since only one item is present
          success_url: successful,
          failure_url: failure
        }),
      });
      let resJson = await res.json();
      if (res.status === 200) {
        setCardNumber("");
        setExpiryMonth("");
        setExpiryYear("");
        setCvv("");
        setAmount("");
        setCurrency("");
        setReference("");
        setMessage("Payment successful");
      } else {
        setMessage(resJson);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App">



<div class="CartContainer">
   	   <div class="Header">
   	   	<h3 class="Heading">Shopping Cart</h3>
   	   </div>

   	   <div class="Cart-Items">
   	   	  <div class="image-box">
   	   	  	<img src="https://cdn.pixabay.com/photo/2016/12/06/09/30/blank-1886001__340.png" />
   	   	  </div>
   	   	  <div class="about">
   	   	  	<h1 class="title">Tshirt</h1>
   	   	  	<h3 class="subtitle">Large</h3>
   	   	  	{/* <img src="./images/download.jpg"/> */}
   	   	  </div>
   	   </div>
   </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={cardNumber}
          placeholder="CardNumber"
          onChange={(e) => setCardNumber(e.target.value)}
        />
        <input
          type="text"
          value={expiryMonth}
          placeholder="Expiry Month"
          onChange={(e) => setExpiryMonth(e.target.value)}
        />
        <input
          type="text"
          value={expiryYear}
          placeholder="Expiry Year"
          onChange={(e) => setExpiryYear(e.target.value)}
        />
        <input
          type="text"
          value={cvv}
          placeholder="Cvv"
          onChange={(e) => setCvv(e.target.value)}
        />
        <input
          type="text"
          value={amount}
          placeholder="Amount"
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="text"
          value={currency}
          placeholder="Currency"
          onChange={(e) => setCurrency(e.target.value)}
        />
        <input
          type="text"
          value={reference}
          placeholder="Reference"
          onChange={(e) => setReference(e.target.value)}
        />

        <button
          onClick={() => (state.button = 1)}
          type="submit"
          name="btn1"
          value="card"
        >
          Card
        </button>

        <button
          onClick={() => (state.button = 2)}
          type="submit"
          name="btn2"
          value="giropay"
        >
          Giropay
        </button>

        <div className="message">{message ? <p>{message}</p> : null}</div>
      </form>
    </div>
  );
}

export default App;