import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setModal, configurePod } from "../../deckhandSlice";
import "./modal.css";

export default function ConfigureGithubPod() {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();
  const closeModal = () => dispatch(setModal(null));
  const project = state.projectId
    ? state.projects.find((p) => p.id === state.projectId)
    : null;
  const cluster = state.clusterId
    ? project.clusters.find((c) => c.id === state.clusterId)
    : null;
  const pod = state.podId
    ? cluster.pods.find((p) => p.id === state.podId)
    : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const mergePod = {
      name: formData.get("name"),
      config: {
        url: formData.get("url"),
        build: formData.get("build"),
        branch: formData.get("branch"),
      },
    };
    dispatch(
      configurePod({
        projectId: state.projectId,
        clusterId: state.clusterId,
        podId: state.podId,
        mergePod: mergePod,
      })
    );
    closeModal();
  };

  return (
    <div
      className={`modal ${state.modal === "ConfigureGithubPod" ? "show" : ""}`}
      onClick={closeModal}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={closeModal}>
          &times;
        </span>
        <h2>Configure Pod</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" value={pod ? pod.name : ""} />
          </label>
          <label>
            Github Repo:
            <input
              type="text"
              name="url"
              value="http://github.com/o-mirza/example-repo"
            />
          </label>
          <label>
            Build:
            <select name="build">
              <option value="1.0.5">1.0.5</option>
            </select>
          </label>
          <label>
            Branch:
            <select name="branch">
              <option value="main">main</option>
            </select>
          </label>
          <div className="buttons">
            <button type="button" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="blue">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
