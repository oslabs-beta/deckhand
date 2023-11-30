import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { /* reducers */ } from "../deckhandSlice";

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

  return <>
    <h1>Projects</h1>
    <div id="project-cards">
      {projectBundle}
    </div>
  </>;
}