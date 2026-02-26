import React from 'react';
import './body.css';
import Top from './TopSection/Top';
import CadastrarProduto from '../ProductForm';
import { Routes, Route } from 'react-router-dom';

const Body = ({ darkMode, toggleTheme }) => {
  return (
    <div className={`mainContent ${darkMode ? "dark" : "light"}`}>
      <Top darkMode={darkMode} toggleTheme={toggleTheme} />

      <Routes>
        {/* Página de cadastro de produto */}
        <Route path="/cadastrar-produto" element={<CadastrarProduto darkMode={darkMode} />} />
      </Routes>
    </div>
  );
};

export default Body;
