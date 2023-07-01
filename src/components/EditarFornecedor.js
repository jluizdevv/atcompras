import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { firestore } from '../services/firebase';

function EditarFornecedor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fornecedorRef = firestore.collection('fornecedores').doc(id);
      const snapshot = await fornecedorRef.get();

      if (snapshot.exists) {
        const data = snapshot.data();
        setNome(data.nome);
        setTelefone(data.telefone);

        const produtosSnapshot = await firestore
          .collection('produtos')
          .where('fornecedorId', '==', id)
          .get();
        const produtosData = produtosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProdutos(produtosData);
      } else {
        // Fornecedor não encontrado, redirecionar para a página de fornecedores
        navigate('/fornecedores');
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleNomeChange = (e) => {
    setNome(e.target.value);
  };

  const handleTelefoneChange = (e) => {
    setTelefone(e.target.value);
  };

  const handleProdutoNomeChange = (produtoId, e) => {
    const updatedProdutos = produtos.map((produto) => {
      if (produto.id === produtoId) {
        return { ...produto, nome: e.target.value };
      }
      return produto;
    });
    setProdutos(updatedProdutos);
  };

  const handleProdutoPrecoChange = (produtoId, e) => {
    const updatedProdutos = produtos.map((produto) => {
      if (produto.id === produtoId) {
        return { ...produto, preco: e.target.value };
      }
      return produto;
    });
    setProdutos(updatedProdutos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Atualizar os dados do fornecedor no Firestore
    const fornecedorRef = firestore.collection('fornecedores').doc(id);
    await fornecedorRef.update({
      nome,
      telefone,
    });

    // Atualizar os dados dos produtos associados ao fornecedor no Firestore
    const batch = firestore.batch();
    produtos.forEach((produto) => {
      const produtoRef = firestore.collection('produtos').doc(produto.id);
      batch.update(produtoRef, {
        nome: produto.nome,
        preco: produto.preco,
      });
    });
    await batch.commit();

    // Redirecionar de volta para a página de fornecedores
    navigate('/fornecedores');
  };

  return (
    <div>
      <h1>Editar Fornecedor</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nome:
          <input type="text" value={nome} onChange={handleNomeChange} />
        </label>
        <label>
          Telefone:
          <input type="text" value={telefone} onChange={handleTelefoneChange} />
        </label>

        <h2>Produtos:</h2>
        {produtos.length === 0 ? (
          <p>Nenhum produto cadastrado para este fornecedor.</p>
        ) : (
          <ul>
            {produtos.map((produto) => (
              <li key={produto.id}>
                <label>
                  Nome:
                  <input
                    type="text"
                    value={produto.nome}
                    onChange={(e) => handleProdutoNomeChange(produto.id, e)}
                  />
                </label>
                <label>
                  Preço:
                  <input
                    type="text"
                    value={produto.preco}
                    onChange={(e) => handleProdutoPrecoChange(produto.id, e)}
                  />
                </label>
              </li>
            ))}
          </ul>
        )}

        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}

export default EditarFornecedor;
