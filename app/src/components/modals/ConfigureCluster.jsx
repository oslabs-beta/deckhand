import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showModal, configureCluster } from "../../deckhandSlice";
import "./modal.css";

export default function () {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();
  const closeModal = () => {
    setShow(false);
    setTimeout(() => dispatch(showModal({})), 300);
  };
  const cluster = state.modal.data;

  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    dispatch(
      configureCluster({
        clusterId: cluster.clusterId,
        name: formData.get("name"),
        instanceType: formData.get("instanceType"),
        minNodes: formData.get("minNodes"),
        maxNodes: formData.get("maxNodes"),
        desiredNodes: formData.get("desiredNodes"),
      })
    );
    closeModal();
  };

  return (
    <div className={`modal ${show ? "show" : ""}`}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={closeModal}>
          &times;
        </span>
        <h2>Configure Cluster</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" defaultValue={cluster.name} />
          </label>
          <label>
            Instance Type:
            <select name="instanceType">
              <option defaultValue="t2.micro">t2.micro</option>
            </select>
          </label>
          <label>
            Min Nodes:
            <input type="text" name="minNodes" defaultValue="1" />
          </label>
          <label>
            Max Nodes:
            <input type="text" name="maxNodes" defaultValue="3" />
          </label>
          <label>
            Desired Nodes:
            <input type="text" name="desiredNodes" defaultValue="2" />
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
