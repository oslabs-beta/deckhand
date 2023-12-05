import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { configureCluster } from "../../deckhandSlice";
import "./modal.css";

export default function ConfigureClusterModal({
  showModal,
  setShowModal,
  projectId,
  clusterId,
}) {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();

  const closeModal = () => setShowModal(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      instanceType: formData.get("instanceType"),
      minNodes: formData.get("minNodes"),
      maxNodes: formData.get("maxNodes"),
    };
    dispatch(configureCluster({ projectId, clusterId, config: data }));
    closeModal();
  };

  return (
    <div className={`modal ${showModal ? "show" : ""}`} onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={closeModal}>
          &times;
        </span>
        <h2>Configure Cluster</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" value="cluster1" />
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
