import api from './api';

export async function validateCard(number: string) {
  const res = await api.get(`/cards/validate?number=${number}`);
  return res.data;
}

export async function updateValidityDate(date: string, token: string) {
  const res = await api.put(
    `/cards/settings/validity?validityDate=${date}`,
    null,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
}

export async function getValidityDate(token: string) {
  try {
    const res = await api.get('/cards/settings/validity', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch {
    return '';
  }
}
