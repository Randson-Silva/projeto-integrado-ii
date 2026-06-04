import api from '../api';
import type { Associate, AssociateCategory } from './associate.types';

export interface CreateAssociatePayload {
  baseData: {
    email: string;
    password: string;
    fullName: string;
    cpf: string;
    phone: string;
  };

  socialName?: string;
  artisticName?: string;

  birthDate: string;

  workCategoryId?: string;

  availableHours?: string;

  postalCode: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;

  race?: string;
  gender?: string;
  sexualOrientation?: string;
  education?: string;
  income?: string;
  disability?: string;

  additionalInfo?: string;
  legalGuardianName?: string;
  acceptedDataSharingTerm?: boolean;
}

export interface UpdateAssociatePayload {
  cpf?: string;
  birthDate?: string;
  phone?: string;

  workCategory?: AssociateCategory;

  fullName?: string;
  email?: string;

  postalCode?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;

  race?: string;
  gender?: string;
  sexualOrientation?: string;
  education?: string;
  income?: string;
  disability?: string;
}

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
