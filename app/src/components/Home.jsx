import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProjectId, addProject, deleteProject } from "../deckhandSlice";
import FloatLogo from "./FloatLogo";
import FloatAccount from "./FloatAccount";

export default function Home() {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();

  const handleClickAddProject = (event) => {
    // fetch data
    const data = {
      id: state.projects.length + 1, // get from SQL once connected
      createdDate: "Dec 4, 2023",
      modifiedDate: "Dec 4, 2023",
    };
    dispatch(addProject(data));
    dispatch(setProjectId(data.id));
  };

  const projectBundle = [];
  for (const el of [...state.projects].reverse()) {
    projectBundle.push(
      <div
        key={el.id}
        className="card"
        onClick={() => dispatch(setProjectId(el.id))}
      >
        <div className="name">{el.name}</div>
        <div className="date-info">
          Created: {el.createdDate}
          <br />
          Last Modified: {el.modifiedDate}
          <br />
          <br />
        </div>
        <button
          className="delete"
          onClick={(e) => {
            dispatch(deleteProject(el.id));
            e.stopPropagation();
          }}
        >
          Delete Project
        </button>
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
            <div className="card" onClick={handleClickAddProject}>
              <div className="new-project">
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
