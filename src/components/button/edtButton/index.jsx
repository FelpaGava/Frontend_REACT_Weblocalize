import React, { useState } from 'react';
import Swal from 'sweetalert2';
import api from '../../../service/Api';
import Modal from '../../modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

function EdtButton({ item, onSuccess }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: item.locnome || '',
    endereco: item.locendereco || '',
    descricao: item.locdescricao || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.nome) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos Obrigatórios',
        text: 'Por favor, preencha o Nome.',
        confirmButtonColor: '#0d6efd'
      });
      return;
    }

    setIsEditing(true);
    try {
      await api.put(`local/${item.locid}`, {
        locnome: formData.nome,
        locendereco: formData.endereco,
        locdescricao: formData.descricao
      });

      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Local atualizado com sucesso!',
        showConfirmButton: false,
        timer: 2500
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Ocorreu um erro ao atualizar. Entre em contato com o Suporte.',
        confirmButtonColor: '#dc3545'
      });
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <>
      <button
        className="btn btn-outline-primary btn-sm px-3 d-flex align-items-center gap-2"
        onClick={() => setIsEditing(true)}
        title="Editar Local"
      >
        <FontAwesomeIcon icon={faPen} />
        Editar
      </button>

      {isEditing && (
        <Modal
          title="Editar Local"
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setIsEditing(false)} disabled={isEditing}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={handleSave} disabled={isEditing && !formData.nome}>
                {isEditing ? 'Salvar' : 'Salvando...'}
              </button>
            </>
          }
        >
          <form>
            <div className="mb-3 fw-bold">
              <label className="form-label">Nome do Local <span className="text-danger">*</span></label>
              <input
                type="text"
                className="form-control"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                maxLength="50"
              />
              <div className="text-end text-muted" style={{ fontSize: '0.8em' }}>
                {formData.nome.length}/50
              </div>
            </div>

            <div className="mb-3 fw-bold">
              <label className="form-label">Descrição</label>
              <textarea
                className="form-control"
                rows="3"
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                maxLength="100"
              ></textarea>
              <div className="text-end text-muted" style={{ fontSize: '0.8em' }}>
                {formData.descricao.length}/100
              </div>
            </div>

            <div className="mb-3 fw-bold">
              <label className="form-label">Endereço</label>
              <input
                type="text"
                className="form-control"
                name="endereco"
                value={formData.endereco}
                onChange={handleInputChange}
                maxLength="50"
              />
              <div className="text-end text-muted" style={{ fontSize: '0.8em' }}>
                {formData.endereco.length}/50
              </div>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

export default EdtButton;