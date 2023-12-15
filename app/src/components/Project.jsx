import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  showModal,
  addCluster,
  deleteCluster,
  addPod,
  deletePod,
  configurePod,
  addVarSet,
  addIngress,
  addVolume,
} from "../deckhandSlice";
import FloatLogo from "./floats/FloatLogo";
import FloatProject from "./floats/FloatProject";
import FloatAccount from "./floats/FloatAccount";
import Modals from "./modals/Modals";
import Icon from "@mdi/react";
import { mdiTrashCanOutline } from "@mdi/js";
import { mdiCogOutline } from "@mdi/js";
import { mdiDotsVertical } from "@mdi/js";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function Project() {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();
  const project = state.projects.find((p) => p.projectId === state.projectId);
  const clusters = state.clusters?.filter(
    (cluster) => cluster.projectId === project.projectId
  );

  useEffect(() => {
    const fetchPodData = async () => {
      for (let cluster of clusters) {
        const pods = state.pods?.filter(
          (pod) => pod.clusterId === cluster.clusterId
        );
        for (let pod of pods) {
          if (pod.type === "docker-hub" && pod.imageName) {
            await getImageTags(pod.podId, pod.imageName);
          }
          if (pod.type === "github" && pod.githubRepo) {
            await getBranches(pod.podId, pod.githubRepo);
          }
        }
      }
    };
    fetchPodData().catch(console.error);
  }, []);

  const getBranches = async (podId, repo) => {
    await fetch("/api/github/branches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ repo }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch(
          configurePod({
            podId: podId,
            githubBranches: data,
          })
        );
      })
      .catch((err) => console.log(err));
  };

  const setImageTag = (podId, imageTag) => {
    dispatch(
      configurePod({
        podId: podId,
        imageTag: imageTag,
      })
    );
  };

  const setBranch = (podId, branch) => {
    dispatch(
      configurePod({
        podId: podId,
        githubBranch: branch,
      })
    );
  };

  const getImageTags = async (podId, image) => {
    await fetch(`/api/dockerHubImageTags/${image}`)
      .then((res) => res.json())
      .then((data) => {
        dispatch(
          configurePod({
            podId: podId,
            imageTags: data,
          })
        );
      })
      .catch((error) => console.log(error));
  };

  const handleClickBuild = async (pod) => {
    await fetch("/api/github/build", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        repo: pod.githubRepo,
        branch: pod.githubBranch,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch(
          configurePod({
            podId: pod.podId,
            ...data,
          })
        );
      })
      .catch((err) => console.log(err));
  };

  const clusterBundle = [];
  for (const cluster of clusters) {
    // bundle pods
    const podBundle = [];
    const pods = state.pods?.filter(
      (pod) => pod.clusterId === cluster.clusterId
    );
    for (const pod of pods) {
      const varSets = state.varSets.filter(
        (varSet) => varSet.podId === pod.podId
      );
      const ingresses = state.ingresses.filter(
        (ingress) => ingress.podId === pod.podId
      );
      const volumes = state.volumes.filter(
        (volume) => volume.podId === pod.podId
      );
      podBundle.push(
        <div key={pod.podId} className="card">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="card-menu" aria-label="Customise options">
                <Icon path={mdiDotsVertical} size={1} />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="dropdown"
                onClick={(e) => e.stopPropagation()}
              >
                <DropdownMenu.Item
                  className="dropdown-item"
                  onClick={() =>
                    dispatch(showModal({ name: "PodSource", data: pod }))
                  }
                >
                  Select Source
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  className="dropdown-item"
                  onClick={() =>
                    dispatch(showModal({ name: "ConfigurePodYaml", data: pod }))
                  }
                >
                  Show YAML
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="dropdown-separator" />
                <DropdownMenu.Item
                  className="dropdown-item"
                  onClick={() => dispatch(deletePod(pod.podId))}
                >
                  Delete
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
          <div className="name">{`${pod.name} (${pod.type})`}</div>
          {pod.type === "docker-hub" && pod.imageName && (
            <select
              name="tag"
              onChange={(e) => setImageTag(pod.podId, e.target.value)}
            >
              {pod.imageTags
                ? pod.imageTags.map((el) => (
                    <option key={el} value={el}>
                      {el}
                    </option>
                  ))
                : ""}
            </select>
          )}
          {pod.type === "github" && pod.githubRepo && (
            <select
              name="branch"
              onChange={(e) => setBranch(pod.podId, e.target.value)}
            >
              {pod.githubBranches
                ? pod.githubBranches.map((el) => (
                    <option key={el} value={el}>
                      {el}
                    </option>
                  ))
                : ""}
            </select>
          )}
          {!pod.type ? (
            <>
              <button
                onClick={() =>
                  dispatch(showModal({ name: "PodSource", data: pod }))
                }
              >
                Select Source
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() =>
                  dispatch(
                    showModal({ name: "ConfigurePodReplicas", data: pod })
                  )
                }
              >
                <b>Edit Replicas ({pod.replicas})</b>
              </button>
              {!varSets.length ? (
                <button
                  onClick={() => {
                    dispatch(
                      addVarSet({
                        varSetId: Math.floor(Math.random() * 10000),
                        podId: pod.podId,
                      })
                    );
                  }}
                >
                  Add Variables
                </button>
              ) : (
                <button
                  onClick={() =>
                    dispatch(
                      showModal({
                        name: "ConfigurePodVariables",
                        data: varSets[0],
                      })
                    )
                  }
                >
                  <b>Edit Variables</b>
                </button>
              )}
              {!ingresses.length ? (
                <button
                  onClick={() => {
                    dispatch(
                      addIngress({
                        ingressId: Math.floor(Math.random() * 10000),
                        podId: pod.podId,
                      })
                    );
                  }}
                >
                  Add Ingress
                </button>
              ) : (
                <button
                  onClick={() =>
                    dispatch(
                      showModal({
                        name: "ConfigurePodIngress",
                        data: ingresses[0],
                      })
                    )
                  }
                >
                  <b>Edit Ingress</b>
                </button>
              )}
              {!volumes.length ? (
                <button
                  onClick={() => {
                    dispatch(
                      addVolume({
                        volumeId: Math.floor(Math.random() * 10000),
                        podId: pod.podId,
                      })
                    );
                  }}
                >
                  Add Volume
                </button>
              ) : (
                <button
                  onClick={() => {
                    dispatch(
                      showModal({
                        name: "ConfigurePodVolume",
                        data: volumes[0],
                      })
                    );
                  }}
                >
                  <b>Edit Volume</b>
                </button>
              )}
              {pod.type === "github" ? (
                <button
                  onClick={() => {
                    handleClickBuild(pod);
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
            </>
          )}
        </div>
      );
    }

    // bundle clusters
    clusterBundle.push(
      <div key={cluster.clusterId}>
        <h2>
          {cluster.name}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Icon className="icon" path={mdiDotsVertical} size={0.75} />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="dropdown"
                onClick={(e) => e.stopPropagation()}
              >
                <DropdownMenu.Item
                  className="dropdown-item"
                  onClick={() => {
                    dispatch(
                      showModal({ name: "ConfigureCluster", data: project })
                    );
                  }}
                >
                  Configure
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="dropdown-separator" />
                <DropdownMenu.Item
                  className="dropdown-item"
                  onClick={() => dispatch(deleteCluster(cluster.clusterId))}
                >
                  Delete
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </h2>
        <div id="pod-cards">
          <div
            className="card"
            onClick={() => {
              const podId = Math.floor(Math.random() * 10000); // fetch new pod ID from SQL
              dispatch(
                addPod({
                  podId: podId,
                  clusterId: cluster.clusterId,
                })
              );
            }}
          >
            <div className="new-pod">New Pod</div>
          </div>
          {podBundle}
        </div>
      </div>
    );
  }

  const useECR = async (e) => {
    
    e.preventDefault();

    await fetch('/api/awsEcr/repositoryMaker', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify({
        repoName: document.getElementById('repoName').value,
        imageName: document.getElementById('imageName').value,
        githuburl: document.getElementById('githuburl').value
      })
    }).then(res => res.json())
    .then(data => console.log(data));

  };

  return (
    <div className="container">
      <FloatLogo />
      <FloatProject />
      <FloatAccount />
      <Modals />
      <div className="content-container">
        <div className="content">
          {clusterBundle}
          <div id="new-cluster">
            <button
              onClick={() =>
                dispatch(
                  addCluster({
                    clusterId: Math.floor(Math.random() * 10000), // get from SQL once connected
                    projectId: project.projectId,
                  })
                )
              }
            >
              + Add Cluster
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={useECR}>
        <input id='repoName' placeholder='repoName' />
        <input id='imageName'placeholder='imageName' />
        <input id='githuburl' placeholder='githuburl' />
        <button>Click Me</button>
      </form>
      
    </div>
  );
}
