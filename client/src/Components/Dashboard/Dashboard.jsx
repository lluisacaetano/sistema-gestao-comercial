import React, { useState } from "react";
import "../../App.css";
import Sidebar from "../Dashboard/SideBarSection/Sidebar";
import Body from "../Dashboard/BodySection/Body";
import CadastrarProduto from "./ProductForm";
import Comissao from "./Comissao";
import AlertaEstoque from "./AlertaEstoque";
import SimularPedido from "./SimuladorPedido";
import HeaderSection from "../Dashboard/BodySection/TopSection/HeaderSection";

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Body darkMode={darkMode} toggleTheme={toggleTheme} />;
      case "cadastrar-produto":
        return <CadastrarProduto darkMode={darkMode} />;
      case "simular-pedido":
        return <SimularPedido darkMode={darkMode} />;
      case "cadastrar-funcionario":
        return <CadastrarFuncionario darkMode={darkMode} />;
      case "alerta-estoque":
        return <AlertaEstoque darkMode={darkMode} />;
      case "comissao":
        return <Comissao darkMode={darkMode} />;
      default:
        return <Body darkMode={darkMode} toggleTheme={toggleTheme} />;
    }
  };

  return (
    <div className={`dashboard ${darkMode ? "dark" : "light"}`}>
      <div className="dashboardContainer flex">
        <Sidebar
          darkMode={darkMode}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <div className="mainContent">
          <HeaderSection darkMode={darkMode} toggleTheme={toggleTheme} />
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
