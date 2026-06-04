import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import PersonIcon from '@mui/icons-material/Person';
import RefreshIcon from '@mui/icons-material/Refresh';
import SendIcon from '@mui/icons-material/Send';

import {
  Alert,
  Avatar,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

import {
  mapAssociateResponseToForm,
  mapFormToUpdatePayload,
} from '../services/associate/associate.mappers';

import type { AssociateCategoryResponse, IAssociateProfileForm } from '../services/associate/associate.types';

import api from '../services/api';

import {
  deleteAssociate,
  getAssociateById,
  updateAssociate,
} from '../services/associate/associateService';

import DeleteConfirmDialog from './DeleteConfirmDialog';
import InactivateAssociateDialog from './InactivateAssociateDialog';

const BR_STATES = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
];

const DARK_BTN = {
  bgcolor: '#5F5E5E',
  color: '#fff',
  borderRadius: 10,
  textTransform: 'none',
  fontWeight: 600,
  px: 2.5,
  '&:hover': {
    bgcolor: '#3E3D3D',
  },
} as const;

type Snack = {
  open: boolean;
  severity: 'success' | 'error';
  msg: string;
};

const EMPTY: IAssociateProfileForm = {
  id: '',
  fullName: '',
  cpf: '',
  email: '',
  phone: '',
  birthDate: '',
  category: '',
  addressZipCode: '',
  addressState: '',
  addressCity: '',
  addressNeighborhood: '',
  addressStreet: '',
  addressNumber: '',
  race: '',
  gender: '',
  sexualOrientation: '',
  education: '',
  income: '',
  disability: '',
};

