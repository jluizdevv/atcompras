import React, { useState, useEffect } from 'react';
import { firestore, auth } from '../services/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

function ProdutosECotacoes() {
  const navigate = useNavigate();

  const [produtosCotacoes, setProdutosCotacoes] = useState([]);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        setUserEmail(user.email);

        // Obter os produtos/cotações do banco de dados
        const produtosCotacoesSnapshot = await firestore
          .collection('produtosCotacoes')
          .where('userId', '==', user.uid)
          .get();

        const produtosCotacoesData = produtosCotacoesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProdutosCotacoes(produtosCotacoesData);
      } else {
        // Usuário não está logado, redirecionar para a página de login
        setShouldRedirect(true);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    setShouldRedirect(true);
  };

  const handleDelete = async (produtoCotacaoId) => {
    try {
      await firestore.collection('produtosCotacoes').doc(produtoCotacaoId).delete();
      setProdutosCotacoes((prevProdutosCotacoes) =>
        prevProdutosCotacoes.filter((produtoCotacao) => produtoCotacao.id !== produtoCotacaoId)
      );
    } catch (error) {
      console.error('Erro ao excluir produto/cotação:', error);
    }
  };

  if (shouldRedirect) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <h1>Produtos e Cotações cadastrados</h1>
      <p>Usuário conectado: {userEmail}</p>
      {produtosCotacoes.length === 0 ? (
        <p>Nenhum produto/cotação cadastrado.</p>
      ) : (
        <ul>
          {produtosCotacoes.map((produtoCotacao) => (
            <li key={produtoCotacao.id}>
              <p>Produto: {produtoCotacao.produto}</p>
              <p>Preço: {produtoCotacao.preco}</p>
              <button onClick={() => handleDelete(produtoCotacao.id)}>Excluir</button>
            </li>
          ))}
        </ul>
      )}
      <Link to="/cadastrar-produtos-e-cotacoes">Cadastrar um novo Produto/Cotação</Link>
      <p>
        <button onClick={handleLogout}>Logout</button>
      </p>
    </div>
  );
}

export default ProdutosECotacoes;
