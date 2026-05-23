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
  phone: associate.phone ?? '',

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
  cpf: form.cpf,
  birthDate: form.birthDate,
  phone: form.phone,

  workCategory: form.category === '' ? undefined : form.category,

  fullName: form.fullName,
  email: form.email,

  postalCode: form.addressZipCode,
  street: form.addressStreet,
  number: form.addressNumber,
  neighborhood: form.addressNeighborhood,
  city: form.addressCity,
  state: form.addressState,

  race: form.race,
  gender: form.gender,
  sexualOrientation: form.sexualOrientation,
  education: form.education || undefined,
  income: form.income || undefined,
  disability: form.disability,
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

  race: form.race,
  gender: form.gender,
  sexualOrientation: form.sexualOrientation,
  education: form.education || undefined,
  income: form.income || undefined,
  disability: form.disability,
});
