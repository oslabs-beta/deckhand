import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleLayout, showModal } from "../../deckhandSlice";
import Icon from "@mdi/react";
import { mdiChevronDown } from "@mdi/js";
import {
  Button,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
} from "react-aria-components";

export default function FloatAccount() {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();

  const handleAction = async (key) => {
    if (key === "linked-cloud-providers")
      dispatch(showModal({ name: "LinkedCloudProviders" }));
    if (key === "toggle-layout") dispatch(toggleLayout());
    if (key === "logout") {
      await fetch("/api/github/logout");
      location.reload();
    }
  };

  return (
    <MenuTrigger>
      <Button className="float-account" aria-label="Menu">
        <img src={state.user.avatarUrl} alt="Account" />
        <span>{state.user.name}</span>
        <Icon path={mdiChevronDown} size={1} />
      </Button>
      <Popover>
        <Menu className="dropdown" onAction={handleAction}>
          <MenuItem id="linked-cloud-providers" className="dropdown-item">
            Link AWS Account
          </MenuItem>
          <MenuItem id="toggle-layout" className="dropdown-item">
            Toggle Layout
          </MenuItem>
          <MenuItem id="logout" className="dropdown-item">
            Sign Out
          </MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}
