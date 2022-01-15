import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import qs from "qs";
import { linkDiscordUser, linkDiscordServer } from "../utils/users_api";

export function DiscordUserCallback() {
  const location = useLocation();
  const query = qs.parse(location.search.substring(1));
  const { code, guild_id } = query;
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    linkDiscordUser(code as string, guild_id as string).then((status) => {
      setSuccess(status);
    });
  }, [code, guild_id]);

  return (
    <>
      <h2>Hello!</h2>
      <p>Have you successfully linked? {success ? "yes" : "no"}</p>
    </>
  );
}

export function DiscordServerCallback() {
  const location = useLocation();
  const query = qs.parse(location.search.substring(1));
  const { code, guild_id } = query;
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    linkDiscordServer(code as string, guild_id as string).then((status) => {
      setSuccess(status);
    });
  }, [code, guild_id]);

  return (
    <>
      <h2>Hello!</h2>
      <p>Have you successfully linked? {success ? "yes" : "no"}</p>
    </>
  );
}
