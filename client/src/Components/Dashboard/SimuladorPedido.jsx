import React, { useState } from "react";
import "./SimularPedido.css";
// Import the default logo image
import defaultLogo from '../../Assets/logo.png';

// Função para formatar preço no padrão brasileiro
const formatarPreco = (valor) => {
  return Number(valor).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const SimularPedido = ({ darkMode }) => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [formData, setFormData] = useState({
    codproduto: "",
    qtd: "",
    opcap: "",
    status: "",
    comissao: "",
  });

  // Buscar produtos do localStorage
  const [produtos] = useState(() => {
    const produtosStorage = localStorage.getItem('produtos');
    return produtosStorage ? JSON.parse(produtosStorage) : [];
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSimular = (produto) => {
    setProdutoSelecionado(produto);
    setFormData({
      codproduto: produto.codigo || produto.nome || "",
      qtd: "",
      opcap: "",
      status: "",
      comissao: "",
    });
    setMostrarFormulario(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verificar se há estoque suficiente
    const quantidadeSolicitada = parseInt(formData.qtd);
    const estoqueAtual = parseInt(produtoSelecionado.qtd || 0);

    if (quantidadeSolicitada > estoqueAtual) {
      alert(`Estoque insuficiente! Disponível: ${estoqueAtual}, Solicitado: ${quantidadeSolicitada}`);
      return;
    }

    // Criar objeto do pedido simulado
    const pedidoSimulado = {
      ...formData,
      produto: produtoSelecionado,
      dataSimulacao: new Date().toLocaleString(),
      id: Date.now() // ID único baseado no timestamp
    };

    // Salvar pedido no localStorage
    const pedidosStorage = localStorage.getItem('pedidosSimulados');
    const pedidos = pedidosStorage ? JSON.parse(pedidosStorage) : [];
    pedidos.push(pedidoSimulado);
    localStorage.setItem('pedidosSimulados', JSON.stringify(pedidos));

    // Atualizar estoque do produto
    const produtosStorage = localStorage.getItem('produtos');
    const produtos = produtosStorage ? JSON.parse(produtosStorage) : [];

    const produtoIndex = produtos.findIndex(p =>
        (p.codigo && p.codigo === produtoSelecionado.codigo) ||
        (p.nome === produtoSelecionado.nome)
    );

    if (produtoIndex !== -1) {
      produtos[produtoIndex].qtd = estoqueAtual - quantidadeSolicitada;
      localStorage.setItem('produtos', JSON.stringify(produtos));
    }

    console.log("Pedido simulado:", pedidoSimulado);
    alert(`Pedido simulado com sucesso! Estoque atualizado: ${estoqueAtual - quantidadeSolicitada}`);

    setFormData({
      codproduto: "",
      qtd: "",
      opcap: "",
      status: "",
      comissao: "",
    });
    setMostrarFormulario(false);
    setProdutoSelecionado(null);

    // Forçar atualização da lista de produtos
    window.location.reload();
  };

  const getImagePath = (produto) => {
    // Se o produto tem uma URL de imagem válida, use ela
    if (produto.imagemUrl && produto.imagemUrl.startsWith('http')) {
      return produto.imagemUrl;
    }
    // Se tem campo 'imagem' antigo, tenta usar ele
    if (produto.imagem) {
      return `/assets/${produto.imagem}`;
    }
    // Senão, usa logo padrão
    return defaultLogo;
  };

  return (
      <div className={`simularPedidoContainer ${darkMode ? "dark" : "light"}`}>
        <h2 className="titulo">Simulador de Pedido</h2>

        {/* Lista de Produtos */}
        <div className="produtosGrid">
          {produtos.map((produto, index) => (
              <div key={index} className="produtoCard">
                <img
                    src={getImagePath(produto)}
                    alt={produto.nome}
                    className="produtoImagem"
                    onError={(e) => {
                      // Fallback to default logo if image fails to load
                      e.target.src = defaultLogo;
                    }}
                />
                <h3 className="produtoNome">{produto.nome}</h3>
                <p className="produtoCodigo">Produto: {produto.nome}</p>
                <p className="produtoPreco">
                  R$ {produto.preco ? formatarPreco(produto.preco) : '0,00'}
                </p>
                <p className="produtoQuantidade">
                  Estoque: {produto.qtd || 0}
                </p>
                {produto.descricao && (
                    <p className="produtoDescricao">
                      {produto.descricao.length > 50
                          ? produto.descricao.substring(0, 50) + '...'
                          : produto.descricao}
                    </p>
                )}
                <button
                    className="btnSimular"
                    onClick={() => handleSimular(produto)}
                >
                  Simular Pedido
                </button>
              </div>
          ))}
        </div>

        {produtos.length === 0 && (
            <div className="semProdutos">
              <p>Nenhum produto cadastrado encontrado.</p>
              <p>Cadastre produtos para poder simular pedidos.</p>
            </div>
        )}

        {/* Modal do Formulário */}
        {mostrarFormulario && (
            <div className="modalOverlay">
              <div className="modalContent">
                <h3 className="modalTitulo">
                  Simular Pedido - {produtoSelecionado?.nome}
                </h3>

                <form className="formSimulador" onSubmit={handleSubmit}>
                  <div className="formGroup">
                    <label>Código do Produto</label>
                    <input
                        type="text"
                        name="codproduto"
                        value={formData.codproduto}
                        onChange={handleChange}
                        required
                    />
                  </div>

                  <div className="formGroup">
                    <label>Quantidade</label>
                    <input
                        type="number"
                        name="qtd"
                        value={formData.qtd}
                        onChange={handleChange}
                        min="1"
                        required
                    />
                  </div>

                  <div className="formGroup">
                    <label>Tipo de Pedido</label>
                    <select
                        name="opcap"
                        value={formData.opcap}
                        onChange={handleChange}
                        required
                    >
                      <option value="">Selecione</option>
                      <option value="interno">Interno</option>
                      <option value="retirada">Retirada</option>
                      <option value="delivery">Delivery</option>
                    </select>
                  </div>

                  {/* Campo de Comissão - só aparece se for interno */}
                  {formData.opcap === "interno" && (
                      <div className="formGroup">
                        <label>Comissão (%)</label>
                        <input
                            type="number"
                            name="comissao"
                            value={formData.comissao}
                            onChange={handleChange}
                            min="0"
                            max="100"
                            step="0.01"
                            placeholder="Ex: 5.50"
                            required
                        />
                      </div>
                  )}

                  <div className="formGroup">
                    <label>Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                    >
                      <option value="">Selecione</option>
                      <option value="feito">Feito</option>
                      <option value="preparo">Preparo</option>
                      <option value="concluido">Concluído</option>
                    </select>
                  </div>

                  <div className="formActions">
                    <button type="submit" className="btnPrimary">
                      Confirmar Simulação
                    </button>
                    <button
                        type="button"
                        className="btnSecondary"
                        onClick={() => {
                          setMostrarFormulario(false);
                          setProdutoSelecionado(null);
                          setFormData({
                            codproduto: "",
                            qtd: "",
                            opcap: "",
                            status: "",
                            comissao: "",
                          });
                        }}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}
      </div>
  );
};

export default SimularPedido;