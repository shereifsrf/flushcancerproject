import React from "react";

export default function AlertDialog(props) {
  const mode = process.env.NODE_ENV;
  const url = process.env.REACT_APP_SERVER_URL;
  const urlL = process.env.REACT_APP_LOCAL_URL;
  return (
    <>
      {mode}
      <br /> {url}
      <br /> {urlL}
    </>
  );
}
