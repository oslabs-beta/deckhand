import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser, setState } from "./deckhandSlice";
import Login from "./components/Login";
import Home from "./components/Home";
import Canvas from "./components/Canvas";

export default function App() {
  const dispatch = useDispatch();
  // @ts-expect-error TS(2571): Object is of type 'unknown'.
  const state = useSelector((state) => state.deckhand);

  useEffect(() => {
    const fetchGithubUserData = async () => {
      await fetch("/api/github/userData")
        .then((res) => {
          if (res.status === 401) return null;
          return res.json();
        })
        .then((data) => {
          dispatch(setUser(data));
          if (data.state) dispatch(setState(data.state));
          if (data.theme === "dark")
            document.body.classList.toggle("dark-mode");
        })
        .catch((err) => console.log("Error fetching Github user data: ", err));
    };

    fetchGithubUserData();
  }, []);

  if (!state.user.name) return <Login />;
  else if (!state.projectId) return <Home />;
  else return <Canvas />;
}
