import type {
  AssociateProfileForm,
  AssociateResponse,
  CreateAssociatePayload,
  UpdateAssociatePayload,
} from './associate.types';

export const mapAssociateResponseToForm = (
  associate: AssociateResponse
): AssociateProfileForm => ({
  id: associate.id,
  fullName: associate.user.name ?? '',
  cpf: associate.cpf ?? '',
  email: associate.user.email ?? '',
  phone: associate.phone ?? associate.user.phone ?? '',
  birthDate: associate.birthDate ?? '',
  category: associate.workCategory ?? '',
  addressZipCode: associate.address?.postalCode ?? '',
  addressState: associate.address?.state ?? '',
  addressCity: associate.address?.city ?? '',
  addressNeighborhood: associate.address?.neighborhood ?? '',
  addressStreet: associate.address?.street ?? '',
  addressNumber: associate.address?.number ?? '',
  race: associate.selfDeclaration?.race ?? '',
  gender: associate.selfDeclaration?.gender ?? '',
  sexualOrientation: associate.selfDeclaration?.sexualOrientation ?? '',
  education: associate.selfDeclaration?.education ?? '',
  income: associate.selfDeclaration?.income ?? '',
  disability: associate.selfDeclaration?.disability ?? '',
});

export const mapFormToUpdatePayload = (
  form: AssociateProfileForm
): UpdateAssociatePayload => ({
  cpf: form.cpf || undefined,
  birthDate: form.birthDate || undefined,
  phone: form.phone || undefined,
  workCategory: form.category === '' ? undefined : form.category,
  fullName: form.fullName || undefined,
  email: form.email || undefined,
  postalCode: form.addressZipCode || undefined,
  street: form.addressStreet || undefined,
  number: form.addressNumber || undefined,
  neighborhood: form.addressNeighborhood || undefined,
  city: form.addressCity || undefined,
  state: form.addressState || undefined,
  race: form.race || undefined,
  gender: form.gender || undefined,
  sexualOrientation: form.sexualOrientation || undefined,
  education: form.education === '' ? undefined : form.education,
  income: form.income === '' ? undefined : form.income,
  disability: form.disability || undefined,
});

export const mapFormToCreatePayload = (
  form: AssociateProfileForm,
  password: string
): CreateAssociatePayload => ({
  baseData: {
    email: form.email,
    password,
    fullName: form.fullName,
    cpf: form.cpf,
    phone: form.phone,
  },
  birthDate: form.birthDate,
  workCategory: form.category === '' ? 'OUTRO' : form.category,
  postalCode: form.addressZipCode,
  street: form.addressStreet,
  number: form.addressNumber,
  neighborhood: form.addressNeighborhood,
  city: form.addressCity,
  state: form.addressState,
  race: form.race || undefined,
  gender: form.gender || undefined,
  sexualOrientation: form.sexualOrientation || undefined,
  education: form.education === '' ? undefined : form.education,
  income: form.income === '' ? undefined : form.income,
  disability: form.disability || undefined,
});
