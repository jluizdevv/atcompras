import React, { useState, useEffect } from 'react';
import { firestore, auth } from '../services/firebase';
import { Link, Navigate } from 'react-router-dom';
import './css/styles.css';

function Fornecedores() {
  const [fornecedores, setFornecedores] = useState([]);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        setUserEmail(user.email);

        const snapshot = await firestore
          .collection('fornecedores')
          .where('userId', '==', user.uid)
          .get();

        const fornecedoresData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFornecedores(fornecedoresData);
      } else {
        // User is not logged in, redirect to the login page
        setShouldRedirect(true);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    setShouldRedirect(true);
  };

  const handleDelete = async (fornecedorId) => {
    try {
      await firestore.collection('fornecedores').doc(fornecedorId).delete();
      setFornecedores((prevFornecedores) =>
        prevFornecedores.filter((fornecedor) => fornecedor.id !== fornecedorId)
      );
    } catch (error) {
      console.error('Error deleting fornecedor:', error);
    }
  };

  if (shouldRedirect) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <h1>Fornecedores cadastrados no sistema de compras</h1>
      <p>Usuário conectado: {userEmail}</p>
      {fornecedores.length === 0 ? (
        <p>Nenhum fornecedor cadastrado.</p>
      ) : (
        <ul className="fornecedores-list">
          {fornecedores.map((fornecedor) => (
            <li className="fornecedores-list-item" key={fornecedor.id}>
              <p>Nome: {fornecedor.nome}</p>
              <p>Telefone: {fornecedor.telefone}</p>
              <p>Produto: {fornecedor.produto}</p>
              <p>Estoque: {fornecedor.estoque}</p>
              <div className="fornecedores-list-item-actions">
                <Link
                  to={`/editar-fornecedor/${fornecedor.id}`}
                  className="editar-fornecedor-link"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(fornecedor.id)}
                  className="excluir-fornecedor-button"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Link to="/cadastrar-fornecedores" className="link-cad-fornecedores">
        Cadastrar um novo Fornecedor
      </Link>
      <Link to="/cadastrar-produto" className="link-cad-produto">
        Cadastrar Produtos e Cotações
      </Link>
      <p>
        <button onClick={handleLogout}>Logout</button>
      </p>
    </div>
  );
}

export default Fornecedores;
