import React, { createContext, useState, useEffect } from 'react';
import api from '../service/Api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [listaLocais, setListaLocais] = useState([]);
  const [listaCidades, setListaCidades] = useState([]);
  const [listaEstados, setListaEstados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [resLocais, resCidades, resEstados] = await Promise.all([
        api.get('local'),
        api.get('cidade'),
        api.get('estado'),
      ]);

      const dadosLocais = resLocais.data.$values || resLocais.data;
      const dadosCidades = resCidades.data.$values || resCidades.data;
      const dadosEstados = resEstados.data.$values || resEstados.data;

      const locaisAtivos = (dadosLocais || []).filter((l) => l.locsituacao !== 'i');

      setListaLocais(locaisAtivos);
      setListaCidades(dadosCidades || []);
      setListaEstados(dadosEstados || []);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const buscarPorTermo = async (termo) => {
    if (!termo.trim()) {
      carregarDados();
      return;
    }

    try {
      const response = await api.get('local/buscar-por-termo', {
        params: { termo },
      });

      if (response.status === 200 && Array.isArray(response.data.$values)) {
        const ativos = response.data.$values.filter((item) => item.locsituacao === 'A');
        setListaLocais(ativos);
      } else {
        console.warn('Resposta inesperada do servidor:', response);
        setListaLocais([]);
      }
    } catch (error) {
      console.error('Erro ao buscar por termo:', error);
      setListaLocais([]);
    }
  };

  return (
    <AppContext.Provider
      value={{
        listaLocais,
        listaCidades,
        listaEstados,
        isLoading,
        carregarDados,
        buscarPorTermo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;