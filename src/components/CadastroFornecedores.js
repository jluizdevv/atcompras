import React, { useState } from 'react';
import { firestore, auth } from '../services/firebase';
import { Link, useNavigate } from 'react-router-dom';

function CadastroFornecedores() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [produto, setProduto] = useState('');
  const [estoque, setEstoque] = useState('');
;

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;

      // Salvar os dados do estagiário no Firestore
      await firestore.collection('fornecedores').add({
        userId,
        nome,
        telefone,
        produto,
        estoque,
       
      });

      // Redirecionar para a página de estagiários cadastrados
      navigate('/fornecedores');
    }
  };

  return (
    <div>
      <h1>Cadastro de Fornecedores</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nome">Nome:</label>
          <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="telefone">Telefone:</label>
          <input type="text" id="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="idade">Qual produto fornece:</label>
          <input type="text" id="produto" value={produto} onChange={(e) => setProduto(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="estoque">Quantidade no estoque:</label>
          <input type="text" id="estoque" value={estoque} onChange={(e) => setEstoque(e.target.value)} required />
        </div>
        <div>
          
          <button type="submit">Cadastrar</button>
        </div>
      </form>
      <Link to="/fornecedores" className="link-exibir-fonecedores">Exibir os Fornecedores Cadastrados</Link>
    </div>
  );
}

export default CadastroFornecedores;
