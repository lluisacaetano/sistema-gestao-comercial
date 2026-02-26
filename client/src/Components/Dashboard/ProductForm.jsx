import React, { useState, useEffect } from "react";
import "./cadastrarProduto.css";

// Função para formatar preço no padrão brasileiro
const formatarPreco = (valor) => {
  return Number(valor).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const CadastrarProduto = ({ darkMode }) => {
  const [formData, setFormData] = useState({
    nome: "",
    preco: "",
    qtd: "",
    descricao: "",
    imagemUrl: "",
  });

  const [produtos, setProdutos] = useState([]);
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [editData, setEditData] = useState({ preco: "", qtd: "" });

  // Carrega produtos do localStorage ao iniciar
  useEffect(() => {
    const produtosSalvos = localStorage.getItem("produtos");
    if (produtosSalvos) {
      try {
        setProdutos(JSON.parse(produtosSalvos));
      } catch (e) {
        console.error("Erro ao ler produtos:", e);
        setProdutos([]);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const novoProduto = { ...formData };
    const novaLista = [...produtos, novoProduto];
    setProdutos(novaLista);
    localStorage.setItem("produtos", JSON.stringify(novaLista));
    alert("Produto cadastrado com sucesso!");
    setFormData({ nome: "", preco: "", qtd: "", descricao: "", imagemUrl: "" });
  };

  const handleEditClick = (index) => {
    setEditandoIndex(index);
    setEditData({
      preco: produtos[index].preco,
      qtd: produtos[index].qtd,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = (index) => {
    const atualizados = [...produtos];
    atualizados[index].preco = editData.preco;
    atualizados[index].qtd = editData.qtd;
    setProdutos(atualizados);
    localStorage.setItem("produtos", JSON.stringify(atualizados));
    setEditandoIndex(null);
  };

  const handleDelete = (index) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      const novaLista = produtos.filter((_, i) => i !== index);
      setProdutos(novaLista);
      localStorage.setItem("produtos", JSON.stringify(novaLista));
    }
  };

  return (
      <div className={`cadastrarProdutoContainer ${darkMode ? "dark" : "light"}`}>
        <div className="formCard">
          <div className="contentHeader">
            <h2>Cadastrar Produto</h2>
            <p>Adicione um novo produto ao sistema</p>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <div className="formGroup">
              <label>Nome do Produto</label>
              <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Ex: X-Burger"
                  required
              />
            </div>

            <div className="formRow">
              <div className="formGroup">
                <label>Preço (R$)</label>
                <input
                    type="number"
                    name="preco"
                    value={formData.preco}
                    onChange={handleInputChange}
                    placeholder="Ex: 25,00"
                    step="0.01"
                    required
                />
              </div>

              <div className="formGroup">
                <label>Quantidade em Estoque</label>
                <input
                    type="number"
                    name="qtd"
                    value={formData.qtd}
                    onChange={handleInputChange}
                    placeholder="Ex: 100"
                    required
                />
              </div>
            </div>

            <div className="formGroup">
              <label>URL da Imagem</label>
              <input
                type="url"
                name="imagemUrl"
                value={formData.imagemUrl}
                onChange={handleInputChange}
                placeholder="https://exemplo.com/imagem.jpg"
                required
              />
            </div>

            <div className="formGroup">
              <label>Descrição</label>
              <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  placeholder="Descreva o produto..."
                  rows="3"
                  required
              />
            </div>

            <div className="formActions">
              <button type="submit" className="btnPrimary">Cadastrar Produto</button>
              <button
                  type="button"
                  className="btnSecondary"
                  onClick={() =>
                      setFormData({ nome: "", preco: "", qtd: "", descricao: "", imagemUrl: "" })
                  }
              >
                Limpar Campos
              </button>
            </div>
          </form>
        </div>

        {produtos.length > 0 && (
            <div className="tabelaCard">
              <h3>Produtos Cadastrados ({produtos.length})</h3>
              <table className="produtosTable">
                <thead>
                <tr>
                  <th>Imagem</th>
                  <th>Nome</th>
                  <th>Preço</th>
                  <th>Estoque</th>
                  <th>Descrição</th>
                  <th>Ações</th>
                </tr>
                </thead>
                <tbody>
                {produtos.map((produto, index) => (
                    <tr key={index}>
                      <td>
                        <img
                          src={produto.imagemUrl}
                          alt={produto.nome}
                          className="produtoImgTabela"
                        />
                      </td>
                      <td><strong>{produto.nome}</strong></td>
                      <td>
                        {editandoIndex === index ? (
                            <input
                                type="number"
                                name="preco"
                                value={editData.preco}
                                onChange={handleEditChange}
                                className="inputEdit"
                            />
                        ) : (
                            `R$ ${formatarPreco(produto.preco)}`
                        )}
                      </td>
                      <td>
                        {editandoIndex === index ? (
                            <input
                                type="number"
                                name="qtd"
                                value={editData.qtd}
                                onChange={handleEditChange}
                                className="inputEdit"
                            />
                        ) : (
                            parseInt(produto.qtd)
                        )}
                      </td>
                      <td className="descricaoCell">
                        {produto.descricao?.length > 40
                          ? produto.descricao.substring(0, 40) + '...'
                          : produto.descricao}
                      </td>
                      <td>
                        {editandoIndex === index ? (
                            <>
                              <button
                                  onClick={() => handleSaveEdit(index)}
                                  className="btnSave"
                              >
                                Salvar
                              </button>
                              <button
                                  onClick={() => setEditandoIndex(null)}
                                  className="btnCancel"
                              >
                                Cancelar
                              </button>
                            </>
                        ) : (
                            <>
                              <button
                                  onClick={() => handleEditClick(index)}
                                  className="btnEdit"
                              >
                                Editar
                              </button>
                              <button
                                  onClick={() => handleDelete(index)}
                                  className="btnDelete"
                              >
                                Excluir
                              </button>
                            </>
                        )}
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}
      </div>
  );
};

export default CadastrarProduto;
