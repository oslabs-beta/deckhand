import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProjectId, addProject, deleteProject } from "../deckhandSlice";
import FloatLogo from "./floats/FloatLogo";
import FloatAccount from "./floats/FloatAccount";

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

  const timeAgo = (date) => {
    const minutes = (new Date() - new Date(date)) / (1000 * 60);
    const hours = minutes / 60;
    const days = hours / 24;
    if (Math.round(minutes) === 1) return "1 minute ago";
    else if (minutes < 60) return Math.round(minutes) + " minutes ago";
    else if (Math.round(hours) === 1) return "1 hour ago";
    else if (hours < 24) return Math.round(hours) + " hours ago";
    else if (Math.round(days) < 1.5) return "1 day ago";
    else return Math.round(days) + " days ago";
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
        <div
          className="date-info"
          title={"Created: " + new Date(el.createdDate).toString()}
        >
          Created: {timeAgo(el.createdDate)}
        </div>
        <div
          className="date-info"
          title={"Last Modified: " + new Date(el.modifiedDate).toString()}
        >
          Last Modified: {timeAgo(el.modifiedDate)}
        </div>
        <br />
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
