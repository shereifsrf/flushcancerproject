import React from "react";

const mode = process.env.NODE_ENV;
const url = process.env.SERVER_URL;
const urlL = process.env.LOCAL_URL;

export default function AlertDialog(props) {
  return (
    <>
      {mode} <br /> {url}
    </>
  );
}
