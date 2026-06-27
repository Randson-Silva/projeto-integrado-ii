import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { api_base_url } from '../../services/api';
import { validateCard } from '../../services/cardService';
import { convertToForm } from '../../utils/dates.util';
import ValidationResultModal from './ValidationResultModal';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined'

interface CardResult {
  valid: string;
  avatarUrl: string;
  fullName: string;
  socialName: string;
  category: string;
  number: string;
  validity: string;
}

const ValidateCardSection = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CardResult | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleValidate = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      const data = await validateCard(code.trim());
      if (data?.valid) {
        const cardResult: CardResult = {
          fullName: data.fullName || '—',
          socialName: data.socialName || '—',
          category: data.category.name || '—',
          number: code.trim(),
          validity: data.validity || '—',
          avatarUrl: data.avatarUrl || '',
          valid: data.valid ? 'Válido' : 'Inválido',
        };

        setResult(cardResult);
      } else {
        setErrorMsg(data?.message || 'Carteirinha não encontrada.');
        setErrorOpen(true);
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Não foi possível validar. Tente novamente.';
      setErrorMsg(msg);
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setCode('');
  };

  /* ── Resultado inline ── */
  if (result) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2.5,
        }}
      >
        {/* Título */}
        <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1}>
          <CheckCircleIcon color="success" sx={{ fontSize: 28 }} />
          <Typography
            variant="h5"
            sx={{ fontWeight: 700 }}
            color="primary.main"
          >
            Carteirinha Válida
          </Typography>
        </Stack>

        {/* Card de resultado */}
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            p: 3,
            width: '100%',
            maxWidth: 400,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 2,
          }}
        >
          <Avatar
            src={
              result.avatarUrl
                ? `${api_base_url}${result.avatarUrl}`
                : undefined
            }
            sx={{
              width: 52,
              height: 52,
              bgcolor: 'success.main',
              fontWeight: 700,
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            <PersonOutlineIcon sx={{ fontSize: 64, color: 'primary.main' }} />
          </Avatar>

          <Stack spacing={0.5} sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 700 }}>
              {result.socialName ?? result.fullName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Categoria: {result.category}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Numeração: {result.number}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              sx={{ pt: 0.5, flexWrap: 'wrap' }}
            >
              <Chip
                label={result.valid}
                size="small"
                sx={{
                  bgcolor: 'success.main',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 11,
                }}
              />
              <Chip
                label={`Validade: ${convertToForm(result.validity)}`}
                size="small"
                color="primary"
                sx={{ fontWeight: 700, fontSize: 11 }}
              />
            </Stack>
          </Stack>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleReset}
          sx={{
            borderRadius: 10,
            textTransform: 'none',
            fontWeight: 700,
            px: 4,
            py: 1.5,
          }}
        >
          Nova Verificação
        </Button>
      </Box>
    );
  }

  /* ── Formulário ── */
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, textAlign: 'center' }}>
          Validação da Carteirinha
        </Typography>

        <TextField
          label="Numeração da Carteirinha"
          placeholder="Digite a numeração da carteirinha"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleValidate()}
          size="small"
          sx={{ width: { xs: '100%', sm: 320 } }}
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleValidate}
          disabled={loading || !code.trim()}
          sx={{
            borderRadius: 10,
            textTransform: 'none',
            fontWeight: 700,
            px: 5,
            py: 1.5,
          }}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            'Verificar'
          )}
        </Button>
      </Box>

      <ValidationResultModal
        open={errorOpen}
        onClose={() => setErrorOpen(false)}
        message={errorMsg}
      />
    </>
  );
};

export default ValidateCardSection;
