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
  addressNumber: string;
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
  addressNumber: '',
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

  const applyMask = (value: string, key: keyof AssociateCreateForm): string => {
    const digits = value.replace(/\D/g, '');
    if (key === 'cpf') {
      return digits
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
        .slice(0, 14);
    }
    if (key === 'phone') {
      return digits
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4,5})(\d{4})$/, '$1-$2')
        .slice(0, 15);
    }
    if (key === 'addressZipCode') {
      return digits.replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9);
    }
    if (key === 'addressNumber') {
      return digits.slice(0, 10);
    }
    return value;
  };

  const maskedKeys: (keyof AssociateCreateForm)[] = ['cpf', 'phone', 'addressZipCode', 'addressNumber'];

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
      onChange={(e) => {
        const masked = applyMask(e.target.value, key);
        e.target.value = masked;
        setForm((p) => ({ ...p, [key]: masked }));
      }}
      type={type}
      size="small"
      fullWidth
      slotProps={{
        inputLabel: { shrink: true },
        htmlInput: {
          maxLength: key === 'cpf' ? 14 : key === 'phone' ? 15 : key === 'addressZipCode' ? 9 : key === 'addressNumber' ? 10 : undefined,
          inputMode: maskedKeys.includes(key) ? 'numeric' : 'text',
        },
      }}
      onKeyDown={(e) => {
        if (maskedKeys.includes(key)) {
          if (e.key.length === 1 && !/[0-9]/.test(e.key) && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
          }
        }
      }}
    />
  );

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

        availableHours: (form.availability as 'MATUTINO' | 'VESPERTINO' | 'NOTURNO' | 'TODOS') || 'TODOS',

        postalCode: form.addressZipCode.replace(/\D/g, ''),

        street: form.addressStreet,

        number: form.addressNumber || '0',

        complement: form.addressComplement || undefined,

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
        <MenuItem value="" disabled>
          <em>Selecione</em>
        </MenuItem>
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

            {/* Row 2: Rua, Número, Complemento */}
            <Grid size={{ xs: 12, sm: 6 }}>
              {textField('Rua', 'addressStreet', 'Informe a Rua')}
            </Grid>

            <Grid size={{ xs: 12, sm: 2 }}>
              {textField('Número', 'addressNumber', 'Nº')}
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              {textField(
                'Complemento',
                'addressComplement',
                'Apto, bloco...'
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
                { value: 'MATUTINO', label: 'Matutino' },
                { value: 'VESPERTINO', label: 'Vespertino' },
                { value: 'NOTURNO', label: 'Noturno' },
                { value: 'TODOS', label: 'Todos os turnos' },
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
