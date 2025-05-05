import React from "react";
import { Dropdown } from "react-bootstrap";
import "./DropdownMenu.css"; // Optional, for custom styling

const DropdownMenu = ({ title, items }) => {
  return (
    <Dropdown>
      <Dropdown.Toggle
        variant="link"
        id="dropdown-basic"
        className="dropdown-toggle"
      >
        {title}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {items.map((item, index) => (
          <Dropdown.Item key={index} href={item.link}>
            {item.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DropdownMenu;
