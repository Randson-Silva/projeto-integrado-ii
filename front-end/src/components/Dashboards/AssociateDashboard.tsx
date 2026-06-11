import DownloadIcon from '@mui/icons-material/Download';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { Button, Chip, CircularProgress, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import { getMyAssociate } from '../../services/associate/associateService';
import { authGetProfile } from '../../services/auth/authService';

const AssociateDashboard = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [status, setStatus] = useState('Inativo');
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const loadAssociate = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await authGetProfile({ token });
        setFirstName(profile.name ? profile.name.split(' ')[0] : 'Associado');

        try {
          const associate = await getMyAssociate(token);

          const sd = associate.selfDeclaration;
          // Verifica se o associado já preencheu algum dado autodeclaratório real (ignora termo de consentimento)
          const hasCompletedComplementaryData =
            !!sd &&
            (!!sd.socialName ||
              !!sd.race ||
              !!sd.gender ||
              !!sd.sexualOrientation ||
              !!sd.education ||
              (sd.income !== undefined && sd.income !== null));

          setHasProfile(hasCompletedComplementaryData);
          setStatus(associate.user?.active ? 'Ativo' : 'Inativo');
        } catch {
          // Se retornar 404, o associado ainda não tem o objeto base
          setHasProfile(false);
          setStatus('Inativo');
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAssociate();
  }, [token]);

  if (loading) {
    return (
      <Stack sx={{ alignItems: 'center', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Stack spacing={4}>
      <Typography variant="h4" sx={{ fontWeight: 700 }} color="text.primary">
        Bem Vindo, {firstName}
      </Typography>

      <Stack spacing={0.5}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, mb: 1.5 }}
          color="text.primary"
        >
          Ações
        </Typography>

        {!hasProfile && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddAlt1Icon />}
            onClick={() => navigate('/meu-cadastro')}
            sx={{
              borderRadius: 10,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1.5,
              width: 'fit-content',
              fontSize: 16,
            }}
          >
            Complementar Cadastro
          </Button>
        )}

        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={() => {
            // TODO: download carteirinha
          }}
          sx={{
            borderRadius: 10,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1.5,
            width: 'fit-content',
            fontSize: 16,
            mt: 1.5,
          }}
        >
          Baixar Carteirinha
        </Button>
      </Stack>

      <Stack spacing={1.5}>
        <Typography variant="h6" sx={{ fontWeight: 700 }} color="text.primary">
          Status do Vinculo
        </Typography>

        <Chip
          label={status}
          sx={{
            bgcolor: status === 'Ativo' ? '#8FA882' : '#9E9E9E',
            color: '#fff',
            fontWeight: 600,
            fontSize: 15,
            borderRadius: 3,
            px: 1,
            height: 40,
            width: 'fit-content',
          }}
        />
      </Stack>
    </Stack>
  );
};

export default AssociateDashboard;
