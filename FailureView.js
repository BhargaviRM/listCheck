import React from "react";

const FailureView = ({ onRetry }) => {
  return (
    <div className="failure-view">
      <h2>Something went wrong!</h2>
      <button onClick={onRetry}>Try Again</button>
    </div>
  );
};

export default FailureView;
