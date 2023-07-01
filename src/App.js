import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TelaLogin from './components/Login';
import CadastroUsuario from './components/CadastroUsuario';
import TelaFornecedores from './components/Fornecedores';
import CadastroFornecedores from './components/CadastroFornecedores';
import EditarFornecedor from './components/EditarFornecedor';
import CadastroProdutosECotacoes from './components/CadastroProdutosECotacoes';



function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<TelaLogin />} />
          <Route path="/cadastro-usuario" element={<CadastroUsuario />} />
          <Route path="/fornecedores" element={<TelaFornecedores />} />
          <Route path="/cadastrar-fornecedores" element={<CadastroFornecedores />} />
          <Route path="/editar-fornecedor/:id" element={<EditarFornecedor />} />
          <Route path="/cadastrar-produto" element={<CadastroProdutosECotacoes />} />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
