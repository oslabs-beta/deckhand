import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showModal, configurePod } from "../../deckhandSlice";
import "./modal.css";
import createYaml from "../../yaml";

export default function () {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();
  const closeModal = () => {
    setShow(false);
    setTimeout(() => dispatch(showModal({})), 300);
  };
  const pod = state.modal.data;
  const varSet = state.varSets.find(
    (varSet) => varSet.varSetId === pod.varSetId
  );
  const ingress = state.ingresses.find(
    (ingress) => ingress.ingressId === pod.ingressId
  );
  const volume = state.volumes.find(
    (volume) => volume.volumeId === pod.volumeId
  );

  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    closeModal();
  };

  return (
    <div className={`modal ${show ? "show" : ""}`}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={closeModal}>
          &times;
        </span>
        <h2>YAML File for {pod.name}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            <pre className="yaml" name="yaml">
              {createYaml.all(pod)}
            </pre>
          </label>
        </form>
      </div>
    </div>
  );
}
