import birthdayBg from '../assets/bg fundo.svg';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import FormatItalicIcon from '@mui/icons-material/FormatItalicOutlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import SendIcon from '@mui/icons-material/Send';
import {
  Alert,
  Avatar,
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
import { useEffect, useRef, useState } from 'react';

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

const BirthdayTemplateTab = () => {
  const [subject, setSubject] = useState('Feliz Aniversário! 🎂');
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState<Snack>({
    open: false,
    severity: 'success',
    msg: '',
  });

  const editorRef = useRef<HTMLDivElement>(null);
  const savedSelection = useRef<Range | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewHtml, setPreviewHtml] = useState('');

  const initialHtml =
    '<p style="text-align:center"><b style="color:#E36D3B">Feliz Aniversário! 🎂</b></p>' +
    '<p style="text-align:center">Olá {Nome},</p>' +
    '<p style="text-align:center">Parabéns pelo seu aniversário!<br>' +
    'O Grupo Cultural Dom Mauricio deseja a você um dia incrível e cheio de alegria!</p>' +
    '<p style="text-align:center"><em>Grupo Cultural de Dom Mauricio</em></p>';

  // coloca o html inicial no editor uma só vez
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialHtml;
      setPreviewHtml(initialHtml);
    }
  }, []);

  // atualiza a preview sempre que o usuário digitar
  const handleInput = () => {
    setPreviewHtml(editorRef.current?.innerHTML ?? '');
  };

  // salva a seleção do editor (usado pelo color picker antes de perder o foco)
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelection.current = sel.getRangeAt(0).cloneRange();
    }
  };

  // restaura a seleção salva
  const restoreSelection = () => {
    const sel = window.getSelection();
    if (sel && savedSelection.current) {
      sel.removeAllRanges();
      sel.addRange(savedSelection.current.cloneRange());
    }
  };

  // aplica formatação no texto selecionado (funciona com preventDefault nos botões)
  const applyFormat = (cmd: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
    handleInput();
  };

  // aumenta ou diminui a fonte do texto selecionado
  const changeFontSize = (direction: 'up' | 'down') => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;

    // pega o tamanho atual computado
    const anchorEl = sel.anchorNode?.parentElement;
    const currentSize = anchorEl ? parseInt(window.getComputedStyle(anchorEl).fontSize) : 14;
    const step = 2;
    const newSize = direction === 'up'
      ? Math.min(currentSize + step, 96)
      : Math.max(currentSize - step, 8);

    // usa execCommand pra marcar o texto, depois corrige o valor in-place (sem trocar elementos)
    document.execCommand('fontSize', false, '1');

    const editor = editorRef.current;
    if (editor) {
      // modifica <font size="1"> in-place (remove o atributo size e adiciona style)
      editor.querySelectorAll('font[size="1"]').forEach((font) => {
        font.removeAttribute('size');
        (font as HTMLElement).style.fontSize = `${newSize}px`;
      });
      // modifica spans com x-small in-place
      editor.querySelectorAll('span').forEach((span) => {
        if (span.style.fontSize === 'x-small') {
          span.style.fontSize = `${newSize}px`;
        }
      });
    }
    handleInput();
  };

  // insere uma imagem do computador convertida em base64
  const insertImageFromFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      editorRef.current?.focus();
      restoreSelection();
      document.execCommand('insertImage', false, dataUrl);
      handleInput();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // substitui {Nome} pelo nome de exemplo só pra mostrar na preview
  const previewHtmlWithName = previewHtml.replace(/\{Nome\}/g, 'Maria Silva');

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setSnack({
        open: true,
        severity: 'success',
        msg: 'Mensagem de aniversário salva com sucesso!',
      });
    } catch {
      setSnack({
        open: true,
        severity: 'error',
        msg: 'Erro ao salvar mensagem de aniversário.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        {/* lado esquerdo: campos de edição da mensagem */}
        <Stack spacing={2} sx={{ flex: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700 }}
            color="text.secondary"
          >
            Configurar Mensagem Padrão de Aniversário
          </Typography>

          <Typography variant="caption" color="text.secondary" sx={{ mt: -1 }}>
            Use <strong>{'{Nome}'}</strong> para inserir o nome do associado automaticamente.
            Inclua o título e rodapé diretamente no corpo da mensagem.
          </Typography>

          <TextField
            label="Assunto do e-mail (linha de assunto na caixa de entrada)"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            size="small"
            fullWidth
          />

          {/* editor de texto com formatação real */}
          <Paper
            variant="outlined"
            sx={{ borderRadius: 1.5, overflow: 'hidden' }}
          >
            {/* barra de ferramentas funcional */}
            <Stack
              direction="row"
              spacing={0.5}
              sx={{
                px: 1,
                py: 0.5,
                borderBottom: '1px solid',
                borderColor: 'divider',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              {/* formatação básica */}
              <Tooltip title="Negrito">
                <IconButton size="small" onMouseDown={(e) => { e.preventDefault(); applyFormat('bold'); }}>
                  <FormatBoldIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Itálico">
                <IconButton size="small" onMouseDown={(e) => { e.preventDefault(); applyFormat('italic'); }}>
                  <FormatItalicIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Sublinhado">
                <IconButton size="small" onMouseDown={(e) => { e.preventDefault(); applyFormat('underline'); }}>
                  <FormatUnderlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

              {/* alinhamento */}
              <Tooltip title="Alinhar à esquerda">
                <IconButton size="small" onMouseDown={(e) => { e.preventDefault(); applyFormat('justifyLeft'); }}>
                  <FormatAlignLeftIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Centralizar">
                <IconButton size="small" onMouseDown={(e) => { e.preventDefault(); applyFormat('justifyCenter'); }}>
                  <FormatAlignCenterIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Alinhar à direita">
                <IconButton size="small" onMouseDown={(e) => { e.preventDefault(); applyFormat('justifyRight'); }}>
                  <FormatAlignRightIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

              {/* color picker: seleciona o texto e escolhe a cor */}
              <Tooltip title="Cor do texto (selecione o texto antes)">
                <IconButton
                  size="small"
                  component="label"
                  sx={{ position: 'relative', overflow: 'hidden' }}
                >
                  <FormatColorTextIcon fontSize="small" />
                  <Box
                    component="input"
                    type="color"
                    onMouseDown={saveSelection}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      restoreSelection();
                      applyFormat('foreColor', e.target.value);
                      saveSelection();
                    }}
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      opacity: 0,
                      cursor: 'pointer',
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </IconButton>
              </Tooltip>

              <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

              {/* tamanho da fonte — botões A+ e A- com preventDefault (nunca perde o foco) */}
              <Tooltip title="Diminuir fonte">
                <IconButton size="small" onMouseDown={(e) => { e.preventDefault(); changeFontSize('down'); }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 700, lineHeight: 1 }}>A−</Typography>
                </IconButton>
              </Tooltip>
              <Tooltip title="Aumentar fonte">
                <IconButton size="small" onMouseDown={(e) => { e.preventDefault(); changeFontSize('up'); }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 700, lineHeight: 1 }}>A+</Typography>
                </IconButton>
              </Tooltip>

              {/* inserir imagem do computador */}
              <Tooltip title="Inserir imagem">
                <IconButton size="small" onMouseDown={(e) => { e.preventDefault(); saveSelection(); insertImageFromFile(); }}>
                  <InsertPhotoOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>

            {/* área editável — contentEditable permite formatação real */}
            <Box
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              sx={{
                minHeight: 200,
                p: 1.5,
                fontFamily: '"Open Sans", Arial, sans-serif',
                fontSize: 14,
                color: 'text.primary',
                outline: 'none',
                '& p': { margin: '0 0 8px 0' },
                '& img': { maxWidth: '100%', height: 'auto', borderRadius: 1 },
                '&:empty::before': {
                  content: '"Digite a mensagem aqui..."',
                  color: 'text.disabled',
                },
              }}
            />
          </Paper>

          {/* input de arquivo escondido — acionado pelo botão de imagem na toolbar */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelected}
            style={{ display: 'none' }}
          />

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
                'Salvar Alterações'
              )}
            </Button>
          </Stack>
        </Stack>

        {/* lado direito: preview do cartão de aniversário */}
        <Stack spacing={1} sx={{ minWidth: { md: 300 } }}>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700 }}
            color="text.secondary"
          >
            Pré Visualização
          </Typography>

          {/* cartão de aniversário com o fundo do projeto */}
          <Box
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              overflow: 'hidden',
              backgroundImage: `url(${birthdayBg})`,
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              aspectRatio: '1 / 1',
              width: '100%',
              position: 'relative',
            }}
          >
            {/* conteúdo absoluto pra nunca estourar o aspect-ratio do card */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 3,
                gap: 1.5,
                textAlign: 'center',
                overflow: 'hidden',
              }}
            >
              {/* foto/avatar do aniversariante — na hora do envio real vem a foto de perfil dele */}
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: 'primary.main',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: 32,
                }}
              >
                M
              </Avatar>

              
              <Box
                sx={{
                  maxWidth: '72%',
                  textAlign: 'center',
                  fontSize: 14,
                  lineHeight: 1.8,
                  fontFamily: '"Open Sans", Arial, sans-serif',
                  wordBreak: 'break-word',
                  overflow: 'hidden',
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
