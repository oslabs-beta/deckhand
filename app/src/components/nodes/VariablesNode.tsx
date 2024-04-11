import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Handle, Position } from "reactflow";
import { showModal, deleteNode, deleteEdge } from "../../deckhandSlice";
import Icon from "@mdi/react";
import { mdiDotsVertical, mdiKeyVariant } from "@mdi/js";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function ({ id, data, isConnectable }: any) {
  const state = useSelector((state: any) => state.deckhand);
  const dispatch = useDispatch();

  return (
    <div className="node">
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
              <DropdownMenu.Item
                className="dropdown-item"
                onClick={() =>
                  dispatch(showModal({ name: "ConfigureVariables", id, data }))
                }
              >
                Edit Variables
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="dropdown-separator" />
              <DropdownMenu.Item
                className="dropdown-item"
                onClick={() => {
                  dispatch(deleteNode(id));
                }}
              >
                Delete
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        <div className="icon">
          <Icon path={mdiKeyVariant} style={{ color: "orange" }} size={1} />
        </div>
        <div className="title">Variables</div>
        <button
          className="button nodrag"
          onClick={() =>
            dispatch(showModal({ name: "ConfigureVariables", id, data }))
          }
        >
          Edit Variables
        </button>
      </div>
    </div>
  );
}
