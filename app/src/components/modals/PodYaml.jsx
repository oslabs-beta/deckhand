import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showModal, updateNode } from "../../deckhandSlice";
import "./modal.css";
import createYaml from "../../yaml";

export default function () {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();
  const closeModal = () => {
    setShow(false);
    setTimeout(() => dispatch(showModal({})), 300);
  };
  const id = state.modal.id;
  const data = state.modal.data;

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
        <h2>YAML File for {data.name}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            <pre className="yaml" name="yaml">
              {createYaml.all(pods)}
            </pre>
          </label>
        </form>
      </div>
    </div>
  );
}
