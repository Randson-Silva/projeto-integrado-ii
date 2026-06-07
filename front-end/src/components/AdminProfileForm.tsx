import EditIcon from '@mui/icons-material/Edit';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import type { AdminProfileForm } from '../services/admin/admin.types';
import { maskCPF, maskPhone } from '../utils/masks.util';
import ResetPasswordDialog from './ResetPasswordDialog';
import { isValidBirthDate } from '../utils/dates.util';

const MOCK_PROFILE: AdminProfileForm = {
  fullName: 'João da Silva',
  cpf: '000.000.000-00',
  email: 'joao@email.com',
  phone: '(88) 9 0000-0000',
  birthDate: '01/01/1990',
};

type Snack = { open: boolean; severity: 'success' | 'error'; msg: string };

const AdminProfileForm = () => {
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof AdminProfileForm, string>>
  >({});

  const [form, setForm] = useState<AdminProfileForm>({ ...MOCK_PROFILE });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [snack, setSnack] = useState<Snack>({
    open: false,
    severity: 'success',
    msg: '',
  });

  const set =
    (key: keyof AdminProfileForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      if (key === 'birthDate') {
        value = value.replace(/\D/g, '').slice(0, 8);

        if (value.length > 4) {
          value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
        } else if (value.length > 2) {
          value = `${value.slice(0, 2)}/${value.slice(2)}`;
        }
      }

      if (key === 'cpf') {
        value = maskCPF(value);
      }

      if (key === 'phone') {
        value = maskPhone(value);
      }

      setForm((p) => ({ ...p, [key]: value }));

      setFieldErrors((prev) => ({
        ...prev,
        [key]: undefined,
      }));
    };

  const handleSave = async () => {
    setFieldErrors({});

    const errors: Partial<Record<keyof AdminProfileForm, string>> = {};

    if (!form.fullName.trim()) {
      errors.fullName = 'Nome é obrigatório';
    }

    if (!form.email.trim()) {
      errors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Formato de e-mail inválido';
    }

    if (!form.cpf.trim()) {
      errors.cpf = 'CPF é obrigatório';
    } else if (form.cpf.replace(/\D/g, '').length !== 11) {
      errors.cpf = 'CPF inválido';
    }

    if (!form.phone.trim()) {
      errors.phone = 'Telefone é obrigatório';
    } else if (form.phone.replace(/\D/g, '').length < 10) {
      errors.phone = 'Telefone inválido';
    }

    if (!form.birthDate.trim()) {
      errors.birthDate = 'Data de nascimento é obrigatória';
    } else if (!isValidBirthDate(form.birthDate)) {
      errors.birthDate = 'Data de nascimento inválida';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setEditing(false);
      setSnack({
        open: true,
        severity: 'success',
        msg: 'Perfil atualizado com sucesso!',
      });
    } catch {
      setSnack({
        open: true,
        severity: 'error',
        msg: 'Erro ao salvar perfil.',
      });
    } finally {
      setSaving(false);
    }
  };

  const f = (label: string, key: keyof AdminProfileForm) => (
    <TextField
      label={label}
      value={form[key]}
      onChange={set(key)}
      disabled={!editing}
      size="small"
      fullWidth
      required
      error={Boolean(fieldErrors[key])}
      helperText={fieldErrors[key]}
    />
  );

  return (
    <>
      <Stack spacing={2.5}>
        {/* Header */}
        <Stack
          direction="row"
          sx={{ alignItems: 'center', justifyContent: 'space-between' }}
        >
          {!editing && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => {
                setFieldErrors({});
                setEditing(true);
              }}
              sx={{
                borderRadius: 10,
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
              }}
            >
              Editar perfil
            </Button>
          )}
        </Stack>

        <Paper
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            p: { xs: 2, sm: 3 },
          }}
        >
          {/* Avatar */}
          <Stack sx={{ alignItems: 'center', mb: 3 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                editing ? (
                  <IconButton
                    size="small"
                    sx={{
                      bgcolor: 'primary.main',
                      color: '#fff',
                      width: 28,
                      height: 28,
                      '&:hover': { bgcolor: 'primary.dark' },
                    }}
                  >
                    <EditIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                ) : null
              }
            >
              <Avatar
                sx={{ width: 100, height: 100, bgcolor: 'primary.light' }}
              >
                <PersonOutlineIcon
                  sx={{ fontSize: 64, color: 'primary.main' }}
                />
              </Avatar>
            </Badge>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {/* Dados Pessoais */}
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
            Dados Pessoais
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12 }}>{f('Nome Completo', 'fullName')}</Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              {f('Data de Nascimento', 'birthDate')}
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>{f('CPF', 'cpf')}</Grid>
            <Grid size={{ xs: 12, sm: 4 }}>{f('Telefone', 'phone')}</Grid>
            <Grid size={{ xs: 12, sm: 6 }}>{f('E-mail', 'email')}</Grid>
          </Grid>

          {/* Segurança */}
          <Divider sx={{ mb: 3 }} />
          <Stack
            direction="row"
            sx={{ alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Segurança
            </Typography>
            <Button
              variant="text"
              size="small"
              onClick={() => setResetOpen(true)}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: 'primary.main',
              }}
            >
              Alterar senha &rsaquo;
            </Button>
          </Stack>

          {/* Editing actions */}
          {editing && (
            <>
              <Divider sx={{ my: 3 }} />
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ justifyContent: 'flex-end' }}
              >
                <Button
                  variant="outlined"
                  onClick={() => {
                    setEditing(false);
                    setForm({ ...MOCK_PROFILE });
                    setFieldErrors({});
                  }}
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
                  onClick={handleSave}
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
                    'Salvar Alterações'
                  )}
                </Button>
              </Stack>
            </>
          )}
        </Paper>
      </Stack>

      <ResetPasswordDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
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

export default AdminProfileForm;
