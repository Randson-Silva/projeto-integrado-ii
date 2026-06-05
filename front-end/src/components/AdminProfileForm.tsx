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
import { useEffect, useState } from 'react';
import ResetPasswordDialog from './ResetPasswordDialog';
import { useAuth } from '../hooks/useAuth';
import { authGetProfile } from '../services/auth/authService';
import { normalizeRoleView } from '../services/auth/roles';

interface AdminProfileForm {
  fullName: string;
  cpf: string;
  email: string;
  phone: string;
  role: string;
}

const MOCK_PROFILE: AdminProfileForm = {
  fullName: 'João da Silva',
  cpf: '000.000.000-00',
  email: 'joao@email.com',
  phone: '(88) 9 0000-0000',
  birthDate: '01/01/1990',
};

type Snack = { open: boolean; severity: 'success' | 'error'; msg: string };

const AdminProfileForm = () => {
  const { token } = useAuth();
  const [form, setForm] = useState<AdminProfileForm>({
    fullName: '',
    cpf: '',
    email: '',
    phone: '',
    role: '',
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [snack, setSnack] = useState<Snack>({
    open: false,
    severity: 'success',
    msg: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const user = await authGetProfile({ token });
        setForm({
          fullName: user.name ?? '',
          cpf: applyMask(user.cpf ?? '', 'cpf'),
          email: user.email ?? '',
          phone: applyMask(user.phone ?? '', 'phone'),
          role: user.role ? normalizeRoleView(user.role) : '',
        });
      } catch (err) {
        setSnack({ open: true, severity: 'error', msg: 'Erro ao carregar perfil.' });
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [token]);

  const applyMask = (value: string, key: keyof AdminProfileForm): string => {
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
        .replace(/(\d{5})(\d)/, '$1-$2')
        .slice(0, 15);
    }
    return value;
  };

  const set =
    (key: keyof AdminProfileForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [key]: applyMask(e.target.value, key) }));

  const handleSave = async () => {
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
    />
  );

  return (
    <>
      <Stack spacing={2.5}>
        {/* Header */}
        <Stack
          direction="row"
          sx={{ alignItems: 'center', justifyContent: 'flex-end' }}
        >
          {!editing && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => setEditing(true)}
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
          {loading ? (
            <Stack alignItems="center" py={4}>
              <CircularProgress />
            </Stack>
          ) : (
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12 }}>{f('Nome Completo', 'fullName')}</Grid>
              <Grid size={{ xs: 12, sm: 6 }}>{f('Telefone', 'phone')}</Grid>
              <Grid size={{ xs: 12, sm: 6 }}>{f('CPF', 'cpf')}</Grid>
              <Grid size={{ xs: 12, sm: 6 }}>{f('E-mail', 'email')}</Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Tipo de Acesso"
                  value={form.role}
                  disabled
                  size="small"
                  fullWidth
                />
              </Grid>
            </Grid>
          )}

          {/* Segurança */}
          <Divider sx={{ mb: 3 }} />
          <Stack
            direction="row"
            sx={{ alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 70 }}>
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
