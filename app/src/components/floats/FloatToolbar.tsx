import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  const state = useSelector((state: any) => state.deckhand);
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
        aria-label="Drag on cluster"
      >
        <Icon path={mdiDotsHexagon} style={{ color: "red" }} size={1.25} />
        <br />
        <span>Cluster</span>
      </div>
      <div className="dropdown-separator" />
      <div
        className="float-toolbar-item"
        onDragStart={(event) => onDragStart(event, "pod")}
        draggable
        aria-label="Drag on pod"
      >
        <Icon path={mdiCircle} style={{ color: "#0db7ed" }} size={1.25} />
        <br />
        <span>Pod</span>
      </div>
      <div className="dropdown-separator" />
      <div
        className="float-toolbar-item"
        onDragStart={(event) => onDragStart(event, "variables")}
        draggable
        aria-label="Drag on variables"
      >
        <Icon path={mdiKeyVariant} style={{ color: "orange" }} size={1.25} />
        <br />
        <span>Variables</span>
      </div>
      <div
        className="float-toolbar-item"
        onDragStart={(event) => onDragStart(event, "ingress")}
        draggable
        aria-label="Drag on ingress"
      >
        <Icon path={mdiImport} style={{ color: "green" }} size={1.25} />
        <br />
        <span>Ingress</span>
      </div>
      <div
        className="float-toolbar-item"
        onDragStart={(event) => onDragStart(event, "volume")}
        draggable
        aria-label="Drag on volume"
      >
        <Icon path={mdiDatabase} style={{ color: "violet" }} size={1.25} />
        <br />
        <span>Volume</span>
      </div>
    </aside>
  );
}
