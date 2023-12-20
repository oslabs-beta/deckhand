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
import { mdiDotsVertical, mdiDotsHexagon } from "@mdi/js";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function ({ id, data, isConnectable }) {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();

  const handleClickStart = () => {
    dispatch(updateNode({ id, data: { status: "creating" } }));

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
              <b>0</b> of{" "}
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
