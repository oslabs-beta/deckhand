import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleLayout } from "../../deckhandSlice";

export default function FloatNav() {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();
  const project = state.projects.find(
    (project) => project.projectId === state.projectId
  );

  return (
    <div className="dev">
      <b>Dev Tools:</b>
      <button name="layout" onClick={() => dispatch(toggleLayout())}>
        Toggle Layout
      </button>
    </div>
  );
}
