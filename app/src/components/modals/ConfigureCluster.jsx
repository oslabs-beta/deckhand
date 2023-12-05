import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setModal, configureCluster } from "../../deckhandSlice";
import "./modal.css";

export default function ConfigureCluster() {
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
    const data = {
      name: formData.get("name"),
      instanceType: formData.get("instanceType"),
      minNodes: formData.get("minNodes"),
      maxNodes: formData.get("maxNodes"),
    };
    dispatch(
      configureCluster({
        projectId: state.projectId,
        clusterId: state.clusterId,
        config: data,
      })
    );
    closeModal();
  };

  return (
    <div
      className={`modal ${state.modal === "ConfigureCluster" ? "show" : ""}`}
      onClick={closeModal}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={closeModal}>
          &times;
        </span>
        <h2>Configure Cluster</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={cluster?.name.replace(/\s/g, "").toLowerCase() || ""}
            />
          </label>
          <label>
            Instance Type:
            <select name="instanceType">
              <option value="t2.micro">t2.micro</option>
            </select>
          </label>
          <label>
            Min Nodes:
            <input type="text" name="minNodes" value="1" />
          </label>
          <label>
            Max Nodes:
            <input type="text" name="maxNodes" value="3" />
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
