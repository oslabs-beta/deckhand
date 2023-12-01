import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { /* reducers */ } from "../deckhandSlice";
import logo from '../assets/logo.png';
import account from '../assets/account.png';

export default function Deckhand() {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();

  return <div className="container">
    <div className="logo">
      <img src={logo} alt="Deckhand" />
    </div>
    <div className="account">
      <span>{state.user.name}</span>
      <img src={account} alt="Account" />
    </div>
    <div className="page-title">
      Example Project {state.project}
    </div>
    <div className="content-container">
      <div className="content">
        <h1>Cluster 1</h1>
        <div id="project-cards">
          <div className="new-card">
            <div>New<br />Pod</div>
          </div>
        </div>
      </div>
    </div>
  </div>;
}