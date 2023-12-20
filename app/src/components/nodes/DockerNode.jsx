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
import { mdiDotsVertical, mdiDocker } from "@mdi/js";
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
      await fetch(`/api/dockerHubImageTags/${data.imageName}`)
        .then((res) => res.json())
        .then((imageTags) => {
          dispatch(
            updateNode({
              id,
              data: {
                imageTags,
              },
            })
          );
        })
        .catch((error) => console.log(error));
    })();
  }, []);

  const setImageTag = (imageTag) => {
    dispatch(
      updateNode({
        id,
        data: {
          imageTag,
        },
      })
    );
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
              {data.imageName.split("/").length === 1 ? (
                <DropdownMenu.Item
                  className="dropdown-item"
                  onClick={() =>
                    window.open(
                      "https://hub.docker.com/_/" + data.imageName,
                      "_blank"
                    )
                  }
                >
                  Show Documentation
                </DropdownMenu.Item>
              ) : data.imageName.split("/").length > 1 ? (
                <DropdownMenu.Item
                  className="dropdown-item"
                  onClick={() =>
                    window.open(
                      "https://hub.docker.com/r/" + data.imageName,
                      "_blank"
                    )
                  }
                >
                  Show Documentation
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
          <Icon path={mdiDocker} style={{ color: "#0db7ed" }} size={1} />
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
              name="imageTag"
              className="select nodrag"
              onChange={(e) => setImageTag(e.target.value)}
              value={data.imageTag}
            >
              {data.imageTags
                ? data.imageTags.map((el) => (
                    <option key={el} value={el}>
                      {el}
                    </option>
                  ))
                : ""}
            </select>
            {!state.edges.find((edge) => edge.target === id)?.animated ? (
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
