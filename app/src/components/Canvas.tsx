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
import {
  ReactFlow,
  ReactFlowInstance,
  Connection,
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
  const state = useSelector((state: any) => state.deckhand);
  const dispatch = useDispatch();

  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  useEffect(() => {
    const projectNodes = state.nodes.filter(
      (nds: any) => nds.projectId === state.projectId
    );
    const projectEdges = state.edges.filter(
      (eds: any) => eds.projectId === state.projectId
    );
    setNodes(projectNodes);
    setEdges(projectEdges);
  }, [state.nodes, state.edges, setNodes, setEdges]);

  const onConnect = useCallback((params: Connection) => {
    const id: string = `${params.source}-${params.target}`;
    const deletable: boolean = false;
    const projectId: string = state.projectId;
    dispatch(addNewEdge({
      id,
      deletable,
      source: params.source,
      target: params.target,
      projectId
    }));
  }, [dispatch, state.projectId]);

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  function generateUniqueId() {
    let uniqueId: any;
    do {
      uniqueId = Math.floor(Math.random() * 1000000).toString();
    } while (state.nodes.some((node: any) => node.id === uniqueId));
    return uniqueId;
  }

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();
      const id = generateUniqueId();
      const type = event.dataTransfer.getData("application/reactflow");
      const projectId = state.projectId;
      const position = reactFlowInstance!.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const deletable: boolean = false;
      const data: any = {};

      if (type === "pod") data.replicas = 1;

      dispatch(addNode({ id, type, projectId, position, deletable, data }));
    },
    [reactFlowInstance]
  );

  const onNodeDragStop = (event: any, node: any) => {
    dispatch(updateNode({ id: node.id, position: node.position }));
  };

  return (
    <div className="container">
      <FloatLogo />
      <FloatProject />
      <FloatAccount />
      <Modals />
      <div id="container-react-flow">
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
