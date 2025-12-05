import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchButton = ({ onSearch, onClear }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSearchClick = () => {
    onSearch(inputValue);
  };

  const handleClearClick = () => {
    setInputValue('');
    onClear();
  };

  return (
    <div className="search-bar mb-3 d-flex gap-2">
      <input
        type="text"
        className="form-control form-control-sm"
        placeholder="Pesquisar..."
        value={inputValue}
        onChange={handleInputChange}
      />
      <button className="btn btn-primary btn-sm" onClick={handleSearchClick}>
        <FontAwesomeIcon icon={faSearch} /> Buscar
      </button>
      <button className="btn btn-secondary btn-md" onClick={handleClearClick}>
        Limpar
      </button>
    </div>
  );
};

export default SearchButton;