import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showModal } from "../../deckhandSlice";
import Icon from "@mdi/react";
import { mdiCogOutline } from "@mdi/js";

export default function FloatNav() {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();
  const project = state.projects.find(
    (obj) => obj.projectId === state.projectId
  );

  return (
    <div className="active-project">
      {project.name}{" "}
      <Icon
        path={mdiCogOutline}
        size={0.75}
        className="icon"
        onClick={() => {
          dispatch(showModal({ name: "ConfigureProject", data: project }));
        }}
      />
    </div>
  );
}
