import React, { useEffect, useState } from "react";
import { cx, css } from "@emotion/css/macro";
import "styles/App.scss";
import mintConfigContract from "./components/config";
import machine from "./components/machine";
import MetaMaskButton from "scripts/MetaMaskButton";
import web3 from "./web3";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DndFileUploader from "@lib/inputs/DndFileUploader";
import CreateCollection from "scripts/CreateCollection";
import PreviewCollection from "scripts/PreviewCollection";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

const GraphQLClient = new ApolloClient({
  uri: "https://48p1r2roz4.sse.codesandbox.io",
  cache: new InMemoryCache(),
});

const TO_GWEI = 10 ** 9;
const CONTRACT_ADDR = "0x75b925f04697c16561570d0cf8dbb516bb576aae";

function App() {
  const config = mintConfigContract(CONTRACT_ADDR);
  const [val, setVal] = useState<string[]>([]);
  const [newVal, setNewVal] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [price, setPrice] = useState<number>(0);

  const mintRandom = async () => {
    const priceWei = await config.methods.priceWei().call();
    const accounts = await web3.eth.getAccounts();
    try {
      const v = await config.methods.mintRandom().send({
        from: accounts[0],
        value: web3.utils.toBN(priceWei),
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
    <ApolloProvider client={GraphQLClient}>
      <DndProvider backend={HTML5Backend}>
        <div className={cx("App", styles.container)}>
          <div>
            <MetaMaskButton />
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

          <div className="container">
            <CreateCollection />
            <PreviewCollection />
          </div>
        </div>
      </DndProvider>
    </ApolloProvider>
  );
}

const styles = {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
};

export default App;
