import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEarthAmericas } from '@fortawesome/free-solid-svg-icons';

function Header() {
    const location = useLocation();

    return (
        <div className="header-container">
            <div className="container">
                <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
                    <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
                        <svg className="bi me-2" width="40" height="32"><use xlinkHref="#bootstrap" /></svg>
                        <h2 className="fs-3" style={{ fontWeight: 'bold', letterSpacing: '1px' }}>
                            <FontAwesomeIcon icon={faEarthAmericas} size="2xl"/>
                            <span style={{ marginLeft: '10px', textTransform: 'uppercase' }}>Weblocalize</span>
                        </h2>
                    </a>

                    <ul className="nav nav-pills">
                        <li className="nav-item">
                            <Link to="/" className={`nav-link fw-bold ${location.pathname === '/' ? 'active' : ''}`} aria-current="page">
                                Pontos Turísticos
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/sobre" className={`nav-link fw-bold ${location.pathname === '/sobre' ? 'active' : ''}`}>
                                Sobre
                            </Link>
                        </li>
                    </ul>
                </header>
            </div>
        </div>
    )
}

export default Header;