import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { /* reducers */ } "../deckhandSlice";
import FloatLogo from "./FloatLogo";
import FloatActiveProject from "./FloatActiveProject";
import FloatAccount from "./FloatAccount";

export default function Deckhand() {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();
  const project = state.projects.find((obj) => obj.id === state.projectId);

  const clusterBundle = [];
  if (project.clusters) {
    for (let i = 0; i < project.clusters.length; i++) {
      // bundle pods
      const podBundle = [];
      if (project.clusters[i]) {
        for (const pod of project.clusters[i]) {
          console.log(pod);
          podBundle.push(
            <div className="card">
              <div className="name">{pod.type}</div>
              <button>Add ConfigMap</button>
              <button>Add Secrets</button>
              <button>Add Ingress</button>
              <button>Add Volume</button>
              <button className="red">Delete Pod</button>
            </div>
          );
        }
      }

      // bundle cluster
      clusterBundle.push(
        <>
          <h1>Cluster {i + 1}</h1>
          <div id="pod-cards">
            <div className="new-card">
              <div>New Pod</div>
              <button>Add Github</button>
              <button>Add Docker-Hub</button>
            </div>
            {podBundle}
          </div>
        </>
      );
    }
  }

  return (
    <div className="container">
      <FloatLogo />
      <FloatActiveProject />
      <FloatAccount />
      <div className="content-container">
        <div className="content">{clusterBundle}</div>
      </div>
    </div>
  );
}
