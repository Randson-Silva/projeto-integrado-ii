import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import {
  Alert,
  Button,
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
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import DuplicateCPFDialog from './DuplicateCPFDialog';
import { createAssociate } from '../services/associate/associateService';
import api from '../services/api';
import type { AssociateCategoryResponse } from '../services/associate/associate.types';

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

interface AssociateCreateForm {
  fullName: string;
  cpf: string;
  birthDate: string;
  guardianName: string;
  email: string;
  phone: string;
  addressZipCode: string;
  addressState: string;
  addressCity: string;
  addressNeighborhood: string;
  addressStreet: string;
  addressComplement: string;
  availability: string;
  category: string;
}

const EMPTY: AssociateCreateForm = {
  fullName: '',
  cpf: '',
  birthDate: '',
  guardianName: '',
  email: '',
  phone: '',
  addressZipCode: '',
  addressState: '',
  addressCity: '',
  addressNeighborhood: '',
  addressStreet: '',
  addressComplement: '',
  availability: '',
  category: '',
};

type Snack = { open: boolean; severity: 'success' | 'error'; msg: string };

const AssociateCreateForm = () => {
  const { token } = useAuth();

  const navigate = useNavigate();

  const [form, setForm] = useState<AssociateCreateForm>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [duplicateOpen, setDuplicate] = useState(false);
  const [categories, setCategories] = useState<AssociateCategoryResponse[]>([]);
  const [snack, setSnack] = useState<Snack>({
    open: false,
    severity: 'success',
    msg: '',
  });

  useEffect(() => {
    if (!token) return;
    api
      .get<AssociateCategoryResponse[]>('/categories', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCategories(res.data))
      .catch(() => {/* silently ignore, select fica vazio */});
  }, [token]);

  const set =
    (key: keyof AssociateCreateForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async () => {
    setSaving(true);

    try {
      if (!token) return;

      await createAssociate(token, {
        baseData: {
          email: form.email,
          password: '12345678',
          fullName: form.fullName,
          cpf: form.cpf.replace(/\D/g, ''),
          phone: form.phone.replace(/\D/g, ''),
        },

        birthDate: form.birthDate,

        workCategoryId: form.category || undefined,

        postalCode: form.addressZipCode.replace(/\D/g, ''),

        street: form.addressStreet,

        number: '0',

        neighborhood: form.addressNeighborhood,

        city: form.addressCity,

        state: form.addressState,

        legalGuardianName: isUnder18 ? form.guardianName : '',

        acceptedDataSharingTerm: true,
      });

      setSnack({
        open: true,
        severity: 'success',
        msg: 'Associado cadastrado com sucesso!',
      });

      setTimeout(() => navigate('/associados'), 1500);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? '';

      if (
        msg.toLowerCase().includes('cpf') ||
        msg.toLowerCase().includes('already')
      ) {
        setDuplicate(true);
      } else {
        setSnack({
          open: true,
          severity: 'error',
          msg: 'Erro ao cadastrar associado.',
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const textField = (
    label: string,
    key: keyof AssociateCreateForm,
    placeholder?: string,
    type = 'text'
  ) => (
    <TextField
      label={label}
      placeholder={placeholder}
      value={form[key]}
      onChange={set(key)}
      type={type}
      size="small"
      fullWidth
      slotProps={{ inputLabel: { shrink: true } }}
    />
  );

  const selectField = (
    label: string,
    key: keyof AssociateCreateForm,
    options: { value: string; label: string }[]
  ) => (
    <FormControl size="small" fullWidth>
      <InputLabel shrink>{label}</InputLabel>

      <Select
        value={form[key]}
        label={label}
        notched
        displayEmpty
        renderValue={(v) =>
          v === '' ? (
            <span style={{ color: '#9e9e9e' }}>Selecione</span>
          ) : (
            options.find((o) => o.value === v)?.label ?? String(v)
          )
        }
        onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
      >
        {options.map((o) => (
          <MenuItem key={o.value} value={o.value}>
            {o.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const isUnder18 = (() => {
    if (!form.birthDate) return false;

    const today = new Date();

    const birth = new Date(form.birthDate);

    let age = today.getFullYear() - birth.getFullYear();

    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age < 18;
  })();

  return (
    <>
      <Stack spacing={2.5}>
        {/* Breadcrumb */}
        <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1}>
          <GroupOutlinedIcon sx={{ color: 'primary.main', fontSize: 18 }} />

          <Typography
            variant="body2"
            color="primary.main"
            sx={{ fontWeight: 600 }}
          >
            Associados
          </Typography>
        </Stack>

        {/* Voltar */}
        <Button
          startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
          onClick={() => navigate('/associados')}
          sx={{
            alignSelf: 'flex-start',
            color: 'text.secondary',
            fontWeight: 600,
            textTransform: 'none',
            p: 0,
            '&:hover': { bgcolor: 'transparent', color: 'primary.main' },
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
            p: { xs: 2, sm: 3 },
          }}
        >
          {/* ── Dados Pessoais ── */}
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            Dados Pessoais
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {/* Row 1: Nome, CPF, Data Nascimento */}
            <Grid size={{ xs: 12, sm: 5 }}>
              {textField(
                'Nome Completo',
                'fullName',
                'Informe o nome completo'
              )}
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              {textField('CPF', 'cpf', 'Informe o CPF')}
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              {textField(
                'Data de Nascimento',
                'birthDate',
                'XX/XX/XXXX',
                'date'
              )}
            </Grid>

            {/* Row 2: Nome Responsável */}
            {isUnder18 && (
              <Grid size={{ xs: 12 }}>
                {textField(
                  'Nome Responsável',
                  'guardianName',
                  'Informe o nome completo do Responsável'
                )}
              </Grid>
            )}

            {/* Row 3: Email, Telefone */}
            <Grid size={{ xs: 12, sm: 8 }}>
              {textField('E-mail', 'email', 'Informe o E-mail', 'email')}
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              {textField('Telefone', 'phone', 'Informe o Telefone')}
            </Grid>
          </Grid>

          {/* ── Dados de Endereço ── */}
          <Divider sx={{ mb: 3 }} />

          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            Dados de Endereço
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {/* Row 1: CEP, Estado, Cidade, Bairro */}
            <Grid size={{ xs: 12, sm: 2 }}>
              {textField('CEP', 'addressZipCode', 'Informe o CEP')}
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              {selectField(
                'Estado',
                'addressState',
                BR_STATES.map((s) => ({ value: s, label: s }))
              )}
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              {selectField('Cidade', 'addressCity', [
                { value: 'Quixadá', label: 'Quixadá' },
                { value: 'Fortaleza', label: 'Fortaleza' },
                { value: 'Outras', label: 'Outras' },
              ])}
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              {textField('Bairro', 'addressNeighborhood', 'Informe o Bairro')}
            </Grid>

            {/* Row 2: Logradouro, Complemento */}
            <Grid size={{ xs: 12, sm: 6 }}>
              {textField('Logradouro', 'addressStreet', 'Informe o Logradouro')}
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              {textField(
                'Complemento',
                'addressComplement',
                'Informe dados complementares'
              )}
            </Grid>
          </Grid>

          {/* ── Dados Institucionais ── */}
          <Divider sx={{ mb: 3 }} />

          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            Dados Institucionais
          </Typography>

          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 4 }}>
              {selectField('Disponibilidade de Horário', 'availability', [
                { value: 'MANHA', label: 'Manhã' },
                { value: 'TARDE', label: 'Tarde' },
                { value: 'NOITE', label: 'Noite' },
                { value: 'FLEXIVEL', label: 'Flexível' },
              ])}
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              {selectField('Categoria', 'category',
                categories.map((c) => ({ value: c.id, label: c.name }))
              )}
            </Grid>
          </Grid>

          {/* ── Actions ── */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ justifyContent: 'flex-end' }}
          >
            <Button
              variant="contained"
              onClick={() => navigate('/associados')}
              sx={{
                bgcolor: 'grey.300',
                color: 'text.primary',
                fontWeight: 700,
                borderRadius: 10,
                textTransform: 'none',
                px: 4,
                py: 1.5,
                boxShadow: 'none',
                width: { xs: '100%', sm: 'auto' },
                '&:hover': { bgcolor: 'grey.400', boxShadow: 'none' },
              }}
            >
              Cancelar
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={saving}
              sx={{
                fontWeight: 700,
                borderRadius: 10,
                textTransform: 'none',
                px: 4,
                py: 1.5,
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              {saving ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                'Confirmar'
              )}
            </Button>
          </Stack>
        </Paper>
      </Stack>

      <DuplicateCPFDialog
        open={duplicateOpen}
        onClose={() => setDuplicate(false)}
      />

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snack.severity}
          variant="filled"
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AssociateCreateForm;
