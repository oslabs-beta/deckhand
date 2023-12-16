import React, { useEffect, useState, useCallback, useRef } from "react";
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
import FloatToolbar from "./floats/FloatToolbar";
import Modals from "./modals/Modals";
import Icon from "@mdi/react";
import { mdiDotsVertical } from "@mdi/js";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import ReactFlow, {
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import TextUpdaterNode from "./nodes/TextUpdaterNode";

const initialNodes = [
  // {
  //   id: "node-1",
  //   type: "textUpdater",
  //   position: { x: 0, y: 0 },
  //   data: { value: 123 },
  // },
];
const nodeTypes = { textUpdater: TextUpdaterNode };

export default function Project() {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();
  const project = state.projects.find((p) => p.projectId === state.projectId);
  const clusters = state.clusters?.filter(
    (cluster) => cluster.projectId === project.projectId
  );

  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: Math.floor(Math.random() * 10000).toString(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  return (
    <div className="container">
      <FloatLogo />
      <FloatProject />
      <FloatAccount />
      <Modals />
      <div style={{ width: "100vw", height: "100vh" }}>
        <ReactFlowProvider>
          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              proOptions={{ hideAttribution: true }}
            >
              <Controls position="bottom-right" />
              {/* <MiniMap /> */}
            </ReactFlow>
          </div>
          <FloatToolbar />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
