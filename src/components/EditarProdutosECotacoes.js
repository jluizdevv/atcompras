import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { firestore } from '../services/firebase';

function EditarProdutosECotacoes() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [produto, setProduto] = useState('');
  const [preco, setPreco] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const produtoRef = firestore.collection('produtos').doc(id);
      const snapshot = await produtoRef.get();

      if (snapshot.exists) {
        const data = snapshot.data();
        setProduto(data.produto);
        setPreco(data.preco);
      } else {
        // Produto não encontrado, redirecionar para a página de produtos e cotações
        navigate('/produtos-e-cotacoes');
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Atualizar os dados do produto no Firestore
    const produtoRef = firestore.collection('produtos').doc(id);
    await produtoRef.update({
      produto,
      preco,
    });

    // Atualizar os dados da cotação no Firestore
    const cotacaoRef = firestore.collection('cotacoes').doc(id);
    await cotacaoRef.update({
      produto,
      preco,
    });

    // Redirecionar de volta para a página de produtos e cotações
    navigate('/produtos-e-cotacoes');
  };

  return (
    <div>
      <h1>Editar Produto e Cotação</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Produto:
          <input type="text" value={produto} onChange={(e) => setProduto(e.target.value)} />
        </label>
        <label>
          Preço do Produto:
          <input type="text" value={preco} onChange={(e) => setPreco(e.target.value)} />
        </label>
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}

export default EditarProdutosECotacoes;
