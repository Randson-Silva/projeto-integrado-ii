export type AssociateStatus = 'ATIVO' | 'PENDENTE' | 'INATIVADO' | 'INATIVO';

export type AssociateCategory = 'ARTISTA' | 'PRODUTOR' | 'TECNICO' | 'OUTRO';

export interface AssociateCategoryResponse {
  id: string;
  name: string;
}

export type AssociateIncome = 'BAIXA' | 'MEDIA' | 'ALTA';

export type AssociateEducation =
  | 'FUNDAMENTAL'
  | 'MEDIO'
  | 'SUPERIOR'
  | 'POS_GRADUACAO'
  | 'MESTRADO'
  | 'DOUTORADO'
  | 'NAO_INFORMADO';

export interface IAssociateProfileForm {
  id: string;
  fullName: string;
  cpf: string;
  email: string;
  phone: string;
  birthDate: string;
  category: string; // UUID from categories table
  addressZipCode: string;
  addressState: string;
  addressCity: string;
  addressNeighborhood: string;
  addressStreet: string;
  addressNumber: string;
  race: string;
  gender: string;
  sexualOrientation: string;
  education: AssociateEducation | '';
  income: AssociateIncome | '';
  disability: string;
}

// Alias sem prefixo para compatibilidade com o padrão do develop
export type AssociateProfileForm = IAssociateProfileForm;


export interface IAssociateSelfDeclarationForm {
  education: AssociateEducation;
  race: string;
  gender: string;
  sexualOrientation: string;
  income: AssociateIncome;
  disability: string;
}

export interface AssociateResponse {
  id: string;
  cpf: string;
  birthDate?: string;
  workCategory?: AssociateCategoryResponse;
  phone?: string;
  legalGuardianName?: string;
  user: {
    id: string;
    name: string;
    email?: string;
    password?: string;
    cpf?: string;
    phone?: string;
    role?: string;
    accessKeyHash?: string;
    createdAt?: string;
    updatedAt?: string;
    enabled?: boolean;
    active: boolean;
    username?: string;
    authorities?: { authority: string }[];
    accountNonExpired?: boolean;
    accountNonLocked?: boolean;
    credentialsNonExpired?: boolean;
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
    socialName?: string;
    race?: string;
    gender?: string;
    sexualOrientation?: string;
    education?: AssociateEducation;
    income?: AssociateIncome;
  };
  acceptedDataSharingTerm?: boolean;
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
  education?: AssociateEducation;
  income?: AssociateIncome;
  disability?: string;
  additionalInfo?: string;
  legalGuardianName?: string;
}

export interface UpdateAssociatePayload {
  cpf?: string;
  birthDate?: string;
  phone?: string;
  workCategoryId?: string;
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
  education?: AssociateEducation;
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

export const normalizeIncomeView = (income?: AssociateIncome) => {
  switch (income) {
    case 'BAIXA':
      return 'Baixa';
    case 'MEDIA':
      return 'Média';
    case 'ALTA':
      return 'Alta';
    default:
      return '-';
  }
};

export const normalizeEducationView = (education?: AssociateEducation) => {
  switch (education) {
    case 'FUNDAMENTAL':
      return 'Fundamental';
    case 'MEDIO':
      return 'Médio';
    case 'SUPERIOR':
      return 'Superior';
    case 'POS_GRADUACAO':
      return 'Pós-graduação';
    case 'MESTRADO':
      return 'Mestrado';
    case 'DOUTORADO':
      return 'Doutorado';
    default:
      return '-';
  }
};
