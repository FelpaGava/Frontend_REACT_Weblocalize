function Footer() {
    return (
        <footer className="bg-dark text-white text-center py-3 fixed-bottom">
            <div className="container">
                <p className="mb-0 small">
                    &copy; {new Date().getFullYear()} WebLocalize. Todos os direitos reservados.
                </p>
            </div>
        </footer>
    );
}

export default Footer;