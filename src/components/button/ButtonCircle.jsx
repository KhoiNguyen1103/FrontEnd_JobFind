import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import React from "react";

const ButtonCircle = ({ direction = "left", onClick, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-3 py-1 border rounded-full bg-primary text-white disabled:opacity-50"
    >
      <FontAwesomeIcon
        icon={direction === "left" ? faAngleLeft : faAngleRight}
      />
    </button>
  );
};

export default ButtonCircle;
