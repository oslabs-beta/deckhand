import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  showModal,
  addCluster,
  deleteCluster,
  addPod,
  deletePod,
  configurePod,
  addVarSet,
  addIngress,
  addVolume,
} from "../deckhandSlice";
import FloatLogo from "./floats/FloatLogo";
import FloatProject from "./floats/FloatProject";
import FloatAccount from "./floats/FloatAccount";
import Modals from "./modals/Modals";
import Icon from "@mdi/react";
import { mdiDotsVertical } from "@mdi/js";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";

const initialNodes = [
  {
    type: "input",
    id: "1",
    data: { label: "Testing" },
    position: { x: 100, y: 0 },
  },
  {
    id: "2",
    data: { label: "Another test" },
    position: { x: 0, y: 100 },
  },
  {
    id: "3",
    data: { label: "Hello world" },
    position: { x: 200, y: 100 },
  },
  {
    id: "4",
    data: { label: "More tests" },
    position: { x: 100, y: 200 },
  },
];

const initialEdges = [
  {
    id: "1->2",
    source: "1",
    target: "2",
    animated: true,
  },
  {
    id: "1->3",
    source: "1",
    target: "3",
    animated: true,
  },
  {
    id: "2->4",
    source: "2",
    target: "4",
    animated: true,
  },
  {
    id: "3->4",
    source: "3",
    target: "4",
    animated: true,
  },
];

export default function Project() {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();
  const project = state.projects.find((p) => p.projectId === state.projectId);
  const clusters = state.clusters?.filter(
    (cluster) => cluster.projectId === project.projectId
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="container">
      <FloatLogo />
      <FloatProject />
      <FloatAccount />
      <Modals />
      <div style={{ width: "100vw", height: "100vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          proOptions={{ hideAttribution: true }}
        >
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
