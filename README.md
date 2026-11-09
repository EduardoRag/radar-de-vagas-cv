# ResumeMatch — Analisador e Otimizador de Currículos ATS

## Aplicação publicada

**Acesse a aplicação:** [https://radar-de-vagas-cv.lovable.app](https://radar-de-vagas-cv.lovable.app)

---

## 1. Qual problema a aplicação resolve?

O ResumeMatch foi pensado para ajudar candidatos a adaptar seus currículos para vagas específicas.

Muitas pessoas enviam o mesmo currículo para diferentes oportunidades, mesmo quando cada vaga exige competências, experiências e palavras-chave diferentes. Isso pode dificultar a identificação, pelo recrutador ou por sistemas ATS (*Applicant Tracking Systems*), das qualificações mais relevantes do candidato.

A aplicação permite comparar o currículo com a descrição de uma vaga, identificar pontos de compatibilidade e oportunidades de melhoria e preparar uma versão do currículo mais alinhada aos requisitos apresentados.

A ferramenta busca:

- Destacar experiências e competências relevantes para a vaga;
- Identificar requisitos e palavras-chave encontrados ou ausentes no currículo;
- Apontar possíveis melhorias na apresentação das experiências;
- Ajudar a organizar o currículo em um formato mais simples e compatível com ATS;
- Evitar que o candidato precise adaptar todo o documento manualmente a cada candidatura.

A aplicação não garante aprovação em processos seletivos ou em sistemas ATS. A compatibilidade apresentada deve ser entendida como uma estimativa baseada na comparação entre o currículo e a descrição da vaga.

---

## 2. Mega prompt utilizado

O prompt foi elaborado para orientar o Lovable na criação de uma aplicação SaaS de análise e otimização de currículos, incluindo interface, fluxo de análise, telas, regras da IA e estrutura técnica.

### Prompt

```text
Crie uma aplicação SaaS chamada ResumeMatch, voltada para candidatos que desejam melhorar seus currículos e aumentar a compatibilidade com sistemas ATS (Applicant Tracking Systems).

O objetivo principal é permitir que o usuário:
1. Envie seu currículo atual.
2. Insira a descrição de uma vaga.
3. Receba uma análise de compatibilidade.
4. Identifique palavras-chave ausentes e pontos de melhoria.
5. Gere uma versão otimizada do currículo.
6. Edite o resultado e exporte o documento final.

A aplicação deve ter aparência profissional, moderna e minimalista, com experiência intuitiva e fluida. Não criar apenas uma landing page: desenvolver as telas da aplicação, navegação, estados e componentes reutilizáveis.

## Design System

Utilize um design moderno de SaaS, inspirado em produtos como Linear, Vercel e ferramentas modernas de produtividade.

A interface deve transmitir confiança, profissionalismo, clareza e simplicidade.

Tema dark como padrão.

Paleta:
- Background principal: #09090B
- Background secundário: #111114
- Cards: #18181B
- Background elevado: #202024
- Border: #27272A
- Primary: #A3E635
- Primary hover: #BEF264
- Primary foreground: #09090B
- Success: #22C55E
- Warning: #F59E0B
- Danger: #EF4444
- Info: #3B82F6
- Texto principal: #FAFAFA
- Texto secundário: #A1A1AA
- Texto muted: #71717A

Utilize Inter ou Geist, Lucide Icons e shadcn/ui como base.

Manter bordas discretas, espaçamento consistente, animações suaves, hover states e responsividade. Evitar gradientes exagerados, glassmorphism excessivo e aparência de template genérico.

## Navegação

Criar uma sidebar com:
- Dashboard
- Analisar currículo
- Meus currículos
- Minhas análises
- Configurações

Na parte inferior, mostrar avatar, nome, plano e menu de perfil. A sidebar deve ser recolhível e adaptada para mobile.

## Telas

### Landing Page
Criar navbar com logo, Como funciona, Recursos, Entrar e Começar gratuitamente.

Headline:
“Seu currículo, alinhado à vaga certa.”

Subheadline:
“Compare seu currículo com a descrição da vaga, descubra o que está faltando e gere uma versão otimizada para ATS sem inventar experiências.”

Adicionar CTAs, seção de funcionamento, recursos e CTA final.

### Dashboard
Mostrar saudação, botão de nova análise, resumo de currículos e análises, análises recentes e estado vazio quando ainda não houver dados.

Não apresentar estatísticas fictícias como se fossem dados reais do usuário.

### Nova análise
Criar fluxo guiado por etapas:
1. Currículo
2. Descrição da vaga
3. Análise
4. Resultado

Na etapa de currículo, permitir upload ou inserção manual do conteúdo, além de selecionar currículos previamente salvos.

Na etapa de vaga, solicitar:
- Cargo
- Empresa (opcional)
- Descrição completa da vaga

Validar os campos antes de iniciar a análise.

### Resultado da análise
Mostrar:
- Cargo e empresa
- Data e currículo utilizado
- Score estimado de compatibilidade
- Competências técnicas
- Experiência profissional
- Palavras-chave
- Formação
- Responsabilidades

Apresentar pontos fortes, pontos de atenção, palavras-chave encontradas, parcialmente encontradas e ausentes, além de recomendações específicas.

O score deve ser identificado como estimativa própria, não como pontuação oficial de qualquer ATS.

### Editor de currículo
Criar editor com conteúdo à esquerda e preview à direita.

Permitir editar:
- Informações pessoais
- Resumo profissional
- Experiência
- Formação
- Competências
- Certificações
- Projetos
- Idiomas

Permitir sugerir melhorias com IA, visualizar texto original e sugerido, entender as alterações e aceitar ou rejeitar cada sugestão.

Não substituir o conteúdo automaticamente sem consentimento.

### Exportação
Permitir exportar currículo em PDF e DOCX.

O currículo ATS-friendly deve utilizar layout simples, uma coluna, títulos convencionais, texto selecionável, fontes legíveis e datas consistentes.

Evitar tabelas complexas, múltiplas colunas, gráficos, barras de habilidades, ícones no lugar de informações e texto dentro de imagens.

Não incluir score ou comentários da IA no currículo exportado.

### Meus currículos
Permitir visualizar, editar, duplicar, excluir e iniciar análise a partir de currículos salvos.

### Histórico
Mostrar análises anteriores, cargo, empresa, score estimado, data e currículo utilizado. Permitir filtros e acesso aos relatórios.

### Configurações
Incluir perfil, preferências, idioma e gerenciamento de dados e conta.

## Fluxo de análise

1. Extrair e organizar informações do currículo: contato, resumo, experiências, formação, competências, certificações, projetos e idiomas.
2. Analisar a descrição da vaga: cargo, senioridade, requisitos obrigatórios e desejáveis, competências, responsabilidades e palavras-chave.
3. Comparar currículo e vaga, identificando correspondências, requisitos parcialmente demonstrados e requisitos não encontrados.
4. Gerar relatório com pontos fortes, pontos de atenção e recomendações.
5. Permitir que o usuário revise e aceite sugestões.
6. Gerar uma versão otimizada do currículo, preservando os dados reais do candidato.

Considerar sinônimos e equivalências semânticas, sem assumir automaticamente que uma competência relacionada comprova domínio de outra tecnologia.

## Regras fundamentais

A IA não pode inventar:
- Experiências profissionais
- Empresas
- Tecnologias
- Métricas ou resultados
- Certificações
- Datas
- Senioridade

Preservar histórico profissional, datas, formação, tecnologias realmente utilizadas e resultados comprovados.

Adicionar palavras-chave apenas quando forem sustentadas pelo currículo ou confirmadas pelo usuário.

Quando um requisito não for encontrado, informar que ele não foi identificado e pedir confirmação antes de adicioná-lo.

Detectar o idioma do currículo e da vaga. Permitir português, inglês e espanhol. Não traduzir automaticamente sem autorização.

## Estados da aplicação

Implementar loading, skeleton, empty state, erro, sucesso, progresso de upload, análise em andamento, análise concluída e falha de processamento.

Durante a análise, mostrar etapas:
- Extraindo informações do currículo
- Analisando requisitos da vaga
- Comparando competências
- Identificando palavras-chave
- Gerando recomendações

Não exibir porcentagens falsas de progresso.

## Stack e arquitetura

Utilizar:
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Lucide React
- Supabase, caso necessário
- React Hook Form
- Zod

Organizar código em componentes, páginas, layouts, hooks, services, types e utils.

Não expor API keys no frontend. Integrações de IA devem ocorrer em backend ou ambiente seguro, como Supabase Edge Functions.

Se a integração real com IA não estiver configurada, utilizar serviços mockados claramente identificados e não apresentar resultados fictícios como reais.

## Responsividade

Desktop: sidebar e editor com duas colunas.
Tablet: sidebar recolhível e preview alternável.
Mobile: drawer, layout em uma coluna e editor/preview em tabs.

Evitar overflow horizontal.

## Qualidade

Priorizar consistência visual, componentes reutilizáveis, validação, navegação funcional, acessibilidade, responsividade e feedback claro.

Implementar por etapas:
1. Design system
2. Landing page
3. Autenticação
4. Dashboard
5. Nova análise
6. Resultado
7. Editor
8. Exportação
9. Histórico
10. Configurações

Começar pelo frontend, utilizando dados mockados apenas quando necessário e deixando clara a diferença entre simulação e análise real.
```

### O que mudou até a versão final?

O prompt inicial já previa o envio de currículos, mas durante a revisão da aplicação foi identificado que a experiência precisava deixar essa ação mais clara e acessível.

O principal ajuste realizado foi:

- **Adicionar um botão específico para enviar currículo em PDF ou DOCX**, facilitando a seleção do arquivo pelo usuário.

Esse ajuste tornou o envio do currículo mais direto, sem depender exclusivamente de outras formas de inserir o conteúdo.

---

## 3. Como a análise funciona?

O fluxo da aplicação parte da descrição da vaga e do currículo fornecido pelo usuário.

### Etapa 1 — Envio do currículo

O usuário envia seu currículo em PDF ou DOCX por meio do botão de upload.

O documento é utilizado como fonte das informações profissionais do candidato, como experiências, competências, formação e projetos.

### Etapa 2 — Inserção da descrição da vaga

O usuário copia e cola a descrição da oportunidade que deseja analisar.

A descrição da vaga é a referência para identificar os requisitos mais importantes para aquela candidatura.

### Etapa 3 — Comparação

A aplicação compara as informações do currículo com os requisitos da vaga.

A análise busca identificar:

- Competências que aparecem nos dois documentos;
- Experiências relacionadas às responsabilidades da vaga;
- Palavras-chave relevantes;
- Requisitos que não estão claramente demonstrados;
- Possíveis melhorias na apresentação do currículo.

### Etapa 4 — Resultado

O usuário recebe uma análise de compatibilidade com os pontos fortes e as oportunidades de melhoria.

A ideia é ajudar o candidato a entender quais informações do currículo já estão alinhadas e quais poderiam ser melhor apresentadas.

### Etapa 5 — Ajuste do currículo

Com base na análise, o currículo pode ser ajustado para destacar informações relevantes à vaga.

O objetivo é melhorar a organização e a apresentação das experiências reais do candidato, sem criar informações falsas ou adicionar competências que ele não possui.

### Etapa 6 — Revisão e utilização

O candidato revisa o currículo ajustado antes de utilizá-lo na candidatura.

É importante que o usuário confirme todas as informações e sugestões antes de enviar o documento para uma empresa.

---

## 4. Ajustes solicitados após a primeira geração

Após a primeira geração da aplicação no Lovable, foi identificado que o envio do currículo precisava ser mais simples e evidente.

### Ajuste realizado: botão de upload de currículo

Foi solicitado adicionar um botão que permita ao usuário selecionar e enviar seu currículo nos formatos:

- PDF
- DOCX

**Motivo:** facilitar a entrada de dados na aplicação e tornar o fluxo de análise mais intuitivo. O usuário pode utilizar um documento que já possui, sem precisar copiar manualmente todo o conteúdo do currículo.

Esse ajuste foi realizado para melhorar a usabilidade e reduzir o esforço necessário para iniciar uma análise.

---

## 5. Aplicação publicada

A aplicação está disponível publicamente no Lovable:

**[https://radar-de-vagas-cv.lovable.app](https://radar-de-vagas-cv.lovable.app)**

---

## 6. Considerações finais

O projeto foi desenvolvido com o objetivo de explorar como a IA pode auxiliar candidatos na preparação de currículos direcionados a oportunidades específicas.

Além da análise de compatibilidade, a aplicação busca oferecer uma experiência simples para identificar melhorias e organizar as informações profissionais de forma mais clara e adequada para ATS.

A ferramenta deve ser utilizada como apoio na preparação do currículo, e não como garantia de aprovação em processos seletivos.
