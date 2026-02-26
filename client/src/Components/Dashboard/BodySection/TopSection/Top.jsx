import React, { useState, useEffect } from 'react';
import './top.css';
import { MdOutlineFoodBank, MdAllInbox } from 'react-icons/md';
import { BsTruck, BsArrowDownShort } from 'react-icons/bs';

const Top = ({ darkMode, toggleTheme }) => {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({
    totalValue: 0,
    interno: { count: 0, total: 0 },
    retirada: { count: 0, total: 0 },
    delivery: { count: 0, total: 0 }
  });

  const [editandoStatusId, setEditandoStatusId] = useState(null);
  const [novoStatus, setNovoStatus] = useState('');

  useEffect(() => {
    const savedOrders = localStorage.getItem('pedidosSimulados');
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders);
        const normalizados = parsedOrders.map((pedido) => ({
          ...pedido,
          produto: typeof pedido.produto === 'string'
            ? JSON.parse(pedido.produto)
            : pedido.produto
        }));
        setOrders(normalizados);
      } catch (error) {
        console.error('Erro ao carregar pedidos do localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    const newSummary = {
      totalValue: 0,
      interno: { count: 0, total: 0 },
      retirada: { count: 0, total: 0 },
      delivery: { count: 0, total: 0 }
    };

    orders.forEach(order => {
      const qtd = parseInt(order.qtd);
      const preco = parseFloat(order.produto?.preco || 0);
      const valorTotal = qtd * preco;

      newSummary.totalValue += valorTotal;

      if (order.opcap === 'interno') {
        newSummary.interno.count += qtd;
        newSummary.interno.total += valorTotal;
      } else if (order.opcap === 'retirada') {
        newSummary.retirada.count += qtd;
        newSummary.retirada.total += valorTotal;
      } else if (order.opcap === 'delivery') {
        newSummary.delivery.count += qtd;
        newSummary.delivery.total += valorTotal;
      }
    });

    setSummary(newSummary);
  }, [orders]);

  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString.replace(/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2}):(\d{2})/, '$3-$2-$1T$4:$5:$6'));
      const now = new Date();
      const diff = Math.floor((now - date) / 60000);
      return diff < 60 ? `Hoje - ${diff}min atrás` : `Hoje - ${Math.floor(diff / 60)}h atrás`;
    } catch (error) {
      return dateString;
    }
  };

  const getStatusDisplay = (status) => {
    const normalized = status?.toLowerCase().trim();
    if (['feito'].includes(normalized)) return { text: 'Aceito', className: 'done' };
    if (['concluido'].includes(normalized)) return { text: 'Concluído', className: 'done' };
    if (['preparando', 'preparo'].includes(normalized)) return { text: 'Preparando', className: 'preparing' };
    if (['pendente', 'espera'].includes(normalized)) return { text: 'Pendente', className: 'pending' };
    return { text: 'Indefinido', className: 'undefined' };
  };

  const handleEditarStatus = (id, statusAtual) => {
    setEditandoStatusId(id);
    setNovoStatus(statusAtual);
  };

  const handleSalvarStatus = (id) => {
    const pedidosAtualizados = orders.map((pedido) =>
      pedido.id === id ? { ...pedido, status: novoStatus } : pedido
    );
    setOrders(pedidosAtualizados);
    localStorage.setItem('pedidosSimulados', JSON.stringify(pedidosAtualizados));
    setEditandoStatusId(null);
  };

  const handleCancelarEdicao = () => {
    setEditandoStatusId(null);
  };

  const handleExcluirPedido = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este pedido?")) {
      const pedidosAtualizados = orders.filter((pedido) => pedido.id !== id);
      setOrders(pedidosAtualizados);
      localStorage.setItem('pedidosSimulados', JSON.stringify(pedidosAtualizados));
    }
  };

  return (
    <div className={`topSection ${darkMode ? "dark" : "light"}`}>
      <div className="contentSection">
        <div className="totalsCard">
          <div className="totalHeader">
            <h3>Valor total: R$ {summary.totalValue.toFixed(2)}</h3>
          </div>
          <div className="iconsSummary">
            <div className="iconCard yellow">
              <MdOutlineFoodBank />
              <p>Interno<br /><strong>{summary.interno.count}</strong></p>
            </div>
            <div className="iconCard red">
              <MdAllInbox />
              <p>Retirada<br /><strong>{summary.retirada.count}</strong></p>
            </div>
            <div className="iconCard blue">
              <BsTruck />
              <p>Delivery<br /><strong>{summary.delivery.count}</strong></p>
            </div>
          </div>
        </div>

        <div className="ordersCard">
          <div className="ordersHeader">
            <h3>Pedidos</h3>
          </div>

          <table className="ordersTable">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Horário</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)' }}>
                    Nenhum pedido encontrado
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const preco = parseFloat(order.produto?.preco || 0);
                  const qtd = parseInt(order.qtd);
                  const total = preco * qtd;
                  const statusDisplay = getStatusDisplay(order.status);

                  return (
                    <tr key={order.id}>
                      <td>
                        <strong>{order.produto?.nome}</strong>
                        <small>Qtd: {qtd} | {order.opcap}</small>
                      </td>
                      <td>{formatTime(order.dataSimulacao)}</td>
                      <td>
                        <strong>R$ {total.toFixed(2)}</strong>
                        <small>Unit: R$ {preco.toFixed(2)}</small>
                      </td>
                      <td>
                        {editandoStatusId === order.id ? (
                          <select value={novoStatus} onChange={(e) => setNovoStatus(e.target.value)}>
                            <option value="preparo">Preparando</option>
                            <option value="feito">Aceito</option>
                            <option value="concluido">Concluído</option>
                            <option value="pendente">Pendente</option>
                            <option value="cancelado">Cancelado</option>
                          </select>
                        ) : (
                          <span className={`status ${statusDisplay.className}`}>
                            {statusDisplay.text}
                          </span>
                        )}
                      </td>
                      <td>
                        {editandoStatusId === order.id ? (
                          <>
                            <button
                              onClick={() => handleSalvarStatus(order.id)}
                              style={{
                                backgroundColor: 'var(--success)',
                                color: '#fff'
                              }}
                            >
                              Salvar
                            </button>
                            <button
                              onClick={handleCancelarEdicao}
                              style={{
                                backgroundColor: 'var(--gray-400)',
                                color: '#fff'
                              }}
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditarStatus(order.id, order.status)}
                              style={{
                                backgroundColor: 'var(--primary)',
                                color: '#fff'
                              }}
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleExcluirPedido(order.id)}
                              style={{
                                backgroundColor: 'var(--danger)',
                                color: '#fff'
                              }}
                            >
                              Excluir
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          <div className="moreOrders">
            <span>Mais Pedidos ({orders.length})</span>
            <BsArrowDownShort />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Top;