const AssociateProfile = () => {
  const { token } = useAuth();

  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<IAssociateProfileForm>(EMPTY);

  const [categories, setCategories] = useState<AssociateCategoryResponse[]>([]);

  const [inactivateOpen, setInactivateOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [snack, setSnack] = useState<Snack>({
    open: false,
    severity: 'success',
    msg: '',
  });

  const toast = (severity: 'success' | 'error', msg: string) =>
    setSnack({
      open: true,
      severity,
      msg,
    });

  useEffect(() => {
    const load = async () => {
      try {
        if (!token || !id) return;

        const res = await getAssociateById(token, id);
        setForm(mapAssociateResponseToForm(res));
      } catch {
        toast('error', 'Erro ao carregar associado.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, token]);

  useEffect(() => {
    if (!token) return;
    api
      .get<AssociateCategoryResponse[]>('/categories', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCategories(res.data))
      .catch(() => {});
  }, [token]);

  const handleSave = async () => {
    try {
      if (!token || !id) return;

      setSaving(true);

      await updateAssociate(
        token,
        id,
        mapFormToUpdatePayload({
          ...form,

          cpf: form.cpf.replace(/\D/g, ''),

          phone: form.phone.replace(/\D/g, ''),

          addressZipCode: form.addressZipCode.replace(/\D/g, ''),
        })
      );

      setEditing(false);

      toast('success', 'Alterações salvas com sucesso!');
    } catch {
      toast('error', 'Erro ao salvar alterações.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (!token || !id) return;

      await deleteAssociate(token, id);

      navigate('/associados');
    } catch {
      toast('error', 'Erro ao excluir associado.');
    }
  };

  const tf = (
    label: string,
    key: keyof IAssociateProfileForm,
    type = 'text'
  ) => {
    const applyMask = (value: string, fieldKey: string) => {
      let v = String(value ?? '').replace(/\D/g, '');
      if (fieldKey === 'cpf') {
        return v
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
          .slice(0, 14);
      }
      if (fieldKey === 'addressZipCode') {
        return v.replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9);
      }
      if (fieldKey === 'phone') {
        return v
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{4,5})(\d{4})$/, '$1-$2')
          .slice(0, 15);
      }
      if (fieldKey === 'addressNumber') {
        return v;
      }
      return value;
    };

    const getMaxLength = (fieldKey: string) => {
      if (fieldKey === 'cpf') return 14;
      if (fieldKey === 'addressZipCode') return 9;
      if (fieldKey === 'phone') return 15;
      return undefined;
    };

    return (
      <TextField
        label={label}
        value={applyMask(String(form[key] ?? ''), key)}
        onChange={(e) =>
          setForm((p) => ({
            ...p,
            [key]: applyMask(e.target.value, key),
          }))
        }
        disabled={!editing}
        type={type}
        size="small"
        fullWidth
        slotProps={{
          inputLabel: {
            shrink: true,
          },
          htmlInput: {
            maxLength: getMaxLength(key),
            inputMode: ['cpf', 'addressZipCode', 'phone', 'addressNumber'].includes(key) ? 'numeric' : 'text',
          },
        }}
        onKeyDown={(e) => {
          if (['cpf', 'addressZipCode', 'phone', 'addressNumber'].includes(key as string)) {
            if (
              e.key.length === 1 &&
              !/[0-9]/.test(e.key) &&
              !e.ctrlKey &&
              !e.metaKey
            ) {
              e.preventDefault();
            }
          }
        }}
      />
    );
  };

  const sf = (
    label: string,
    key: keyof IAssociateProfileForm,
    options: {
      value: string;
      label: string;
    }[]
  ) => (
    <FormControl size="small" fullWidth>
      <InputLabel shrink>{label}</InputLabel>

      <Select
        value={String(form[key] ?? '')}
        label={label}
        notched
        disabled={
          !editing ||
          ['education', 'income', 'race', 'gender', 'sexualOrientation'].includes(key as string)
        }
        onChange={(e) =>
          setForm((p) => ({
            ...p,
            [key]: e.target.value,
          }))
        }
      >
        {options.map((o) => (
          <MenuItem key={o.value} value={o.value}>
            {o.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  if (loading) {
    return (
      <Stack
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          py: 10,
        }}
      >
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <>
      <Stack spacing={3}>
        <Button
          startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
          onClick={() => navigate('/associados')}
          sx={{
            alignSelf: 'flex-start',
            color: 'text.secondary',
            fontWeight: 600,
            textTransform: 'none',
            p: 0,
            '&:hover': {
              bgcolor: 'transparent',
              color: 'primary.main',
            },
          }}
        >
          Voltar
        </Button>

        <Paper
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            p: {
              xs: 2,
              sm: 3,
            },
          }}
        >
          <Stack
            sx={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 3,
            }}
          >
            <Stack
              sx={{
                width: 120,
              }}
            />

            <Stack
              sx={{
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Avatar
                sx={{
                  width: {
                    xs: 100,
                    sm: 140,
                  },
                  height: {
                    xs: 100,
                    sm: 140,
                  },
                  bgcolor: 'grey.500',
                }}
              >
                <PersonIcon
                  sx={{
                    fontSize: {
                      xs: 64,
                      sm: 90,
                    },
                    color: 'grey.300',
                  }}
                />
              </Avatar>

              <Chip
                label="Ativo"
                size="small"
                color="success"
                sx={{
                  fontWeight: 700,
                  fontSize: 12,
                  borderRadius: 1,
                }}
              />
            </Stack>

            <Stack
              sx={{
                width: 120,
                alignItems: 'flex-end',
              }}
            >
              {!editing && (
                <Button
                  startIcon={<EditIcon sx={{ fontSize: 16 }} />}
                  variant="contained"
                  color="primary"
                  onClick={() => setEditing(true)}
                  sx={{
                    borderRadius: 10,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 2.5,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Editar Perfil
                </Button>
              )}
            </Stack>
          </Stack>

          {!editing && (
            <>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  mb: 1.5,
                  color: 'text.secondary',
                }}
              >
                Gerenciar Associado
              </Typography>

              <Stack
                sx={{
                  flexDirection: {
                    xs: 'column',
                    sm: 'row',
                  },
                  gap: 1.5,
                  mb: 3,
                  flexWrap: 'wrap',
                }}
              >
                <Button
                  startIcon={<DeleteOutlineIcon sx={{ fontSize: 16 }} />}
                  variant="contained"
                  onClick={() => setDeleteOpen(true)}
                  sx={DARK_BTN}
                >
                  Excluir Associado
                </Button>

                <Button
                  startIcon={<LinkOffIcon sx={{ fontSize: 16 }} />}
                  variant="contained"
                  onClick={() => setInactivateOpen(true)}
                  sx={DARK_BTN}
                >
                  Inativar Vínculo
                </Button>

                <Button
                  startIcon={<DownloadIcon sx={{ fontSize: 16 }} />}
                  variant="contained"
                  color="primary"
                  sx={{
                    borderRadius: 10,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 2.5,
                  }}
                >
                  Baixar Ficha Cadastral
                </Button>
              </Stack>

              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  mb: 1.5,
                  color: 'text.secondary',
                }}
              >
                Gerenciar Carteirinha
              </Typography>

              <Stack
                sx={{
                  flexDirection: {
                    xs: 'column',
                    sm: 'row',
                  },
                  gap: 1.5,
                  mb: 3,
                  flexWrap: 'wrap',
                }}
              >
                <Button
                  startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
                  variant="contained"
                  sx={DARK_BTN}
                >
                  Renovar Carteirinha
                </Button>

                <Button
                  startIcon={<SendIcon sx={{ fontSize: 16 }} />}
                  variant="contained"
                  sx={DARK_BTN}
                >
                  Enviar Carteirinha
                </Button>

                <Button
                  startIcon={<CreditCardOutlinedIcon sx={{ fontSize: 16 }} />}
                  variant="contained"
                  color="primary"
                  sx={{
                    borderRadius: 10,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 2.5,
                  }}
                >
                  Baixar Carteirinha
                </Button>
              </Stack>
            </>
          )}

          <Divider sx={{ mb: 3 }} />

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 2,
            }}
          >
            Dados Pessoais
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 5 }}>
              {tf('Nome Completo', 'fullName')}
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>{tf('CPF', 'cpf')}</Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              {tf('Data de Nascimento', 'birthDate', 'date')}
            </Grid>

            <Grid size={{ xs: 12, sm: 8 }}>
              {tf('E-mail', 'email', 'email')}
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>{tf('Telefone', 'phone')}</Grid>
          </Grid>

          <Divider sx={{ mb: 3 }} />

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 2,
            }}
          >
            Dados de Endereço
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 2 }}>{tf('CEP', 'addressZipCode')}</Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              {sf(
                'Estado',
                'addressState',
                [
                  { value: '', label: 'Selecione' },
                  ...BR_STATES.map((s) => ({
                    value: s,
                    label: s,
                  })),
                ]
              )}
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>{tf('Cidade', 'addressCity')}</Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              {tf('Bairro', 'addressNeighborhood')}
            </Grid>

            <Grid size={{ xs: 12, sm: 5 }}>
              {tf('Rua', 'addressStreet')}
            </Grid>

            <Grid size={{ xs: 12, sm: 2 }}>
              {tf('Número', 'addressNumber')}
            </Grid>

            <Grid size={{ xs: 12, sm: 5 }}>
              {tf('Complemento', 'addressComplement')}
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3 }} />

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 2,
            }}
          >
            Dados Institucionais
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 4 }}>
              {sf('Disponibilidade de Horário', 'availableHours', [
                { value: '', label: 'Selecione' },
                { value: 'MANHA', label: 'Matutino' },
                { value: 'TARDE', label: 'Vespertino' },
                { value: 'NOITE', label: 'Noturno' },
                { value: 'FLEXIVEL', label: 'Flexível' },
                { value: 'PREFIRO_NAO_INFORMAR', label: 'Prefiro não informar' },
              ])}
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              {sf('Categoria', 'category', [
                { value: '', label: 'Selecione' },
                ...categories.map((c) => ({ value: c.id, label: c.name })),
              ])}
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3 }} />

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 2,
            }}
          >
            Dados Autodeclaratórios
          </Typography>

          <Grid
            container
            spacing={2}
            sx={{
              mb: editing ? 0 : 1,
            }}
          >
            <Grid size={{ xs: 12, sm: 3 }}>
              {sf('Escolaridade', 'education', [
                { value: '', label: 'Selecione' },
                { value: 'FUNDAMENTAL', label: 'Fundamental' },
                { value: 'MEDIO', label: 'Ensino Médio' },
                { value: 'SUPERIOR', label: 'Superior' },
                { value: 'POS_GRADUACAO', label: 'Pós-graduação' },
                { value: 'PREFIRO_NAO_INFORMAR', label: 'Prefiro não informar' },
              ])}
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              {sf('Renda Pessoal', 'income', [
                { value: '', label: 'Selecione' },
                { value: 'BAIXA', label: 'Baixa' },
                { value: 'MEDIA', label: 'Média' },
                { value: 'ALTA', label: 'Alta' },
                { value: 'PREFIRO_NAO_INFORMAR', label: 'Prefiro não informar' },
              ])}
            </Grid>

            <Grid size={{ xs: 12, sm: 2 }}>
              {sf('Etnia', 'race', [
                { value: '', label: 'Selecione' },
                { value: 'BRANCO', label: 'Branco (a)' },
                { value: 'PARDO', label: 'Pardo (a)' },
                { value: 'PRETO', label: 'Preto (a)' },
                { value: 'AMARELO', label: 'Amarelo (a)' },
                { value: 'INDIGENA', label: 'Indígena' },
                { value: 'PREFIRO_NAO_INFORMAR', label: 'Prefiro não informar' },
              ])}
            </Grid>

            <Grid size={{ xs: 12, sm: 2 }}>
              {sf('Identidade de Gênero', 'gender', [
                { value: '', label: 'Selecione' },
                { value: 'MASCULINO', label: 'Masculino' },
                { value: 'FEMININO', label: 'Feminino' },
                { value: 'NAO_BINARIO', label: 'Não-binário' },
                { value: 'OUTRO', label: 'Outro' },
                { value: 'PREFIRO_NAO_INFORMAR', label: 'Prefiro não informar' },
              ])}
            </Grid>

            <Grid size={{ xs: 12, sm: 2 }}>
              {sf('Orientação Sexual', 'sexualOrientation', [
                { value: '', label: 'Selecione' },
                { value: 'HETEROSSEXUAL', label: 'Heterosexual' },
                { value: 'HOMOSSEXUAL', label: 'Homossexual' },
                { value: 'BISSEXUAL', label: 'Bissexual' },
                { value: 'OUTRO', label: 'Outro' },
                { value: 'PREFIRO_NAO_INFORMAR', label: 'Prefiro não informar' },
              ])}
            </Grid>
          </Grid>

          {editing && (
            <Stack
              sx={{
                flexDirection: {
                  xs: 'column',
                  sm: 'row',
                },
                gap: 2,
                justifyContent: 'flex-end',
                mt: 4,
              }}
            >
              <Button
                variant="contained"
                onClick={() => setEditing(false)}
                sx={{
                  bgcolor: 'grey.300',
                  color: 'text.primary',
                  fontWeight: 700,
                  borderRadius: 10,
                  textTransform: 'none',
                  px: 4,
                  py: 1.5,
                  boxShadow: 'none',
                  width: {
                    xs: '100%',
                    sm: 'auto',
                  },
                  '&:hover': {
                    bgcolor: 'grey.400',
                    boxShadow: 'none',
                  },
                }}
              >
                Cancelar
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={saving}
                sx={{
                  fontWeight: 700,
                  borderRadius: 10,
                  textTransform: 'none',
                  px: 4,
                  py: 1.5,
                  width: {
                    xs: '100%',
                    sm: 'auto',
                  },
                }}
              >
                {saving ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  'Salvar Alterações'
                )}
              </Button>
            </Stack>
          )}
        </Paper>
      </Stack>

      <InactivateAssociateDialog
        open={inactivateOpen}
        onClose={() => setInactivateOpen(false)}
        onConfirm={async () => {}}
        associateName={form.fullName}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Confirmar Exclusão de Associado"
        description="Tem certeza que deseja excluir este associado? Todos os dados serão removidos permanentemente do sistema."
        confirmLabel="Sim, Excluir Associado"
      />

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() =>
          setSnack((p) => ({
            ...p,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Alert
          severity={snack.severity}
          variant="filled"
          sx={{
            borderRadius: 2,
            fontWeight: 600,
          }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AssociateProfile;
