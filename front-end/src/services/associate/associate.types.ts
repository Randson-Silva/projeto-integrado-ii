import type { Address } from './address/address.types';
import type { User } from '../user/user.types';
import type { SelfDeclaration } from './selfDeclaration/selfDeclaration.types';

export type Associate = {
  id: string;
  cpf: string;
  birthDate: string;
  workCategory: AssociateCategory;
  phone: string;
  user: User;
  address: Address;
  selfDeclaration: SelfDeclaration;
};

type AssociateCategory = 'ARTISTA' | 'PRODUTOR' | 'TECNICO' | 'OUTRO';

export const normalizeCategoryView = (category: AssociateCategory) => {
  switch (category) {
    case 'ARTISTA':
      return 'Artista';
    case 'TECNICO':
      return 'Tecnico';
    case 'PRODUTOR':
      return 'Produtor';
    case 'OUTRO':
      return 'Outro';
  }
};
