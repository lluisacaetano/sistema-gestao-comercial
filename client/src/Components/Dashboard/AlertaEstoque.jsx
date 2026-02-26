import React, { useEffect, useState } from "react";
import "./alertaestoque.css";

const AlertaEstoque = ({ darkMode }) => {
    const [produtosBaixo, setProdutosBaixo] = useState([]);

    useEffect(() => {
        const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
        const filtrados = produtos.filter(prod => parseInt(prod.qtd, 10) <= 0);
        setProdutosBaixo(filtrados);
    }, []);

    return (
        <div className={`alertaEstoqueContainer ${darkMode ? "dark" : "light"}`}>
            <div className="alertaCard">
                <div className="alertaHeader">
                    <div>
                        <h2>Alerta de Estoque</h2>
                        <p>Produtos com estoque zerado ou negativo</p>
                    </div>
                    {produtosBaixo.length > 0 && (
                        <span className="alertaBadge">
                            {produtosBaixo.length} {produtosBaixo.length === 1 ? 'produto' : 'produtos'}
                        </span>
                    )}
                </div>

                {produtosBaixo.length === 0 ? (
                    <div className="successMessage">
                        <p>Todos os produtos estão com estoque suficiente.</p>
                    </div>
                ) : (
                    <table className="alertaTable">
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Quantidade</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {produtosBaixo.map((prod, i) => (
                                <tr key={i}>
                                    <td>{prod.nome}</td>
                                    <td>{prod.qtd}</td>
                                    <td>
                                        <span className="statusCritico">Crítico</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AlertaEstoque;
