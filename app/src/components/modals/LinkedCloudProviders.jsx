import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setModal, setUser } from "../../deckhandSlice";
import "./modal.css";

export default function LinkedCloudProviders() {
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
      awsAccessKey: formData.get("awsAccessKey"),
      awsSecretKey: formData.get("awsSecretKey"),
    };
    dispatch(setUser(data));
    closeModal();
  };

  return (
    <div
      className={`modal ${
        state.modal === "LinkedCloudProviders" ? "show" : ""
      }`}
      onClick={closeModal}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={closeModal}>
          &times;
        </span>
        <h2>Link AWS Account</h2>
        <form onSubmit={handleSubmit}>
          <label>
            AWS Access Key:
            <input type="password" name="awsAccessKey" />
          </label>
          <label>
            AWS Secret Key:
            <input type="password" name="awsSecretKey" />
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
