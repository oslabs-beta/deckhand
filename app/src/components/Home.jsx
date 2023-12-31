import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setProjectId,
  addProject,
  deleteProject,
  showModal,
} from "../deckhandSlice";
import FloatLogo from "./floats/FloatLogo";
import FloatAccount from "./floats/FloatAccount";
import Modals from "./modals/Modals";
import Icon from "@mdi/react";
import { mdiDotsVertical } from "@mdi/js";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function Home() {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();

  function generateUniqueProjectId() {
    let uniqueId;
    do {
      uniqueId = Math.floor(Math.random() * 1000000).toString();
    } while (state.projects.some((project) => project.projectId === uniqueId));
    return uniqueId;
  }

  const handleClickAddProject = (event) => {
    const projectId = generateUniqueProjectId();
    dispatch(addProject(projectId));
    dispatch(setProjectId(projectId));
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
  const sortedProjects = [...state.projects].sort((a, b) => {
    const dateA = new Date(a.modifiedDate);
    const dateB = new Date(b.modifiedDate);
    return dateB - dateA;
  });
  for (const project of sortedProjects) {
    projectBundle.push(
      <div
        key={project.projectId}
        className="card"
        onClick={() => dispatch(setProjectId(project.projectId))}
      >
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="card-menu" aria-label="Customise options">
              <Icon path={mdiDotsVertical} size={1} />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="dropdown"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenu.Item
                className="dropdown-item"
                onClick={() => {
                  dispatch(
                    showModal({ name: "ConfigureProject", data: project })
                  );
                }}
              >
                Configure
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="dropdown-separator" />
              <DropdownMenu.Item
                className="dropdown-item"
                onClick={() => dispatch(deleteProject(project.projectId))}
              >
                Delete
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        <div className="name">{project.name}</div>
        <div
          className="date-info"
          title={"Created: " + new Date(project.createdDate).toString()}
        >
          Created: {timeAgo(project.createdDate)}
        </div>
        <div
          className="date-info"
          title={"Last Modified: " + new Date(project.modifiedDate).toString()}
        >
          Last Modified: {timeAgo(project.modifiedDate)}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <FloatLogo />
      <FloatAccount />
      <Modals />
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
