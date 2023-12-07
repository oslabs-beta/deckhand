import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { /* reducers */ } "../deckhandSlice";
import account from "../../assets/account.png";
import Icon from "@mdi/react";
import { mdiChevronDown } from "@mdi/js";

export default function FloatAccount() {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();

  return (
    <div className="account">
      <img src={state.user.avatarUrl} alt="Account" />
      <span>{state.user.name}</span>
      <Icon path={mdiChevronDown} size={1} />
    </div>
  );
}
