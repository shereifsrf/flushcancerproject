import React from "react";
const urlH = process.env.SERVER_URL;
const envH = process.env.NODE_URL;
export default function AlertDialog(props) {
  let url = process.env.SERVER_URL;
  let env = process.env.NODE_URL;
  console.log({ magic: [url, urlH, env, envH] });
  return <></>;
}
