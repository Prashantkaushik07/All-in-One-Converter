import React from "react";
import "./WhySection.css";

const WhySection = () => {
  const features = [
    {
      icon: "⚡",
      title: "Fast",
      description:
        "Our tools processing is powerful. It takes less time to perform any task on any tool.",
    },
    {
      icon: "🛡️",
      title: "Security",
      description:
        "All files uploaded by you will be automatically permanently erased from our servers after 2 hours.",
    },
    {
      icon: "👥",
      title: "User Friendly",
      description:
        "All the tools are designed for all users, advanced knowledge is not required.",
    },
  ];

  return (
    <div className="why-section">
      <h2>Why All in One?</h2>
      <div className="why-features">
        {features.map((feature, index) => (
          <div className="why-feature" key={index}>
            <div className="icon">{feature.icon}</div>
            <h4>{feature.title}</h4>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhySection;
