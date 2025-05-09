import React from "react";

const ToolCard = ({ name, icon }) => {
  return (
    <div className="tool-card">
      <img src={icon} alt={name} />
      <p>{name}</p>
    </div>
  );
};

export default ToolCard;
