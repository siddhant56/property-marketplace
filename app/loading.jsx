"use client";
import React from "react";
import { ClipLoader } from "react-spinners";

const override = {
  display: "block",
  margin: "100px auto",
};
const LoadingPage = ({ loading }) => {
  return (
    <ClipLoader
      color="#3b82f6"
      loading={loading}
      size={150}
      aria-label="Loading Spinner"
      cssOverride={override}
    ></ClipLoader>
  );
};

export default LoadingPage;
