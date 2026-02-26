import React, { useEffect, useState } from "react";
import "./comissao.css";

// Função para formatar preço no padrão brasileiro
const formatarPreco = (valor) => {
  return Number(valor).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const Comissao = ({ darkMode }) => {
    const [pedidos, setPedidos] = useState([]);

    useEffect(() => {
        const lista = JSON.parse(localStorage.getItem("pedidosSimulados")) || [];
        setPedidos(lista);
    }, []);

    const calcularComissao = (preco, qtd, percentual) =>
        ((preco * qtd) * percentual) / 100;

    const pedidosComComissao = pedidos.filter(
        (p) => p.comissao && parseFloat(p.comissao) > 0
    );

    const totalComissao = pedidosComComissao.reduce((acc, pedido) => {
        const produto = typeof pedido.produto === "string"
            ? JSON.parse(pedido.produto)
            : pedido.produto;
        const qtd = parseInt(pedido.qtd) || 0;
        const preco = parseFloat(produto?.preco) || 0;
        const percentual = parseFloat(pedido.comissao) || 0;
        return acc + calcularComissao(preco, qtd, percentual);
    }, 0);

    return (
        <div className={`comissaoContainer ${darkMode ? "dark" : "light"}`}>
            <div className="comissaoCard">
                <div className="comissaoHeader">
                    <h2>Comissão de Vendas</h2>
                    <p>Acompanhe as comissões dos pedidos realizados</p>
                </div>

                {pedidosComComissao.length === 0 ? (
                    <div className="emptyMessage">
                        <p>Nenhum pedido com comissão registrado.</p>
                    </div>
                ) : (
                    <>
                        <table className="comissaoTable">
                            <thead>
                                <tr>
                                    <th>Produto</th>
                                    <th>Qtd</th>
                                    <th>Preço Unit.</th>
                                    <th>Valor Total</th>
                                    <th>Comissão (%)</th>
                                    <th>Valor Comissão</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidosComComissao.map((pedido, i) => {
                                    const produto = typeof pedido.produto === "string"
                                        ? JSON.parse(pedido.produto)
                                        : pedido.produto;

                                    const qtd = parseInt(pedido.qtd) || 0;
                                    const preco = parseFloat(produto?.preco) || 0;
                                    const percentual = parseFloat(pedido.comissao) || 0;
                                    const total = preco * qtd;
                                    const valorComissao = calcularComissao(preco, qtd, percentual);

                                    return (
                                        <tr key={i}>
                                            <td>{produto?.nome || "Produto desconhecido"}</td>
                                            <td>{qtd}</td>
                                            <td>R$ {formatarPreco(preco)}</td>
                                            <td>R$ {formatarPreco(total)}</td>
                                            <td>{percentual}%</td>
                                            <td>R$ {formatarPreco(valorComissao)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <div className="comissaoTotal">
                            <span>Total de Comissões:</span>
                            <strong>R$ {totalComissao.toFixed(2)}</strong>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Comissao;
