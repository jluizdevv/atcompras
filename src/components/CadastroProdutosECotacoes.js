import React, { useState, useEffect } from 'react';
import { firestore, auth } from '../services/firebase';
import { Link } from 'react-router-dom';

function CadastroProdutosECotacoes() {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [fornecedores, setFornecedores] = useState([]);

  useEffect(() => {
    const fetchFornecedores = async () => {
      const user = auth.currentUser;
      if (user) {
        const fornecedoresSnapshot = await firestore
          .collection('fornecedores')
          .where('userId', '==', user.uid)
          .get();

        const fornecedoresData = fornecedoresSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFornecedores(fornecedoresData);
      }
    };

    fetchFornecedores();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      try {
        const fornecedorId = e.target.fornecedor.value;
        await firestore.collection('produtos').add({
          nome,
          preco,
          fornecedorId,
          userId: user.uid,
        });
        // Limpar campos após cadastrar
        setNome('');
        setPreco('');
      } catch (error) {
        console.error('Erro ao cadastrar produto:', error);
      }
    }
  };

  return (
    <div>
      <h1>Adicionar Produtos ligados ao Fornecedor</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nome:
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </label>
        <label>
          Preço:
          <input
            type="text"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
          />
        </label>
        <label>
          Fornecedor:
          <select name="fornecedor">
            {fornecedores.map((fornecedor) => (
              <option key={fornecedor.id} value={fornecedor.id}>
                {fornecedor.nome}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Cadastrar</button>
      </form>
      <Link to="/fornecedores" className="link-exib-fornecedor" > Exibir produtos juntos ao Fornecedor </Link>
      
    </div>
  );
}

export default CadastroProdutosECotacoes;
