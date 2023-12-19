import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Handle, Position } from "reactflow";
import {
  showModal,
  addCluster,
  deleteCluster,
  addPod,
  deletePod,
  configurePod,
  addVarSet,
  addIngress,
  addVolume,
} from "../../deckhandSlice";
import Icon from "@mdi/react";
import { mdiDotsVertical, mdiKeyVariant } from "@mdi/js";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function ({ data, isConnectable }) {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();

  return (
    <div className="node">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div>
        <div className="icon">
          <Icon path={mdiKeyVariant} style={{ color: "orange" }} size={1} />
        </div>
        <div className="title">{"Variables"}</div>
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
