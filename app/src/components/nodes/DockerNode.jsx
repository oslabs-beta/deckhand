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

export default function ({ id, data, isConnectable }) {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();

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

  const handleClickStart = () => {
    console.log("deploying!");
    console.log(id);
    console.log(data);
    dispatch(updateNode({ id, data: { status: "deploying" } }));

    // Add 5 second delay to simulate fetch request
    setTimeout(() => {
      dispatch(updateNode({ id, data: { status: "running" } }));
      const edges = state.edges.filter((edge) => edge.source === id);
      edges.map((edge) =>
        dispatch(updateEdge({ id: edge.id, animated: true }))
      );
    }, 1000);
  };

  const handleClickStop = () => {
    dispatch(updateNode({ id, data: { status: "stopping" } }));
    const edges = state.edges.filter((edge) => edge.source === id);
    edges.map((edge) => dispatch(updateEdge({ id: edge.id, animated: false })));

    // Add 5 second delay to simulate fetch request
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
              <DropdownMenu.Item
                className="dropdown-item"
                onClick={() =>
                  dispatch(showModal({ name: "PodSource", id, data }))
                }
              >
                Change Source
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
