import React, { useState } from 'react';
import { firestore, auth } from '../services/firebase';
import { Link, useNavigate } from 'react-router-dom';

function CadastroFornecedores() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
 
  
;

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;

     
      await firestore.collection('fornecedores').add({
        userId,
        nome,
        telefone,
        
      
       
      });

      
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
          <button type="submit">Cadastrar</button>
        </div>
      </form>
      <Link to="/fornecedores" className="link-exibir-fonecedores">Exibir os Fornecedores Cadastrados</Link>
    </div>
  );
}

export default CadastroFornecedores;
