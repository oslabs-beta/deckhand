import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { /* reducers */ } "../deckhandSlice";

export default function FloatActiveProject() {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();
  const project = state.projects.find((obj) => obj.id === state.projectId);

  return <div className="active-project">{project.name}</div>;
}
