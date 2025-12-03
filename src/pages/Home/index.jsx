import api from '../../service/Api'; // Verifique se é 'Api' ou 'api' conforme sua pasta
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen, faPlus } from '@fortawesome/free-solid-svg-icons';

// CORREÇÃO 1: Importar com Letra Maiúscula
import AddLocations from '../../components/forms/addLocations'; 

function Home() {

    // --- ESTADOS ---
    const [listaLocais, setListaLocais] = useState([]);
    const [listaCidades, setListaCidades] = useState([]);
    const [listaEstados, setListaEstados] = useState([]);
    
    // Controle de UI
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // --- EFEITOS (LIFECYCLE) ---
    useEffect(() => {
        carregarDados();
    }, []);

    // --- FUNÇÕES AUXILIARES ---

    const carregarDados = async () => {
        try {
            // Promise.all para requisições paralelas (Performance)
            const [resLocais, resCidades, resEstados] = await Promise.all([
                api.get('Local'),
                api.get('Cidade'),
                api.get('Estado')
            ]);

            // Normalização de dados do .NET ($values)
            const dadosLocais = resLocais.data.$values || resLocais.data;
            const dadosCidades = resCidades.data.$values || resCidades.data;
            const dadosEstados = resEstados.data.$values || resEstados.data;

            setListaLocais(dadosLocais);
            setListaCidades(dadosCidades);
            setListaEstados(dadosEstados);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Callback para quando o cadastro for realizado com sucesso
    const handleCadastroSucesso = () => {
        api.get('Local').then(res => {
            setListaLocais(res.data.$values || res.data);
        });
    };

    // Helpers de Formatação (Lookup de IDs para Nomes)
    const getNomeCidade = (id) => {
        if (!listaCidades.length || !id) return '...';
        const item = listaCidades.find(c => (c.cidid || c.CIDID) === id);
        return item ? (item.cidnome || item.CIDNOME) : '-';
    };

    const getSiglaEstado = (id) => {
        if (!listaEstados.length || !id) return '';
        const item = listaEstados.find(e => (e.ufid || e.UFID) === id);
        return item ? (item.ufsigla || item.UFSIGLA) : '-';
    };

    const truncateText = (text, maxLength = 30) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };


    // --- RENDERIZAÇÃO ---

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center mt-5" style={{ minHeight: '200px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4 animate-fade-in">
            {/* Cabeçalho da Página */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-light text-primary fw-bold border-start border-5 border-primary ps-3">
                    Pontos Turísticos
                </h2>                  
                
                <button 
                    className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
                    onClick={() => setShowModal(true)}
                >
                    <FontAwesomeIcon icon={faPlus} />
                    <span className='fw-bold'>Novo Ponto Turístico</span>
                </button>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-striped table-hover mb-0 align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col" className="ps-4">ID</th>
                                    <th scope="col">Nome</th>
                                    <th scope="col">Descrição</th>
                                    <th scope="col">Endereço</th>
                                    <th scope="col">Cidade/UF</th>
                                    <th scope="col" className="text-end pe-4">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaLocais.length > 0 ? (
                                    listaLocais.map((item) => (
                                        <tr key={item.locid || item.LOCID}>
                                            <td className="ps-4 fw-bold text-muted">
                                                {item.locid || item.LOCID}
                                            </td>
                                            
                                            <td className="fw-semibold text-primary">
                                                {item.locnome || item.LOCNOME}
                                            </td>
                                            
                                            <td title={item.locdescricao || item.LOCDESCRICAO}>
                                                {truncateText(item.locdescricao || item.LOCDESCRICAO)}
                                            </td>
                                            
                                            <td className="small text-secondary">
                                                {item.locendereco || item.LOCENDERECO}
                                            </td>
                                            
                                            <td>
                                                <span className="badge bg-info text-dark">
                                                    {getNomeCidade(item.loccid || item.LOCCID)} 
                                                    {' - '} 
                                                    {getSiglaEstado(item.locuf || item.LOCUF)}
                                                </span>
                                            </td>

                                            <td className="text-end pe-4">
                                                <button className="btn btn-sm btn-outline-primary me-2" title="Editar">
                                                    <FontAwesomeIcon icon={faPen} />
                                                </button>
                                                <button className="btn btn-sm btn-outline-danger" title="Excluir">
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5 text-muted">
                                            <div className="d-flex flex-column align-items-center">
                                                <FontAwesomeIcon icon={faPlus} size="2x" className="mb-2 opacity-25" />
                                                <span>Nenhum registro encontrado</span>
                                                <small>Clique em "Novo Ponto Turístico" para começar.</small>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <AddLocations 
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={handleCadastroSucesso}
                listaCidades={listaCidades}
                listaEstados={listaEstados}
            />
        </div>
    );
}

export default Home;