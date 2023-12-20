import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Handle, Position } from "reactflow";
import { showModal, updateNode } from "../../deckhandSlice";
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
          <Icon path={mdiDocker} style={{ color: "#0db7ed" }} size={1} />
        </div>
        <div className="title">{data.name}</div>
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
