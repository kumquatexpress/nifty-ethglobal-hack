import React, { useEffect, useState } from "react";
import { cx, css } from "@emotion/css/macro";
import "@styles/App.scss";
import MetaMaskButton from "@scripts/MetaMaskButton";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Create from "./pages/Create";
import Home from "./pages/Home";
import All from "./pages/All";
import Test from "./pages/Test";
import Mint from "./pages/Mint";
import Livestream from "./pages/Livestream";
import Stash from "./pages/Stash";
import { DiscordServerCallback, DiscordUserCallback } from "./pages/Discord";
import Header from "@scripts/Header";

import { ApolloProvider } from "@apollo/client";
import GraphQLClient from "@graphql/GraphQLClient";
import { Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <ApolloProvider client={GraphQLClient}>
      <DndProvider backend={HTML5Backend}>
        <div className={cx("App", styles.container)}>
          <Header>
            <MetaMaskButton />
          </Header>
          <div className="container badger-page">
            <Routes>
              <Route path="/" element={<All />} />
              <Route path="/me" element={<Home />} />
              <Route path="/test" element={<Test />} />
              <Route path="collection/create" element={<Create />} />
              <Route path="collection/:id/mint" element={<Mint />} />
              <Route
                path="/discord/callback"
                element={<DiscordServerCallback />}
              />
              <Route
                path="/discord/user/auth"
                element={<DiscordUserCallback />}
              />
              <Route path="/livestream/:streamId" element={<Livestream />} />
              <Route path="/stash" element={<Stash />} />
            </Routes>
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
