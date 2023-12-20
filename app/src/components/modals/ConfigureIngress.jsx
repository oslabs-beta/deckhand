import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showModal, addIngress, configureIngress } from "../../deckhandSlice";
import "./modal.css";

export default function () {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();
  const closeModal = () => {
    setShow(false);
    setTimeout(() => dispatch(showModal({})), 300);
  };
  const ingress = state.modal.data;

  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    dispatch(
      configureIngress({
        ingressId: ingress.ingressId,
        host: formData.get("host"),
        path: formData.get("path"),
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
        <h2>Configure Ingress Route</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Host:
            <input type="text" name="host" defaultValue="example.com" />
          </label>
          <label>
            Path:
            <input type="text" name="path" defaultValue="/path" />
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
