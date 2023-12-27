import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  showModal,
  addNode,
  deleteNode,
  updateNode,
  addNewEdge,
  deleteEdge,
  updateEdge,
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
import ClusterNode from "./nodes/ClusterNode";
import PodNode from "./nodes/PodNode";
import GithubNode from "./nodes/GithubNode";
import DockerNode from "./nodes/DockerNode";
import VariablesNode from "./nodes/VariablesNode";
import IngressNode from "./nodes/IngressNode";
import VolumeNode from "./nodes/VolumeNode";

const nodeTypes = {
  cluster: ClusterNode,
  pod: PodNode,
  github: GithubNode,
  docker: DockerNode,
  variables: VariablesNode,
  ingress: IngressNode,
  volume: VolumeNode,
};

export default function Canvas() {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();

  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  useEffect(() => {
    const projectNodes = state.nodes.filter(
      (nds) => nds.projectId === state.projectId
    );
    const projectEdges = state.edges.filter(
      (eds) => eds.projectId === state.projectId
    );
    setNodes(projectNodes);
    setEdges(projectEdges);
  }, [state.nodes, state.edges, setNodes, setEdges]);

  const onConnect = useCallback((params) => {
    // setEdges((eds) => addEdge(params, eds)), [];
    const id = `${params.source}-${params.target}`;
    const deletable = false;
    const projectId = state.projectId;
    dispatch(addNewEdge({ id, deletable, ...params, projectId }));
  });

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const id = Math.floor(Math.random() * 10000).toString(); // fetch from SQL
      const type = event.dataTransfer.getData("application/reactflow");
      const projectId = state.projectId;
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const deletable = false;
      const data = {};

      if (type === "pod") data.replicas = 1;

      dispatch(addNode({ id, type, projectId, position, deletable, data }));
    },
    [reactFlowInstance]
  );

  const onNodeDragStop = (event, node) => {
    dispatch(updateNode({ id: node.id, position: node.position }));
  };

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
              onNodeDragStop={onNodeDragStop}
              nodeTypes={nodeTypes}
              proOptions={{ hideAttribution: true }}
            >
              <Controls position="bottom-right" />
            </ReactFlow>
          </div>
          <FloatToolbar />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
