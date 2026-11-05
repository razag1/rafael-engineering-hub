# Relatório de Higienização Técnica — Rafael Engineering Hub

Data de conclusão: 5 de novembro de 2026

Branch de trabalho: `chore-audit-and-cleanup`

Escopo: estabilidade, acessibilidade, segurança, dependências, qualidade, documentação e validação, sem redesign ou alteração indevida de dados pessoais.

## 1. Resumo executivo

A higienização foi concluída de forma incremental, mantendo a identidade Windows 95/98, o conteúdo, as três páginas, a responsividade e os fluxos PT-BR/EN. Os principais resultados foram:

- inicialização local desacoplada da requisição à API do GitHub;
- modal de certificados acessível por teclado, com contenção e restauração de foco;
- renderização dinâmica de certificados com APIs DOM, sem interpolação de HTML;
- validação de URLs externas e fortalecimento do fallback de projetos;
- agrupamento correto do certificado conjunto no filtro da Alura, sem alterar sua emissora real;
- destaques da Home renderizados a partir do catálogo compartilhado;
- remoção de dependências e assets comprovadamente sem uso;
- correção das vulnerabilidades npm conhecidas;
- inclusão de lint, formatação, testes automatizados, smoke tests e CI;
- README reescrito para refletir o estado real do projeto;
- validação visual desktop e mobile das três páginas.

Nenhum commit, push ou merge foi executado.

## 2. Diagnóstico e prioridades

### Alta prioridade

| Achado                                          | Impacto                                                     | Tratamento                                                                                 |
| ----------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Inicialização aguardava a API do GitHub         | lentidão ou falha de rede atrasava interfaces independentes | o catálogo local é renderizado imediatamente e a atualização remota segue em segundo plano |
| Modal sem gerenciamento completo de foco        | navegação por teclado incompleta                            | adicionados foco inicial, contenção de Tab/Shift+Tab, Escape e retorno ao acionador        |
| Cards de certificados montados com `innerHTML`  | superfície desnecessária para injeção                       | substituído por criação explícita de elementos e `textContent`                             |
| URLs externas de projeto sem validação uniforme | risco de esquemas inseguros                                 | demos aceitam somente HTTPS; URLs GitHub são validadas e possuem fallback conhecido        |
| Cinco vulnerabilidades npm no baseline          | quatro altas e uma moderada                                 | Sharp e dependências transitivas atualizados; auditoria final com zero vulnerabilidades    |

### Média prioridade

| Achado                                    | Impacto                   | Tratamento                                                    |
| ----------------------------------------- | ------------------------- | ------------------------------------------------------------- |
| Gulp sem `gulpfile`                       | script não reproduzível   | Gulp e o script inválido foram removidos                      |
| Bootstrap Icons declarado sem uso         | dependência redundante    | removido do manifesto e lockfile                              |
| Ausência de lint, testes e CI             | regressões não detectadas | adicionados ESLint, Prettier, Vitest/jsdom e GitHub Actions   |
| Páginas internas sem `h1` e sem skip link | semântica e teclado       | hierarquia corrigida e skip links adicionados às três páginas |
| README desatualizado                      | documentação divergente   | reescrito em inglês, com resumo em português                  |
| Versão de Node não fixada                 | variação entre ambientes  | Node 24 definido em `.nvmrc`, `engines` e CI                  |

### Baixa prioridade

- função JavaScript sem uso removida;
- parciais SCSS locais migrados para `@use`;
- metadados npm e `.gitignore` atualizados;
- assets duplicados ou obsoletos removidos após confirmação de ausência de referências.

## 3. Alterações funcionais e técnicas

### JavaScript

- `src/scripts/main.js`: não aguarda o enriquecimento remoto de projetos para inicializar idioma, certificados, modal, acordeões e comportamento de foco.
- `src/scripts/modules/certificate-modal.js`: implementa foco inicial no diálogo, ciclo de Tab/Shift+Tab, Escape, retorno ao botão acionador e preserva zoom, reset e arraste.
- `src/scripts/modules/certificate-archive.js`:
    - utiliza APIs DOM seguras;
    - renderiza arquivo e destaques a partir do mesmo catálogo;
    - localiza títulos e tópicos conforme o idioma;
    - separa emissora apresentada de instituição usada para agrupamento;
    - usa `DocumentFragment` para reduzir atualizações intermediárias do DOM.
