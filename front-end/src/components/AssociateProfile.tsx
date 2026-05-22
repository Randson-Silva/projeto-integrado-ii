import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import SendIcon from '@mui/icons-material/Send';
import {
  Alert,
  Avatar,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Associate } from '../services/associate/associate.types';
import { default as DeleteConfirmDialog } from './DeleteConfirmDialog';
import InactivateAssociateDialog from './InactivateAssociateDialog';

const MOCK: Associate = {
  id: '1',
  fullName: 'João da Silva',
  cpf: '000.000.000-00',
  email: 'joao@email.com',
  phone: '(88) 9 0000-0000',
  birthDate: '01/01/1990',
  category: 'Sócio',
  status: 'ATIVO',
  addressStreet: 'Rua Exemplo',
  addressNumber: '123',
  addressComplement: 'Apto 01',
  addressNeighborhood: 'Centro',
  addressZipCode: '63900-000',
  addressCity: 'Quixadá',
  addressState: 'CE',
  institutionName: 'Escola Municipal',
  institutionRole: 'Professor',
  registrationDate: '01/01/2024',
  validity: '31/12/2025',
  monthlyFee: 'R$ 50,00',
};

type Snack = { open: boolean; severity: 'success' | 'error'; msg: string };

const AssociateProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<Associate>({ ...MOCK, id: id ?? MOCK.id });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [inactivateOpen, setInactivateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [snack, setSnack] = useState<Snack>({
    open: false,
    severity: 'success',
    msg: '',
  });

  const toast = (severity: 'success' | 'error', msg: string) =>
    setSnack({ open: true, severity, msg });

  const handleSave = async () => {
    setSaving(true);
    try {
      console.log('Save associate:', form);
      setEditing(false);
      toast('success', 'Alterações salvas com sucesso!');
    } catch {
      toast('error', 'Erro ao salvar o perfil.');
    } finally {
      setSaving(false);
    }
  };

  const handleInactivate = async (reason: string) => {
    console.log('Inactivate:', id, reason);
    toast('success', 'Vínculo inativado com sucesso!');
  };

  const handleDelete = async () => {
    console.log('Delete:', id);
    navigate('/associados');
  };

  const f = (label: string, key: keyof Associate, disabled = false) => (
    <TextField
      label={label}
      value={(form[key] as string) ?? ''}
      onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
      disabled={disabled || !editing}
      size="small"
      fullWidth
    />
  );

  return (
    <>
      <Stack spacing={3}>
        <Button
          startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
          onClick={() => navigate('/associados')}
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

        <Paper
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            p: { xs: 2, sm: 3 },
          }}
        >
          {/* Avatar + Editar */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            sx={{
              mb: 3,
              justifyContent: 'space-between',
              alignItems: { xs: 'center', sm: 'flex-start' },
            }}
            spacing={2}
          >
            <Stack sx={{ alignItems: 'center' }} spacing={1}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: 'grey.400' }}>
                <PersonOutlineIcon sx={{ fontSize: 50, color: 'grey.100' }} />
              </Avatar>
              <Typography variant="body2" color="text.secondary">
                {form.category}
              </Typography>
            </Stack>
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
                Editar Perfil
              </Button>
            )}
          </Stack>

          {!editing && (
            <>
              {/* Gerenciar Associado */}
              <Divider sx={{ mb: 2 }} />
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, mb: 1.5 }}
                color="text.secondary"
              >
                Gerenciar Associado
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                sx={{ mb: 3, flexWrap: 'wrap' }}
              >
                <Button
                  startIcon={<MessageOutlinedIcon sx={{ fontSize: 16 }} />}
                  variant="contained"
                  onClick={() => navigate('/comunicacao')}
                  sx={{
                    bgcolor: 'grey.500',
                    color: '#fff',
                    borderRadius: 10,
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': { bgcolor: 'grey.700' },
                  }}
                >
                  Enviar Mensagem
                </Button>
                <Button
                  startIcon={<LinkOffIcon sx={{ fontSize: 16 }} />}
                  variant="contained"
                  color="primary"
                  onClick={() => setInactivateOpen(true)}
                  sx={{
                    borderRadius: 10,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Inativar Vínculo
                </Button>
                <Button
                  startIcon={<DeleteOutlineIcon sx={{ fontSize: 16 }} />}
                  variant="contained"
                  onClick={() => setDeleteOpen(true)}
                  sx={{
                    bgcolor: 'grey.500',
                    color: '#fff',
                    borderRadius: 10,
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': { bgcolor: 'grey.700' },
                  }}
                >
                  Excluir Associado
                </Button>
              </Stack>

              {/* Gerenciar Carteirinha */}
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, mb: 1.5 }}
                color="text.secondary"
              >
                Gerenciar Carteirinha
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                sx={{ mb: 3 }}
              >
                <Button
                  startIcon={<CreditCardOutlinedIcon sx={{ fontSize: 16 }} />}
                  variant="contained"
                  sx={{
                    bgcolor: 'grey.500',
                    color: '#fff',
                    borderRadius: 10,
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': { bgcolor: 'grey.700' },
                  }}
                >
                  Emitir Carteirinha
                </Button>
                <Button
                  startIcon={<SendIcon sx={{ fontSize: 16 }} />}
                  variant="contained"
                  sx={{
                    bgcolor: 'grey.500',
                    color: '#fff',
                    borderRadius: 10,
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': { bgcolor: 'grey.700' },
                  }}
                >
                  Solicitar Aprovação
                </Button>
              </Stack>
            </>
          )}

          <Divider sx={{ mb: 3 }} />

          {/* Dados Pessoais */}
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
            Dados Pessoais
          </Typography>
          <Grid container sx={{ spacing: 2, mb: 3 }}>
            <Grid size={{ xs: 12 }}>{f('Nome Completo', 'fullName')}</Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              {f('Data de Nascimento', 'birthDate')}
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>{f('CPF', 'cpf')}</Grid>
            <Grid size={{ xs: 12, sm: 4 }}>{f('Telefone', 'phone')}</Grid>
            <Grid size={{ xs: 12, sm: 6 }}>{f('E-mail', 'email')}</Grid>
          </Grid>

          {/* Dados de Endereço */}
          <Divider sx={{ mb: 3 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
            Dados de Endereço
          </Typography>
          <Grid container sx={{ spacing: 2, mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              {f('Logradouro', 'addressStreet')}
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }}>{f('Número', 'addressNumber')}</Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              {f('Complemento', 'addressComplement')}
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              {f('Bairro', 'addressNeighborhood')}
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }}>{f('CEP', 'addressZipCode')}</Grid>
            <Grid size={{ xs: 12, sm: 4 }}>{f('Cidade', 'addressCity')}</Grid>
            <Grid size={{ xs: 12, sm: 2 }}>{f('Estado', 'addressState')}</Grid>
          </Grid>

          {/* Dados Institucionais */}
          <Divider sx={{ mb: 3 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
            Dados Institucionais
          </Typography>
          <Grid container sx={{ spacing: 2, mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              {f('Instituição', 'institutionName')}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              {f('Função', 'institutionRole')}
            </Grid>
          </Grid>

          {/* Dados Socioeconômicos */}
          <Divider sx={{ mb: 3 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
            Dados Socioeconômicos
          </Typography>
          <Grid container sx={{ spacing: 2, mb: editing ? 3 : 0 }}>
            <Grid size={{ xs: 12, sm: 3 }}>
              {f('Data de Cadastro', 'registrationDate', true)}
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              {f('Validade', 'validity', true)}
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              {f('Mensalidade', 'monthlyFee', !editing)}
            </Grid>
          </Grid>

          {/* Botões edição */}
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
                    setForm({ ...MOCK, id: id ?? MOCK.id });
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

      <InactivateAssociateDialog
        open={inactivateOpen}
        onClose={() => setInactivateOpen(false)}
        onConfirm={handleInactivate}
        associateName={form.fullName}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Confirmar Exclusão de Associado"
        description="Tem certeza que deseja excluir este associado? Todos os dados serão removidos permanentemente do sistema."
        confirmLabel="Sim, Excluir Associado"
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

export default AssociateProfile;
