import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Handle, Position } from "reactflow";
import {
  showModal,
  updateNode,
  deleteNode,
  updateEdge,
  deleteEdge,
  configureProject,
} from "../../deckhandSlice";
import Icon from "@mdi/react";
import { mdiDotsVertical, mdiDotsHexagon } from "@mdi/js";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function ({ id, data, isConnectable }) {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();

  let project = state.projects.find(
    (project) => project.projectId === state.projectId
  );

  useEffect(() => {
    state.edges
      // Get child edges
      .filter((edge) => edge.source === id)
      // Animate edges if node is running
      .forEach((edge) =>
        dispatch(
          updateEdge({
            id: edge.id,
            animated: data.status === "running",
          })
        )
      );
  }, [state.edges, data]);

  const addVPC = async () => {
    // Add VPC (if no clusters are running)
    if (
      state.nodes.filter(
        (node) => node.type === "cluster" && node.data.status !== null
      ).length
    ) {
      try {
        const res = await fetch("/api/deployment/addVPC", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: state.user.id,
            awsAccessKey: state.user.awsAccessKey,
            awsSecretKey: state.user.awsSecretKey,
            projectId: project.projectId,
            projectName: project.name,
            vpcRegion: project.vpcRegion,
          }),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
      } catch (error) {
        console.error("Error in addVPC:", error);
        throw error; // Re-throw the error to be handled in parent function
      }
    } else {
      return;
    }
  };

  const deleteVPC = async () => {
    try {
      const res = await fetch("/api/deployment/deleteVPC", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: state.user.id,
          projectId: project.projectId,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      return;
    } catch (error) {
      console.error("Error in deleteVPC:", error);
      throw error; // Re-throw the error to be handled in parent function
    }
  };

  const addCluster = async () => {
    console.log({
      userId: state.user.id,
      projectId: project.projectId,
      clusterId: id,
      clusterName: data.name,
      instanceType: data.instanceType,
      minNodes: data.minNodes,
      maxNodes: data.maxNodes,
      desiredNodes: data.desiredNodes,
    });
    // Add cluster and return volumeHandle
    try {
      const res = await fetch("/api/deployment/addCluster", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: state.user.id,
          projectId: project.projectId,
          clusterId: id,
          clusterName: data.name,
          instanceType: data.instanceType,
          minNodes: data.minNodes,
          maxNodes: data.maxNodes,
          desiredNodes: data.desiredNodes,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      return data.volumeHandle;
    } catch (error) {
      console.error("Error in addCluster:", error);
      throw error; // Re-throw the error to be handled in parent function
    }
  };

  const deleteCluster = async () => {
    try {
      const res = await fetch("/api/deployment/deleteVPC", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: state.user.id,
          projectId: project.projectId,
          clusterId: id,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      return;
    } catch (error) {
      console.error("Error in deleteCluster:", error);
      throw error; // Re-throw the error to be handled in parent function
    }
  };

  const handleClickStart = async () => {
    try {
      dispatch(updateNode({ id, data: { status: "starting" } }));
      await addVPC();
      const volumeHandle = await addCluster();
      dispatch(updateNode({ id, data: { volumeHandle, status: "running" } }));
    } catch (error) {
      console.error("Error in handleClickStart:", error);
      dispatch(updateNode({ id, data: { status: null } }));
    }

    // Add 1 second delay to simulate fetch request
    // setTimeout(() => {
    //   dispatch(updateNode({ id, data: { status: "running" } }));
    // }, 1000);
  };

  const handleClickStop = async () => {
    // Set status to "stopping"
    dispatch(updateNode({ id, data: { status: "stopping" } }));
    // Delete cluster
    await deleteCluster();
    // Delete VPC if there are no other running clusters in project
    const nodes = state.nodes.filter(
      (node) => node.type === "cluster" && node.projectId === state.projectId
    );
    if (!nodes) await deleteVPC();
    // Set status to null
    dispatch(updateNode({ id, data: { status: null } }));

    // Add 1 second delay to simulate fetch request
    // setTimeout(() => {
    //   dispatch(updateNode({ id, data: { status: null } }));
    // }, 1000);
  };

  const countDeployedPods = () => {
    const childNodes = state.edges
      // Get child edges
      .filter((edge) => edge.source === id)
      // Get child nodes
      .map((edge) => state.nodes.find((node) => node.id === edge.target));
    return childNodes.filter((node) => node.data.status === "running").length;
  };

  return (
    <div className={`node ${data.status === "running" ? "running" : ""}`}>
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
              <DropdownMenu.Item
                className="dropdown-item"
                onClick={() => deleteVPC()}
              >
                Delete VPC
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
        ) : data.status === "starting" ? (
          <button className="button busy nodrag">
            Starting... (will take time)
          </button>
        ) : data.status === "stopping" ? (
          <button className="button busy nodrag">Stopping...</button>
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
