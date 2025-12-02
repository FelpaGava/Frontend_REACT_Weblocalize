import api from '../../service/Api';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';


function Home() {

    const [listaLocais, setListaLocais] = useState([]);
    const [listaCidades, setListaCidades] = useState([]);
    const [listaEstados, setListaEstados] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resLocais, resCidades, resEstados] = await Promise.all([
                    api.get('Local'),
                    api.get('Cidade'),
                    api.get('Estado')
                ]);

                const dadosLocais = resLocais.data.$values || resLocais.data;
                const dadosCidades = resCidades.data.$values || resCidades.data;
                const dadosEstados = resEstados.data.$values || resEstados.data;

                setListaLocais(dadosLocais);
                setListaCidades(dadosCidades);
                setListaEstados(dadosEstados);

            } catch (error) {
                console.error('Erro ao buscar os dados:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const getNomeCidade = (idCidade) => {
        if (!listaCidades.length || !idCidade) return '...';
        const cidade = listaCidades.find(c => c.cidid === idCidade || c.CIDID === idCidade);
        return cidade ? (cidade.cidnome || cidade.CIDNOME) : 'Não encontrada';
    };

    const getSiglaEstado = (idEstado) => {
        if (!listaEstados.length || !idEstado) return '-';
        const estado = listaEstados.find(e => e.ufid === idEstado || e.UFID === idEstado);
        return estado ? (estado.ufsigla || estado.UFSIGLA) : '-';
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4 animate-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-light text-primary fw-bold border-start border-5 border-primary ps-3">Pontos Turísticos</h2>
                <span className="badge bg-secondary">{listaLocais.length} registros encontrados</span>
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

                                            <td>
                                                {item.locnome || item.LOCNOME}
                                            </td>

                                            <td title={item.locdescricao || item.LOCDESCRICAO}>
                                                {(item.locdescricao || item.LOCDESCRICAO || '').length > 30
                                                    ? (item.locdescricao || item.LOCDESCRICAO).substring(0, 30) + '...'
                                                    : (item.locdescricao || item.LOCDESCRICAO)}
                                            </td>

                                            <td>{item.locendereco || item.LOCENDERECO}</td>

                                            <td>
                                                <span className="badge bg-info text-dark">
                                                    {getNomeCidade(item.loccid || item.LOCCID)}
                                                    {' - '}
                                                    {getSiglaEstado(item.locuf || item.LOCUF)}
                                                </span>
                                            </td>

                                            <td className="text-end pe-4">
                                                <button className="btn btn-sm btn-outline-primary me-2" title="Editar"><FontAwesomeIcon icon={faPen} /></button>
                                                <button className="btn btn-sm btn-outline-danger" title="Excluir"><FontAwesomeIcon icon={faTrash} /></button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">
                                            Nenhum registro encontrado
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;