import React, { useEffect, useState } from "react";
import { cx, css } from "@emotion/css/macro";
import "@styles/App.scss";
import web3 from "../web3";
import mintConfigContract, {
  getBalance,
  getTotalMined,
  getAllCandidates,
  priceWei,
  mintRandom,
} from "../components/config";

const TO_GWEI = 10 ** 9;
const CONTRACT_ADDR = "0x3f39abfa131b595b7604324091ab3c348463d9c2";
function Create() {
  const config = mintConfigContract(CONTRACT_ADDR);

  getBalance(config);
  getTotalMined(config);
  getAllCandidates(config);
  priceWei(config);

  return (
    <div>
      <div>Hey</div>
      <button
        onClick={async () => {
          const accounts = await web3.eth.getAccounts();
          mintRandom(config, accounts[0]);
        }}
      >
        Mint
      </button>
    </div>
  );
}

const styles = {};

export default Create;
