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
const CONTRACT_ADDR = "0xba868e58d1a082135fe5fdb59b01254853224b4f";
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
