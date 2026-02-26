import React, { useEffect, useState } from 'react';
import './top.css';
import { BiSearchAlt } from 'react-icons/bi';
import { TbMessageCircle } from 'react-icons/tb';
import { MdOutlineNotificationsNone, MdDarkMode } from 'react-icons/md';
import Badge from '@mui/material/Badge';

const HeaderSection = ({ darkMode, toggleTheme }) => {
    const [alertCount, setAlertCount] = useState(0);
    const [showAlerts, setShowAlerts] = useState(false);
    const [produtosComEstoqueBaixo, setProdutosComEstoqueBaixo] = useState([]);

    useEffect(() => {
        const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
        const baixos = produtos.filter(prod => parseInt(prod.qtd) <= 0);
        setAlertCount(baixos.length);
        setProdutosComEstoqueBaixo(baixos);
    }, []);

    const handleNotificationClick = () => {
        setShowAlerts(!showAlerts);
    };

    return (
        <div className={`headerSection ${darkMode ? "dark" : "light"}`}>
            <div className="title">
                <h1>Bem-vindo!</h1>
                <p>Gerencie seus pedidos e produtos</p>
            </div>
            <div className="adminDiv">
                <Badge badgeContent={alertCount} color="error">
                    <div className="icon" onClick={handleNotificationClick}>
                        <MdOutlineNotificationsNone />
                    </div>
                </Badge>
                <div className="icon" onClick={toggleTheme}>
                    <MdDarkMode />
                </div>

                {showAlerts && (
                    <div className="alertsDropdown">
                        <h4>Estoque baixo</h4>
                        {produtosComEstoqueBaixo.length === 0 ? (
                            <p>Nenhum produto com estoque zerado.</p>
                        ) : (
                            <ul className="alertsList">
                                {produtosComEstoqueBaixo.map((prod, idx) => (
                                    <li key={idx}>
                                        <strong>{prod.nome}</strong>
                                        <span>Qtd: {prod.qtd}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HeaderSection;
