import React from "react";
import { useParams } from "react-router-dom";

export default function UserVerification() {
  const { refreshToken } = useParams();
  return <div>user-verify page token: {refreshToken || "asdasd"}</div>;
}
