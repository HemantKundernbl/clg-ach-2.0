import React from "react";
import Logo from "../assets/logo.png";

const Header = () => {
  return (
    <div
      className=" py-2 text-white text-center"
      style={{ backgroundColor: "#6e263a" }}
    >
      <div className=" flex my-4 justify-center">
        <a href="https://www.consumerlaw.com/">
          <img className="custom-logo" src={Logo} alt="Custom Logo" />
        </a>
      </div>
      <p className="font text-lg py-2">Los Guardianes Del Pueblo</p>
      <p className="pb-3">
        <i>
          Trayendo alivio de inmigración a nuestra comunidad, a todo el país.
        </i>
      </p>
    </div>
  );
};

export default Header;
