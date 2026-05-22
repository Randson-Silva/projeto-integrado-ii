import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalicOutlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import SendIcon from '@mui/icons-material/Send';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';

const RichToolbar = () => (
  <Stack
    direction="row"
    spacing={0.5}
    sx={{
      px: 1,
      py: 0.5,
      borderBottom: '1px solid',
      borderColor: 'divider',
      alignItems: 'center',
    }}
  >
    {[
      { icon: <FormatBoldIcon fontSize="small" />, title: 'Negrito' },
      { icon: <FormatItalicIcon fontSize="small" />, title: 'Itálico' },
      { icon: <FormatUnderlinedIcon fontSize="small" />, title: 'Sublinhado' },
    ].map(({ icon, title }) => (
      <Tooltip key={title} title={title}>
        <IconButton size="small">{icon}</IconButton>
      </Tooltip>
    ))}
    <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
    {[
      { icon: <FormatListBulletedIcon fontSize="small" />, title: 'Lista' },
      {
        icon: <FormatListNumberedIcon fontSize="small" />,
        title: 'Lista numerada',
      },
      { icon: <InsertLinkIcon fontSize="small" />, title: 'Link' },
    ].map(({ icon, title }) => (
      <Tooltip key={title} title={title}>
        <IconButton size="small">{icon}</IconButton>
      </Tooltip>
    ))}
  </Stack>
);

type Snack = { open: boolean; severity: 'success' | 'error'; msg: string };

const SendMessageTab = () => {
  const [recipient, setRecipient] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [snack, setSnack] = useState<Snack>({
    open: false,
    severity: 'success',
    msg: '',
  });

  const handleSend = async () => {
    setSending(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      setSnack({
        open: true,
        severity: 'success',
        msg: 'Mensagem enviada com Sucesso!',
      });
      setRecipient('');
      setBody('');
    } catch {
      setSnack({
        open: true,
        severity: 'error',
        msg: 'Erro ao tentar enviar mensagem!',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Stack spacing={2}>
        <TextField
          label="Para"
          placeholder="Nome ou e-mail do destinatário"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          size="small"
          fullWidth
        />

        <Paper
          variant="outlined"
          sx={{ borderRadius: 1.5, overflow: 'hidden' }}
        >
          <RichToolbar />
          <Box
            component="textarea"
            value={body}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setBody(e.target.value)
            }
            placeholder="Digite sua mensagem aqui..."
            sx={{
              width: '100%',
              minHeight: 160,
              border: 'none',
              outline: 'none',
              resize: 'vertical',
              p: 1.5,
              fontFamily: 'inherit',
              fontSize: 14,
              color: 'text.primary',
              bgcolor: 'background.paper',
              boxSizing: 'border-box',
              display: 'block',
            }}
          />
        </Paper>

        <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={sending ? undefined : <SendIcon sx={{ fontSize: 16 }} />}
            onClick={handleSend}
            disabled={sending || !recipient || !body}
            sx={{
              borderRadius: 10,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
            }}
          >
            {sending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Enviar Mensagem'
            )}
          </Button>
        </Stack>
      </Stack>

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

const TemplateTab = () => {
  const [templateBody, setTemplateBody] = useState(
    'Olá {nome_associado},\n\nVim informar que sua mensalidade está disponível para pagamento.\n\nValor: {valor_mensalidade}\nVencimento: {data_vencimento}\n\nAtenciosamente,\nEquipe de Gestão'
  );
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState<Snack>({
    open: false,
    severity: 'success',
    msg: '',
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setSnack({
        open: true,
        severity: 'success',
        msg: 'Template salvo com sucesso!',
      });
    } catch {
      setSnack({
        open: true,
        severity: 'error',
        msg: 'Erro ao salvar template.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        {/* Editor */}
        <Stack spacing={2} sx={{ flex: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700 }}
            color="text.secondary"
          >
            Configurar Mensagem Padrão de Associativo
          </Typography>
          <Paper
            variant="outlined"
            sx={{ borderRadius: 1.5, overflow: 'hidden' }}
          >
            <RichToolbar />
            <Box
              component="textarea"
              value={templateBody}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setTemplateBody(e.target.value)
              }
              sx={{
                width: '100%',
                minHeight: 220,
                border: 'none',
                outline: 'none',
                resize: 'vertical',
                p: 1.5,
                fontFamily: 'inherit',
                fontSize: 13,
                color: 'text.primary',
                bgcolor: 'background.paper',
                boxSizing: 'border-box',
                display: 'block',
              }}
            />
          </Paper>
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ justifyContent: 'flex-end' }}
          >
            <Button
              variant="outlined"
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
              onClick={handleSave}
              disabled={saving}
              sx={{
                borderRadius: 10,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
              }}
            >
              {saving ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                'Salvar Mensagem'
              )}
            </Button>
          </Stack>
        </Stack>

        {/* Preview */}
        <Stack spacing={1} sx={{ minWidth: { md: 260 } }}>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700 }}
            color="text.secondary"
          >
            Pré Visualização
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 2,
              p: 2,
              flex: 1,
              bgcolor: 'primary.main',
              color: '#fff',
              fontSize: 13,
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
            }}
          >
            {templateBody}
          </Paper>
        </Stack>
      </Stack>

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

const CommunicationForm = () => {
  const [tab, setTab] = useState(0);

  return (
    <Stack spacing={2.5}>
      {/* Breadcrumb */}
      <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1}>
        <MessageOutlinedIcon sx={{ color: 'primary.main', fontSize: 18 }} />
        <Typography
          variant="body2"
          color="primary.main"
          sx={{ fontWeight: 600 }}
        >
          Comunicação
        </Typography>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            px: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: 13,
            },
          }}
        >
          <Tab label="Enviar Mensagem" />
          <Tab label="Definir Mensagem padrão de Associativo" />
        </Tabs>

        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {tab === 0 ? <SendMessageTab /> : <TemplateTab />}
        </Box>
      </Paper>
    </Stack>
  );
};

export default CommunicationForm;