- `src/scripts/modules/project-archive.js`: valida payloads, nomes de repositório e URLs; mantém timeout de cinco segundos e fallback local em erros HTTP, rede, formato ou limite da API.
- `src/scripts/modules/language.js`: passa a traduzir também rótulos ARIA por `data-i18n-aria-label`.

### Certificados

- O certificado “Imersão Engenharia de Software: Dev na Era da IA” mantém `issuer: "Alura + Google for Startups"`.
- O novo campo técnico `filterIssuer: "Alura"` o agrupa com os demais certificados Alura.
- A opção independente “Alura + Google for Startups” deixou de aparecer no filtro.
- O filtro Alura retorna seis certificados em PT-BR e inglês.
- A identificação conjunta continua visível no card e no modal.
- A Home mantém três destaques na mesma ordem dos dois primeiros: TIM Tec, Alura SQL e, no terceiro card, a Imersão de Engenharia de Software.
- Os três destaques são definidos por `featuredOrder` no catálogo, eliminando a duplicação de título, emissora, datas e caminhos de imagem no HTML.

### HTML e acessibilidade

- skip links adicionados às três páginas;
- `main` possui alvo focável para navegação direta;
- `h1` adicionado às páginas de projetos e certificados;
- contador de certificados usa região `aria-live`;
- diálogo possui alvo de foco e rótulo de fechamento traduzível;
- hierarquia visual, classes BEM, cores e estrutura retro foram preservadas.

### SCSS

- parciais locais usam o sistema de módulos `@use`;
- Bootstrap é carregado por caminho explícito compatível com o resolvedor do Parcel;
- estilo visível e ordem da cascata foram preservados;
- foi adicionado apenas o estilo necessário ao skip link.

## 4. Dependências

### Removidas

- `gulp`: não havia gulpfile ou tarefa utilizável.
- `bootstrap-icons`: nenhuma importação, classe `bi-*` ou referência foi encontrada.

### Atualizadas ou adicionadas

- `sharp` atualizado dentro da linha 0.35 para uma versão corrigida.
- ESLint e `@eslint/js` adicionados para análise estática.
- Prettier adicionado para consistência verificável.
- Vitest e jsdom adicionados para testes de comportamento e smoke tests.
- override restrito de `minimatch` aplicado às dependências do ESLint para manter a versão suportada do ESLint sem a vulnerabilidade transitiva identificada.

Resultado final de `npm audit`: **0 vulnerabilidades**.

## 5. Assets removidos

Os itens abaixo não possuíam referências no HTML, SCSS, JavaScript ou ferramentas atuais e continuam recuperáveis pelo histórico Git:

- `src/assets/certificates.zip`: snapshot redundante e desatualizado da pasta de certificados;
- `src/assets/preview/`: seis previews antigos duplicados;
- `src/assets/projects/github-finder/`: PNG/WebP sem projeto correspondente no catálogo atual.

Os JPG/PNG usados como origem pelo fluxo Sharp foram preservados nas áreas ativas de perfil, certificados e projetos.

## 6. Qualidade e CI

Arquivos adicionados:

- `.github/workflows/quality.yml`;
- `.nvmrc`;
- `.prettierrc.json` e `.prettierignore`;
- `eslint.config.mjs`;
- `vitest.config.mjs`;
- suíte em `tests/`.

O workflow executa `npm ci` e `npm run check` em pull requests e pushes para `main`.

Cobertura comportamental atual:

- alternância e persistência de idioma;
- tradução de conteúdo e rótulos ARIA;
- agrupamento de certificados por instituição;
- preservação da emissora conjunta;
- destaques compartilhados da Home;
- filtros do arquivo de certificados;
- modal, foco, Escape e contenção de Tab;
- fallback da API do GitHub;
- rejeição de URL insegura;
- smoke tests e referências locais das três páginas.

## 7. Resultados das verificações

### Automatizadas

| Verificação        | Resultado                                                               |
| ------------------ | ----------------------------------------------------------------------- |
| `npm ci`           | concluído com sucesso após permitir acesso normal ao cache/registro npm |
| `npm audit`        | 0 vulnerabilidades                                                      |
| `npm run lint`     | aprovado                                                                |
| `npm run format`   | aprovado                                                                |
| `npm test`         | 5 arquivos, 9 testes aprovados                                          |
| `npm run build`    | aprovado                                                                |
| `npm run check`    | aprovado integralmente                                                  |
| `git diff --check` | aprovado                                                                |
| deploy Vercel      | HTTP 200 em `https://rafael-engineering-hub.vercel.app`                 |

