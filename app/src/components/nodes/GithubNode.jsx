import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Handle, Position } from "reactflow";
import {
  showModal,
  updateNode,
  deleteNode,
  updateEdge,
} from "../../deckhandSlice";
import Icon from "@mdi/react";
import { mdiDotsVertical, mdiGithub } from "@mdi/js";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import createYaml from "../../yaml";

export default function ({ id, data, isConnectable }) {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();

  // Find parent project
  const project = state.projects.find(
    (project) => project.projectId === state.projectId
  );

  // Find parent cluster
  const clusterEdge = state.edges.find((edge) => edge.target === id);
  const cluster = state.nodes.find((node) => node.id === clusterEdge.source);

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

  const handleClickBuild = async () => {
    dispatch(updateNode({ id, data: { status: "building" } }));

    setTimeout(() => {
      dispatch(
        updateNode({
          id,
          data: { status: null, build: true },
        })
      );
    }, 1000);

    // await fetch("/api/deployment/build", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     repo: data.githubRepo,
    //     branch: data.githubBranch,
    //     awsAccessKey: state.user.awsAccessKey,
    //     awsSecretKey: state.user.awsSecretKey,
    //     vpcRegion: project.vpcRegion,
    //   }),
    // })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     dispatch(
    //       updateNode({
    //         id,
    //         data: {
    //           status: null,
    //           build: true,
    //           imageName: data.imageName,
    //           imageTag: data.imageTag,
    //         },
    //       })
    //     );
    //   })
    //   .catch((err) => console.log(err));
  };

  const generateYaml = () => {
    // Find connected nodes
    const connectedNodes = state.edges
      .filter((edge) => edge.source === id)
      .map((edge) => state.nodes.find((node) => node.id === edge.target));

    return createYaml.all(
      data,
      connectedNodes,
      data.exposedPort || "(GENERATED DURING DEPLOYMENT)",
      cluster.volumeHandle || "(GENERATED DURING DEPLOYMENT)",
      project.vpcRegion || "(GENERATED DURING DEPLOYMENT)"
    );
  };

  const handleClickStart = async () => {
    dispatch(updateNode({ id, data: { status: "deploying" } }));

    const yaml = generateYaml();
    console.log(yaml);

    // Add 1 second delay to simulate fetch request
    setTimeout(() => {
      dispatch(updateNode({ id, data: { status: "running" } }));
      const edges = state.edges.filter((edge) => edge.source === id);
      edges.map((edge) =>
        dispatch(updateEdge({ id: edge.id, animated: true }))
      );
    }, 1000);

    // await fetch("/api/deployment/build", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     provider: project.provider,
    //     awsAccessKey: state.user.awsAccessKey,
    //     awsSecretKey: state.user.awsSecretKey,
    //     vpcRegion: state.project.vpcRegion,
    //     vpcId: cluster.data.vpcId,
    //     yaml: yaml,
    //   }),
    // })
    //   .then((res) => res.json())
    //   .then(() => {
    //     dispatch(updateNode({ id, data: { status: "running" } }));
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

  return (
    <div className={`node pod ${data.status === "running" ? "running" : ""}`}>
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
