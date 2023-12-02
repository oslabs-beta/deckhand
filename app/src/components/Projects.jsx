import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProjectId } from "../deckhandSlice";
import FloatLogo from "./FloatLogo";
import FloatAccount from "./FloatAccount";

export default function Projects() {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();

  const handleClick = (id) => (e) => {
    e.preventDefault();
    dispatch(setProjectId(id));
  };

  const projectBundle = [];
  for (const el of state.projects) {
    projectBundle.push(
      <div key={el.id} className="card" onClick={handleClick(el.id)}>
        <div className="name">{el.name}</div>
        <div className="date-info">
          Created: {el.created_date}
          <br />
          Last Modified: {el.modified_date}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <FloatLogo />
      <FloatAccount />
      <div className="content-container">
        <div className="content">
          <h1>Home</h1>
          <div id="project-cards">
            <div className="new-card">
              <div>
                New
                <br />
                Project
              </div>
            </div>
            {projectBundle}
          </div>
        </div>
      </div>
    </div>
  );
}
