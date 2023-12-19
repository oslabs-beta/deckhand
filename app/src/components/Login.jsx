import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../deckhandSlice";
import logo from "../assets/logo.png";

export default function Login() {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();

  return (
    <div id="login-container">
      <div className="image-section">
        <img src={logo} alt="Deckhand" />
      </div>
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
