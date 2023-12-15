import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleLayout, showModal } from "../../deckhandSlice";
import Icon from "@mdi/react";
import { mdiChevronDown } from "@mdi/js";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function FloatAccount() {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="float-account" aria-label="Customise options">
          <img src={state.user.avatarUrl} alt="Account" />
          <span>{state.user.name}</span>
          <Icon path={mdiChevronDown} size={1} />
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
          <DropdownMenu.Item
            className="dropdown-item"
            onClick={() => {
              dispatch(toggleLayout());
            }}
          >
            Toggle Layout
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
