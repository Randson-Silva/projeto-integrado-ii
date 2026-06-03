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
  availability: string;
  category: string;
  dataSharing: boolean;
}

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

// Mock — TODO: substituir por API
const MOCK_SELF_DECL: SelfDeclForm = {
  education: 'PREFIRO_NAO_INFORMAR',
  income: 'R$ 1.500,00',
  race: 'BRANCO',
  gender: 'MASCULINO',
  sexualOrientation: 'HETEROSSEXUAL',
};

const MOCK_PROFILE: ProfileForm = {
  fullName: 'João da Silva',
  cpf: '000.000.000-00',
  birthDate: '2004-04-15',
  email: 'joao.silva@gmail.com',
  phone: '(00) 0.0000-0000',
  addressZipCode: '63900-000',
  addressState: 'CE',
  addressCity: 'Quixadá',
  addressNeighborhood: 'Centro',
  addressStreet: 'Rua Rodrigues Junior',
  addressNumber: '001',
  addressComplement: 'APT 123',
  availability: 'MANHA',
  category: 'CANTOR',
  dataSharing: true,
};

type Snack = { open: boolean; severity: 'success' | 'error'; msg: string };

const AssociateSelfSupplementForm = () => {
  const { token } = useAuth();

  const [editingDecl, setEditingDecl] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selfDecl, setSelfDecl] = useState<SelfDeclForm>(MOCK_SELF_DECL);
  const [selfDeclDraft, setSelfDeclDraft] =
    useState<SelfDeclForm>(MOCK_SELF_DECL);
  const [profile, setProfile] = useState<ProfileForm>(MOCK_PROFILE);
  const [snack, setSnack] = useState<Snack>({
    open: false,
    severity: 'success',
    msg: '',
  });

  // TODO: carregar dados reais via API
  useEffect(() => {
    if (!token) return;
    // const load = async () => { ... }
    // load();
  }, [token]);

  const toast = (severity: 'success' | 'error', msg: string) =>
    setSnack({ open: true, severity, msg });

  const handleSaveDecl = async () => {
    setSaving(true);
    try {
      // TODO: API update autodeclaratórios
      console.log('Save autodecl:', selfDeclDraft);
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

  //  Select field (autodeclaratórios)
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

  // Renda Pessoal — campo de texto com máscara de moeda
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

  //  Profile TextField
  const ptf = (
    label: string,
    value: string,
    onChange?: (v: string) => void,
    type = 'text'
  ) => (
    <TextField
      label={label}
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      disabled
      type={type}
      size="small"
      fullWidth
      slotProps={{ inputLabel: { shrink: true } }}
    />
  );

  return (
    <>
      <Stack spacing={4}>
        {/*  Avatar grande centralizado  */}
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
            {/* Botão de editar avatar (edit mode) */}
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
                {
                  value: 'PREFIRO_NAO_INFORMAR',
                  label: 'Prefiro não informar',
                },
                { value: 'FUNDAMENTAL', label: 'Ensino Fundamental' },
                { value: 'MEDIO', label: 'Ensino Médio' },
                { value: 'SUPERIOR', label: 'Superior' },
                { value: 'POS', label: 'Pós-graduação' },
              ])}
            </Grid>
            <Grid size={{ xs: 12, sm: 'auto' }} sx={{ minWidth: 150 }}>
              {rendaField}
            </Grid>
            <Grid size={{ xs: 12, sm: 'auto' }} sx={{ minWidth: 150 }}>
              {declSelect('Etnia', 'race', [
                { value: 'BRANCO', label: 'Branco (a)' },
                { value: 'PARDO', label: 'Pardo (a)' },
                { value: 'PRETO', label: 'Preto (a)' },
                { value: 'AMARELO', label: 'Amarelo (a)' },
                { value: 'INDIGENA', label: 'Indígena' },
                {
                  value: 'PREFIRO_NAO_INFORMAR',
                  label: 'Prefiro não informar',
                },
              ])}
            </Grid>
            <Grid size={{ xs: 12, sm: 'auto' }} sx={{ minWidth: 180 }}>
              {declSelect('Identidade de Gênero', 'gender', [
                { value: 'MASCULINO', label: 'Masculino' },
                { value: 'FEMININO', label: 'Feminino' },
                { value: 'NAO_BINARIO', label: 'Não-binário' },
                { value: 'OUTRO', label: 'Outro' },
                {
                  value: 'PREFIRO_NAO_INFORMAR',
                  label: 'Prefiro não informar',
                },
              ])}
            </Grid>
            <Grid size={{ xs: 12, sm: 'auto' }} sx={{ minWidth: 180 }}>
              {declSelect('Orientação Sexual', 'sexualOrientation', [
                { value: 'HETEROSSEXUAL', label: 'Heterosexual' },
                { value: 'HOMOSSEXUAL', label: 'Homossexual' },
                { value: 'BISSEXUAL', label: 'Bissexual' },
                { value: 'OUTRO', label: 'Outro' },
                {
                  value: 'PREFIRO_NAO_INFORMAR',
                  label: 'Prefiro não informar',
                },
              ])}
            </Grid>
          </Grid>

          {/* Cancelar / Salvar — só em edit mode */}
          {editingDecl && (
            <Stack
              direction="row"
              spacing={2}
              sx={{ pt: 1, justifyContent: 'center' }}
            >
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
                sx={{
                  fontWeight: 700,
                  borderRadius: 10,
                  textTransform: 'none',
                  px: 4,
                  py: 1.5,
                }}
              >
                {saving ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  'Salvar'
                )}
              </Button>
            </Stack>
          )}
        </Stack>

        {/*  Dados Pessoais (somente leitura)  */}
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Dados Pessoais
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 5 }}>
              {ptf('Nome Completo', profile.fullName)}
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>{ptf('CPF', profile.cpf)}</Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              {ptf('Date', profile.birthDate, undefined, 'date')}
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>{ptf('E-mail', profile.email)}</Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              {ptf('Telefone', profile.phone)}
            </Grid>
          </Grid>
        </Stack>

        {/*  Endereço (somente leitura)  */}
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Endereço
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 2 }}>
              {ptf('CEP', profile.addressZipCode)}
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControl size="small" fullWidth>
                <InputLabel shrink>Estado</InputLabel>
                <Select
                  value={profile.addressState}
                  label="Estado"
                  notched
                  disabled
                >
                  {BR_STATES.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControl size="small" fullWidth>
                <InputLabel shrink>Cidade</InputLabel>
                <Select
                  value={profile.addressCity}
                  label="Cidade"
                  notched
                  disabled
                >
                  <MenuItem value="Quixadá">Quixadá</MenuItem>
                  <MenuItem value="Fortaleza">Fortaleza</MenuItem>
                  <MenuItem value="Outras">Outras</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              {ptf('Bairro', profile.addressNeighborhood)}
            </Grid>
            <Grid size={{ xs: 12, sm: 5 }}>
              {ptf('Rua', profile.addressStreet)}
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }}>
              {ptf('Número', profile.addressNumber)}
            </Grid>
            <Grid size={{ xs: 12, sm: 5 }}>
              {ptf('Complemento', profile.addressComplement)}
            </Grid>
          </Grid>
        </Stack>

        {/*  Dados Institucionais (somente leitura)  */}
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Dados Institucionais
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl size="small" fullWidth>
                <InputLabel shrink>Disponibilidade de Horario</InputLabel>
                <Select
                  value={profile.availability}
                  label="Disponibilidade de Horario"
                  notched
                  disabled
                >
                  <MenuItem value="MANHA">Matutino</MenuItem>
                  <MenuItem value="TARDE">Vespertino</MenuItem>
                  <MenuItem value="NOITE">Noturno</MenuItem>
                  <MenuItem value="FLEXIVEL">Flexível</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControl size="small" fullWidth>
                <InputLabel shrink>Categoria</InputLabel>
                <Select
                  value={profile.category}
                  label="Categoria"
                  notched
                  disabled
                >
                  <MenuItem value="ARTISTA">Artista</MenuItem>
                  <MenuItem value="PRODUTOR">Produtor</MenuItem>
                  <MenuItem value="TECNICO">Técnico</MenuItem>
                  <MenuItem value="CANTOR">Cantor</MenuItem>
                  <MenuItem value="OUTRO">Outro</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Stack>

        {/*  Checkbox autorização  */}
        <FormControlLabel
          control={
            <Checkbox
              checked={profile.dataSharing}
              onChange={(e) =>
                setProfile((p) => ({ ...p, dataSharing: e.target.checked }))
              }
              color="primary"
            />
          }
          label={
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Eu autorizo o compartilhamento de todos os meus dados com
              parcerios da associação.
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

export default AssociateSelfSupplementForm;

