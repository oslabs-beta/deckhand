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
import LinkedCloudProviders from "./modals/LinkedCloudProviders";
import ConfigureProject from "./modals/ConfigureProject";
import ConfigureCluster from "./modals/ConfigureCluster";
import ConfigureGithubPod from "./modals/ConfigureGithubPod";
import ConfigureDockerHubPod from "./modals/ConfigureDockerHubPod";
import ConfigurePodReplicas from "./modals/ConfigurePodReplicas";
import ConfigurePodIngress from "./modals/ConfigurePodIngress";
import ConfigurePodVolume from "./modals/ConfigurePodVolume";
import ConfigurePodVariables from "./modals/ConfigurePodVariables";
import ConfigurePodYaml from "./modals/ConfigurePodYaml";
import Icon from "@mdi/react";
import { mdiTrashCanOutline } from "@mdi/js";

export default function Project() {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();
  const project = state.projects.find((p) => p.id === state.projectId);

  const handleClickBuild = async (cluster, pod) => {
    await fetch("/api/github/build", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: pod.githubUrl }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch(
          configurePod({
            projectId: state.projectId,
            clusterId: cluster.id,
            podId: pod.id,
            mergePod: data,
          })
        );
      })
      .catch((err) => console.log(err));
  };

  const clusterBundle = [];
  for (const cluster of project.clusters) {
    // bundle pods
    const podBundle = [];
    for (const pod of cluster.pods) {
      podBundle.push(
        <div key={pod.id} className="card">
          <div className="name">{`${pod.name} (${pod.type})`}</div>
          {!pod.config ? (
            <>
              <button
                onClick={() => {
                  dispatch(setClusterId(cluster.id));
                  dispatch(setPodId(pod.id));
                  if (pod.type === "github")
                    dispatch(setModal("ConfigureGithubPod"));
                  if (pod.type === "docker-hub")
                    dispatch(setModal("ConfigureDockerHubPod"));
                }}
              >
                Configure Pod
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  dispatch(setClusterId(cluster.id));
                  dispatch(setPodId(pod.id));
                  if (pod.type === "github")
                    dispatch(setModal("ConfigureGithubPod"));
                  if (pod.type === "docker-hub")
                    dispatch(setModal("ConfigureDockerHubPod"));
                }}
              >
                Edit Configuration
              </button>
              <button
                onClick={() => {
                  dispatch(setClusterId(cluster.id));
                  dispatch(setPodId(pod.id));
                  dispatch(setModal("ConfigurePodReplicas"));
                }}
              >
                <b>Edit Replicas ({pod.replicas})</b>
              </button>
              {!pod.variables ? (
                <button
                  onClick={() => {
                    dispatch(setClusterId(cluster.id));
                    dispatch(setPodId(pod.id));
                    dispatch(setModal("ConfigurePodVariables"));
                  }}
                >
                  Add Variables
                </button>
              ) : (
                <button
                  onClick={() => {
                    dispatch(setClusterId(cluster.id));
                    dispatch(setPodId(pod.id));
                    dispatch(setModal("ConfigurePodVariables"));
                  }}
                >
                  <b>Edit Variables</b>
                </button>
              )}
              {!pod.ingress ? (
                <button
                  onClick={() => {
                    dispatch(setClusterId(cluster.id));
                    dispatch(setPodId(pod.id));
                    dispatch(setModal("ConfigurePodIngress"));
                  }}
                >
                  Add Ingress
                </button>
              ) : (
                <button
                  onClick={() => {
                    dispatch(setClusterId(cluster.id));
                    dispatch(setPodId(pod.id));
                    dispatch(setModal("ConfigurePodIngress"));
                  }}
                >
                  <b>Edit Ingress</b>
                </button>
              )}
              {!pod.volume ? (
                <button
                  onClick={() => {
                    dispatch(setClusterId(cluster.id));
                    dispatch(setPodId(pod.id));
                    dispatch(setModal("ConfigurePodVolume"));
                  }}
                >
                  Add Volume
                </button>
              ) : (
                <button
                  onClick={() => {
                    dispatch(setClusterId(cluster.id));
                    dispatch(setPodId(pod.id));
                    dispatch(setModal("ConfigurePodVolume"));
                  }}
                >
                  <b>Edit Volume</b>
                </button>
              )}
              {pod.type === "github" ? (
                <button
                  onClick={() => {
                    handleClickBuild(cluster, pod);
                  }}
                >
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
              <button
                onClick={() => {
                  dispatch(setClusterId(cluster.id));
                  dispatch(setPodId(pod.id));
                  dispatch(setModal("ConfigurePodYaml"));
                }}
              >
                Create YAML
              </button>
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
      <div key={cluster.id}>
        <h2>
          {cluster.name}{" "}
          <button
            onClick={() => {
              dispatch(setModal("LinkedCloudProviders"));
            }}
          >
            Link AWS Account
          </button>{" "}
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
      </div>
    );
  }

  return (
    <div className="container">
      <FloatLogo />
      <FloatNav />
      <FloatAccount />
      <LinkedCloudProviders />
      <ConfigureProject />
      <ConfigureCluster />
      <ConfigureGithubPod />
      <ConfigureDockerHubPod />
      <ConfigurePodReplicas />
      <ConfigurePodIngress />
      <ConfigurePodVolume />
      <ConfigurePodVariables />
      <ConfigurePodYaml />
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
