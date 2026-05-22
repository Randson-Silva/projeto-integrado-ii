export interface SelfDeclaration {
  id: string;
  race: string;
  gender: string;
  sexualOrientation: string;
  education: LevelEducationEnum;
  income: IncomeEnum;
  disability: string;
}

type LevelEducationEnum =
  | 'FUNDAMENTAL'
  | 'MEDIO'
  | 'SUPERIOR'
  | 'POS_GRADUACAO';

type IncomeEnum = 'BAIXA' | 'MEDIA' | 'ALTA';
