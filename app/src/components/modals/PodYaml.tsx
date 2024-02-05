import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showModal, updateNode } from "../../deckhandSlice";
import createYaml from "../../yaml";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function () {
  const state = useSelector((state: any) => state.deckhand);
  const dispatch = useDispatch();
  const closeModal = () => {
    setShow(false);
    setTimeout(() => dispatch(showModal({})), 300);
  };
  const id = state.modal.id;
  const data = state.modal.data;
  const project = state.modal.data;
  const cluster = state.modal.data;

  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    closeModal();
  };

  const generateYaml = () => {
    // Find connected nodes
    const connectedNodes = state.edges
      .filter((edge: any) => edge.source === id)
      .map((edge: any) => state.nodes.find((node: any) => node.id === edge.target));

    return createYaml.all(
      data,
      connectedNodes,
      data.exposedPort || "(GENERATED DURING DEPLOYMENT)",
      cluster.volumeHandle || "(GENERATED DURING DEPLOYMENT)",
      project.vpcRegion || "(GENERATED DURING DEPLOYMENT)"
    );
  };

  return (
    <div className={`modal ${show ? "show" : ""}`}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={closeModal}>
          &times;
        </span>
        <h2>YAML configuration for {data.name}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            <pre className="yaml">
              <SyntaxHighlighter language="yaml" style={materialDark}>
                {generateYaml()}
              </SyntaxHighlighter>
            </pre>
          </label>
        </form>
      </div>
    </div>
  );
}
