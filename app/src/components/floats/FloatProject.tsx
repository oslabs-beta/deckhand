import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showModal } from "../../deckhandSlice";
import Icon from "@mdi/react";
import { mdiCogOutline } from "@mdi/js";

export default function FloatNav() {
  const state = useSelector((state: any) => state.deckhand);
  const dispatch = useDispatch<any>();
  const project = state.projects.find(
    (obj: any) => obj.projectId === state.projectId
  );

  return (
    <div className="active-project">
      {project.name}{" "}
      <div 
        onClick={() => dispatch(showModal({ name: "ConfigureProject", data: project }))}
        className="icon-container"
      >
        <Icon
          path={mdiCogOutline}
          size={0.75}
          className="icon"
        />
      </div>
    </div>
  );
}
