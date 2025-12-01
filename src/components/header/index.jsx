import React from 'react';

function Header() {
    return (
        <div className="header-container">
            <div className="container">
                <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
                    <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
                        <svg className="bi me-2" width="40" height="32"><use xlinkHref="#bootstrap" /></svg>
                        <h2 className="fs-3">🗺 Weblocalize</h2>
                    </a>

                    <ul className="nav nav-pills">
                        <li className="nav-item"><a href="#" className="nav-link active" aria-current="page">Pontos Turísticos</a></li>
                        <li className="nav-item"><a href="#" className="nav-link">Cadastrar Locais</a></li>
                        <li className="nav-item"><a href="#" className="nav-link">Contato</a></li>
                        <li className="nav-item"><a href="#" className="nav-link">Sobre</a></li>
                    </ul>
                </header>
            </div>
        </div>
    )
}

export default Header;