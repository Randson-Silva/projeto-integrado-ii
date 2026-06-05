import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import {
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

const DAYS_LABEL = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = [
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

const MiniCalendar = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState<number | null>(today.getDate());

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prev = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };
  const next = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <Paper
      variant="outlined"
      sx={{ borderRadius: 2, p: 2, display: 'inline-block' }}
    >
      {/* Header */}
      <Stack
        direction="row"
        sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1 }}
      >
        <IconButton size="small" onClick={prev}>
          <ChevronLeftIcon fontSize="small" />
        </IconButton>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {MONTHS[month]} {year}
        </Typography>
        <IconButton size="small" onClick={next}>
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      </Stack>

      {/* Day labels */}
      <Grid container columns={7} sx={{ mb: 0.5 }}>
        {DAYS_LABEL.map((d) => (
          <Grid key={d} size={1}>
            <Typography
              variant="caption"
              sx={{ align: 'center', fontWeight: 600, display: 'block' }}
              color="text.disabled"
            >
              {d}
            </Typography>
          </Grid>
        ))}
      </Grid>

      {/* Days */}
      <Grid container columns={7}>
        {cells.map((day, i) => (
          <Grid key={i} size={1}>
            {day ? (
              <Box
                onClick={() => setSelected(day)}
                sx={{
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  bgcolor: selected === day ? 'primary.main' : 'transparent',
                  color: selected === day ? '#fff' : 'text.primary',
                  fontSize: 12,
                  '&:hover': {
                    bgcolor: selected === day ? 'primary.dark' : 'action.hover',
                  },
                }}
              >
                {day}
              </Box>
            ) : null}
          </Grid>
        ))}
      </Grid>

      {/* Footer */}
      <Stack
        direction="row"
        spacing={1}
        sx={{ mt: 1.5, justifyContent: 'flex-end' }}
      >
        <Button
          size="small"
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            color: 'text.secondary',
          }}
          onClick={() => setSelected(null)}
        >
          Cancelar
        </Button>
        <Button
          size="small"
          variant="contained"
          color="primary"
          sx={{ borderRadius: 10, textTransform: 'none', fontWeight: 600 }}
        >
          Confirmar
        </Button>
      </Stack>
    </Paper>
  );
};

const DEFAULT_COLUMNS = ['Nome', 'CPF', 'Categoria', 'Status'];
const AVAILABLE_COLUMNS = [
  'E-mail',
  'Telefone',
  'Cidade',
  'Instituição',
  'Validade',
];

const SettingsForm = () => {
  const [columns, setColumns] = useState<string[]>(DEFAULT_COLUMNS);
  const [newColumn, setNewColumn] = useState('');
  const [validityStart, setStart] = useState('');
  const [validityEnd, setEnd] = useState('');
  const [cardType, setCardType] = useState('');

  const addColumn = () => {
    if (newColumn && !columns.includes(newColumn)) {
      setColumns((prev) => [...prev, newColumn]);
      setNewColumn('');
    }
  };
  const removeColumn = (col: string) =>
    setColumns((prev) => prev.filter((c) => c !== col));

  const remaining = AVAILABLE_COLUMNS.filter((c) => !columns.includes(c));

  return (
    <Stack spacing={2.5}>


      <Grid container spacing={3} sx={{ alignItems: 'flex-start' }}>
        {/* Definições de Colunas */}
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
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              Definições de Colunas
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontWeight: 600,
                display: 'block',
                mb: 1,
                letterSpacing: 0.5,
              }}
            >
              COLUNAS ATIVAS
            </Typography>
            <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, mb: 2.5 }}>
              {columns.map((col) => (
                <Chip
                  key={col}
                  label={col}
                  onDelete={() => removeColumn(col)}
                  deleteIcon={
                    <CloseIcon sx={{ fontSize: '14px !important' }} />
                  }
                  size="small"
                  sx={{
                    fontWeight: 600,
                    fontSize: 12,
                    borderRadius: 1,
                    bgcolor: 'grey.200',
                  }}
                />
              ))}
            </Stack>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontWeight: 600,
                letterSpacing: 0.5,
                display: 'block',
                mb: 1,
              }}
            >
              ADICIONAR COLUNA
            </Typography>
            <Stack direction="row" spacing={1.5}>
              <FormControl size="small" fullWidth>
                <InputLabel>Selecione uma coluna</InputLabel>
                <Select
                  value={newColumn}
                  label="Selecione uma coluna"
                  onChange={(e) => setNewColumn(e.target.value)}
                >
                  {remaining.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                onClick={addColumn}
                disabled={!newColumn}
                sx={{
                  borderRadius: 10,
                  textTransform: 'none',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  px: 2,
                }}
              >
                Adicionar
              </Button>
            </Stack>
          </Paper>
        </Grid>

        {/* Definições de Carteirinha */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              p: 3,
              mb: 2,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              Definições da Carteirinha
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontWeight: 600,
                letterSpacing: 0.5,
                display: 'block',
                mb: 1,
              }}
            >
              TIPO DE CARTEIRINHA
            </Typography>
            <FormControl size="small" fullWidth sx={{ mb: 2.5 }}>
              <InputLabel>Tipo de card</InputLabel>
              <Select
                value={cardType}
                label="Tipo de card"
                onChange={(e) => setCardType(e.target.value)}
              >
                <MenuItem value="Sócio">Sócio</MenuItem>
                <MenuItem value="Colaborador">Colaborador</MenuItem>
              </Select>
            </FormControl>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontWeight: 600,
                letterSpacing: 0.5,
                display: 'block',
                mb: 1,
              }}
            >
              VALIDADE PADRÃO
            </Typography>
            <Grid container spacing={1.5} sx={{ mb: 2 }}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Início"
                  placeholder="dd/mm/aaaa"
                  value={validityStart}
                  onChange={(e) => setStart(e.target.value)}
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Fim"
                  placeholder="dd/mm/aaaa"
                  value={validityEnd}
                  onChange={(e) => setEnd(e.target.value)}
                  size="small"
                  fullWidth
                />
              </Grid>
            </Grid>

            <Stack
              direction="row"
              spacing={1}
              sx={{ justifyContent: 'flex-end' }}
            >
              <Button
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: 10,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: 'text.secondary',
                  color: 'text.secondary',
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{
                  borderRadius: 10,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 2,
                }}
              >
                Salvar
              </Button>
            </Stack>
          </Paper>

          {/* Calendar */}
          <MiniCalendar />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default SettingsForm;
