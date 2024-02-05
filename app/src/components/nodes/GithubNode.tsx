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

export default function ({ id, data, isConnectable }: any) {
  const state = useSelector((state: any) => state.deckhand);
  const dispatch = useDispatch();

  useEffect(() => {
    const edges = state.edges.filter((edge: any) => edge.source === id);
    edges.forEach((edge: any) =>
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
    (project: any) => project.projectId === state.projectId
  );

  // Find parent cluster
  const clusterEdge = state.edges.find((edge: any) => edge.target === id);
  const cluster = state.nodes.find((node: any) => node.id === clusterEdge?.source);

  // Find connected nodes
  const connectedNodes = state.edges
    .filter((edge: any) => edge.source === id)
    .map((edge: any) => state.nodes.find((node: any) => node.id === edge.target));

  // Find connected nodes
  const ingress = connectedNodes?.find((node: any) => node.type === "ingress");

  let yaml: any;

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

  const setBranch = (githubBranch: string) => {
    dispatch(
      updateNode({
        id,
        data: {
          ...data,
          githubBranch,
          imageName: null,
          imageTag: null,
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
        updateNode({
          id,
          data: { exposedPort: fetchData.exposedPort || "3000" },
        })
      );
      return data.exposedPort;
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
          vpcRegion: project.vpcRegion,
        }),
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const fetchData = await res.json();
      dispatch(
        updateNode({
          id,
          data: {
            awsRepo: fetchData.awsRepo,
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

  const deleteImage = async () => {
    try {
      const res = await fetch("/api/deployment/deleteImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          awsAccessKey: state.user.awsAccessKey,
          awsSecretKey: state.user.awsSecretKey,
          vpcRegion: project.vpcRegion,
          awsRepo: data.awsRepo,
          imageName: data.imageName,
          imageTag: data.imageTag,
        }),
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const fetchData = await res.json();
      dispatch(updateNode({ id, data: { imageName: null, imageTag: null } }));
      return;
    } catch (error) {
      console.log("Error in deleteImage", error);
      throw error; // Re-throw the error to be handled in parent function
    }
  };

  const handleClickBuild = async () => {
    if (state.user.demoMode) {
      // Simulate activity if demo mode enabled
      dispatch(updateNode({ id, data: { status: "building" } }));
      setTimeout(() => {
        dispatch(
          updateNode({
            id,
            data: { imageName: "demo", imageTag: "demo", status: null },
          })
        );
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
        dispatch(
          updateNode({
            id,
            data: { imageName: null, imageTag: null, status: null },
          })
        );
      }
    }
  };

  const getURL = async () => {
    try {
      const res = await fetch("/api/deployment/getURL", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          awsAccessKey: state.user.awsAccessKey,
          awsSecretKey: state.user.awsSecretKey,
          vpcRegion: project.vpcRegion,
          awsClusterName: cluster.data.awsClusterName,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const fetchData = await res.json();
      const url = fetchData.url;
      dispatch(updateNode({ id, data: { url } }));
    } catch (error) {
      console.error("Error in handleClickStart:", error);
    }
  };

  const handleClickStart = async () => {
    if (state.user.demoMode) {
      // Simulate activity if demo mode enabled
      dispatch(updateNode({ id, data: { status: "deploying" } }));
      setTimeout(() => {
        dispatch(updateNode({ id, data: { status: "running" } }));
        if (ingress)
          dispatch(updateNode({ id, data: { url: "http://example.com" } }));
      }, 1000);
    } else {
      try {
        // Update status
        dispatch(updateNode({ id, data: { status: "deploying" } }));

        // Get exposed port
        const exposedPort = await findExposedPort();

        // Create YAML
        yaml = createYaml.all(
          data,
          connectedNodes,
          exposedPort,
          cluster.volumeHandle,
          project.vpcRegion
        );

        // Deploy pod
        await deployPod();

        // Get URL if ingress connected
        if (ingress) await getURL();

        // Update status
        dispatch(updateNode({ id, data: { status: "running" } }));
      } catch (error) {
        console.error("Error in handleClickStart:", error);
        dispatch(updateNode({ id, data: { status: null } }));
      }
    }
  };

  const deployPod = async () => {
    try {
      const res = await fetch("/api/deployment/deployPod", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          awsAccessKey: state.user.awsAccessKey,
          awsSecretKey: state.user.awsSecretKey,
          vpcRegion: project.vpcRegion,
          awsClusterName: cluster.data.awsClusterName,
          yaml: yaml,
        }),
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      // return data.exposedPort;
      return;
    } catch (error) {
      console.log("Error in deployPod", error);
      throw error; // Re-throw the error to be handled in parent function
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
          vpcRegion: project.vpcRegion,
          awsClusterName: cluster.data.awsClusterName,
          podName: data.name,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      // Set URL to null
      dispatch(updateNode({ id, data: { url: null } }));

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
        dispatch(updateNode({ id, data: { url: null, status: null } }));
      }, 1000);
    } else {
      try {
        // Set status to "stopping"
        dispatch(updateNode({ id, data: { url: null, status: "stopping" } }));

        // Delete image
        await deleteImage();

        // Delete pod
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
              <DropdownMenu.Item
                className="dropdown-item"
                onClick={handleClickStop}
              >
                Force Stop
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
        <div className="display-flex">
          <div className="flex-1">
            <div className="replicas">
              <div
                onClick={() => handleClickIncrementReplicas()}
                className="replicas-content"
              >
                <span className="arrow nodrag">▲</span>
              </div>
              <div className="replicas-content">
                {data.replicas}
              </div>
              <div
                onClick={() => handleClickDecrementReplicas()}
                className="replicas-content"
              >
                <span className="arrow nodrag">▼</span>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <select
              title="githubBranch"
              name="githubBranch"
              className="select nodrag"
              onChange={(e: any) => setBranch(e.target.value)}
              value={data.githubBranch}
            >
              {data.githubBranches
                ? data.githubBranches.map((el: any) => (
                    <option key={el} value={el}>
                      {el}
                    </option>
                  ))
                : ""}
            </select>
            {data.status === "building" ? (
              <button className="button busy nodrag">Building...</button>
            ) : !data.imageName || !data.imageTag ? (
              <button className="button nodrag" onClick={handleClickBuild}>
                Build
              </button>
            ) : !state.edges.find((edge: any) => edge.target === id)?.animated ? (
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
