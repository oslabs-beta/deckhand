import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { setUser } from "./deckhandSlice";
import Login from "./components/Login";
import Home from "./components/Home";
import Project from "./components/Project";

export default function App() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.deckhand);

  if (!state.user) return <Login />;
  else if (!state.projectId) return <Home />;
  else return <Project />;
}
