import api from '../api';
import type { Associate } from '../associate/associate.types';

interface AdminFetchAssociatesRequest {
  bearerToken: string;
}

export async function adminFetchAssociates({
  bearerToken,
}: AdminFetchAssociatesRequest): Promise<Associate[]> {
  const res = await api.get('/admins/all-associates', {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  });

  return res.data.content;
}

export async function renovateAssociateCard(id: string, token: string) {
  return true;
  // const res = await api.put(`/cards/${id}/renovate`, {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // });

  // return res.data;
}
