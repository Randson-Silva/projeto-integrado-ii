import { ArrowBackIos } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authLogin } from '../services/auth/authService';
import PasswordField from './PasswordField';

const LoginForm = () => {
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const navigate = useNavigate();

  const { setAuthToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setEmailError('');

    const data = new FormData(e.currentTarget);

    const email = data.get('email') as string;

    const password = data.get('password') as string;

    if (!email.trim()) {
      setEmailError('O e-mail é obrigatório!');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('O e-mail deve ser válido!');
      return;
    }

    if (!password.trim()) {
      setPasswordError('A senha é obrigatória!');
      return;
    }

    setLoading(true);

    try {
      const { token } = await authLogin({
        email,
        password,
      });

      setAuthToken(token);

      navigate('/associados');
    } catch {
      setEmailError('Credenciais inválidas. Verifique e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ width: '100%' }}
    >
      <Stack spacing={3} sx={{ alignItems: 'center' }}>
        <Typography
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
            fontWeight: 800,
            letterSpacing: { xs: 2, sm: 3 },
            fontSize: { xs: 14, sm: 16 },
            lineHeight: 1.6,
          }}
        >
          SISTEMA DE EMISSÃO
          <br />
          DE CARTEIRINHA
        </Typography>

        <Button
          component={RouterLink}
          to="/"
          startIcon={<ArrowBackIos sx={{ fontSize: 14 }} />}
          sx={{
            alignSelf: 'flex-start',
            color: 'text.secondary',
            fontWeight: 600,
            textTransform: 'none',
            p: 0,
            '&:hover': { bgcolor: 'transparent', color: 'primary.main' },
          }}
        >
          Voltar para tela inicial
        </Button>

        <TextField
          label="E-mail"
          name="email"
          type="email"
          placeholder="Digite seu e-mail"
          error={!!emailError}
          helperText={
            emailError || 'Verifique se seu e-mail está digitado corretamente'
          }
          fullWidth
          required
          autoComplete="email"
        />

        <PasswordField
          label="Senha"
          name="password"
          placeholder="Digite sua senha"
          error={!!passwordError}
          helperText={passwordError}
          onChange={() => {
            setPasswordError('');
          }}
          fullWidth
          required
          autoComplete="current-password"
        />

        <Link
          component={RouterLink}
          to="/forgot-password"
          underline="hover"
          color="primary"
          sx={{ alignSelf: 'flex-start', fontSize: 14, fontWeight: 500 }}
        >
          Esqueceu sua senha?
        </Link>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{
            fontWeight: 'bold',
            py: 1.5,
            px: 4,
            borderRadius: 10,
            textTransform: 'none',
            minWidth: 120,
            width: { xs: '100%', sm: 'auto' },
            mb: 1,
          }}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : 'Entrar'}
        </Button>
      </Stack>
    </Box>
  );
};

export default LoginForm;
