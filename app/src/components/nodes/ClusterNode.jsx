import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Handle, Position } from "reactflow";
import {
  showModal,
  updateNode,
  deleteNode,
  updateEdge,
  configureProject,
} from "../../deckhandSlice";
import Icon from "@mdi/react";
import { mdiDotsVertical, mdiDotsHexagon } from "@mdi/js";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function ({ id, data, isConnectable }) {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();

  const handleClickStart = async () => {
    dispatch(updateNode({ id, data: { status: "creating" } }));

    const project = state.projects.find(
      (project) => project.projectId === state.projectId
    );

    // if (!project.vpcId) {
    //   await fetch("/api/deployment/addVPC", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       provider: project.provider,
    //       name: project.name,
    //       vpcRegion: project.vpcRegion,
    //       awsAccessKey: state.user.awsAccessKey,
    //       awsSecretKey: state.user.awsSecretKey,
    //     }),
    //   })
    //     .then((res) => res.json())
    //     .then((data) => {
    //       dispatch(
    //         configureProject({
    //           projectId: state.projectId,
    //           vpcId: data.externalId,
    //         })
    //       );
    //     })
    //     .catch((err) => console.log(err));
    // }

    // Add 1 second delay to simulate fetch request
    setTimeout(() => {
      dispatch(updateNode({ id, data: { status: "running" } }));
      const edges = state.edges.filter((edge) => edge.source === id);
      edges.map((edge) =>
        dispatch(updateEdge({ id: edge.id, animated: true }))
      );
    }, 1000);

    // await fetch("/api/deployment/addCluster", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     provider: project.provider,
    //     vpcRegion: project.vpcRegion,
    //     externalId: project.vpcId,
    //     awsAccessKey: state.user.awsAccessKey,
    //     awsSecretKey: state.user.awsSecretKey,
    //     name: data.name,
    //     instanceType: data.instanceType,
    //     minNodes: data.minNodes,
    //     maxNodes: data.maxNodes,
    //     desiredNodes: data.desiredNodes,
    //   }),
    // })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     dispatch(
    //       updateNode({
    //         id,
    //         data: { volumeHandle: data.volumeHandle, status: "running" },
    //       })
    //     );
    //     const edges = state.edges.filter((edge) => edge.source === id);
    //     edges.map((edge) =>
    //       dispatch(updateEdge({ id: edge.id, animated: true }))
    //     );
    //   })
    //   .catch((err) => console.log(err));
  };

  const handleClickStop = () => {
    dispatch(updateNode({ id, data: { status: "stopping" } }));
    const edges = state.edges.filter((edge) => edge.source === id);
    edges.map((edge) => dispatch(updateEdge({ id: edge.id, animated: false })));

    // Add 1 second delay to simulate fetch request
    setTimeout(() => {
      dispatch(updateNode({ id, data: { status: null } }));
    }, 1000);
  };

  const getConnectedPods = () => {
    const edges = state.edges.filter((edge) => edge.source === id);
    return state.edges
      .filter((edge) => edge.source === id)
      .map((edge) => state.nodes.find((node) => node.id === edge.target));
  };

  const countDeployedPods = () => {
    const pods = getConnectedPods();
    return pods.filter((pod) => pod.data.status === "running").length;
  };

  return (
    <div className={`node ${data.status === "running" ? "running" : ""}`}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="node-menu" aria-label="Customise options">
              <Icon path={mdiDotsVertical} size={1} />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="dropdown"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenu.Item
                className="dropdown-item"
                onClick={() =>
                  dispatch(showModal({ name: "ConfigureCluster", id, data }))
                }
              >
                Configure
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="dropdown-separator" />
              <DropdownMenu.Item
                className="dropdown-item"
                onClick={() => dispatch(deleteNode(id))}
              >
                Delete
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        <div className="icon">
          <Icon path={mdiDotsHexagon} style={{ color: "red" }} size={1} />
        </div>
        <div className="title">{data.name ? data.name : "Cluster"}</div>
        {!data.instanceType ||
        !data.minNodes ||
        !data.maxNodes ||
        !data.desiredNodes ? (
          <button
            className="button nodrag"
            onClick={() =>
              dispatch(showModal({ name: "ConfigureCluster", id, data }))
            }
          >
            Configure
          </button>
        ) : !data.status ? (
          <button className="button nodrag" onClick={handleClickStart}>
            Start Instance
          </button>
        ) : data.status === "creating" ? (
          <button className="button busy nodrag">Creating instance...</button>
        ) : data.status === "stopping" ? (
          <button className="button busy nodrag">Stopping instance...</button>
        ) : (
          <>
            <div
              style={{
                fontSize: "14px",
                paddingBottom: "10px",
              }}
            >
              <b>{countDeployedPods()}</b> of{" "}
              <b>{state.edges.filter((edge) => edge.source === id).length}</b>{" "}
              pods deployed
            </div>
            <button className="button stop nodrag" onClick={handleClickStop}>
              Stop Instance
            </button>
          </>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        isConnectable={isConnectable}
      />
    </div>
  );
}
