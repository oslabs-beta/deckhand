import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "./deckhandSlice";
import Login from "./components/Login";
import Home from "./components/Home";
import Project from "./components/Project";
import Canvas from "./components/Canvas";

export default function App() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.deckhand);

  useEffect(() => {
    const fetchGithubUserData = async () => {
      await fetch("/api/github/userData")
        .then((res) => {
          if (res.status === 401) return null;
          return res.json();
        })
        .then((data) => dispatch(setUser(data)))
        .catch((err) => console.log("Error fetching Github user data: ", err));
    };

    fetchGithubUserData();
  }, []);

  if (!state.user.name) return <Login />;
  else if (!state.projectId) return <Home />;
  else if (state.layout === "canvas") return <Canvas />;
  else return <Project />;
}
