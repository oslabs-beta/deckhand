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
  // @ts-expect-error TS(2571): Object is of type 'unknown'.
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();

  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

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

  // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
  const onConnect = useCallback((params: any) => {
    // setEdges((eds) => addEdge(params, eds)), [];
    const id = `${params.source}-${params.target}`;
    const deletable = false;
    const projectId = state.projectId;
    dispatch(addNewEdge({ id, deletable, ...params, projectId }));
  });

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
      // @ts-expect-error TS(2531): Object is possibly 'null'.
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const deletable = false;
      const data = {};

      // @ts-expect-error TS(2339): Property 'replicas' does not exist on type '{}'.
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
      <div style={{ width: "100vw", height: "100vh" }}>
        <ReactFlowProvider>
          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              // @ts-expect-error TS(2322): Type 'Dispatch<SetStateAction<null>>' is not assig... Remove this comment to see the full error message
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
