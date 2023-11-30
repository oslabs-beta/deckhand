import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { /* reducers */ } from "../deckhandSlice";

export default function Deckhand() {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();

  return <>Deckhand canvas</>;
}