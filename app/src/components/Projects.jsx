import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProject } from "../deckhandSlice";
import logo from '../assets/logo.png';
import account from '../assets/account.png';

export default function Projects() {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();

  const handleClick = (id) => (e) => {
    e.preventDefault();
    dispatch(setProject((id)));
  };

  const projectBundle = [];
  for (const el of state.projectArr) {
    projectBundle.push(
      <div key={el.id} className="card" onClick={handleClick(el.id)}>
        <div className="name">{el.name}</div>
        <div className="date-info">
          Created: {el.created_date}<br />
          Last Modified: {el.modified_date}
        </div>
      </div>
    )
  }

  return <div className="container">
    <div className="logo">
      <img src={logo} alt="Deckhand" />
    </div>
    <div className="account">
      <span>{state.user.name}</span>
      <img src={account} alt="Account" />
    </div>
    <div className="content-container">
      <div className="content">
        <h1>Home</h1>
        <div id="project-cards">
          <div className="new-card">
            <div>New<br />Project</div>
          </div>
          {projectBundle}
        </div>
      </div>
    </div>
  </div>;
}