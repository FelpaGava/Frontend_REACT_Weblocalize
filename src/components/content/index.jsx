import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faInfoCircle, faMapLocationDot, faPen } from '@fortawesome/free-solid-svg-icons';
import DelButton from '../../components/button/delButton';
import EdtButton from '../../components/button/edtButton';
import SearchButton from '../search/SearchButton';

const Content = ({
  currentItems,
  expandedId,
  toggleDetails,
  getNomeCidade,
  getSiglaEstado,
  handleCadastroSucesso,
}) => {
  const [filteredItems, setFilteredItems] = useState(currentItems);
  const [paginatedItems, setPaginatedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setFilteredItems(currentItems);
    setCurrentPage(1);
  }, [currentItems]);

  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setPaginatedItems(filteredItems.slice(indexOfFirstItem, indexOfLastItem));
  }, [filteredItems, currentPage]);

  const handleSearch = (term = '') => {
    const sanitizedTerm = term.toString().toLowerCase();
    if (!sanitizedTerm.trim()) {
      setFilteredItems(currentItems);
    } else {
      const filtered = currentItems.filter((item) => {
        const nome = item.locnome || '';
        return nome.toLowerCase().includes(sanitizedTerm);
      });
      setFilteredItems(filtered);
    }
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setFilteredItems(currentItems);
    setCurrentPage(1);
  };

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredItems.length / itemsPerPage)));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const isItemExpanded = (itemId) => {
    return expandedId === itemId;
  };

  const handleItemClick = (itemId) => {
    toggleDetails(itemId);
  };

  return (
    <div className="d-flex flex-column gap-3">
      <SearchButton
        onSearch={handleSearch}
        onClear={clearSearch}
      />

      {paginatedItems.map((item, index) => {
        const itemId = item.locid || index;
        const isExpanded = expandedId === itemId;

        return (
          <div
            key={itemId}
            className={`card border-0 shadow-sm transition-all ${isExpanded ? 'border-start border-primary border-4 bg-info' : 'bg-light'}`}
            style={{ transition: 'all 0.1s ease' }}
          >
            <div
              className="card-body py-3 d-flex align-items-center justify-content-between cursor-pointer"
              onClick={() => handleItemClick(itemId)}
              style={{ cursor: 'pointer' }}
            >
              <div className="d-flex align-items-center gap-3">
                <div
                  className={`rounded-circle d-flex align-items-center justify-content-center ${isExpanded ? 'bg-primary text-white' : 'bg-white text-secondary'}`}
                  style={{ width: '40px', height: '40px', minWidth: '40px' }}
                >
                  <FontAwesomeIcon icon={faMapLocationDot} />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold text-dark">{item.locnome}</h6>
                  <small className="text-muted">
                    {getNomeCidade(item.loccid)} / {getSiglaEstado(item.locuf)}
                  </small>
                </div>
              </div>

              <div className="d-flex align-items-center gap-3">
                <span
                  className={`d-none d-md-block badge text-secondary border fw-normal ${isExpanded ? 'bg-light' : 'bg-white'}`}
                >
                  ID: {itemId}
                </span>
                <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} className="text-muted" />
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
                      <EdtButton item={item} onSuccess={handleCadastroSucesso} />
                      <DelButton item={item} onSuccess={handleCadastroSucesso} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {filteredItems.length === 0 && (
        <div className="text-center py-5 text-muted card border-0 bg-light">
          <div className="d-flex flex-column align-items-center">
            <FontAwesomeIcon icon={faPen} size="3x" className="mb-3 opacity-25" />
            <span className="fw-bold">Nenhum registro encontrado</span>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mt-4">
        <button className="btn btn-secondary" onClick={prevPage} disabled={currentPage === 1}>
          Anterior
        </button>
        <span>Página {currentPage} de {Math.ceil(filteredItems.length / itemsPerPage)}</span>
        <button className="btn btn-secondary" onClick={nextPage} disabled={currentPage === Math.ceil(filteredItems.length / itemsPerPage)}>
          Próxima
        </button>
      </div>
    </div>
  );
};

export default Content;