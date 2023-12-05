import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setModal,
  setClusterId,
  setPodId,
  addCluster,
  deleteCluster,
  addPod,
  deletePod,
  configurePod,
} from "../deckhandSlice";
import FloatLogo from "./floats/FloatLogo";
import FloatNav from "./floats/FloatNav";
import FloatAccount from "./floats/FloatAccount";
import ConfigureProject from "./modals/ConfigureProject";
import ConfigureCluster from "./modals/ConfigureCluster";
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
              <button
                onClick={() =>
                  dispatch(
                    configurePod({
                      projectId: project.id,
                      clusterId: cluster.id,
                      podId: pod.id,
                      config: "placeholder",
                    })
                  )
                }
              >
                Select Source
              </button>
            </>
          ) : (
            <>
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
              {pod.type === "github" ? (
                <button>
                  <b>Build</b>
                </button>
              ) : (
                ""
              )}
              {!pod.deployed ? (
                <button>
                  <b>Deploy</b>
                </button>
              ) : (
                <button>
                  <b>Stop</b>
                </button>
              )}
            </>
          )}
          <button
            className="delete"
            onClick={() =>
              dispatch(
                deletePod({
                  projectId: project.id,
                  clusterId: cluster.id,
                  podId: pod.id,
                })
              )
            }
          >
            Delete Pod
          </button>
        </div>
      );
    }

    // bundle clusters
    clusterBundle.push(
      <>
        <h2>
          {cluster.name}{" "}
          <button
            onClick={() => {
              dispatch(setModal("ConfigureProject"));
            }}
          >
            Configure Project
          </button>{" "}
          <button
            onClick={() => {
              dispatch(setClusterId(cluster.id));
              dispatch(setModal("ConfigureCluster"));
            }}
          >
            Configure Cluster
          </button>{" "}
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
            <button
              onClick={() =>
                dispatch(
                  addPod({
                    projectId: project.id,
                    clusterId: cluster.id,
                    podId: cluster.pods.length + 1,
                    type: "github",
                  })
                )
              }
            >
              + Add Github
            </button>
            <button
              onClick={() =>
                dispatch(
                  addPod({
                    projectId: project.id,
                    clusterId: cluster.id,
                    podId: cluster.pods.length + 1, // get from SQL once connected
                    type: "docker-hub",
                  })
                )
              }
            >
              + Add Docker-Hub
            </button>
          </div>
          {podBundle}
        </div>
      </>
    );
  }

  return (
    <div className="container">
      <FloatLogo />
      <FloatNav />
      <FloatAccount />
      <ConfigureProject />
      <ConfigureCluster />
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
