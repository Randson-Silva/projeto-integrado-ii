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
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DuplicateCPFDialog from './DuplicateCPFDialog';

interface AssociateCreateForm {
  fullName: string;
  birthDate: string;
  cpf: string;
  monthlyFee: string;
  email: string;
  phone: string;
  addressStreet: string;
  addressComplement: string;
  addressNeighborhood: string;
  addressZipCode: string;
  addressCity: string;
  addressState: string;
  addressNumber: string;
  institutionName: string;
  institutionRole: string;
  category: string;
}

const EMPTY: AssociateCreateForm = {
  fullName: '',
  birthDate: '',
  cpf: '',
  monthlyFee: '',
  email: '',
  phone: '',
  addressStreet: '',
  addressComplement: '',
  addressNeighborhood: '',
  addressZipCode: '',
  addressCity: '',
  addressState: '',
  addressNumber: '',
  institutionName: '',
  institutionRole: '',
  category: '',
};

type Snack = { open: boolean; severity: 'success' | 'error'; msg: string };

const AssociateCreateForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<AssociateCreateForm>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [duplicateOpen, setDuplicate] = useState(false);
  const [snack, setSnack] = useState<Snack>({
    open: false,
    severity: 'success',
    msg: '',
  });

  const set =
    (key: keyof AssociateCreateForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      setSnack({
        open: true,
        severity: 'success',
        msg: 'Associado cadastrado com sucesso!',
      });
      setTimeout(() => navigate('/associados'), 1500);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === 'CPF_DUPLICATE') {
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

  const f = (
    label: string,
    key: keyof AssociateCreateForm,
    placeholder?: string
  ) => (
    <TextField
      label={label}
      placeholder={placeholder}
      value={form[key]}
      onChange={set(key)}
      size="small"
      fullWidth
    />
  );

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
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            Cadastro de Associados
          </Typography>

          {/* Dados Pessoais */}
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
            Dados Pessoais
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              {f('Nome Completo', 'fullName', 'Nome completo do associado')}
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              {f('Data de Nascimento', 'birthDate', 'dd/mm/aaaa')}
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              {f('CPF', 'cpf', '000.000.000-00')}
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              {f('E-mail', 'email', 'email@exemplo.com')}
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              {f('Telefone', 'phone', '(00) 0 0000-0000')}
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }}>
              <FormControl size="small" fullWidth>
                <InputLabel>Categoria</InputLabel>
                <Select
                  value={form.category}
                  label="Categoria"
                  onChange={(e) =>
                    setForm((p) => ({ ...p, category: e.target.value }))
                  }
                >
                  <MenuItem value="Sócio">Sócio</MenuItem>
                  <MenuItem value="Colaborador">Colaborador</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }}>
              {f('Mensalidade', 'monthlyFee', 'R$ 0,00')}
            </Grid>
          </Grid>

          {/* Dados de Endereço */}
          <Divider sx={{ mb: 3 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
            Dados de Endereço
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 5 }}>
              {f('Logradouro', 'addressStreet', 'Rua, Avenida...')}
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              {f('Complemento', 'addressComplement', 'Apto, Bloco...')}
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              {f('Número', 'addressNumber', 'Nº')}
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              {f('Bairro', 'addressNeighborhood', 'Bairro')}
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }}>
              {f('CEP', 'addressZipCode', '00000-000')}
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              {f('Cidade', 'addressCity', 'Cidade')}
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }}>
              {f('Estado', 'addressState', 'UF')}
            </Grid>
          </Grid>

          {/* Dados Institucionais */}
          <Divider sx={{ mb: 3 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
            Dados Institucionais
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              {f('Instituição', 'institutionName', 'Nome da instituição')}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              {f('Função', 'institutionRole', 'Cargo ou função')}
            </Grid>
          </Grid>

          {/* Actions */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ justifyContent: 'flex-end' }}
          >
            <Button
              variant="outlined"
              onClick={() => navigate('/associados')}
              sx={{
                borderRadius: 10,
                textTransform: 'none',
                fontWeight: 600,
                borderColor: 'text.secondary',
                color: 'text.secondary',
                width: { xs: '100%', sm: 'auto' },
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
                borderRadius: 10,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              {saving ? (
                <CircularProgress size={20} color="inherit" />
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
