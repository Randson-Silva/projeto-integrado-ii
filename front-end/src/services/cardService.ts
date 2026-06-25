import api from './api';

export async function validateCard(number: string) {
  const res = await api.get(`/cards/validate?number=${number}`);
  return res.data;
}
