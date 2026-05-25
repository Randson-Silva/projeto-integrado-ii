import birthdayBg from '../assets/bg fundo.svg';
import SendIcon from '@mui/icons-material/Send';
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import TextEditor from './TextEditor';

type Snack = { open: boolean; severity: 'success' | 'error'; msg: string };

/* ── aba "Enviar Mensagem" ─────────────────────────────────────────── */

const SendMessageTab = () => {
  const [subject, setSubject] = useState('');
  const [audience, setAudience] = useState('todos');
  const [sending, setSending] = useState(false);
  const [snack, setSnack] = useState<Snack>({ open: false, severity: 'success', msg: '' });
  const editorRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    setSending(true);
    try {
      // TODO: endpoint POST /communication/send — manda subject, body (HTML) e audience
      await new Promise((r) => setTimeout(r, 1000));
      setSnack({ open: true, severity: 'success', msg: 'Mensagem enviada com sucesso!' });
      setSubject('');
      if (editorRef.current) editorRef.current.innerHTML = '';
    } catch {
      setSnack({ open: true, severity: 'error', msg: 'Erro ao tentar enviar mensagem!' });
    } finally {
      setSending(false);
    }
  };

  const hasBody = editorRef.current?.textContent?.trim();

  return (
    <>
      <Stack spacing={2}>
        <TextField
          label="Assunto do e-mail"
          placeholder="Digite o assunto da mensagem"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          size="small"
          fullWidth
        />

        <TextEditor editorRef={editorRef} />

        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <RadioGroup row value={audience} onChange={(e) => setAudience(e.target.value)}>
            <FormControlLabel value="todos" control={<Radio size="small" />} label="Todos" />
            <FormControlLabel value="associados" control={<Radio size="small" />} label="Associados" />
            <FormControlLabel value="gerenciadores" control={<Radio size="small" />} label="Administradores e Consultores" />
          </RadioGroup>
          <Button
            variant="contained"
            color="primary"
            startIcon={sending ? undefined : <SendIcon sx={{ fontSize: 16 }} />}
            onClick={handleSend}
            disabled={sending || !subject || !hasBody}
            sx={{ borderRadius: 10, textTransform: 'none', fontWeight: 600, px: 3 }}
          >
            {sending ? <CircularProgress size={20} color="inherit" /> : 'Enviar Mensagem'}
          </Button>
        </Stack>
      </Stack>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snack.severity} variant="filled" sx={{ borderRadius: 2, fontWeight: 600 }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </>
  );
};

/* ── aba "Mensagem de Aniversário" ─────────────────────────────────── */

const BirthdayTemplateTab = () => {
  const [subject, setSubject] = useState('Feliz Aniversário! 🎂');
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState<Snack>({ open: false, severity: 'success', msg: '' });
  const editorRef = useRef<HTMLDivElement>(null);
  const [previewHtml, setPreviewHtml] = useState('');

  // TODO: buscar do banco — GET /communication/birthday-template — e jogar no editor
  const initialHtml =
    '<p style="text-align:center"><b style="color:#E36D3B">Feliz Aniversário! 🎂</b></p>' +
    '<p style="text-align:center">Olá {Nome},</p>' +
    '<p style="text-align:center">Parabéns pelo seu aniversário!<br>' +
    'O Grupo Cultural Dom Mauricio deseja a você um dia incrível e cheio de alegria!</p>' +
    '<p style="text-align:center"><em>Grupo Cultural de Dom Mauricio</em></p>';

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialHtml;
      setPreviewHtml(initialHtml);
    }
  }, []);

  const handleInput = () => {
    setPreviewHtml(editorRef.current?.innerHTML ?? '');
  };

  const previewHtmlWithName = previewHtml.replace(/\{Nome\}/g, 'Maria Silva');

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: endpoint PUT /communication/birthday-template — manda subject e body (HTML)
      await new Promise((r) => setTimeout(r, 800));
      setSnack({ open: true, severity: 'success', msg: 'Mensagem de aniversário salva com sucesso!' });
    } catch {
      setSnack({ open: true, severity: 'error', msg: 'Erro ao salvar mensagem de aniversário.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Stack spacing={2} sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }} color="text.secondary">
            Configurar Mensagem Padrão de Aniversário
          </Typography>

          <TextField
            label="Assunto do e-mail"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            size="small"
            fullWidth
          />

          <TextEditor
            editorRef={editorRef}
            placeholder="Digite a mensagem aqui..."
            onInput={handleInput}
          />

          <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              sx={{
                borderRadius: 10, textTransform: 'none', fontWeight: 600,
                borderColor: 'text.secondary', color: 'text.secondary',
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={saving}
              sx={{ borderRadius: 10, textTransform: 'none', fontWeight: 600, px: 3 }}
            >
              {saving ? <CircularProgress size={20} color="inherit" /> : 'Salvar Alterações'}
            </Button>
          </Stack>
        </Stack>

        <Stack spacing={1} sx={{ minWidth: { md: 300 } }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }} color="text.secondary">
            Pré Visualização
          </Typography>

          <Box
            sx={{
              borderRadius: 3, border: '1px solid', borderColor: 'divider',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)', overflow: 'hidden',
              backgroundImage: `url(${birthdayBg})`,
              backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
              aspectRatio: '1 / 1', width: '100%', position: 'relative',
            }}
          >
            <Box
              sx={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                p: 3, gap: 1.5, textAlign: 'center', overflow: 'hidden',
              }}
            >
              <Avatar
                sx={{
                  width: 100, height: 100, bgcolor: 'primary.main',
                  color: '#fff', fontWeight: 800, fontSize: 32,
                }}
              >
                M
              </Avatar>

              <Box
                sx={{
                  maxWidth: '72%', textAlign: 'center', fontSize: 14, lineHeight: 1.8,
                  fontFamily: '"Open Sans", Arial, sans-serif',
                  wordBreak: 'break-word', overflow: 'hidden',
                  '& p': { margin: '0 0 6px 0' },
                  '& b, & strong': { fontWeight: 700 },
                }}
                dangerouslySetInnerHTML={{ __html: previewHtmlWithName }}
              />
            </Box>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
            A foto de perfil do associado será exibida automaticamente no lugar do avatar.
          </Typography>
        </Stack>
      </Stack>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snack.severity} variant="filled" sx={{ borderRadius: 2, fontWeight: 600 }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </>
  );
};

/* ── componente principal ──────────────────────────────────────────── */

const CommunicationForm = () => {
  const [tab, setTab] = useState(0);

  return (
    <Stack spacing={2.5}>
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
          <Tab label="Definir mensagem padrão de aniversário" />
        </Tabs>

        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {tab === 0 ? <SendMessageTab /> : <BirthdayTemplateTab />}
        </Box>
      </Paper>
    </Stack>
  );
};

export default CommunicationForm;
