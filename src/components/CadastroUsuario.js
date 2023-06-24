import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import './css/styles.css';


function CadastroUsuario() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cadastroSucesso, setCadastroSucesso] = useState(false);
  const [usuarioExistente, setUsuarioExistente] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCadastro = async () => {
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      setCadastroSucesso(true);
      setUsuarioExistente(false);
      setError(null);
    } catch (error) {
      setCadastroSucesso(false);
      setUsuarioExistente(true);
      setError('O endereço de e-mail já está em uso por outra conta. Por favor, tente fazer login.');
    }
  };

  const handleRedirecionarLogin = () => {
    navigate('/login');
  };

  return (
    <div>
      <h1>Cadastro de Usuário</h1>
      {cadastroSucesso && <p>Cadastro realizado com sucesso!</p>}
      {usuarioExistente && <p>O endereço de e-mail já está em uso por outra conta. Tente fazer login.</p>}
      {error && <p>{error}</p>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
      />
      <button onClick={handleCadastro}>Cadastrar</button>
      <p><button onClick={handleRedirecionarLogin}>Fazer Login</button></p>
    </div>
  );
}

export default CadastroUsuario;
