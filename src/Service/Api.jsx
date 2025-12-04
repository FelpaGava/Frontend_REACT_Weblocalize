import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5229/api/",
});

export const apiEstadosIBGE = () => {
  return axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome");
};

export const apiCidadesIBGE = (ufId) => {
  return axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufId}/municipios?orderBy=nome`);
};

export default api;
