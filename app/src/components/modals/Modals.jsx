import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {} from "../../deckhandSlice";
import LinkedCloudProviders from "../modals/LinkedCloudProviders";
import ConfigureProject from "../modals/ConfigureProject";
import ConfigureCluster from "../modals/ConfigureCluster";
import ConfigureIngress from "../modals/ConfigureIngress";
import ConfigureVolume from "../modals/ConfigureVolume";
import ConfigureVarSets from "../modals/ConfigureVarSets";
import PodSource from "../modals/PodSource";
import PodReplicas from "../modals/PodReplicas";
import PodYaml from "../modals/PodYaml";

export default function Modals() {
  const state = useSelector((state) => state.deckhand);
  const dispatch = useDispatch();

  return (
    <>
      {state.modal.name === "LinkedCloudProviders" && <LinkedCloudProviders />}
      {state.modal.name === "ConfigureProject" && <ConfigureProject />}
      {state.modal.name === "ConfigureCluster" && <ConfigureCluster />}
      {state.modal.name === "ConfigureIngress" && <ConfigureIngress />}
      {state.modal.name === "ConfigureVolume" && <ConfigureVolume />}
      {state.modal.name === "ConfigureVarSets" && <ConfigureVarSets />}
      {state.modal.name === "PodSource" && <PodSource />}
      {state.modal.name === "PodReplicas" && <PodReplicas />}
      {state.modal.name === "PodYaml" && <PodYaml />}
    </>
  );
}
