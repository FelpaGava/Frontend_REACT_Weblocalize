import React, { useState, useEffect } from 'react';
import api from '../../../service/Api';
import Modal from '../../modal';

import Swal from 'sweetalert2';

function AddLocations({ isOpen, onClose, onSuccess, listaEstados, listaCidades }) {

    const [isSaving, setIsSaving] = useState(false);
    
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
        }
    }, [isOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!formData.nome || !formData.cidadeId || !formData.ufId) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos Obrigatórios',
                text: 'Por favor, preencha o Nome, Estado e Cidade.',
                confirmButtonColor: '#0d6efd' // Cor azul do bootstrap
            });
            return;
        }

        setIsSaving(true);
        try {
            const payload = {
                locnome: formData.nome,
                locdescricao: formData.descricao,
                locendereco: formData.endereco,
                loccid: parseInt(formData.cidadeId),
                locuf: parseInt(formData.ufId),
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
                text: 'Não foi possível salvar o registro. Tente novamente.',
                confirmButtonColor: '#dc3545'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const cidadesFiltradas = listaCidades.filter(c =>
        !formData.ufId || c.ciduf === parseInt(formData.ufId) || c.CIDUF === parseInt(formData.ufId)
    );

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
                        {isSaving ? 'Salvando...' : 'Salvar Registro'}
                    </button>
                </>
            }
        >
            <form>
                <div className="mb-3">
                    <label className="form-label">Nome do Local <span className="text-danger">*</span></label>
                    <input
                        type="text"
                        className="form-control"
                        name="nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        placeholder="Ex: Cristo Redentor"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Descrição</label>
                    <textarea
                        className="form-control"
                        rows="3"
                        name="descricao"
                        value={formData.descricao}
                        onChange={handleInputChange}
                        placeholder="Ex: Ponto turístico famoso no Rio de Janeiro"
                    ></textarea>
                </div>

                <div className="mb-3">
                    <label className="form-label">Endereço</label>
                    <input
                        type="text"
                        className="form-control"
                        name="endereco"
                        value={formData.endereco}
                        onChange={handleInputChange}
                        placeholder="Ex: Parque Nacional da Tijuca, Rio de Janeiro - RJ"
                    />
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Estado <span className="text-danger">*</span></label>
                        <select
                            className="form-select"
                            name="ufId"
                            value={formData.ufId}
                            onChange={handleInputChange}
                        >
                            <option value="">Selecione...</option>
                            {listaEstados.map(uf => (
                                <option key={uf.ufid || uf.UFID} value={uf.ufid || uf.UFID}>
                                    {uf.ufnome || uf.UFNOME}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-6 mb-3">
                        <label className="form-label">Cidade <span className="text-danger">*</span></label>
                        <select
                            className="form-select"
                            name="cidadeId"
                            value={formData.cidadeId}
                            onChange={handleInputChange}
                            disabled={!formData.ufId}
                        >
                            <option value="">
                                {!formData.ufId ? 'Selecione um Estado primeiro' : 'Selecione a Cidade...'}
                            </option>
                            {cidadesFiltradas.map(cid => (
                                <option key={cid.cidid || cid.CIDID} value={cid.cidid || cid.CIDID}>
                                    {cid.cidnome || cid.CIDNOME}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </form>
        </Modal>
    );
}

export default AddLocations;