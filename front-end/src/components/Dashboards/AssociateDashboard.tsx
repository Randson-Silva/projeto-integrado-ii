import DownloadIcon from '@mui/icons-material/Download';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { Button, Chip, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import { getAssociateById } from '../../services/associate/associateService';
import { authGetProfile } from '../../services/auth/authService';

const AssociateDashboard = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('Associado');
  const [status, setStatus] = useState('Indefinido');

  useEffect(() => {
    const loadAssociate = async () => {
      if (!token) {
        return;
      }

      const { id } = await authGetProfile({ token });

      const { user: associate } = await getAssociateById(token, id!);

      setFirstName(associate.name ? associate.name.split(' ')[0] : 'Associado');

      setStatus(associate.enabled ? 'Ativo' : 'Inativo');
    };

    loadAssociate();
  }, [token]);

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
            bgcolor: '#8FA882',
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
