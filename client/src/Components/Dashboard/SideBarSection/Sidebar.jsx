import React from 'react';
import './sidebar.css';
import logo from '../../../Assets/logo.png';
// Menu atualizado
import { IoMdSpeedometer } from 'react-icons/io';
import { MdDeliveryDining } from 'react-icons/md';
import { BsCreditCard2Front } from 'react-icons/bs';
import { AiOutlinePieChart } from 'react-icons/ai';
import { BiTrendingUp } from 'react-icons/bi';

const Sidebar = ({ darkMode, activeSection, setActiveSection }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Painel', icon: IoMdSpeedometer },
    { id: 'simular-pedido', label: 'Simular Pedido', icon: MdDeliveryDining },
    { id: 'cadastrar-produto', label: 'Cadastro Produto', icon: BsCreditCard2Front },
    { id: 'alerta-estoque', label: 'Alerta Estoque', icon: AiOutlinePieChart },
    { id: 'comissao', label: 'Comissão', icon: BiTrendingUp },
  ];

  return (
    <div className={`sideBar ${darkMode ? "dark" : "light"}`}>
      <div className="logoDiv">
        <img src={logo} alt="Logo" />
        <h2>Gestor de Pedidos</h2>
      </div>
      <div className="menuDiv">
        <h3 className="divTitle">MENU</h3>
        <ul className="menuLists">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id} className="listItem">
                <a
                  href="#"
                  className={`menuLink ${activeSection === item.id ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveSection(item.id);
                  }}
                >
                  <Icon className="icon" />
                  <span className="smallText">{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
