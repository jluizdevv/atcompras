import React, { useState } from 'react';
import { firestore, auth } from '../services/firebase';
import { Link, useNavigate } from 'react-router-dom';

function CadastroProdutosECotacoes() {
  const navigate = useNavigate();

  const [produto, setProduto] = useState('');
  const [preco, setPreco] = useState('');

  const handleCadastro = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;

    try {
      // Salvar os dados no Firestore
      const produtoCotacaoData = {
        produto,
        preco,
        userId: user.uid,
      };

      await firestore.collection('produtosCotacoes').add(produtoCotacaoData);

      // Redirecionar para a página de Produtos e Cotações
      navigate('/produtos-e-cotacoes');
    } catch (error) {
      console.error('Erro ao cadastrar produto/cotação:', error);
    }
  };

  return (
    <div>
      <h1>Cadastro de Produtos e Cotações</h1>
      <form onSubmit={handleCadastro}>
        <label>
          Produto:
          <input type="text" value={produto} onChange={(e) => setProduto(e.target.value)} />
        </label>
        <label>
          Preço:
          <input type="text" value={preco} onChange={(e) => setPreco(e.target.value)} />
        </label>
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default CadastroProdutosECotacoes;
