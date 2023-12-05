import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setModal, configureProject } from "../../deckhandSlice";
import "./modal.css";

export default function ConfigureProject() {
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
      provider: formData.get("provider"),
      region: formData.get("region"),
    };
    dispatch(
      configureProject({
        projectId: state.projectId,
        clusterId: state.clusterId,
        config: data,
      })
    );
    closeModal();
  };

  return (
    <div
      className={`modal ${state.modal === "ConfigureProject" ? "show" : ""}`}
      onClick={closeModal}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={closeModal}>
          &times;
        </span>
        <h2>Configure Project</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={
                project ? project.name.replace(/\s/g, "").toLowerCase() : ""
              }
            />
          </label>
          <label>
            Provider:
            <select name="provider">
              <option value="aws">Amazon Web Services (AWS)</option>
            </select>
          </label>
          <label>
            Provider:
            <select name="region">
              <option value="US-East">US-East</option>
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
