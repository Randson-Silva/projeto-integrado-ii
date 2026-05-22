export type AssociateStatus = 'ATIVO' | 'PENDENTE' | 'INATIVADO' | 'INATIVO';

export type AssociateCategory = 'ARTISTA' | 'PRODUTOR' | 'TECNICO' | 'OUTRO';

export type AssociateIncome = 'BAIXA' | 'MEDIA' | 'ALTA';

export interface AssociateProfileForm {
  id: string;

  fullName: string;
  cpf: string;
  email: string;
  phone: string;

  birthDate: string;

  category: AssociateCategory | '';

  addressZipCode: string;
  addressState: string;
  addressCity: string;
  addressNeighborhood: string;
  addressStreet: string;

  addressNumber: string;

  race: string;
  gender: string;
  sexualOrientation: string;
  education: string;
  income: AssociateIncome | '';
  disability: string;
}

export interface AssociateResponse {
  id: string;

  cpf: string;

  birthDate?: string;

  workCategory?: AssociateCategory;

  phone?: string;

  legalGuardianName?: string;

  user: {
    id: string;

    name: string;

    email?: string;
    cpf?: string;
    phone?: string;

    role?: string;

    enabled?: boolean;
    active?: boolean;
  };

  address?: {
    id?: string;

    postalCode?: string;

    street?: string;
    number?: string;

    neighborhood?: string;

    city?: string;

    state?: string;
  };

  selfDeclaration?: {
    id?: string;

    race?: string;

    gender?: string;

    sexualOrientation?: string;

    education?: string;

    income?: AssociateIncome;

    disability?: string;
  };

  status?: AssociateStatus;
}

export interface AssociatePageableResponse {
  content: AssociateResponse[];

  totalElements: number;
  totalPages: number;

  size: number;
  number: number;

  first: boolean;
  last: boolean;

  numberOfElements: number;
  empty: boolean;
}

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

  workCategory: AssociateCategory;

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

  income?: AssociateIncome;

  disability?: string;

  additionalInfo?: string;

  legalGuardianName?: string;
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

  income?: AssociateIncome;

  disability?: string;
}

export type Associate = AssociateResponse;

export type AssociatePageable = AssociatePageableResponse;

export const normalizeCategoryView = (category?: AssociateCategory) => {
  switch (category) {
    case 'ARTISTA':
      return 'Artista';

    case 'TECNICO':
      return 'Técnico';

    case 'PRODUTOR':
      return 'Produtor';

    case 'OUTRO':
      return 'Outro';

    default:
      return '-';
  }
};
