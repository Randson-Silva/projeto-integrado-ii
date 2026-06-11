import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  Button,
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
import ChangeAccessKeyDialog from './ChangeAccessKeyDialog';

const AccessControlProfileForm = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<User | null>(null);
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
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [token]);



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
                label="E-mail"
                value={profile?.email || ''}
                disabled
                size="small"
                fullWidth
                type="email"
              />
            </Grid>
          </Grid>

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
