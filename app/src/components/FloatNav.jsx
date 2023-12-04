import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { /* reducers */ } "../deckhandSlice";
import Icon from "@mdi/react";
import { mdiChevronDown } from "@mdi/js";

export default function FloatNav() {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();
  const project = state.projects.find((obj) => obj.id === state.projectId);

  return (
    <div className="active-project">
      {project.name} <Icon path={mdiChevronDown} size={1} />
    </div>
  );
}
