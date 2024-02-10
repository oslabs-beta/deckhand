import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleLayout } from "../../deckhandSlice";
import Icon from "@mdi/react";
import {
  mdiDotsHexagon,
  mdiCircle,
  mdiPackageVariantClosed,
  mdiKeyVariant,
  mdiImport,
  mdiDatabase,
} from "@mdi/js";

export default function FloatNav() {
  // @ts-expect-error TS(2571) FIXME: Object is of type 'unknown'.
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();
  const project = state.projects.find(
    (project: any) => project.projectId === state.projectId
  );

  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="float-toolbar">
      <div
        className="float-toolbar-item"
        onDragStart={(event) => onDragStart(event, "cluster")}
        draggable
      >
        <Icon path={mdiDotsHexagon} style={{ color: "red" }} size={1} />
        <br />
        <b>Cluster</b>
      </div>
      <div className="dropdown-separator" />
      <div
        className="float-toolbar-item"
        onDragStart={(event) => onDragStart(event, "pod")}
        draggable
      >
        <Icon path={mdiCircle} style={{ color: "#0db7ed" }} size={1} />
        <br />
        <b>Pod</b>
      </div>
      <div className="dropdown-separator" />
      <div
        className="float-toolbar-item"
        onDragStart={(event) => onDragStart(event, "variables")}
        draggable
      >
        <Icon path={mdiKeyVariant} style={{ color: "orange" }} size={1} />
        <br />
        <b>Variables</b>
      </div>
      <div
        className="float-toolbar-item"
        onDragStart={(event) => onDragStart(event, "ingress")}
        draggable
      >
        <Icon path={mdiImport} style={{ color: "green" }} size={1} />
        <br />
        <b>Ingress</b>
      </div>
      <div
        className="float-toolbar-item"
        onDragStart={(event) => onDragStart(event, "volume")}
        draggable
      >
        <Icon path={mdiDatabase} style={{ color: "violet" }} size={1} />
        <br />
        <b>Volume</b>
      </div>
    </aside>
  );
}
