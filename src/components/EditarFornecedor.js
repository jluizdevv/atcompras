import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { firestore } from '../services/firebase';

function EditarFornecedor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [produto, setProduto] = useState('');
  const [estoque, setEstoque] = useState('');


  useEffect(() => {
    const fetchData = async () => {
      const fornecedorRef = firestore.collection('fornecedores').doc(id);
      const snapshot = await fornecedorRef.get();

      if (snapshot.exists) {
        const data = snapshot.data();
        setNome(data.nome);
        setTelefone(data.telefone);
        setProduto(data.produto);
        setEstoque(data.estoque);
       
      } else {
        // Estagiário não encontrado, redirecionar para a página de estagiários
        navigate('/fornecedores');
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Atualizar os dados do estagiário no Firestore
    const fornecedorRef = firestore.collection('fornecedores').doc(id);
    await fornecedorRef.update({
      nome,
      telefone,
      produto,
      estoque,
     
    });

    // Redirecionar de volta para a página de estagiários
    navigate('/fornecedores');
  };

  return (
    <div>
      <h1>Editar Fornecedor</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nome:
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
        </label>
        <label>
          Telefone:
          <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
        </label>
        <label>
          Idade:
          <input type="text" value={produto} onChange={(e) => setProduto(e.target.value)} />
        </label>
        <label>
          Endereço:
          <input type="text" value={estoque} onChange={(e) => setEstoque(e.target.value)} />
        </label>
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}

export default EditarFornecedor;
