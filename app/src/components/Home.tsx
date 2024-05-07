import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
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
import Transition from "./Transition";
import { motion, animate, stagger } from 'framer-motion';

export default function Home() {
  const state = useSelector((state: any) => state.deckhand);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect (() => {
    animate(".card", { opacity: 1, x: 0, y: 0 }, { duration: 0.25, delay: stagger(0.1) })
  }, [])

  function generateUniqueProjectId() {
    let uniqueId: any;
    do {
      uniqueId = Math.floor(Math.random() * 1000000).toString();
    } while (state.projects.some((project: any) => project.projectId === uniqueId));
    return uniqueId;
  }

  const handleClickAddProject = (event: any) => {
    const projectId = generateUniqueProjectId();
    dispatch(addProject(projectId));
    dispatch(setProjectId(projectId));
    navigate(`/project/${projectId}`)
  };

  const timeAgo = (date: any) => {
    const minutes = (new Date().getTime() - new Date(date).getTime()) / (1000 * 60);
    const hours = minutes / 60;
    const days = hours / 24;
    if (Math.round(minutes) === 1) return "1 minute ago";
    else if (minutes < 60) return Math.round(minutes) + " minutes ago";
    else if (Math.round(hours) === 1) return "1 hour ago";
    else if (hours < 24) return Math.round(hours) + " hours ago";
    else if (Math.round(days) < 1.5) return "1 day ago";
    else return Math.round(days) + " days ago";
  };

  const projectBundle: any = [];
  const sortedProjects = [...state.projects].sort((a, b) => {
    const dateA: any = new Date(a.modifiedDate);
    const dateB: any = new Date(b.modifiedDate);
    return dateB - dateA;
  });
  for (const project of sortedProjects) {
    projectBundle.push(
      <motion.div
        initial={{opacity: 0, x:50, y: 50}}
        key={project.projectId}
        className="card"
        onClick={() => {
          dispatch(setProjectId(project.projectId))
          navigate(`/project/${project.projectId}`)
        }}
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
      </motion.div>
    );
  }

  return (
    <Transition>
    <div className="container">
      <FloatLogo />
      <FloatAccount />
      <Modals />
      <div className="content-container">
        <div className="content">
          <h1>Home</h1>
          <div id="project-cards">
              <motion.div
                key="new-project"
                initial={{opacity: 0, x: 50, y: 50}}
                className="card"
                onClick={handleClickAddProject}>
              <div className="new-project">
                New
                <br />
                Project
              </div>
            </motion.div>
            {projectBundle}
          </div>
        </div>
      </div>
      </div>
    </Transition>
  );
}
