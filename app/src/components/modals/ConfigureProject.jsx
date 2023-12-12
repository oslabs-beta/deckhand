import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showModal, configureProject } from "../../deckhandSlice";
import "./modal.css";

export default function () {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();
  const closeModal = () => {
    setShow(false);
    setTimeout(() => dispatch(showModal({})), 300);
  };
  const project = state.modal.data;

  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    dispatch(
      configureProject({
        projectId: project.projectId,
        name: formData.get("name"),
        provider: formData.get("provider"),
        region: formData.get("region"),
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
        <h2>Configure Project</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" defaultValue={project.name} />
          </label>
          <label>
            Provider:
            <select name="provider">
              <option defaultValue="aws">Amazon Web Services (AWS)</option>
            </select>
          </label>
          <label>
            Region:
            <select name="region">
              <option defaultValue="US-East">US-East</option>
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
