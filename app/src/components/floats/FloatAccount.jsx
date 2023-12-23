import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setState, showModal } from "../../deckhandSlice";
import Icon from "@mdi/react";
import { mdiChevronDown } from "@mdi/js";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function FloatAccount() {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();

  useEffect(() => {
    updateDatabase();
  }, [state.user, state.projects, state.nodes, state.edges]);

  const updateDatabase = () => {
    const body = {
      id: state.user.id,
      name: state.user.name,
      email: state.user.email,
      avatarUrl: state.user.avatarUrl,
      githubId: state.user.githubId,
      awsAccessKey: state.user.awsAccessKey,
      awsSecretKey: state.user.awsSecretKey,
      state: JSON.stringify(
        JSON.stringify({
          projects: state.projects,
          nodes: state.nodes,
          edges: state.edges,
        })
      ),
    };
    fetch("/api/updateDatabase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).catch((err) => console.log(err));
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="float-account" aria-label="Customise options">
          <img src={state.user.avatarUrl} alt="Account" />
          <span>{state.user.name}</span>
          <Icon className="icon" path={mdiChevronDown} size={1} />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="dropdown"
          onClick={(e) => e.stopPropagation()}
        >
          {state.user.theme === "light" || !state.user.theme ? (
            <DropdownMenu.Item
              className="dropdown-item"
              onClick={() => {
                dispatch(setUser({ theme: "dark" }));
                document.body.classList.toggle("dark-mode");
              }}
            >
              Switch to Dark Mode
            </DropdownMenu.Item>
          ) : (
            <DropdownMenu.Item
              className="dropdown-item"
              onClick={() => {
                dispatch(setUser({ theme: "light" }));
                document.body.classList.toggle("dark-mode");
              }}
            >
              Switch to Light Mode
            </DropdownMenu.Item>
          )}
          <DropdownMenu.Item
            className="dropdown-item"
            onClick={() => {
              dispatch(showModal({ name: "LinkedCloudProviders" }));
            }}
          >
            Link AWS Account
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="dropdown-item"
            onClick={() => {
              dispatch(
                setState(
                  JSON.parse(
                    '{ "projects": [{ "projectId": "5259", "name": "Brainstorm App", "createdDate": "Fri Dec 19 2023 11:51:09 GMT-0500 (Eastern Standard Time)", "modifiedDate": "Fri Dec 19 2023 19:51:09 GMT-0500 (Eastern Standard Time)", "provider": "aws", "vpcRegion": "us-east-1", "vpcId": "xyz" }], "nodes": [{ "id": "8345", "type": "cluster", "position": { "x": 737, "y": 109 }, "projectId": "5259", "data": { "name": "Cluster", "instanceType": "t2.micro", "minNodes": 1, "maxNodes": 3, "desiredNodes": 2 } }, { "id": "7250", "type": "github", "position": { "x": 490, "y": 352 }, "projectId": "5259", "data": { "name": "brainstormapp", "githubRepo": "Goblin-Shark-CS/brainstormapp", "githubBranch": "docker", "githubBranches": ["Fix-IP-Address", "LoginPage", "LoginPageFix", "QR", "Websockets", "Websockets-Redux", "andrew/Mobile", "andrew/VoteButton", "andrew/renderMessage", "andrew/roomName", "andrew/sendMessage", "develop", "docker", "entries", "handshake", "initialize", "loginstyle.scss", "main", "o-mirza/frontend-setup", "omirza/develop", "votes"], "replicas": 3, "deployed": false } }, { "id": "8823", "type": "docker", "position": { "x": 928, "y": 355 }, "projectId": "5259", "data": { "name": "postgres", "imageName": "postgres", "imageTag": "latest", "imageTags": ["latest", "bullseye", "bookworm", "16.1-bullseye", "16.1-bookworm", "16.1", "16-bullseye", "16-bookworm", "16", "15.5-bullseye"], "replicas": 1, "deployed": false } }, { "id": "8075", "type": "ingress", "position": { "x": 211, "y": 680 }, "projectId": "5259", "data": {} }, { "id": "8038", "type": "variables", "position": { "x": 685, "y": 679 }, "projectId": "5259", "data": { "varSetId": "1", "podId": "1", "variables": [{ "key": "user1", "value": "abc123", "secret": true }, { "key": "PG_URI", "value": "db_address", "secret": false }] } }, { "id": "9634", "type": "volume", "position": { "x": 1152, "y": 676 }, "projectId": "5259", "data": { "mountPath": "/var/lib/postgresql/data" } }], "edges": [{ "id": "8345-7250", "source": "8345", "sourceHandle": "b", "target": "7250", "targetHandle": null, "projectId": "5259", "animated": false }, { "id": "7250-8075", "source": "7250", "sourceHandle": "b", "target": "8075", "targetHandle": null, "projectId": "5259", "animated": false }, { "id": "7250-8038", "source": "7250", "sourceHandle": "b", "target": "8038", "targetHandle": null, "projectId": "5259" }, { "id": "8823-8038", "source": "8823", "sourceHandle": "b", "target": "8038", "targetHandle": null, "projectId": "5259" }, { "id": "8345-8823", "source": "8345", "sourceHandle": "b", "target": "8823", "targetHandle": null, "projectId": "5259" }, { "id": "8823-9634", "source": "8823", "sourceHandle": "b", "target": "9634", "targetHandle": null, "projectId": "5259" }] }'
                  )
                )
              );
            }}
          >
            Reset State
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="dropdown-separator" />
          <DropdownMenu.Item
            className="dropdown-item"
            onClick={async () => {
              await fetch("/api/github/logout");
              location.reload();
            }}
          >
            Log Out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
