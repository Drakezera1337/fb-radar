// Gist secreto do FB Radar (separado do Rastreazera). A API do GitHub aceita chamadas direto do
// navegador (CORS), então funciona no GitHub Pages.
//
// Arquivos no Gist:
//   fb.json     anúncios publicados pelo server.py do PC (o celular lê daqui)
//   push.json   aparelhos inscritos para notificações (o server.py do PC envia)
const Sync = (() => {
  const CFG_KEY = 'fbradar:sync';
  const FILE = 'fb.json';
  const FILE_PUSH = 'push.json';
  const DESCRICAO = 'FB Radar – anúncios do Facebook Marketplace';
  const API = 'https://api.github.com/gists';

  function config() {
    try { return JSON.parse(localStorage.getItem(CFG_KEY)) || {}; } catch { return {}; }
  }
  function setConfig(cfg) {
    if (cfg) localStorage.setItem(CFG_KEY, JSON.stringify(cfg));
    else localStorage.removeItem(CFG_KEY);
  }
  function enabled() {
    const c = config();
    return Boolean(c.token && c.gistId);
  }

  async function request(url, { token, method = 'GET', body } = {}) {
    const res = await fetch(url, {
      method,
      cache: 'no-store',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const msg = res.status === 401 ? 'token inválido' : res.status === 404 ? 'Gist não encontrado'
        : res.status === 403 ? 'acesso negado pelo GitHub (403) — o token tem a permissão gist?' : `erro ${res.status}`;
      throw new Error(msg);
    }
    return res.json();
  }

  // Usa o Gist do FB Radar que já existe na conta; senão, cria um (secreto)
  async function conectar(token) {
    const lista = await request(`${API}?per_page=100`, { token });
    const existente = lista.find((g) => g.files?.[FILE] && g.description === DESCRICAO);
    const gistId = existente?.id || (await request(API, {
      token,
      method: 'POST',
      body: { description: DESCRICAO, public: false, files: { [FILE]: { content: '{}' } } },
    })).id;
    setConfig({ token, gistId });
    return { token, gistId, criado: !existente };
  }

  async function lerArquivo(gist, nome, padrao) {
    const file = gist.files && gist.files[nome];
    if (!file) return padrao;
    let content = file.content;
    if (file.truncated) content = await (await fetch(file.raw_url)).text();
    try { return JSON.parse(content || 'null') ?? padrao; } catch { return padrao; }
  }

  async function lerUm(nome = FILE, padrao = null) {
    const { token, gistId } = config();
    return lerArquivo(await request(`${API}/${gistId}`, { token }), nome, padrao);
  }

  // Aparelhos que recebem notificações: novo = null remove o aparelho
  async function atualizarInscricao(endpoint, novo) {
    const { token, gistId } = config();
    const gist = await request(`${API}/${gistId}`, { token });
    const lista = (await lerArquivo(gist, FILE_PUSH, [])).filter((r) => r && r.endpoint !== endpoint);
    if (novo) lista.push(novo);
    await request(`${API}/${gistId}`, {
      token,
      method: 'PATCH',
      body: { files: { [FILE_PUSH]: { content: JSON.stringify(lista, null, 1) } } },
    });
  }

  return { config, setConfig, enabled, conectar, lerUm, atualizarInscricao };
})();
