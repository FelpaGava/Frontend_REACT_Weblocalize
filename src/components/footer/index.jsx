import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';

function Footer() {
    return (
        <footer className="bg-dark text-white py-3 fixed-bottom">
            <div className="container">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="text-start">
                        <p className="mb-0 small">
                            &copy; {new Date().getFullYear()} WebLocalize. Todos os direitos reservados.
                        </p>
                    </div>

                    <div>
                        <a href="https://www.linkedin.com/in/marcos-felipe-gava-093910263" target="_blank" rel="noopener noreferrer" className="text-white text-decoration-none">
                            <FontAwesomeIcon icon={faLinkedin} size="2xl" title="Visite meu LinkedIn" />
                        </a>
                        <a href="https://github.com/FelpaGava" target="_blank" rel="noopener noreferrer" className="text-white text-decoration-none">
                            <FontAwesomeIcon icon={faGithub} size="2xl" title="Visite meu GitHub" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;