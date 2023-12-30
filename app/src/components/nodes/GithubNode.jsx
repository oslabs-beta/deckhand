import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Handle, Position } from "reactflow";
import {
  showModal,
  updateNode,
  deleteNode,
  updateEdge,
  deleteEdge,
} from "../../deckhandSlice";
import Icon from "@mdi/react";
import { mdiDotsVertical, mdiGithub } from "@mdi/js";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import createYaml from "../../yaml";

export default function ({ id, data, isConnectable }) {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();

  useEffect(() => {
    const edges = state.edges.filter((edge) => edge.source === id);
    edges.forEach((edge) =>
      dispatch(
        updateEdge({
          id: edge.id,
          animated: data.status === "running",
        })
      )
    );
  }, [state.edges, data]);

  // Find parent project
  const project = state.projects.find(
    (project) => project.projectId === state.projectId
  );

  // Find parent cluster
  const clusterEdge = state.edges.find((edge) => edge.target === id);
  const cluster = state.nodes.find((node) => node.id === clusterEdge?.source);

  // Find connected nodes
  const connectedNodes = state.edges
    .filter((edge) => edge.source === id)
    .map((edge) => state.nodes.find((node) => node.id === edge.target));

  useEffect(() => {
    (async () => {
      await fetch("/api/github/branches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repo: data.githubRepo }),
      })
        .then((res) => res.json())
        .then((githubBranches) => {
          dispatch(
            updateNode({
              id,
              data: {
                ...data,
                githubBranches,
              },
            })
          );
        })
        .catch((err) => console.log(err));
    })();
  }, []);

  const setBranch = (githubBranch) => {
    dispatch(
      updateNode({
        id,
        data: {
          ...data,
          githubBranch,
        },
      })
    );
  };

  const handleClickIncrementReplicas = () => {
    dispatch(updateNode({ id, data: { replicas: data.replicas + 1 } }));
  };

  const handleClickDecrementReplicas = () => {
    dispatch(
      updateNode({
        id,
        data: { replicas: data.replicas > 1 ? data.replicas - 1 : 1 },
      })
    );
  };

  const findExposedPort = async () => {
    try {
      const res = await fetch("/api/github/findExposedPort", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repo: data.githubRepo,
          branch: data.githubBranch,
        }),
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const fetchData = await res.json();
      dispatch(
        updateNode({ id, data: { exposedPort: fetchData.exposedPort } })
      );
      return;
    } catch (error) {
      console.log("Error in findExposedPort", error);
      throw error; // Re-throw the error to be handled in parent function
    }
  };

  const buildImage = async () => {
    try {
      const res = await fetch("/api/deployment/buildImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repo: data.githubRepo,
          branch: data.githubBranch,
          awsAccessKey: state.user.awsAccessKey,
          awsSecretKey: state.user.awsSecretKey,
          vpcRegion: state.user.vpcRegion,
        }),
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const fetchData = await res.json();
      dispatch(
        updateNode({
          id,
          data: {
            imageName: fetchData.imageName,
            imageTag: fetchData.imageTag,
          },
        })
      );
      return;
    } catch (error) {
      console.log("Error in buildImage", error);
      throw error; // Re-throw the error to be handled in parent function
    }
  };

  const handleClickBuild = async () => {
    if (state.user.demoMode) {
      // Simulate activity if demo mode enabled
      dispatch(updateNode({ id, data: { status: "building" } }));
      setTimeout(() => {
        dispatch(updateNode({ id, data: { status: null } }));
      }, 1000);
    } else {
      try {
        // Update status
        dispatch(updateNode({ id, data: { status: "building" } }));

        // Build image
        await buildImage();

        // Find exposed port
        await findExposedPort();

        // Update status
        dispatch(updateNode({ id, data: { status: null } }));
      } catch (error) {
        console.error("Error in handleClickBuild:", error);
        dispatch(updateNode({ id, data: { status: null } }));
      }
    }
  };

  const handleClickStart = async () => {
    if (state.user.demoMode) {
      // Simulate activity if demo mode enabled
      dispatch(updateNode({ id, data: { status: "deploying" } }));
      setTimeout(() => {
        dispatch(updateNode({ id, data: { status: "running" } }));
      }, 1000);
    } else {
      try {
        // Update status
        dispatch(updateNode({ id, data: { status: "deploying" } }));

        // Get exposed port
        const exposedPort = await getDockerHubExposedPort();

        // Create YAML
        const yaml = createYaml.all(
          data,
          connectedNodes,
          exposedPort,
          cluster.volumeHandle,
          project.vpcRegion
        );

        // Deploy pod
        await deployPod();

        // Update status
        dispatch(updateNode({ id, data: { status: "running" } }));
      } catch (error) {
        console.error("Error in handleClickStart:", error);
        dispatch(updateNode({ id, data: { status: null } }));
      }
    }
  };

  const deletePod = async () => {
    try {
      const res = await fetch("/api/deployment/deletePod", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          awsAccessKey: state.user.awsAccessKey,
          awsSecretKey: state.user.awsSecretKey,
          vpcRegion: state.user.vpcRegion,
          awsClusterName: cluster.awsClusterName,
          podName: data.name,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      return;
    } catch (error) {
      console.error("Error in deletePod:", error);
      throw error; // Re-throw the error to be handled in parent function
    }
  };

  const handleClickStop = async () => {
    if (state.user.demoMode) {
      dispatch(updateNode({ id, data: { status: "stopping" } }));
      setTimeout(() => {
        dispatch(updateNode({ id, data: { status: null } }));
      }, 1000);
    } else {
      try {
        // Set status to "stopping"
        dispatch(updateNode({ id, data: { status: "stopping" } }));

        // Delete cluster
        await deletePod();

        // Set status to null
        dispatch(updateNode({ id, data: { status: null } }));
      } catch (error) {
        console.error("Error in handleClickStop:", error);
        dispatch(updateNode({ id, data: { status: null } }));
      }
    }
  };

  return (
    <div className={`node pod ${data.status === "running" ? "running" : ""}`}>
      <Handle
        type="target"
        position={Position.Top}
        id="a"
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
              {data.githubRepo && data.githubBranch ? (
                <DropdownMenu.Item
                  className="dropdown-item"
                  onClick={() =>
                    window.open(
                      `https://github.com/${data.githubRepo}.git#${data.githubBranch}`,
                      "_blank"
                    )
                  }
                >
                  Show GitHub
                </DropdownMenu.Item>
              ) : (
                ""
              )}
              <DropdownMenu.Item
                className="dropdown-item"
                onClick={() =>
                  dispatch(showModal({ name: "PodSource", id, data }))
                }
              >
                Change Source
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="dropdown-item"
                onClick={() =>
                  dispatch(
                    showModal({ name: "PodYaml", id, data, project, cluster })
                  )
                }
              >
                Show YAML
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="dropdown-item"
                onClick={handleClickBuild}
              >
                Rebuild
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="dropdown-item"
                onClick={handleClickStart}
              >
                Redeploy
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
          <Icon path={mdiGithub} style={{ color: "black" }} size={1} />
        </div>
        <div className="title">{data.name}</div>
        <div style={{ display: "flex" }}>
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "20px",
                fontWeight: "bold",
              }}
            >
              <div
                onClick={() => handleClickIncrementReplicas()}
                style={{
                  flex: 1,
                  margin: "2px",
                  textAlign: "center",
                }}
              >
                <span className="arrow nodrag">▲</span>
              </div>
              <div
                style={{
                  flex: 1,
                  margin: "2px",
                  textAlign: "center",
                }}
              >
                {data.replicas}
              </div>
              <div
                onClick={() => handleClickDecrementReplicas()}
                style={{
                  flex: 1,
                  margin: "2px",
                  textAlign: "center",
                }}
              >
                <span className="arrow nodrag">▼</span>
              </div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <select
              name="githubBranch"
              className="select nodrag"
              onChange={(e) => setBranch(e.target.value)}
              value={data.githubBranch}
            >
              {data.githubBranches
                ? data.githubBranches.map((el) => (
                    <option key={el} value={el}>
                      {el}
                    </option>
                  ))
                : ""}
            </select>
            {data.status === "building" ? (
              <button className="button busy nodrag">Building...</button>
            ) : !data.build ? (
              <button className="button nodrag" onClick={handleClickBuild}>
                Build
              </button>
            ) : !state.edges.find((edge) => edge.target === id)?.animated ? (
              <button className="button nodrag disabled">Deploy</button>
            ) : !data.status ? (
              <button className="button nodrag" onClick={handleClickStart}>
                Deploy
              </button>
            ) : data.status === "deploying" ? (
              <button className="button busy nodrag">Deploying...</button>
            ) : data.status === "running" ? (
              <button className="button stop nodrag" onClick={handleClickStop}>
                Stop Deployment
              </button>
            ) : (
              <button className="button busy nodrag">Stopping...</button>
            )}
          </div>
        </div>
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
