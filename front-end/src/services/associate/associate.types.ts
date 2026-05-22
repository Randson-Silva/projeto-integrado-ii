export type AssociateStatus = 'ATIVO' | 'INATIVO' | 'INATIVADO' | 'PENDENTE';

export interface Associate {
  id: string;
  fullName: string;
  cpf: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  category?: string;
  status: AssociateStatus;
  // Endereço
  addressStreet?: string;
  addressNumber?: string;
  addressComplement?: string;
  addressNeighborhood?: string;
  addressZipCode?: string;
  addressCity?: string;
  addressState?: string;
  // Institucional
  institutionName?: string;
  institutionRole?: string;
  // Socioeconômico
  registrationDate?: string;
  validity?: string;
  monthlyFee?: string;
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
