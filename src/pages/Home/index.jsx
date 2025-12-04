import api from '../../service/Api';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faPlus, faMapMarkerAlt, faChevronLeft, faChevronRight, faChevronDown, faChevronUp, faInfoCircle, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';

import AddLocations from '../../components/forms/addLocations';
import DelButton from '../../components/button/delButton';

function Home() {

    const [listaLocais, setListaLocais] = useState([]);
    const [listaCidades, setListaCidades] = useState([]);
    const [listaEstados, setListaEstados] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [expandedId, setExpandedId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            const [resLocais, resCidades, resEstados] = await Promise.all([
                api.get('Local'), 
                api.get('Cidade'),
                api.get('Estado')
            ]);

            const dadosLocais = resLocais.data.$values || resLocais.data;
            const dadosCidades = resCidades.data.$values || resCidades.data;
            const dadosEstados = resEstados.data.$values || resEstados.data;

            const locaisAtivos = (dadosLocais || []).filter(l => 
                (l.LOCSITUACAO !== 'I' && l.LocSituacao !== 'I')
            );

            setListaLocais(locaisAtivos);
            setListaCidades(dadosCidades || []);
            setListaEstados(dadosEstados || []);

        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCadastroSucesso = () => {
        carregarDados();
    };

    const getNomeCidade = (id) => {
        if (!listaCidades.length || !id) return '...';
        const item = listaCidades.find(c => String(c.cidid || c.CIDID) === String(id));
        return item ? (item.cidnome || item.CIDNOME) : '-';
    };

    const getSiglaEstado = (id) => {
        if (!listaEstados.length || !id) return '';
        const item = listaEstados.find(e => String(e.ufid || e.UFID) === String(id));
        return item ? (item.ufsigla || item.UFSIGLA) : '-';
    };

    const toggleDetails = (id) => {
        if (expandedId === id) {
            setExpandedId(null); 
        } else {
            setExpandedId(id); 
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const safeList = listaLocais || [];
    const currentItems = safeList.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(safeList.length / itemsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        setExpandedId(null); 
    };
    const nextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
        setExpandedId(null);
    };
    const prevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
        setExpandedId(null);
    };

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
        <div className="container mt-4 mb-5 pb-5 animate-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-light text-primary fw-bold border-start border-5 border-primary ps-3">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="me-3 text-secondary" />
                    Pontos Turísticos
                </h2>

                <button className="btn btn-primary d-flex align-items-center gap-2 shadow-sm" onClick={() => setShowModal(true)}>
                    <FontAwesomeIcon icon={faPlus} />
                    <span className='fw-bold'>Novo Local</span>
                </button>
            </div>
            
            <div className="d-flex flex-column gap-3">
                {currentItems.length > 0 ? (
                    currentItems.map((item, index) => {
                        const itemId = item.locid || item.LOCID || index;
                        const isExpanded = expandedId === itemId;

                        return (
                            <div key={itemId} className={`card border-0 shadow-sm transition-all ${isExpanded ? 'border-start border-primary border-4 bg-info' : 'bg-light'}`}style={{ transition: 'all 0.1s ease' }}>
                                <div className="card-body py-3 d-flex align-items-center justify-content-between cursor-pointer"onClick={() => toggleDetails(itemId)}style={{ cursor: 'pointer' }}>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className={`rounded-circle d-flex align-items-center justify-content-center ${isExpanded ? 'bg-primary text-white' : 'bg-white text-secondary'}`} style={{ width: '40px', height: '40px', minWidth: '40px' }}>
                                            <FontAwesomeIcon icon={faMapLocationDot} />
                                        </div>
                                        <div>
                                            <h6 className="mb-0 fw-bold text-dark">{item.locnome || item.LOCNOME}</h6>
                                            <small className="text-muted">
                                                {getNomeCidade(item.loccid || item.LOCCID)} / {getSiglaEstado(item.locuf || item.LOCUF)}
                                            </small>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center gap-3">
                                        <span className={`d-none d-md-block badge text-secondary border fw-normal ${isExpanded ? 'bg-light' : 'bg-white'}`}>
                                            ID: {itemId}
                                        </span>
                                        <FontAwesomeIcon 
                                            icon={isExpanded ? faChevronUp : faChevronDown} 
                                            className="text-muted" 
                                        />
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="card-footer bg-white border-top animate-fade-in py-3">
                                        <div className="row">
                                            <div className="col-md-8">
                                                <h6 className="text-primary small fw-bold text-uppercase mb-2">
                                                    <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                                                    Descrição
                                                </h6>
                                                <p className="text-secondary mb-3">
                                                    {item.locdescricao || item.LOCDESCRICAO || <i>Sem descrição.</i>}
                                                </p>
                                                
                                                <div className="p-2 bg-light rounded border-start border-3 border-secondary">
                                                    <small className="d-block text-muted fw-bold">Endereço:</small>
                                                    <span className="text-dark small">
                                                        {item.locendereco || item.LOCENDERECO || 'Não informado'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="col-md-4 d-flex align-items-end justify-content-md-end mt-3 mt-md-0">
                                                <div className="d-flex gap-2 w-100 justify-content-end">
                                                    <button className="btn btn-outline-primary btn-sm px-3">
                                                        <FontAwesomeIcon icon={faPen} className="me-2" />
                                                        Editar
                                                    </button>
                                                    
                                                    <DelButton item={item} onSuccess={handleCadastroSucesso} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-5 text-muted card border-0 bg-light">
                        <div className="d-flex flex-column align-items-center">
                            <FontAwesomeIcon icon={faPlus} size="3x" className="mb-3 opacity-25" />
                            <span className="fw-bold">Nenhum registro encontrado</span>
                        </div>
                    </div>
                )}
            </div>

            {listaLocais.length > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-4 p-3 bg-white rounded shadow-sm border">
                    <small className="text-muted">
                        Mostrando <strong>{indexOfFirstItem + 1}</strong> - <strong>{Math.min(indexOfLastItem, listaLocais.length)}</strong> de <strong>{listaLocais.length}</strong>
                    </small>

                    <nav>
                        <ul className="pagination pagination-sm mb-0">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link border-0" onClick={prevPage}>
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                </button>
                            </li>

                            {[...Array(totalPages)].map((_, index) => (
                                <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                    <button 
                                        className="page-link border-0 rounded mx-1" 
                                        onClick={() => paginate(index + 1)}
                                        style={{ minWidth: '32px' }}
                                    >
                                        {index + 1}
                                    </button>
                                </li>
                            ))}

                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button className="page-link border-0" onClick={nextPage}>
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}

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