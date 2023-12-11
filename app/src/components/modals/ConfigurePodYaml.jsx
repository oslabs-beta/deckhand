import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setModal, configurePod } from "../../deckhandSlice";
import "./modal.css";
import createYaml from "../../yaml";

export default function ConfigurePodYaml() {
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
    // const formData = new FormData(e.target);
    // const mergePod = {
    //   yaml: formData.get("yaml"),
    // };
    // dispatch(
    //   configurePod({
    //     projectId: state.projectId,
    //     clusterId: state.clusterId,
    //     podId: state.podId,
    //     mergePod: mergePod,
    //   })
    // );
    closeModal();
  };

  return (
    <div
      className={`modal ${state.modal === "ConfigurePodYaml" ? "show" : ""}`}
      onClick={closeModal}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={closeModal}>
          &times;
        </span>
        <h2>YAML File for {pod ? pod.name : ""}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            {/* YAML: */}
            <pre className="yaml" name="yaml">
              {pod ? createYaml.all(pod) : ""}
            </pre>
          </label>
          {/* <div className="buttons">
            <button type="button" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="blue">
              Submit
            </button>
          </div> */}
        </form>
      </div>
    </div>
  );
}
