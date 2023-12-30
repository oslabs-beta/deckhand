import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Handle, Position } from "reactflow";
import { showModal, deleteNode } from "../../deckhandSlice";
import Icon from "@mdi/react";
import { mdiDotsVertical, mdiImport } from "@mdi/js";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function ({ id, data, isConnectable }) {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();

  useEffect(() => {
    // Find parent node
    const parentEdge = state.edges.find((edge) => edge.target === id);
    const parentNode = state.nodes.find(
      (node) => node.id === parentEdge?.source
    );

    // Get URL if parent node is running
    if (parentNode?.data.status === "running") getURL();
  }, [state.nodes, state.edges]);

  const getURL = async () => {
    if (!state.user.demoMode) {
      try {
        const res = await fetch("/api/deployment/getURL", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: state.user.id,
            awsAccessKey: state.user.awsAccessKey,
            awsSecretKey: state.user.awsSecretKey,
            vpcRegion: state.user.vpcRegion,
            projectId: project.projectId,
            clusterId: id,
            clusterName: data.name,
            instanceType: data.instanceType,
            minNodes: data.minNodes,
            maxNodes: data.maxNodes,
            desiredNodes: data.desiredNodes,
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
    }
  };

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
                  dispatch(showModal({ name: "ConfigureIngress", id, data }))
                }
              >
                Configure
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
          <Icon path={mdiImport} style={{ color: "green" }} size={1} />
        </div>
        <div className="title">Ingress Route</div>
        {!data.url ? (
          <button className="button nodrag disabled">Open Public URL</button>
        ) : (
          <button
            className="button nodrag green"
            onClick={() => window.open(data.url, "_blank")}
          >
            Open Public URL
          </button>
        )}
      </div>
    </div>
  );
}
