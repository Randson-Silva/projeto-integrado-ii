import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  Button,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authGetProfile } from '../services/auth/authService';
import type { User } from '../services/user/user.types';
import { accessControlUpdateUser } from '../services/user/userService';
import ChangeAccessKeyDialog from './ChangeAccessKeyDialog';

interface AccessControlProfileData {
  association: string;
  email: string;
}

const blank: AccessControlProfileData = {
  association: '',
  email: '',
};

const AccessControlProfileForm = () => {
  const { token, logout } = useAuth();

  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);

  const [originalForm, setOriginalForm] = useState<AccessControlProfileData>({
    ...blank,
  });
  const [form, setForm] = useState<AccessControlProfileData>({
    ...blank,
  });

  const [profile, setProfile] = useState<User | null>(null);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const [loading, setLoading] = useState(false);
  const [keyDialogOpen, setKeyDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      if (!token) return;

      setLoading(true);

      try {
        const data = await authGetProfile({ token });

        const { email, role, cpf = '', id = '', name = '', phone = '' } = data;

        const userProfile: User = {
          cpf,
          email,
          role,
          id,
          name,
          phone,
        };

        setProfile(userProfile);

        const profileData = {
          association: data.name ?? '',
          email: data.email ?? '',
        };

        setOriginalForm(profileData);
        setForm(profileData);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [token]);

  const handleSave = async () => {
    if (!token) return;

    if (!profile) return;

    if (!form.email.trim()) {
      setEmailError('Email é obrigatório');
      return;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      setEmailError('E-mail inválido');
      return;
    }

    if (!form.association) {
      setNameError('Nome é obrigatório');
      return;
    }
    setLoading(true);

    try {
      const { id, phone } = profile;

      const email = form.email;
      const fullName = form.association;

      const updated = await accessControlUpdateUser({
        email,
        fullName,
        id,
        phone,
        token,
      });

      if (
        form.email.trim().toLocaleLowerCase() !==
        originalForm.email.trim().toLocaleLowerCase()
      ) {
        logout();
      }

      setProfile(updated);
      setOriginalForm(form);
      setForm(form);
      setEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEmailError('');
    setNameError('');
    setEditing(false);
    setForm(originalForm);
  };

  return (
    <>
      <Stack spacing={3}>
        <Button
          startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
          onClick={() => navigate('/controle-de-acesso')}
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

        {/* Title row */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
          }}
          spacing={2}
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
                px: 3,
                width: { xs: '100%', sm: 'auto' },
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
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                error={!!nameError}
                helperText={nameError}
                label="Nome do perfil"
                value={form.association}
                onChange={(e) =>
                  setForm((prev) => {
                    setNameError('');
                    return { ...prev, association: e.target.value };
                  })
                }
                disabled={!editing}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                error={!!emailError}
                helperText={
                  emailError ||
                  'Ao mudar o email você será deslogado, para sua segurança'
                }
                label="E-mail"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => {
                    setEmailError('');
                    return { ...prev, email: e.target.value };
                  })
                }
                disabled={!editing}
                size="small"
                fullWidth
                type="email"
              />
            </Grid>
          </Grid>

          {!editing && (
            <>
              {/* <Divider sx={{ my: 3 }} /> */}
              <Button
                startIcon={<LockOutlinedIcon sx={{ fontSize: 18 }} />}
                variant="contained"
                onClick={() => setKeyDialogOpen(true)}
                sx={{
                  my: 3,
                  bgcolor: 'primary',
                  color: '#fff',
                  fontWeight: 600,
                  borderRadius: 10,
                  textTransform: 'none',
                  px: 3,
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                Alterar chave de acesso
              </Button>
            </>
          )}

          {editing && (
            <>
              {/* <Divider sx={{ my: 3 }} /> */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ justifyContent: 'center', mt: 3 }}
              >
                <Button
                  variant="outlined"
                  onClick={handleCancel}
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
                  disabled={loading}
                  sx={{
                    borderRadius: 10,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    width: { xs: '100%', sm: 'auto' },
                  }}
                >
                  {loading ? (
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

      <ChangeAccessKeyDialog
        open={keyDialogOpen}
        onClose={() => setKeyDialogOpen(false)}
      />
    </>
  );
};

export default AccessControlProfileForm;
