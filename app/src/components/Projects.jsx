import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { /* reducers */ } from "../deckhandSlice";
import logo from '../assets/logo.png';
import account from '../assets/account.png';

export default function Projects() {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();

  const projectBundle = [];
  for (const el of state.projectArr) {
    projectBundle.push(
      <div key={el.id} class="card">
        <div class="name">{el.name}</div>
        <div class="date-info">
          Created: {el.created_date}<br />
          Last Modified: {el.modified_date}
        </div>
      </div>
    )
  }

  return <div className="container">
    <div class="top-bar">
      <div class="logo">
        <img src={logo} alt="Deckhand" />
      </div>
      <div class="account">
        <span>{state.user.name}</span>
        <img src={account} alt="Account" />
      </div>
    </div>
    <div className="content">
      <h1>Home</h1>
      <div id="project-cards">
        <div className="new-card">
          <div>New<br />Project</div>
        </div>
        {projectBundle}
      </div>
    </div>
  </div>;
}