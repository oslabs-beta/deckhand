import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProjectId } from "../../deckhandSlice";
// @ts-expect-error TS(2307): Cannot find module '../../assets/logo.svg' or its ... Remove this comment to see the full error message
import logo from "../../assets/logo.svg";

export default function FloatLogo() {
  // @ts-expect-error TS(2571): Object is of type 'unknown'.
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();

  return (
    <div className="float-logo" onClick={() => dispatch(setProjectId(null))}>
      <img src={logo} height="36" />
      <span>Deckhand</span>
    </div>
  );
}
