import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser, setState, setAuthStatus } from "../deckhandSlice";
import Icon from "@mdi/react";
import { mdiGithub } from "@mdi/js";
const logo = require("../assets/logo.svg");
import Transition from "./Transition";

export default function Login() {
  const state = useSelector((state: any) => state.deckhand);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <Transition>
    <div id="login-container">
      <div className="image-section"></div>
      <div className="login-section">
        <div className="login-header">
          <img alt="logo" src={logo} height="60" />
          <span>Deckhand</span>
        </div>
        <div className="login-content">
          <h1>All aboard.</h1>
          <span>Sign in with your GitHub account to begin.</span>
          <div
            id="github-button"
            data-testid="github-button"
            onClick={() => {
              window.location.href = "/api/github/login";
            }}
          >
            <Icon path={mdiGithub} style={{ color: "white", position: 'absolute', left: '15px' }} size={1} />Sign in with GitHub
          </div>
          <p className="or">or</p>
          <div
            id="create-github-button"
            data-testid="create-github-button"
            onClick={() => {
              window.location.href = "https://github.com/signup";
            }}
          >
            <Icon path={mdiGithub} style={{ color: "#333", position: 'absolute', left: '15px' }} size={1} />Create GitHub Account
          </div>
        </div>
        <div className="login-footer">
          <span>Copyright © 2024 Deckhand</span>
          <span><a href="https://deckhand.dev/privacy" target="_blank" rel="noopener">Privacy Policy</a> | <a href="https://deckhand.dev/terms" target="_blank" rel="noopener">Terms of Service</a></span>
        </div>
      </div>
      </div>
      </Transition>
  );
}
