# FB Radar 🎮

Os anúncios novos da categoria **Consoles de Video Game** do Facebook Marketplace, nas cidades escolhidas,
no PC e no celular (app na tela de início, com notificações).

**Site:** https://drakezera1337.github.io/fb-radar/ · no PC: http://localhost:5500/fb/

Site estático (HTML + CSS + JS, sem build) no GitHub Pages. A parte do PC é o `server.py` do
[Rastreazera](https://github.com/Drakezera1337/rastreazera) (pasta `rastreazera` ao lado desta), que serve
este app em `/fb/`, recebe o coletor e publica no Gist do FB Radar.

- **Coletor**: a extensão `coletor/` ("FB Radar Coletor") roda no Chrome do PC, logado no Facebook. Pelo ícone dela:
  **▶ Iniciar** confere a categoria (ordenada pelos mais novos) a cada 3 min (2–15, ajustável). Ela baixa a página
  e lê os dados que a própria página traz (id, título, preço, cidade, foto, quando foi criado) — sem depender do
  selo "Acabou de ser anunciado" e sem abrir aba (se a página vier sem os dados, abre uma em segundo plano e fecha).
  Depois pede as páginas seguintes como a rolagem faz: +1 página (~24 anúncios) a cada conferência e uma varredura
  de até 8 páginas a cada 30 min (para nos anúncios com mais de 7 dias). O id dessa consulta do Facebook é
  descoberto sozinho nos arquivos JS da página quando muda. Anúncios antigos achados na varredura não geram aviso.
- **Reposts**: mesmo preço e título igual (ou com até 2 letras de diferença) viram um card só, com o selo ×N.
- **server.py** guarda os anúncios das cidades escolhidas em `fb_estado.json` (fora do git) por 7 dias,
  marca mudança de preço e publica `fb.json` no Gist do FB Radar.
- **App**: fotos, preço, cidade e há quanto tempo; selo **NOVO** (chegou depois da sua última visita) e
  **⬇ %** (baixou de preço); busca, categorias (PS5, PS4, Xbox, Nintendo, Retrô, Controles…), ordem por preço,
  ⭐ salvar e ✕ ocultar (ficam no aparelho). Tocar no card abre o anúncio no Facebook.
- **Gist**: no PC, ⚙️ → **Gist do FB Radar** → cole um token do GitHub só com a permissão `gist`
  ([gerar](https://github.com/settings/tokens/new?description=FB%20Radar%20(Gist)&scopes=gist)). O app acha ou cria
  o Gist "FB Radar" e passa ao `server.py`.
- **Menu inferior**: Anúncios · Notificações · Favoritos · Configurações.
- **Regras de aviso** (Notificações → **+**): nome, palavras no título (basta uma), palavras que não podem ter,
  preço mínimo/máximo e cidades. Ficam em `regras.json` no Gist (PC e celular editam); o `server.py` só avisa os
  anúncios novos que batem com alguma regra ativa — sem regras ativas, avisa todos. O editor mostra quantos anúncios
  atuais batem. O histórico dos avisos enviados aparece na mesma aba.
- **Favoritos**: ☆ guarda o anúncio (com uma cópia no aparelho: continua lá depois de sair do Marketplace, com o selo SAIU).
- **Cidades**: Configurações no PC (vazio = todas as que o Facebook mostrar no raio da sua conta).
- **Celular**: no PC, ⚙️ → **Mostrar QR code**; no celular, abra o FB Radar → ⚙️ → **Ler QR do PC** (ou aponte a
  câmera) e adicione à tela inicial. **🔔 Ativar notificações**: o PC avisa cada anúncio novo (com foto; tocar
  abre o anúncio). Inscrições em `push.json` no Gist.

**Instalar o coletor:** `chrome://extensions` → Modo do desenvolvedor → **Carregar sem compactação** → pasta `coletor`.

## Publicar

Antes de cada commit que muda o site: `python versao.py` (sobe a versão do cache e dos arquivos — sem isso o
app do celular continua com os arquivos antigos). Cada push na `main` publica em ~1 min.
