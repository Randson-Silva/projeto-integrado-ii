import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { getMyAssociate } from '../services/associate/associateService';

interface SelfDeclForm {
  education: string;
  income: string;
  race: string;
  gender: string;
  sexualOrientation: string;
}

interface ProfileForm {
  fullName: string;
  cpf: string;
  birthDate: string;
  email: string;
  phone: string;
  addressZipCode: string;
  addressState: string;
  addressCity: string;
  addressNeighborhood: string;
  addressStreet: string;
  addressNumber: string;
  addressComplement: string;
  category: string;
  dataSharing: boolean;
}

const BR_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

const EMPTY_SELF_DECL: SelfDeclForm = {
  education: '',
  income: '',
  race: '',
  gender: '',
  sexualOrientation: '',
};

const EMPTY_PROFILE: ProfileForm = {
  fullName: '',
  cpf: '',
  birthDate: '',
  email: '',
  phone: '',
  addressZipCode: '',
  addressState: '',
  addressCity: '',
  addressNeighborhood: '',
  addressStreet: '',
  addressNumber: '',
  addressComplement: '',
  category: '',
  dataSharing: false,
};

type Snack = { open: boolean; severity: 'success' | 'error'; msg: string };

const maskCurrency = (v: string) => {
  const digits = v.replace(/\D/g, '');
  const num = Number(digits) / 100;
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const AssociateSelfSupplementForm = () => {
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [editingDecl, setEditingDecl] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selfDecl, setSelfDecl] = useState<SelfDeclForm>(EMPTY_SELF_DECL);
  const [selfDeclDraft, setSelfDeclDraft] = useState<SelfDeclForm>(EMPTY_SELF_DECL);
  const [profile, setProfile] = useState<ProfileForm>(EMPTY_PROFILE);
  const [snack, setSnack] = useState<Snack>({ open: false, severity: 'success', msg: '' });

  const toast = (severity: 'success' | 'error', msg: string) =>
    setSnack({ open: true, severity, msg });

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        const data = await getMyAssociate(token);
        const decl: SelfDeclForm = {
          education: data.selfDeclaration?.education ?? '',
          income: data.selfDeclaration?.income ?? '',
          race: data.selfDeclaration?.race ?? '',
          gender: data.selfDeclaration?.gender ?? '',
          sexualOrientation: data.selfDeclaration?.sexualOrientation ?? '',
        };
        setSelfDecl(decl);
        setSelfDeclDraft(decl);
        setProfile({
          fullName: data.user.name ?? '',
          cpf: data.cpf ?? '',
          birthDate: data.birthDate ?? '',
          email: data.user.email ?? '',
          phone: data.phone ?? '',
          addressZipCode: data.address?.postalCode ?? '',
          addressState: data.address?.state ?? '',
          addressCity: data.address?.city ?? '',
          addressNeighborhood: data.address?.neighborhood ?? '',
          addressStreet: data.address?.street ?? '',
          addressNumber: data.address?.number ?? '',
          addressComplement: '',
          category: data.workCategory?.name ?? '',
          dataSharing: data.acceptedDataSharingTerm ?? false,
        });
      } catch {
        toast('error', 'Erro ao carregar dados.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const handleSaveDecl = async () => {
    setSaving(true);
    try {
      await api.patch(
        '/associates/me/self-declaration',
        {
          race: selfDeclDraft.race || undefined,
          gender: selfDeclDraft.gender || undefined,
          sexualOrientation: selfDeclDraft.sexualOrientation || undefined,
          education: selfDeclDraft.education || undefined,
          income: selfDeclDraft.income || undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelfDecl({ ...selfDeclDraft });
      setEditingDecl(false);
      toast('success', 'Dados salvos com sucesso!');
    } catch {
      toast('error', 'Erro ao salvar dados.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelDecl = () => {
    setSelfDeclDraft({ ...selfDecl });
    setEditingDecl(false);
  };

  const declSelect = (
    label: string,
    key: keyof SelfDeclForm,
    options: { value: string; label: string }[]
  ) => (
    <FormControl size="small" fullWidth>
      <InputLabel
        shrink
        sx={{ color: editingDecl ? 'primary.main' : undefined }}
      >
        {label}
      </InputLabel>
      <Select
        value={selfDeclDraft[key]}
        label={label}
        notched
        disabled={!editingDecl}
        onChange={(e) =>
          setSelfDeclDraft((p) => ({ ...p, [key]: e.target.value }))
        }
        sx={{
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: editingDecl ? 'primary.main' : undefined,
          },
        }}
      >
        {options.map((o) => (
          <MenuItem key={o.value} value={o.value}>
            {o.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const rendaField = (
    <TextField
      label="Renda Pessoal"
      value={selfDeclDraft.income}
      onChange={(e) => {
        if (!editingDecl) return;
        setSelfDeclDraft((p) => ({
          ...p,
          income: maskCurrency(e.target.value),
        }));
      }}
      disabled={!editingDecl}
      size="small"
      fullWidth
      slotProps={{
        inputLabel: {
          shrink: true,
          sx: { color: editingDecl ? 'primary.main' : undefined },
        },
        input: {
          sx: {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: editingDecl ? 'primary.main' : undefined,
            },
          },
        },
      }}
    />
  );

  const ptf = (label: string, value: string, type = 'text') => (
    <TextField
      label={label}
      value={value}
      disabled
      type={type}
      size="small"
      fullWidth
      slotProps={{ inputLabel: { shrink: true } }}
    />
  );

  if (loading) {
    return (
      <Stack sx={{ alignItems: 'center', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <>
      <Stack spacing={4}>
        {/* Avatar */}
        <Stack sx={{ alignItems: 'center' }}>
          <Box sx={{ position: 'relative', width: 'fit-content' }}>
            <Avatar
              sx={{
                width: { xs: 120, sm: 160 },
                height: { xs: 120, sm: 160 },
                bgcolor: 'secondary.main',
              }}
            >
              <PersonIcon
                sx={{ fontSize: { xs: 80, sm: 110 }, color: 'rgba(0,0,0,0.3)' }}
              />
            </Avatar>
            {editingDecl && (
              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  bottom: 4,
                  right: 4,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  width: 32,
                  height: 32,
                  '&:hover': { bgcolor: 'grey.100' },
                }}
              >
                <EditIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              </IconButton>
            )}
          </Box>
          <Typography variant="h6" sx={{ mt: 1, fontWeight: 700 }}>
            {profile.fullName || '—'}
          </Typography>
          {profile.category && (
            <Typography variant="body2" color="text.secondary">
              {profile.category}
            </Typography>
          )}
        </Stack>

        {/* Dados Autodeclaratórios */}
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'center' }} spacing={2}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Dados Autodeclaratórios
            </Typography>
            {!editingDecl && (
              <Button
                startIcon={<EditIcon sx={{ fontSize: 16 }} />}
                variant="contained"
                color="primary"
                onClick={() => {
                  setSelfDeclDraft({ ...selfDecl });
                  setEditingDecl(true);
                }}
                sx={{
                  borderRadius: 10,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 2.5,
                }}
              >
                Editar
              </Button>
            )}
          </Stack>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 'auto' }} sx={{ minWidth: 180 }}>
              {declSelect('Escolaridade', 'education', [
                { value: 'FUNDAMENTAL', label: 'Ensino Fundamental' },
                { value: 'MEDIO', label: 'Ensino Médio' },
                { value: 'SUPERIOR', label: 'Superior' },
                { value: 'POS_GRADUACAO', label: 'Pós-graduação' },
                { value: 'MESTRADO', label: 'Mestrado' },
                { value: 'DOUTORADO', label: 'Doutorado' },
              ])}
            </Grid>
            <Grid size={{ xs: 12, sm: 'auto' }} sx={{ minWidth: 150 }}>
              {declSelect('Renda Pessoal', 'income', [
                { value: 'BAIXA', label: 'Baixa' },
                { value: 'MEDIA', label: 'Média' },
                { value: 'ALTA', label: 'Alta' },
              ])}
            </Grid>
            <Grid size={{ xs: 12, sm: 'auto' }} sx={{ minWidth: 150 }}>
              {declSelect('Etnia', 'race', [
                { value: 'BRANCO', label: 'Branco (a)' },
                { value: 'PARDO', label: 'Pardo (a)' },
                { value: 'PRETO', label: 'Preto (a)' },
                { value: 'AMARELO', label: 'Amarelo (a)' },
                { value: 'INDIGENA', label: 'Indígena' },
                { value: 'PREFIRO_NAO_INFORMAR', label: 'Prefiro não informar' },
              ])}
            </Grid>
            <Grid size={{ xs: 12, sm: 'auto' }} sx={{ minWidth: 180 }}>
              {declSelect('Identidade de Gênero', 'gender', [
                { value: 'MASCULINO', label: 'Masculino' },
                { value: 'FEMININO', label: 'Feminino' },
                { value: 'NAO_BINARIO', label: 'Não-binário' },
                { value: 'OUTRO', label: 'Outro' },
                { value: 'PREFIRO_NAO_INFORMAR', label: 'Prefiro não informar' },
              ])}
            </Grid>
            <Grid size={{ xs: 12, sm: 'auto' }} sx={{ minWidth: 180 }}>
              {declSelect('Orientação Sexual', 'sexualOrientation', [
                { value: 'HETEROSSEXUAL', label: 'Heterossexual' },
                { value: 'HOMOSSEXUAL', label: 'Homossexual' },
                { value: 'BISSEXUAL', label: 'Bissexual' },
                { value: 'OUTRO', label: 'Outro' },
                { value: 'PREFIRO_NAO_INFORMAR', label: 'Prefiro não informar' },
              ])}
            </Grid>
          </Grid>

          {editingDecl && (
            <Stack direction="row" spacing={2} sx={{ pt: 1, justifyContent: 'center' }}>
              <Button
                variant="contained"
                onClick={handleCancelDecl}
                sx={{
                  bgcolor: 'grey.300',
                  color: 'text.primary',
                  fontWeight: 700,
                  borderRadius: 10,
                  textTransform: 'none',
                  px: 4,
                  py: 1.5,
                  boxShadow: 'none',
                  '&:hover': { bgcolor: 'grey.400', boxShadow: 'none' },
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveDecl}
                disabled={saving}
                sx={{ fontWeight: 700, borderRadius: 10, textTransform: 'none', px: 4, py: 1.5 }}
              >
                {saving ? <CircularProgress size={20} color="inherit" /> : 'Salvar'}
              </Button>
            </Stack>
          )}
        </Stack>

        {/* Dados Pessoais */}
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Dados Pessoais
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 5 }}>{ptf('Nome Completo', profile.fullName)}</Grid>
            <Grid size={{ xs: 12, sm: 4 }}>{ptf('CPF', profile.cpf)}</Grid>
            <Grid size={{ xs: 12, sm: 3 }}>{ptf('Data de Nascimento', profile.birthDate, 'date')}</Grid>
            <Grid size={{ xs: 12, sm: 8 }}>{ptf('E-mail', profile.email)}</Grid>
            <Grid size={{ xs: 12, sm: 4 }}>{ptf('Telefone', profile.phone)}</Grid>
          </Grid>
        </Stack>

        {/* Endereço */}
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Endereço
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 2 }}>{ptf('CEP', profile.addressZipCode)}</Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControl size="small" fullWidth>
                <InputLabel shrink>Estado</InputLabel>
                <Select value={profile.addressState} label="Estado" notched disabled>
                  {BR_STATES.map((s) => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>{ptf('Cidade', profile.addressCity)}</Grid>
            <Grid size={{ xs: 12, sm: 4 }}>{ptf('Bairro', profile.addressNeighborhood)}</Grid>
            <Grid size={{ xs: 12, sm: 5 }}>{ptf('Rua', profile.addressStreet)}</Grid>
            <Grid size={{ xs: 12, sm: 2 }}>{ptf('Número', profile.addressNumber)}</Grid>
            <Grid size={{ xs: 12, sm: 5 }}>{ptf('Complemento', profile.addressComplement)}</Grid>
          </Grid>
        </Stack>

        {/* Dados Institucionais */}
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Dados Institucionais
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              {ptf('Categoria', profile.category)}
            </Grid>
          </Grid>
        </Stack>

        {/* Checkbox autorização */}
        <FormControlLabel
          control={
            <Checkbox
              checked={profile.dataSharing}
              disabled
              color="primary"
            />
          }
          label={
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Eu autorizo o compartilhamento de todos os meus dados com parceiros da associação.
            </Typography>
          }
        />
      </Stack>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snack.severity} variant="filled" sx={{ borderRadius: 2, fontWeight: 600 }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AssociateSelfSupplementForm;
