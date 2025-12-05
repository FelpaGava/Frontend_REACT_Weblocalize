import { useState, useEffect } from 'react';
import api, { apiEstadosIBGE, apiCidadesIBGE } from '../../../service/Api';
import Modal from '../../modal';
import Swal from 'sweetalert2';

const normalizarTexto = (texto) => {
    if (!texto) return "";
    return String(texto).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim();
};

function AddLocations({ isOpen, onClose, onSuccess }) {

    const [isSaving, setIsSaving] = useState(false);
    const [listaEstadosIBGE, setListaEstadosIBGE] = useState([]);
    const [listaCidadesIBGE, setListaCidadesIBGE] = useState([]);
    const [selectedEstadoIBGE, setSelectedEstadoIBGE] = useState(null);

    const initialFormState = {
        nome: '',
        descricao: '',
        endereco: '',
        ufId: '',
        cidadeId: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (isOpen) {
            setFormData(initialFormState);
            setSelectedEstadoIBGE(null);
            setListaCidadesIBGE([]);

            apiEstadosIBGE()
                .then(response => {
                    const estadosOrdenados = response.data.sort((a, b) => a.nome.localeCompare(b.nome));
                    setListaEstadosIBGE(estadosOrdenados);
                })
                .catch(err => console.error("Erro ao carregar IBGE:", err));
        }
    }, [isOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEstadoChange = async (e) => {
        const ibgeId = e.target.value;
        const estadoSelecionado = listaEstadosIBGE.find(uf => uf.id === parseInt(ibgeId));
        setSelectedEstadoIBGE(estadoSelecionado);

        setFormData(prev => ({ ...prev, cidadeId: '' }));

        if (estadoSelecionado) {
            try {
                const response = await apiCidadesIBGE(estadoSelecionado.id);
                setListaCidadesIBGE(response.data);
            } catch (error) {
                console.error("Erro ao buscar cidades IBGE", error);
            }
        } else {
            setListaCidadesIBGE([]);
        }
    };

    const garantirEstadoNoBanco = async () => {
        if (!selectedEstadoIBGE) return null;
        try {
            const responseLocais = await api.get('Estado');

            let listaParaVerificar = [];
            if (responseLocais.data && Array.isArray(responseLocais.data.$values)) {
                listaParaVerificar = responseLocais.data.$values;
            } else if (Array.isArray(responseLocais.data)) {
                listaParaVerificar = responseLocais.data;
            }

            const estadoExistente = listaParaVerificar.find(e => {
                const siglaBanco = e.UFSIGLA || e.ufsigla || "";
                return normalizarTexto(siglaBanco) === normalizarTexto(selectedEstadoIBGE.sigla);
            });

            if (estadoExistente) {
                return estadoExistente.ufid || estadoExistente.UFID;
            } else {
                const novoEstadoPayload = {
                    UFNOME: selectedEstadoIBGE.nome,
                    UFSIGLA: selectedEstadoIBGE.sigla,
                    UFSITUACAO: 'A',
                    UFDATACRIACAO: new Date().toISOString() 
                };

                const responseSave = await api.post('Estado', novoEstadoPayload);
                return responseSave.data.ufid || responseSave.data.UFID;
            }
        } catch (error) {
            console.error("Erro ao sincronizar estado:", error);
            throw error;
        }
    };

    const safeGet = (obj, key) => {
        if (!obj) return undefined;
        const keys = Object.keys(obj);
        const match = keys.find(k => k.toLowerCase() === key.toLowerCase());
        return match ? obj[match] : undefined;
    };

    const garantirCidadeNoBanco = async (ufIdBanco) => {
        const cidadeSelecionadaIBGE = listaCidadesIBGE.find(c => c.id === parseInt(formData.cidadeId));
        if (!cidadeSelecionadaIBGE) return null;
        try {
            const response = await api.get('Cidade/buscar-por-nome', {
                params: {
                    nome: cidadeSelecionadaIBGE.nome,
                    ufId: ufIdBanco
                }
            });
            const idEncontrado = safeGet(response.data, 'cidid');
            return idEncontrado;

        } catch (error) {
            if (error.response && error.response.status === 404) {
                const novaCidadePayload = {
                    CIDNOME: cidadeSelecionadaIBGE.nome,
                    CIDUF: parseInt(ufIdBanco),
                    CIDSITUACAO: 'A', 
                    CIDDATACRIACAO: new Date().toISOString()
                };

                try {
                    const responseSave = await api.post('Cidade', novaCidadePayload);
                    const idNovo = safeGet(responseSave.data, 'cidid');
                    return idNovo;
                } catch (errSave) {
                    throw errSave;
                }
            } else {
                throw error;
            }
        }
    };

    const handleSave = async () => {
        if (!formData.nome || !formData.cidadeId || !selectedEstadoIBGE) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos Obrigatórios',
                text: 'Por favor, preencha o Nome, Estado e Cidade.',
                confirmButtonColor: '#0d6efd'
            });
            return;
        }

        setIsSaving(true);
        try {
            const ufIdLocal = await garantirEstadoNoBanco();
            if (!ufIdLocal) throw new Error("Falha ao obter ID do Estado.");

            const cidadeIdLocal = await garantirCidadeNoBanco(ufIdLocal);
            if (!cidadeIdLocal) throw new Error("Falha ao obter ID da Cidade.");

            const payload = {
                locnome: formData.nome,
                locdescricao: formData.descricao,
                locendereco: formData.endereco,
                loccid: parseInt(cidadeIdLocal),
                locuf: parseInt(ufIdLocal),
                locsituacao: 'A'
            };

            await api.post('Local', payload);

            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Local cadastrado com sucesso!',
                showConfirmButton: false,
                timer: 2500
            });

            onSuccess();
            onClose();

        } catch (error) {
            console.error("Erro ao salvar:", error);
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Ocorreu um erro ao salvar. Entre em contato com o Suporte.',
                confirmButtonColor: '#dc3545'
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal
            title="Novo Ponto Turístico"
            isOpen={isOpen}
            onClose={onClose}
            size="modal-lg"
            footer={
                <>
                    <button className="btn btn-secondary" onClick={onClose} disabled={isSaving}>
                        Cancelar
                    </button>
                    <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? 'Sincronizando...' : 'Salvar Registro'}
                    </button>
                </>
            }
        >
            <form>
                <div className="mb-3 fw-bold">
                    <label className="form-label">Nome do Local <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" name="nome" value={formData.nome} onChange={handleInputChange} maxLength="50" />
                    <div className="text-end text-muted" style={{ fontSize: '0.8em' }}>
                        {formData.nome.length}/50
                    </div>
                </div>
                <div className="mb-3 fw-bold">
                    <label className="form-label">Descrição</label>
                    <textarea className="form-control" rows="3" name="descricao" value={formData.descricao} onChange={handleInputChange} maxLength="100"></textarea>
                    <div className="text-end text-muted" style={{ fontSize: '0.8em' }}>
                        {formData.descricao.length}/100
                    </div>
                </div>
                <div className="mb-3 fw-bold">
                    <label className="form-label">Endereço</label>
                    <input type="text" className="form-control" name="endereco" value={formData.endereco} onChange={handleInputChange} maxLength="50" />
                    <div className="text-end text-muted" style={{ fontSize: '0.8em' }}>
                        {formData.endereco.length}/50
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Estado <span className="text-danger">*</span></label>
                        <select
                            className="form-select"
                            value={selectedEstadoIBGE ? selectedEstadoIBGE.id : ''}
                            onChange={handleEstadoChange}
                        >
                            <option value="">Selecione...</option>
                            {listaEstadosIBGE.map(uf => (
                                <option key={uf.id} value={uf.id}>{uf.nome} ({uf.sigla})</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-6 mb-3 fw-bold">
                        <label className="form-label">Cidade <span className="text-danger">*</span></label>
                        <select
                            className="form-select"
                            name="cidadeId"
                            value={formData.cidadeId}
                            onChange={handleInputChange}
                            disabled={!selectedEstadoIBGE}
                        >
                            <option value="">
                                {!selectedEstadoIBGE ? 'Selecione um Estado primeiro' : 'Selecione a Cidade...'}
                            </option>
                            {listaCidadesIBGE.map(cid => (
                                <option key={cid.id} value={cid.id}>{cid.nome}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </form>
        </Modal>
    );
}

export default AddLocations;