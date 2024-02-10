import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showModal } from "../../deckhandSlice";
import Icon from "@mdi/react";
import { mdiCogOutline } from "@mdi/js";

export default function FloatNav() {
  // @ts-expect-error TS(2571) FIXME: Object is of type 'unknown'.
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();
  const project = state.projects.find(
    (obj: any) => obj.projectId === state.projectId
  );

  return (
    <div className="active-project">
      {project.name}{" "}
      <Icon
        path={mdiCogOutline}
        size={0.75}
        className="icon"
        // @ts-expect-error TS(2322) FIXME: Type '{ path: string; size: number; className: str... Remove this comment to see the full error message
        onClick={() => {
          dispatch(showModal({ name: "ConfigureProject", data: project }));
        }}
      />
    </div>
  );
}
