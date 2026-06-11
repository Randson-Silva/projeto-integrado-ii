import api from '../api';
import type { Role } from '../auth/roles';
import type { PageableResponse, User } from './user.types';

interface GetUsersParams {
  page: number;
  size?: number;
}

export async function getUsers({
  page,
  size = 10,
}: GetUsersParams): Promise<PageableResponse<User>> {
  let response = await api.get<PageableResponse<User>>('/management/users', {
    params: {
      page,
      size,
    },
  });

  const allUsers = response.data.content;

  const filteredUsers = allUsers.filter((user) => {
    return user.role === 'CONSULTANT' || user.role === 'ADMIN';
  });

  response = {
    ...response,
    data: { ...response.data, content: filteredUsers },
  };

  return response.data;
}

interface AccessControlGetUserByIdRequest {
  id: string;
}

export interface AccessControlGetUserByIdResponse {
  email: string;
  password: string;
  name: string;
  cpf: string;
  phone: string;
  role: Role;
}

export async function accessControlGetUserById({
  id,
}: AccessControlGetUserByIdRequest) {
  const res = await api.get(`/management/users/${id}`);

  return res.data;
}

interface AccessControlUpdateUserRequest {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  token: string;
}

export async function accessControlUpdateUser({
  id,
  email,
  fullName,
  phone,
  token,
}: AccessControlUpdateUserRequest) {
  const res = await api.put(
    `/management/users/${id}`,
    {
      email,
      fullName,
      phone,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
}

interface accessControlUpdateUserRoleRequest {
  id: string;
  newRole: Role;
}

export async function accessControlUpdateUserRole({
  id,
  newRole,
}: accessControlUpdateUserRoleRequest) {
  const res = await api.patch(`/management/users/${id}/role`, {
    newRole,
  });

  return res.data;
}

export async function accessControlDeleteUser({
  id,
}: AccessControlGetUserByIdRequest) {
  const res = await api.delete(`/management/users/${id}`);

  return res.data;
}

export async function activateUser(token: string, id: string) {
  const res = await api.patch(
    `/management/users/${id}/active`,
    { active: true },
    { headers: { Authrization: `Bearer ${token}` } }
  );

  return res.data;
}

export async function inactivateUser(token: string, id: string) {
  const res = await api.patch(
    `/management/users/${id}/active`,
    { active: false },
    { headers: { Authrization: `Bearer ${token}` } }
  );

  return res.data;
}
