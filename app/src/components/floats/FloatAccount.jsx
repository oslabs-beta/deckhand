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
      theme: state.user.theme,
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
          <DropdownMenu.Item
            className="dropdown-item"
            onClick={() => {
              dispatch(showModal({ name: "LinkedCloudProviders" }));
            }}
          >
            Link AWS Account
          </DropdownMenu.Item>
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
          {!state.user.demoMode ? (
            <DropdownMenu.Item
              className="dropdown-item"
              onClick={() => {
                dispatch(setUser({ demoMode: true }));
              }}
            >
              Enable Demo Mode
            </DropdownMenu.Item>
          ) : (
            <DropdownMenu.Item
              className="dropdown-item"
              onClick={() => {
                dispatch(setUser({ demoMode: false }));
              }}
            >
              Disable Demo Mode
            </DropdownMenu.Item>
          )}
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
