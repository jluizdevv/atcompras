import React, { useState, useEffect } from 'react';
import { firestore, auth } from '../services/firebase';
import { Link, Navigate } from 'react-router-dom';

function Fornecedores() {
  const [fornecedores, setFornecedores] = useState([]);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        setUserEmail(user.email);

        const fornecedoresSnapshot = await firestore
          .collection('fornecedores')
          .where('userId', '==', user.uid)
          .get();

        const fornecedoresData = [];
        for (const doc of fornecedoresSnapshot.docs) {
          const fornecedor = doc.data();
          const produtosSnapshot = await firestore
            .collection('produtos')
            .where('fornecedorId', '==', doc.id)
            .get();
          const produtosData = produtosSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          fornecedor.produtos = produtosData;
          fornecedoresData.push({ id: doc.id, ...fornecedor });
        }

        setFornecedores(fornecedoresData);
      } else {
  
        setShouldRedirect(true);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    setShouldRedirect(true);
  };

  const handleExcluirFornecedor = async (fornecedorId) => {
    try {
      await firestore.collection('fornecedores').doc(fornecedorId).delete();
     
      const updatedFornecedores = fornecedores.filter((fornecedor) => fornecedor.id !== fornecedorId);
      setFornecedores(updatedFornecedores);
    } catch (error) {
      console.log('Erro ao excluir fornecedor:', error);
    }
  };

  if (shouldRedirect) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <h1>Menu de Fornecedores, Produtos e Cotações</h1>
      <p>Usuário conectado: {userEmail}</p>

      <h2>Fornecedores cadastrados:</h2>
      {fornecedores.length === 0 ? (
        <p>Nenhum fornecedor cadastrado.</p>
      ) : (
        <ul className="fornecedores-list">
          {fornecedores.map((fornecedor) => (
            <li className="fornecedores-list-item" key={fornecedor.id}>
              <p>Nome: {fornecedor.nome}</p>
              <p>Telefone: {fornecedor.telefone}</p>

           
              {fornecedor.produtos && fornecedor.produtos.length > 0 ? (
                <div>
                  <p>Produtos:</p>
                  <ul>
                    {fornecedor.produtos.map((produto) => (
                      <li key={produto.id}>
                        Nome: {produto.nome}, Preço: {produto.preco}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>Nenhum produto cadastrado para este fornecedor.</p>
              )}

              <div className="fornecedores-list-actions">
                <Link to={`/editar-fornecedor/${fornecedor.id}`} className="editar-fornecedor-link">
                  Editar
                </Link>
                <button onClick={() => handleExcluirFornecedor(fornecedor.id)}>Excluir</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Link to="/cadastrar-fornecedores" className="link-cad-fornecedor">
        Cadastrar um novo Fornecedor
      </Link>

      <p>
        <Link to="/cadastrar-produto" className="link-cad-prod-cotacoes">
          Adicionar Produtos e Cotações ao Fornecedor
        </Link>
      </p>

      <p>
        <button onClick={handleLogout}>Logout</button>
      </p>
    </div>
  );
}

export default Fornecedores;
