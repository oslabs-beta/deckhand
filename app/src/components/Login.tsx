import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {} from "../deckhandSlice";
import FloatLogo from "./floats/FloatLogo";

export default function Login() {
  const state = useSelector((state: any) => state.deckhand);
  const dispatch = useDispatch();

  return (
    <div id="login-container">
      <FloatLogo />
      <div className="image-section"></div>
      <div className="login-section">
        <div className="button-container">
          <div
            id="github-button"
            data-testid="github-button"
            onClick={() => {
              window.location.href = "/api/github/login";
            }}
          >
            Sign in with GitHub
          </div>
        </div>
      </div>
    </div>
  );
}
