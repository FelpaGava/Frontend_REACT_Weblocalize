import api from '../../service/Api';
import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

import AddLocations from '../../components/forms/addLocations';
import Content from '../../context/content';
import AppContext from '../../context/AppContext';

function Home() {
  const {
    listaLocais,
    listaCidades,
    listaEstados,
    carregarDados,
  } = useContext(AppContext);

  const [showModal, setShowModal] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const handleCadastroSucesso = () => {
    carregarDados();
  };

  const getNomeCidade = (id) => {
    if (!listaCidades.length || !id) return '...';
    const item = listaCidades.find(c => String(c.cidid) === String(id));
    return item ? item.cidnome : '-';
  };

  const getSiglaEstado = (id) => {
    if (!listaEstados.length || !id) return '';
    const item = listaEstados.find(e => String(e.ufid) === String(id));
    return item ? item.ufsigla : '-';
  };

  const toggleDetails = (id) => {
    setExpandedId((prevId) => (prevId === id ? null : id)); 
  };

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

      <Content
        currentItems={listaLocais}
        expandedId={expandedId}
        toggleDetails={toggleDetails}
        getNomeCidade={getNomeCidade}
        getSiglaEstado={getSiglaEstado}
        handleCadastroSucesso={handleCadastroSucesso}
      />

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