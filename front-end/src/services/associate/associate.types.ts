export type AssociateStatus = 'ATIVO' | 'PENDENTE' | 'INATIVADO' | 'INATIVO';

export interface Associate {
  id: string;
  cpf: string;
  birthDate?: string;
  workCategory?: string;
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
    income?: string;
    disability?: string;
  };

  status?: AssociateStatus;
}

export interface AssociatePageable {
  content: Associate[];
  totalElements: number;
  totalPages: number;
  number: number;
}

// export type Associate = {
//   id: string;
//   cpf: string;
//   birthDate: string;
//   workCategory: AssociateCategory;
//   phone: string;
//   user: User;
//   address: Address;
//   selfDeclaration: SelfDeclaration;
// };

// type AssociateCategory = 'ARTISTA' | 'PRODUTOR' | 'TECNICO' | 'OUTRO';

// export const normalizeCategoryView = (category: AssociateCategory) => {
//   switch (category) {
//     case 'ARTISTA':
//       return 'Artista';
//     case 'TECNICO':
//       return 'Tecnico';
//     case 'PRODUTOR':
//       return 'Produtor';
//     case 'OUTRO':
//       return 'Outro';
//   }
// };
