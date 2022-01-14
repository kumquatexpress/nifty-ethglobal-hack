import React, { useEffect, useState } from "react";
import config from "./components/config";
import machine from "./components/machine";
import web3 from "./web3";
import "./App.css";

const TO_GWEI = 10 ** 9;

function App() {
  const [val, setVal] = useState<string[]>([]);
  const [newVal, setNewVal] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [price, setPrice] = useState<number>(0);

  const mintRandom = async () => {
    const accounts = await web3.eth.getAccounts();
    try {
      const v = await config.methods.mintRandom().send({
        from: accounts[0],
        value: web3.utils.toWei(web3.utils.toBN(0.05 * TO_GWEI), "gwei"),
      });
      console.log("random", v);
      const { sender, url, tokenId } = v.events.Mint.returnValues;
      console.log("sender", sender);
      console.log("url", url);
      console.log("tokenId", tokenId);
    } catch (e) {
      console.log("err", e);
    }
  };
  const setConfigValue = async () => {
    const accounts = await web3.eth.getAccounts();
    try {
      await config.methods.addBatch([newVal]).send({
        from: accounts[0],
      });
      const v = await config.methods.getAll().call();
      setVal(v);
    } catch (e) {
      console.log("err", e);
    }
  };
  const createConfig = async () => {
    const ts = Math.floor(Number(Date.now() / 1000) + 5000);
    const accounts = await web3.eth.getAccounts();
    const priceWei = web3.utils.toWei(web3.utils.toBN(price * TO_GWEI), "gwei");
    const c = await machine.methods
      .create(name, symbol, priceWei, ts, [], [], [])
      .send({
        from: accounts[0],
      });
    console.log("c", c);
  };
  useEffect(() => {
    config.methods
      .candidates(0)
      .call()
      .then((v: string[]) => {
        console.log("asdf", v);
        setVal(v);
      });
  }, []);

  const something = async () => {
    const result = await config.methods.priceWei().call();
    console.log("result", result);
  };

  return (
    <div className="App">
      <div>Hey {val}</div>
      <label>URL</label>
      <input
        type="text"
        defaultValue={newVal}
        onChange={(e) => setNewVal(e.target.value)}
      ></input>
      <button onClick={() => setConfigValue()}>Click me</button>
      <button onClick={() => mintRandom()}>Mint</button>
      <label>Name</label>
      <input
        type="text"
        defaultValue={name}
        onChange={(e) => setName(e.target.value)}
      ></input>
      <label>Symbol</label>
      <input
        type="text"
        defaultValue={symbol}
        onChange={(e) => setSymbol(e.target.value)}
      ></input>
      <label>Price</label>
      <input
        type="text"
        defaultValue={price}
        onChange={(e) => setPrice(Number(e.target.value))}
      ></input>
      <button onClick={() => createConfig()}>Create</button>

      <button onClick={() => something()}>Do something</button>
    </div>
  );
}

export default App;
