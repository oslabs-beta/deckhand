import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProjectId } from "../../deckhandSlice";
import logo from "../../assets/logo.svg";

export default function FloatLogo() {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();

  return (
    <div className="float-logo" onClick={() => dispatch(setProjectId(null))}>
      <img src={logo} height="36" />
      <span>Deckhand</span>
    </div>
  );
}
