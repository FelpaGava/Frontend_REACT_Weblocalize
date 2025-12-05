import styles from './sobre.module.css';

function sobre() {
    return (
        <div className={styles.container}>
            <h1>Weblocalize: Um Desafio Full Stack</h1>

            <p>
                Este projeto nasceu de um desafio técnico: construir uma aplicação completa,
                do banco de dados à interface, em apenas <strong>7 dias</strong>.
            </p>

            <p>
                Construído com a robustez do <strong>.NET</strong> no backend e a interatividade
                do <strong>React</strong> no frontend, o Weblocalize é o resultado de muita
                dedicação e aprendizado acelerado.
            </p>

            <p>
                Para viabilizar a entrega neste curto prazo, utilizei <strong>Inteligência Artificial</strong> como
                copiloto técnico, permitindo focar na lógica de negócio e na integração dos sistemas.
                O resultado é uma aplicação funcional que reflete agilidade e adaptabilidade a novas tecnologias.
            </p>
        </div>
    );
}

export default sobre;