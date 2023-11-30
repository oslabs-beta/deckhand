import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../deckhandSlice";
import logo from '../assets/logo.png';

export default function Login() {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();

  const handleClick = (event) => {
    event.preventDefault();
    const user = {
      name: 'John', // get from Github
    };
    dispatch(setUser(user));
  };

  return (
    <div id="login-container">
      <div className="image-section">
        <img src={logo} alt="Deckhand" />
      </div>
      <div className="login-section">
        <div className="button-container">
          <button id="github-button" onClick={handleClick}>
          Sign in with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}