O build ainda exibe avisos de depreciação provenientes do SCSS interno do Bootstrap 5.3.8. Eles não são falhas do código local e não impedem a geração de `dist/`.

### Validação visual e manual assistida

Validação realizada no servidor local `http://127.0.0.1:1234`, em viewports de **1440×900** e **390×844**:

- **Home:** perfil, projetos, três certificados destacados, tradução PT-BR/EN e modal verificados. O novo destaque usa a imagem correta e preserva “Alura + Google for Startups”. Escape fecha o modal e devolve o foco ao acionador.
- **Projects:** catálogo remoto carregou 19 cards na sessão validada; cards, links, imagens, acordeões e tradução foram exibidos corretamente. O fallback sem rede foi validado por teste automatizado.
- **Certificates:** 20 cards no estado inicial; filtro de instituições sem opção conjunta separada; filtro Alura retornou seis cards; emissora conjunta preservada; modal, imagem, metadados e rótulos traduzidos verificados.
- **Responsividade:** nenhuma das três páginas apresentou overflow horizontal nos viewports testados (`scrollWidth` menor ou igual ao viewport útil).
- **Console:** nenhum erro ou warning JavaScript foi capturado nas páginas de projetos e certificados durante a inspeção.

## 8. Arquivos modificados e justificativas

### Configuração e documentação

- `.gitignore`: caches, cobertura e variantes de `.env`.
- `package.json` e `package-lock.json`: scripts, Node, dependências e metadados.
- `README.md`: documentação completa do estado final.
- configurações ESLint, Prettier, Vitest, Node e GitHub Actions.

### Aplicação

- três HTMLs: semântica, acessibilidade e ponto dinâmico de destaques.
- `src/scripts/main.js`: inicialização não bloqueante.
- módulos de certificados, modal, idioma e projetos: estabilidade, segurança e acessibilidade.
- catálogos e traduções: metadados de destaque, agrupamento e título localizado.
- `src/styles/main.scss` e `_base.scss`: módulos Sass e skip link.

### Formatação

Prettier normalizou arquivos textuais incluídos no escopo configurado. Isso aumenta o volume aparente do diff em HTML, SCSS e JavaScript, mas não representa redesign ou alteração funcional. A revisão final não encontrou mudanças de conteúdo fora do escopo; avisos LF/CRLF são apenas notificações do Git no Windows.

## 9. Riscos, limitações e pendências

- O fallback de projetos foi validado automaticamente com `fetch` rejeitado; não foi simulado um corte de rede dentro do navegador visual.
- Não foi executado teste com leitor de tela real; a validação de acessibilidade combinou semântica, árvore acessível, teclado e testes jsdom.
- A GitHub Action foi criada e validada pela equivalência local de `npm run check`, mas só executará no GitHub após push.
- Os avisos Sass internos do Bootstrap permanecem até solução upstream ou futura atualização cuidadosamente testada.
- O currículo e os certificados continuam públicos por fazerem parte do conteúdo do portfólio; recomenda-se revisão periódica de privacidade.
- A licença declarada no `package.json` não possui arquivo `LICENSE`; nenhum arquivo de licença foi criado, conforme solicitado.

## 10. Recomendações futuras

1. Adicionar testes end-to-end reais para gestos do modal e navegação responsiva.
2. Considerar regressão visual automatizada nos principais breakpoints.
3. Revisar os avisos Sass quando uma versão compatível do Bootstrap migrar integralmente para módulos.
4. Revisar periodicamente links externos, currículo e certificados publicados.
5. Executar a CI no pull request e revisar o diff formatado antes do merge.

## 11. Estado para revisão

A branch está tecnicamente pronta para revisão humana. Antes do merge, recomenda-se:

- revisar visualmente o diff do README e dos arquivos formatados;
- confirmar que a remoção dos assets antigos é desejada no histórico futuro;
- aguardar a primeira execução verde do workflow no pull request;
- realizar commit e push somente após aprovação do mantenedor.
