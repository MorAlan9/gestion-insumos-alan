import axios from 'axios';
import type  { Insumo } from '../types/Insumo';

const API_URL = 'http://localhost:8083/api/v1/insumos';

export const getInsumos = async (): Promise<Insumo[]> => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createInsumo = async (insumo: Insumo): Promise<Insumo> => {
    const response = await axios.post(API_URL, insumo);
    return response.data;
};