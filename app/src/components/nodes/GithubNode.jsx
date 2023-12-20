import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Handle, Position } from "reactflow";
import { showModal, updateNode, deleteNode } from "../../deckhandSlice";
import Icon from "@mdi/react";
import { mdiDotsVertical, mdiGithub } from "@mdi/js";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function ({ id, data, isConnectable }) {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();

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

  return (
    <div className="node">
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
          <Icon path={mdiGithub} style={{ color: "black" }} size={1} />
        </div>
        <div className="title">{data.name}</div>
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
        <button className="button nodrag disabled">Deploy</button>
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
