import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { /* reducers */ } from "../deckhandSlice";

export default function Projects() {
  const state = useSelector((state) => state.main);
  const dispatch = useDispatch();

  return <>Project list</>;
}