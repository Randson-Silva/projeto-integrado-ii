import api from '../api';
import type { Associate, CreateAssociatePayload, UpdateAssociatePayload } from './associate.types';


export interface GetAssociatesParams {
  page?: number;
  size?: number;
  search?: string;
}

export async function getAssociates(
  bearerToken: string,
  params?: GetAssociatesParams
): Promise<Associate[]> {
  const res = await api.get('/associates', {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
    params,
  });

  return res.data;
}

export async function getAssociateById(
  bearerToken: string,
  id: string
): Promise<Associate> {
  const res = await api.get(`/associates/${id}`, {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  });

  return res.data;
}

export async function getMyAssociate(
  bearerToken: string
): Promise<Associate> {
  const res = await api.get('/associates/me', {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  });

  return res.data;
}

export async function createAssociate(
  bearerToken: string,
  data: CreateAssociatePayload
): Promise<Associate> {
  const res = await api.post('/associates', data, {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  });

  return res.data;
}

export async function updateAssociate(
  bearerToken: string,
  id: string,
  data: UpdateAssociatePayload
): Promise<Associate> {
  const res = await api.patch(`/associates/${id}`, data, {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  });

  return res.data;
}

export async function deleteAssociate(
  bearerToken: string,
  id: string
): Promise<void> {
  await api.delete(`/associates/${id}`, {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  });
}
