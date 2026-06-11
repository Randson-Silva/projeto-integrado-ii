import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { AssociateCategoryResponse } from '../services/associate/associate.types';
import {
  createCategory,
  deleteCategory,
  getCategories,
} from '../services/associate/associateService';

const MONTHS_PT = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const formatDatePT = (iso: string): string => {
  if (!iso) return '';
  const [, m, d] = iso.split('-');
  if (!m || !d) return iso;
  return `${parseInt(d, 10)} de ${MONTHS_PT[parseInt(m, 10) - 1]}`;
};

interface DateFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}
const DateField = ({ label, value, onChange }: DateFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      {/* Label flutuante */}
      <Typography
        variant="caption"
        sx={{
          position: 'absolute',
          top: -9,
          left: 12,
          bgcolor: 'background.paper',
          px: 0.5,
          color: 'primary.main',
          fontWeight: 600,
          fontSize: 12,
          zIndex: 1,
          lineHeight: 1,
        }}
      >
        {label}
      </Typography>

      {/* Campo visível */}
      <OutlinedInput
        readOnly
        value={formatDatePT(value)}
        onClick={() => inputRef.current?.showPicker?.()}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              size="small"
              onClick={() => inputRef.current?.showPicker?.()}
              sx={{ color: 'text.secondary' }}
            >
              <CalendarTodayIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </InputAdornment>
        }
        sx={{
          width: '100%',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
            borderWidth: 2,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
          },
          cursor: 'pointer',
        }}
      />

      {/* Input real escondido */}
      <input
        ref={inputRef}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          position: 'absolute',
          opacity: 0,
          pointerEvents: 'none',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </Box>
  );
};

const SettingsForm = () => {
  const { token, logout } = useAuth();

  const [categories, setCategories] = useState<AssociateCategoryResponse[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [validityDate, setValidityDate] = useState('');

  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      logout();
      return;
    }

    const loadCategories = async () => {
      const categories = await getCategories(token);
      setCategories(categories);
    };

    loadCategories();
  }, [token, logout]);

  const addCategory = async () => {
    const trimmedAndUpper = newCategory.trim().toUpperCase();

    if (!trimmedAndUpper) {
      setError('Campo obrigatório');
      return;
    }

    if (
      categories.some(
        (category) => category.name.trim().toUpperCase() === trimmedAndUpper
      )
    ) {
      setError(`A categoria '${trimmedAndUpper}' já foi adicionada`);
      return;
    }

    // if (trimmedAndUpper && !categories.includes(trimmedAndUpper)) {
    //   setCategories((p) => [...p, trimmedAndUpper]);
    //   setNewCategory('');
    // }

    if (!token) {
      setError('Não foi possível adicionar.');
      return;
    }

    try {
      const created = await createCategory(token, trimmedAndUpper);

      setCategories((prev) => [...prev, created]);
      setNewCategory('');
    } catch {
      logout();
    }
  };

  const removeCategory = async (cat: AssociateCategoryResponse) => {
    if (!token) {
      logout();
      return;
    }
    try {
      const res = await deleteCategory(token, cat.id);

      if (res !== null) {
        setError(res);
        return;
      }

      setCategories((p) => p.filter((c) => c.id !== cat.id));
    } catch {
      setError('Não foi possível remover a categoria');
    }
  };

  return (
    <Grid container spacing={3} sx={{ alignItems: 'flex-start' }}>
      {/* ── Definições de Cadastro ── */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            p: 3,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Definições de Cadastro
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5, mb: 2 }}
          >
            Definir Categorias de Cadastro
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {/* Input + botão + */}
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ alignItems: 'center', mb: 3 }}
          >
            <TextField
              error={!!error}
              helperText={error}
              label="Nova Categoria"
              placeholder="Digite o nome da categoria"
              value={newCategory}
              onChange={(e) => {
                setError('');
                setNewCategory(e.target.value);
              }}
              onKeyDown={(e) => e.key === 'Enter' && addCategory()}
              size="small"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <IconButton
              onClick={addCategory}
              disabled={!newCategory.trim()}
              sx={{
                bgcolor: 'primary.main',
                color: '#fff',
                borderRadius: 1.5,
                width: 40,
                height: 40,
                flexShrink: 0,
                '&:hover': { bgcolor: 'primary.dark' },
                '&.Mui-disabled': { bgcolor: 'grey.300', color: 'grey.500' },
              }}
            >
              <AddIcon />
            </IconButton>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {/* Lista vertical de categorias */}
          <Stack spacing={1.5}>
            {categories.map((cat) => (
              <Stack
                key={cat.id}
                direction="row"
                sx={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  bgcolor: 'grey.200',
                  borderRadius: 10,
                  px: 2.5,
                  py: 1,
                  width: 'fit-content',
                  minWidth: 130,
                }}
              >
                <Typography variant="body2" sx={{ mr: 1.5, fontWeight: 600 }}>
                  {cat.name}
                </Typography>
                <CloseIcon
                  onClick={() => removeCategory(cat)}
                  sx={{
                    fontSize: 16,
                    color: 'text.secondary',
                    cursor: 'pointer',
                    '&:hover': { color: 'text.primary' },
                  }}
                />
              </Stack>
            ))}
          </Stack>
        </Paper>
      </Grid>

      {/* ── Definições da Carteirinha ── */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            p: 3,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Definições da Carteirinha
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5, mb: 2 }}
          >
            Definir Data de Validade Anual
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {/* Campo data com borda laranja */}
          <DateField
            label="Data"
            value={validityDate}
            onChange={setValidityDate}
          />

          {/* Cancelar / Confirmar — texto laranja */}
          <Stack
            direction="row"
            spacing={1}
            sx={{ justifyContent: 'flex-end', mt: 3 }}
          >
            <Button
              onClick={() => setValidityDate('')}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: 'primary.main',
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                // TODO: salvar data de validade via API
                console.log('Validade:', validityDate);
              }}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: 'primary.main',
              }}
            >
              Confirmar
            </Button>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SettingsForm;
