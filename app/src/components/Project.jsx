import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCluster, deleteCluster } from "../deckhandSlice";
import FloatLogo from "./FloatLogo";
import FloatActiveProject from "./FloatActiveProject";
import FloatAccount from "./FloatAccount";
import Icon from "@mdi/react";
import { mdiTrashCanOutline } from "@mdi/js";

export default function Project() {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();
  const project = state.projects.find((p) => p.id === state.projectId);

  const clusterBundle = [];
  for (const cluster of project.clusters) {
    // bundle pods
    const podBundle = [];
    for (const pod of cluster.pods) {
      podBundle.push(
        <div className="card">
          <div className="name">{pod.name}</div>
          {!pod.config ? (
            <>
              <button>Configure</button>
            </>
          ) : (
            <>
              <button>
                <b>Edit Config</b>
              </button>
              <button>
                <b>Edit Replicas ({pod.replicas})</b>
              </button>
              {!pod.variables ? (
                <button>Add Variables</button>
              ) : (
                <button>
                  <b>Edit Variables</b>
                </button>
              )}
              {!pod.ingress ? (
                <button>Add Ingress</button>
              ) : (
                <button>
                  <b>Edit Ingress</b>
                </button>
              )}
              {!pod.volume ? (
                <button>Add Volume</button>
              ) : (
                <button>
                  <b>Edit Volume</b>
                </button>
              )}
            </>
          )}
          <button className="delete">Delete Pod</button>
        </div>
      );
    }

    // bundle clusters
    clusterBundle.push(
      <>
        <h2>
          {cluster.name}{" "}
          <Icon
            path={mdiTrashCanOutline}
            size={0.75}
            className="mdiTrashCanOutline"
            onClick={() =>
              dispatch(
                deleteCluster({
                  projectId: project.id,
                  clusterId: cluster.id,
                })
              )
            }
          />
        </h2>
        <div id="pod-cards">
          <div className="card">
            <div className="new-pod">New Pod</div>
            <button>+ Add Github</button>
            <button>+ Add Docker-Hub</button>
          </div>
          {podBundle}
        </div>
      </>
    );
  }

  return (
    <div className="container">
      <FloatLogo />
      <FloatActiveProject />
      <FloatAccount />
      <div className="content-container">
        <div className="content">
          {clusterBundle}
          <div id="new-cluster">
            <button
              onClick={() =>
                dispatch(
                  addCluster({
                    projectId: project.id,
                    clusterId: project.clusters.length + 1, // get from SQL once connected
                  })
                )
              }
            >
              + Add Cluster
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
