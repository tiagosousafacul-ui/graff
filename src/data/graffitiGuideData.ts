import { DiagramLayer, GraffitiStep, SprayCan, SprayCap } from '../types/graffiti';

export const INITIAL_LAYERS: DiagramLayer[] = [
  {
    id: 'grid',
    name: '01. Grid & Ponto de Fuga',
    subtitle: 'Linhas guia de perspectiva 3D',
    color: '#06b6d4',
    tag: 'Base Geométrica',
    description: 'Ponto focal central-inferior e linhas radiais que determinam a inclinação exata de todas as faces de profundidade tridimensional.',
    capUsed: 'Skinny Cap (Linha Fina)',
    sprayTechnique: 'Traço rápido e suave a 25cm com lata inclinada e tinta clara (giz ou amarelo suave).',
    visible: true,
    opacity: 0.85
  },
  {
    id: 'skeleton',
    name: '02. Esboço das Letras (Skeleton)',
    subtitle: 'Estrutura geométrica do "3D"',
    color: '#94a3b8',
    tag: 'Estrutura Óssea',
    description: 'Construção dos blocos principais das letras "3" e "D". Caixas retangulares proporcionais, chanfros nos vértices e cortes dinâmicos.',
    capUsed: 'Skinny Cap (Astro ou Banana)',
    sprayTechnique: 'Traçado leve sem pesar a mão. Não cubra a parede; crie apenas o esqueleto estrutural.',
    visible: true,
    opacity: 0.75
  },
  {
    id: 'fillin',
    name: '03. Preenchimento & Gradiente',
    subtitle: 'Fusão Vermelho Fogo + Azul Cobalto',
    color: '#ef4444',
    tag: 'Fill-In Quente/Frio',
    description: 'Degradê vertical potente: Vermelho Fogo na parte superior das letras fundindo suavemente com Azul Cobalto profundo na metade inferior.',
    capUsed: 'Fat Cap (New York ou Level 5)',
    sprayTechnique: 'Passadas horizontais constantes a 15cm. No centro, incline a lata a 45° para pulverizar o pó de transição sem marcar faixas duras.',
    visible: true,
    opacity: 1
  },
  {
    id: 'blocks3d',
    name: '04. Extrusão & Bloco 3D',
    subtitle: 'Faces de profundidade em perspectiva',
    color: '#1d4ed8',
    tag: 'Volume 3D',
    description: 'Projeção de todas as esquinas e vértices em direção ao ponto de fuga. As faces voltadas para cima recebem luz refletida; as voltadas para baixo recebem sombra profunda.',
    capUsed: 'Skinny Pro ou Soft Cap',
    sprayTechnique: 'Cortes retos acompanhando as linhas guia. Aplique azul escuro sombreado com toques de preto para profundidade cinematográfica.',
    visible: true,
    opacity: 1
  },
  {
    id: 'greenpower',
    name: '05. Elementos de Corte Verde Neon',
    subtitle: 'A cor de equilíbrio & setas de energia',
    color: '#22c55e',
    tag: 'Acento Cromático',
    description: 'O Verde Limão/Neon aplicado estrategicamente em setas de corte (flow arrows), biséis centrais e trincas de energia que separam os tons quentes e frios.',
    capUsed: 'Skinny Universal / Super Skinny',
    sprayTechnique: 'Traços rápidos e curtos com pressão controlada para que a tinta verde não escorra sobre o gradiente recém-seco.',
    visible: true,
    opacity: 1
  },
  {
    id: 'masteroutline',
    name: '06. Contorno Mestre Preto (Master Outline)',
    subtitle: 'Corte cirúrgico que define o grafite',
    color: '#0f172a',
    tag: 'Definição e Corte',
    description: 'O contorno preto de 15mm de espessura que limpa qualquer pulverização do preenchimento e sela os limites entre as letras e o 3D.',
    capUsed: 'Skinny Cap Alemão / Gold Fat cortado',
    sprayTechnique: 'Pulso firme, movimento partindo do ombro e antebraço a 8cm da parede. Velocidade contínua sem paradas para evitar gotejamento.',
    visible: true,
    opacity: 1
  },
  {
    id: 'highlights',
    name: '07. Brilhos Brancos (Highlights)',
    subtitle: 'Pontos de luz especular e reflexos',
    color: '#ffffff',
    tag: 'Efeito Vitrificado',
    description: 'Luzes brancas aplicadas no canto superior esquerdo de cada quina, simulando um sol a 45 graus. Cria a sensação de bloco metálico ou plástico 3D polido.',
    capUsed: 'Needle Cap ou Super Skinny',
    sprayTechnique: 'Toques secos e rápidos em formato de vírgula e pontilhado nítido nos cantos mais salientes.',
    visible: true,
    opacity: 1
  },
  {
    id: 'powerhalo',
    name: '08. Power Outline Verde & Fundo',
    subtitle: 'Halo elétrico e efeitos de respingo',
    color: '#4ade80',
    tag: 'Descolamento da Parede',
    description: 'Uma segunda borda externa verde neon que contorna toda a peça a 2cm do traço preto, fazendo o grafite saltar do muro com respingos de fundo.',
    capUsed: 'Fat Cap (para aura) + Drip/Needle (respingos)',
    sprayTechnique: 'Afastamento a 20cm para criar a aura difusa externa, seguido de respingos e gotas controladas.',
    visible: true,
    opacity: 1
  }
];

export const GRAFFITI_STEPS: GraffitiStep[] = [
  {
    id: 1,
    title: 'Preparação & Linhas de Fuga (Diagrama de Perspectiva)',
    phase: 'Fase 1: Fundação Geométrica',
    colorUsed: 'Tinta guia suave (Amarelo ou Giz)',
    accentColor: '#06b6d4',
    capRecommended: 'Skinny Cap padrão ou barra de giz',
    sprayDistance: '20cm a 30cm da parede',
    pressure: 'Baixa / Leve toque',
    summary: 'Antes de gastar suas tintas nobres, defina a matemática visual da parede.',
    detailedSteps: [
      'Marque uma linha de base horizontal na altura do seu peito (cerca de 1,40m do chão).',
      'Defina o Ponto de Fuga (P.F.): para este design 3D dinâmico, posicione o ponto abaixo e ligeiramente à direita do centro da parede.',
      'Com um giz ou spray bem claro, puxe linhas retas do P.F. até os quatro cantos imaginários onde as letras ficarão.',
      'Todas as faces de profundidade das letras seguirão rigidamente essas linhas.'
    ],
    proTips: [
      'Use um barbante preso com fita crepe no ponto de fuga para puxar linhas perfeitamente retas na parede sem régua.',
      'Mantenha as linhas de guia muito tênues para que o preenchimento vermelho e azul as cubra facilmente.'
    ],
    mistakesToAvoid: [
      'Não mude a direção das linhas de profundidade no meio da peça; isso quebra a ilusão 3D e faz a letra parecer torta.',
      'Evite usar tinta preta para esboçar o grid; o preto sangra por baixo do vermelho e do verde.'
    ]
  },
  {
    id: 2,
    title: 'Esboço Estrutural das Letras Personalizadas',
    phase: 'Fase 2: Anatomia das Letras',
    colorUsed: 'Azul Celeste claro ou Vermelho bem diluído',
    accentColor: '#f59e0b',
    capRecommended: 'Skinny Cap',
    sprayDistance: '15cm da parede',
    pressure: 'Média',
    summary: 'Construa letras sólidas em formato bloco com cortes chanfrados e proporções consistentes.',
    detailedSteps: [
      'Desenhe as caixas de limite (bounding boxes) para cada caractere da sua palavra.',
      'Mantenha a espessura de todas as hastes uniforme em torno de 20cm a 25cm.',
      'Aplique chanfros em 45 graus nos cantos superiores para criar arestas dinâmicas.',
      'Faça conexões e sobreposições leves entre as letras para que a peça funcione como uma escultura única.'
    ],
    proTips: [
      'Dê três passos para trás a cada letra traçada para conferir se o ritmo visual e os espaçamentos estão balanceados.',
      'Em letras com curvas (como B, C, D, O, P, S), transforme as curvas em 3 ou 4 segmentos retos chanfrados; isso facilita imensamente a projeção 3D.'
    ],
    mistakesToAvoid: [
      'Não faça letras desproporcionais onde uma é gigante e a outra espremida.',
      'Evite hastes finas demais que não sustentam o volume do bloco 3D.'
    ]
  },
  {
    id: 3,
    title: 'Preenchimento (Fill-In): O Gradiente Fogo & Gelo',
    phase: 'Fase 3: Cor & Temperatura',
    colorUsed: 'Vermelho Fogo (Topo) + Azul Cobalto (Base)',
    accentColor: '#ef4444',
    capRecommended: 'Fat Cap (New York Fat ou Level 5)',
    sprayDistance: '12cm a 18cm com passada rápida',
    pressure: 'Alta / Contínua',
    summary: 'Aplique a técnica de transição cromática quente/frio que atrai o cérebro humano.',
    detailedSteps: [
      'Comece com o Vermelho Fogo na parte superior das letras. Pinte de cima para baixo em passadas horizontais contínuas e regulares.',
      'Na linha média da letra, solte a pressão gradualmente para que o spray crie uma névoa suave de transição.',
      'Pegue imediatamente a lata de Azul Cobalto e comece da base para cima, indo ao encontro do vermelho.',
      'Na junção central, incline a lata a 45° para que as duas cores se fundam em um roxo-violeta suave e natural sem criar uma emenda dura.'
    ],
    proTips: [
      'Trabalhe enquanto a tinta ainda estiver fresca para que os pigmentos se misturem harmoniosamente.',
      'Para um vermelho ainda mais vibrante, se a parede for de tijolo cru escuro, faça um fundo prévio de branco onde ficará o vermelho.'
    ],
    mistakesToAvoid: [
      'Não passe spray demais no mesmo ponto parado para não escorrer tinta.',
      'Não use o verde no preenchimento principal das letras; misturar vermelho, azul e verde na mesma área de degradê resulta em cor marrom de lama.'
    ]
  },
  {
    id: 4,
    title: 'A Extrusão 3D: Dando Peso e Profundidade',
    phase: 'Fase 4: Bloco de Volume',
    colorUsed: 'Azul Escuro / Azul Noite + Toques de Preto',
    accentColor: '#1d4ed8',
    capRecommended: 'Skinny Pro ou Soft Cap',
    sprayDistance: '10cm a 15cm',
    pressure: 'Média e controlada',
    summary: 'Projete cada canto da letra para trás na direção das linhas do Ponto de Fuga.',
    detailedSteps: [
      'Em cada vértice da frente da letra, puxe a linha de profundidade com 15 a 20cm de comprimento em direção ao P.F.',
      'Feche os fundos das faces replicando os mesmos ângulos da frente da letra (paralelismo geométrico).',
      'Pinte as faces 3D voltadas para cima com um tom de azul mais aberto (pois pegam luz do céu).',
      'Pinte as faces 3D voltadas para baixo com o azul mais escuro ou azul mesclado com preto (sombra própria).'
    ],
    proTips: [
      'O segredo do 3D convincente é o contraste: se a frente da letra é clara/viva, o bloco 3D deve ser 50% mais escuro.',
      'Use um pedaço de papelão limpo como máscara (stencil de mão) se quiser arestas 100% retas e sem overspray.'
    ],
    mistakesToAvoid: [
      'Nunca inverta a direção das faces 3D: todas devem olhar para a mesma fonte imaginária de profundidade.',
      'Não deixe o bloco 3D com a mesma cor chapada da frente das letras.'
    ]
  },
  {
    id: 5,
    title: 'O Elemento Verde Neon: A Arma Secreta de Contraste',
    phase: 'Fase 5: Acento e Biséis de Energia',
    colorUsed: 'Verde Limão Elétrico / Verde Fluorescente',
    accentColor: '#22c55e',
    capRecommended: 'Skinny Universal',
    sprayDistance: '8cm a 12cm',
    pressure: 'Média-alta com velocidade rápida',
    summary: 'Por que o Verde foi a escolha perfeita: ele funciona como condutor de energia visual!',
    detailedSteps: [
      'O Verde Limão tem comprimento de onda intermediário e altíssimo brilho ótico perante o olho humano.',
      'Desenhe setas geométricas de fluxo (flow arrows) que cortam os blocos das letras.',
      'Faça ranhuras de energia (cuts) na diagonal entre o vermelho e o azul para criar transições ultra-modernas.',
      'Adicione biséis finos em verde neon nas quinas de transição entre a face frontal e a face 3D.'
    ],
    proTips: [
      'O Verde atua como um "choque elétrico" visual que impede que o vermelho e o azul pareçam clássicos ou apagados.',
      'Mantenha as linhas em verde limpas e dinâmicas, com terminação em ponta de lança.'
    ],
    mistakesToAvoid: [
      'Não exagere cobrindo a letra inteira de verde; ele deve ocupar apenas 10% a 15% da área total da peça.'
    ]
  },
  {
    id: 6,
    title: 'O Contorno Mestre Preto (Master Outline)',
    phase: 'Fase 6: Precisão Cirúrgica',
    colorUsed: 'Preto Fosco de Alta Cobertura (Tar Black ou Nitro)',
    accentColor: '#0f172a',
    capRecommended: 'German Skinny ou Skinny Pro',
    sprayDistance: '6cm a 10cm da parede',
    pressure: 'Controle cirúrgico',
    summary: 'O momento que separa os amadores dos veteranos: o contorno limpo.',
    detailedSteps: [
      'Agite a lata preta vigorosamente por 2 minutos. Teste um traço no chão ou num canto.',
      'Posicione o corpo: pés firmes na largura dos ombros, cotovelo semi-flexionado. O movimento vem do ombro, não do punho.',
      'Trace todas as bordas frontais das letras com uma linha preta contínua de 10mm a 15mm de espessura.',
      'Faça o corte ("cut-back"): use o preto para "aparar" qualquer excesso de tinta vermelha ou azul que tenha vazado para fora do esboço.'
    ],
    proTips: [
      'Mantenha a velocidade de passada sempre constante: se hesitar ou desacelerar, a tinta junta e escorre.',
      'Respire fundo e solte o ar enquanto faz as linhas longas para estabilizar o movimento do braço.'
    ],
    mistakesToAvoid: [
      'Nunca faça "rabiscos de vai-e-vem" com o spray; cada linha deve ser um traço único e decidido.',
      'Não fique muito perto da parede sem mover o braço rapidamente.'
    ]
  },
  {
    id: 7,
    title: 'Highlights Brancos: O Efeito Vidro e Luz 3D',
    phase: 'Fase 7: Iluminação Especular',
    colorUsed: 'Branco Puro de Alta Opacidade',
    accentColor: '#ffffff',
    capRecommended: 'Super Skinny ou Needle Cap',
    sprayDistance: '5cm a 8cm',
    pressure: 'Toque rápido (Puffs secos)',
    summary: 'A luz que faz a peça parecer um sólido metálico reluzente tridimensional.',
    detailedSteps: [
      'Identifique a fonte de luz: estabeleça mentalmente uma lâmpada imaginária no canto superior esquerdo a 45 graus.',
      'Aplique pontos e vírgulas brancas finas estritamente nas quinas superiores e esquerdas das letras.',
      'Puxe uma linha fina branca ("inline de brilho") paralela ao contorno preto superior.',
      'Adicione uma pequena estrela de brilho (cruz de 4 pontas) no ápice do corte vermelho da letra.'
    ],
    proTips: [
      'Menos é mais: não coloque luz em todos os cantos; a luz só existe onde o sol imaginário bateria.',
      'Se o traço branco ficar grosso demais, você pode dar um toquezinho com o vermelho ou azul por cima para afinar a linha.'
    ],
    mistakesToAvoid: [
      'Não coloque brilho branco nas partes inferiores das letras ou no fundo da sombra 3D.'
    ]
  },
  {
    id: 8,
    title: 'Power Outline Verde Neon & Efeitos Urbanos',
    phase: 'Fase 8: A Grande Finalização',
    colorUsed: 'Verde Limão / Fluorescente + Tinta de Respingos',
    accentColor: '#4ade80',
    capRecommended: 'Fat Cap para a aura + Skinny para o halo externo',
    sprayDistance: '15cm a 25cm',
    pressure: 'Suave e progressiva',
    summary: 'A segunda pele que descola o grafite da parede e cria a assinatura urbana.',
    detailedSteps: [
      'Trace uma linha contínua em Verde Limão a 2cm de distância de todo o contorno preto externo da peça (o famoso "Second Outline").',
      'Afaste a lata a 25cm e faça uma névoa difusa verde suave por trás do bloco 3D para criar um "glow" de neon.',
      'Adicione pequenos respingos (splatters): borrife a lata de cabeça para baixo ou bata no bico para soltar gotas de tinta.',
      'Finalize com a sua tag no canto inferior direito em azul cobalto ou branco com traço rápido.'
    ],
    proTips: [
      'O Power Outline Verde faz a peça saltar literalmente 10cm para fora do muro cinza ou tijolo.',
      'Tire uma foto com a câmera na mesma altura do ponto de fuga para capturar a máxima ilusão 3D!'
    ],
    mistakesToAvoid: [
      'Não cole o power outline verde encostado no contorno preto; deixe a respiração de espaço para criar o efeito flutuante.'
    ]
  }
];

export const GRAFFITI_STEPS_NATURE: GraffitiStep[] = [
  {
    id: 1,
    title: 'Paisagem Abstrata de Fundo (Sol Poente Vermelho & Ondas Azuis)',
    phase: 'Fase 1: Atmosfera Orgânica',
    colorUsed: 'Vermelho Solar e Azul Marinho',
    accentColor: '#ef4444',
    capRecommended: 'Fat Cap (Level 5 ou New York Fat)',
    sprayDistance: '25cm a 35cm com movimento em leque',
    pressure: 'Média-alta com lata em movimento rápido',
    summary: 'Construa a paisagem abstrata no muro: um disco solar vermelho quente e faixas onduladas azuis que criam a sensação de terra, água e horizonte.',
    detailedSteps: [
      'Trace um grande semicírculo abstrato em Vermelho Fogo na parte superior central (simbolizando o pôr do sol irradiando calor).',
      'Na base da parede, aplique ondas horizontais fluidas em Azul Cobalto e Azul Petróleo (evocando água e frescor).',
      'Deixe a área central respirar com respingos atmosféricos para receber as letras e folhagens.',
      'Essa paisagem de fundo cria o contraste de temperatura perfeito antes de inserir as folhas verdes.'
    ],
    proTips: [
      'Pulverize o vermelho em degradê circular de dentro para fora para dar sensação de irradiação solar.',
      'Mantenha as camadas do fundo bem finas para que as letras cubram a parede sem relevos indesejados.'
    ],
    mistakesToAvoid: [
      'Não sature o fundo com detalhes demais; o fundo deve ser suave para não disputar atenção com as folhas.'
    ]
  },
  {
    id: 2,
    title: 'Esboço das Letras Entrelaçadas com Folhas (Bio-Wildstyle)',
    phase: 'Fase 2: Anatomia Botânica',
    colorUsed: 'Verde Musgo Claro ou Amarelo Giz',
    accentColor: '#10b981',
    capRecommended: 'Skinny Cap Alemão',
    sprayDistance: '15cm da parede',
    pressure: 'Leve e precisa',
    summary: 'Desenhe as letras customizadas com aberturas e conexões por onde as folhas e cipós 3D vão passar.',
    detailedSteps: [
      'Desenhe a estrutura básica das letras escolhidas com hastes chanfradas.',
      'Nas junções das letras, desenhe silhuetas de folhas de costela-de-adão (Monstera) com cortes ovais característicos.',
      'Faça folhas longas de palmeira tropical saindo do topo das letras e abraçando a curvatura externa.',
      'Projete cipós finos que "enrolam" nas barras das letras, entrando pela frente e saindo por trás no espaço 3D.'
    ],
    proTips: [
      'O segredo do entrelaçamento natural é a alternância: uma folha passa por cima da letra, a próxima folha passa por trás.',
      'Varie o tamanho das folhas: 2 folhas grandes protagonistas e 4 a 6 folhas menores secundárias.'
    ],
    mistakesToAvoid: [
      'Não desenhe todas as folhas na mesma direção; aponte as folhas em leque radial para criar dinamismo botânico.'
    ]
  },
  {
    id: 3,
    title: 'Preenchimento das Folhas: O Gradiente Verde Esmeralda & Limão',
    phase: 'Fase 3: Vida Clorofila',
    colorUsed: 'Verde Esmeralda Profundo + Verde Limão Neon',
    accentColor: '#22c55e',
    capRecommended: 'Soft Cap para fusão ou Skinny Cap para nervuras',
    sprayDistance: '10cm a 15cm',
    pressure: 'Média com pulso inclinado a 45°',
    summary: 'Dê volume e textura natural às folhas com transição suave de verde escuro na base para verde ácido na ponta.',
    detailedSteps: [
      'Aplique o Verde Esmeralda na base da folha e próximo ao talo central.',
      'Puxe o Verde Limão Neon na ponta e nas bordas da folha com passadas rápidas em direção ao centro.',
      'Para as nervuras principais, pulverize uma linha fina de verde limão com a lata a 8cm da parede.',
      'No verso das folhas que estão viradas, use toques de azul cobalto para simular sombra botânica natural.'
    ],
    proTips: [
      'Use um pedaço de papelão curvado para apoiar a borda da folha e criar um corte perfeitamente afiado com spray.',
      'Deixe uma pequena fresta clara entre os gomos das folhas de Monstera para dar sensação de luz solar filtrada.'
    ],
    mistakesToAvoid: [
      'Evite pintar a folha com uma cor sólida uniforme; folhas sem degradê perdem o aspecto vivo e parecem adesivos planos.'
    ]
  },
  {
    id: 4,
    title: 'Preenchimento das Letras com Contraste Vermelho Solar & Azul Fundo',
    phase: 'Fase 4: Harmonia Floral',
    colorUsed: 'Vermelho Fogo Intenso + Azul Cobalto Real',
    accentColor: '#ef4444',
    capRecommended: 'Fat Cap para as barras + Skinny para o corte',
    sprayDistance: '12cm a 18cm',
    pressure: 'Contínua',
    summary: 'Pinte as letras com o degradê quente no topo e frio na base, fazendo o verde das folhas se destacar com força máxima.',
    detailedSteps: [
      'Pinte o terço superior das letras com Vermelho Fogo, aproveitando o calor visual do sol poente do fundo.',
      'Pinte a metade inferior das letras com Azul Cobalto, criando uma base sólida e densa.',
      'Onde as folhas tocam as letras, "corte" o spray para que a folha fique limpa na frente da letra.',
      'O verde da folhagem ganha vida triplicada ao ficar posicionado exatamente contra o vermelho e azul da letra (contraste complementar).'
    ],
    proTips: [
      'Pinte as letras primeiro e retoque as folhas depois para que as folhas fiquem nitidamente na camada da frente.'
    ],
    mistakesToAvoid: [
      'Não pulverize vermelho sobre o verde limão sem máscara, pois criará um marrom escuro indesejado.'
    ]
  },
  {
    id: 5,
    title: 'Sombreamento 3D das Folhas & Oclusão sobre as Letras',
    phase: 'Fase 5: Profundidade e Relevo',
    colorUsed: 'Azul Escuro / Preto Transparente de Sombra',
    accentColor: '#1d4ed8',
    capRecommended: 'Skinny Pro ou Soft Cap',
    sprayDistance: '15cm com lata inclinada para trás',
    pressure: 'Muito baixa (leve toque na válvula)',
    summary: 'O segredo da profundidade realista: folhas projetando sombras físicas na superfície das letras.',
    detailedSteps: [
      'Imagine a luz do sol vindo de cima a 45 graus.',
      'Na letra que está logo abaixo de cada folha, aplique uma sombra difusa em Azul Escuro a 1cm da borda da folha.',
      'Essa sombra de oclusão (Drop Shadow) faz a folha parecer estar flutuando fisicamente 5 centímetros à frente da letra.',
      'Aplique também uma sombra profunda na dobra inferior de cada folha para dar volume tridimensional à lâmina foliar.'
    ],
    proTips: [
      'A sombra deve ser sempre esfumada e suave, nunca uma linha preta dura.',
      'Use o Azul Escuro em vez de preto puro para fazer a sombra; o azul reflete o céu e cria uma sombra muito mais rica e artística.'
    ],
    mistakesToAvoid: [
      'Não faça sombras em direções opostas; todas as sombras devem cair para baixo e para a direita.'
    ]
  },
  {
    id: 6,
    title: 'Extrusão 3D das Letras & Cipós Tridimensionais',
    phase: 'Fase 6: Bloco e Volume Orgânico',
    colorUsed: 'Azul Noite Profundo + Verde Oliva nas bordas',
    accentColor: '#0f172a',
    capRecommended: 'Skinny Cap',
    sprayDistance: '10cm da parede',
    pressure: 'Média controlada',
    summary: 'Projete os blocos 3D das letras em direção ao ponto de fuga e dê espessura cilíndrica aos cipós.',
    detailedSteps: [
      'Puxe as linhas de profundidade das letras em direção ao ponto de fuga com 15cm a 20cm de espessura.',
      'Nos cipós, desenhe anéis cilíndricos com luz na borda superior e sombra na borda inferior para que pareçam cordas vivas tridimensionais.',
      'As faces das letras que ficam voltadas para cima recebem um toque de verde reflexivo da vegetação ao redor.'
    ],
    proTips: [
      'Os cipós tridimensionais ajudam a mascarar quinas de difícil perspectiva e amarram a composição.'
    ],
    mistakesToAvoid: [
      'Não deixe o bloco 3D das letras plano; dê variação de luz entre as faces superiores e laterais.'
    ]
  },
  {
    id: 7,
    title: 'Contorno Mestre Orgânico & Recortes Cirúrgicos',
    phase: 'Fase 7: Delineamento Botânico',
    colorUsed: 'Preto Fosco de Alta Cobertura',
    accentColor: '#020617',
    capRecommended: 'German Skinny ou Pocket Cap',
    sprayDistance: '6cm a 8cm com passada firme',
    pressure: 'Cirúrgica e rápida',
    summary: 'Defina os limites de cada recorte de folha, nervuras e contornos frontais das letras.',
    detailedSteps: [
      'Contorne as folhas com um traço preto fino e flexível de 6mm a 8mm, acompanhando as curvas orgânicas.',
      'Desenhe as nervuras secundárias com traços finos e curtos que morrem suavemente no interior da folha.',
      'Contorne as letras com o contorno mestre mais encorpado de 12mm a 15mm para manter o peso do grafite de rua.',
      'Recorte qualquer spray que tenha vazado entre as folhas para deixar o recorte botânico impecável.'
    ],
    proTips: [
      'Nas pontas das folhas, termine o traço levantando o spray da parede com um golpe seco (flick) para deixar a ponta pontiaguda como um espinho.'
    ],
    mistakesToAvoid: [
      'Não faça as nervuras das folhas grossas demais; elas devem ser sutis para não poluir a folhagem.'
    ]
  },
  {
    id: 8,
    title: 'Highlights de Orvalho, Luz Zenital & Power Outline Verde',
    phase: 'Fase 8: Orvalho e Brilho',
    colorUsed: 'Branco Puro de Alta Opacidade + Verde Fluorescente',
    accentColor: '#ffffff',
    capRecommended: 'Super Skinny ou Needle Cap',
    sprayDistance: '5cm a 8cm',
    pressure: 'Toque seco e rápido',
    summary: 'Gotas de orvalho reluzentes sobre as folhas e uma aura verde que faz a natureza e as letras saltarem da parede.',
    detailedSteps: [
      'Pinte pequenas gotas de orvalho circulares brancas nas pontas das folhas com um pontinho de luz especular.',
      'Puxe uma linha de brilho fina branca no bordo superior das folhas mais iluminadas pelo sol poente.',
      'Finalize com o Power Outline externo em Verde Limão Neon contornando todo o conjunto botânico a 2cm de distância.',
      'Adicione respingos de névoa matinal em azul claro e verde na base da composição.'
    ],
    proTips: [
      'A gota de orvalho é simples de fazer: uma meia-lua escura embaixo e um pontinho branco puro em cima.',
      'O Power Outline Verde une as letras e as folhas em uma única silhueta impactante à distância!'
    ],
    mistakesToAvoid: [
      'Não espalhe brilho branco aleatório; coloque luz apenas onde o sol atinge as folhas diretamente.'
    ]
  }
];

export const GRAFFITI_STEPS_GEOMETRIC: GraffitiStep[] = [
  {
    id: 1,
    title: 'O Grid Isométrico & Eixos de Perspectiva Angular',
    phase: 'Fase 1: Engenharia Geométrica',
    colorUsed: 'Spray Guia Cinza Claro ou Giz',
    accentColor: '#06b6d4',
    capRecommended: 'Skinny Cap com fita crepe ou régua de madeira',
    sprayDistance: '20cm da parede',
    pressure: 'Baixa e suave',
    summary: 'Marque os eixos de 30°, 60° e 90° que regem a composição geométrica tridimensional.',
    detailedSteps: [
      'Marque o centro da parede e trace três eixos isométricos principais: uma linha vertical e duas linhas inclinadas a 30 graus.',
      'Defina as posições dos 3 triângulos protagonistas (grande, médio e pequeno) criando um equilíbrio assimétrico dinâmico.',
      'Marque os centros onde ficarão as esferas flutuantes azuis e os cubos verdes.',
      'Todas as linhas paralelas na composição devem respeitar os mesmos ângulos isométricos para gerar a ilusão de arquitetura no ar.'
    ],
    proTips: [
      'Corte uma régua de papelão com ângulo de 60 graus para usar como gabarito rápido em todo o muro.',
      'A geometria precisa de linhas retas; apoie o braço ou use uma fita adesiva para demarcar os eixos mestres.'
    ],
    mistakesToAvoid: [
      'Não faça linhas tortas ou com ângulos arbitrários; pequenas imperfeições no grid quebram a ilusão 3D de precisão cirúrgica.'
    ]
  },
  {
    id: 2,
    title: 'Composição de Formas: Triângulos Flutuantes & Esferas 3D',
    phase: 'Fase 2: Arquitetura Espacial',
    colorUsed: 'Tinta base clara',
    accentColor: '#f59e0b',
    capRecommended: 'Skinny Cap',
    sprayDistance: '15cm da parede',
    pressure: 'Média',
    summary: 'Construa os prismas triangulares facetados e posicione as esferas em diferentes planos de profundidade.',
    detailedSteps: [
      'Desenhe o triângulo principal em formato de prisma oco (moldura triangular 3D com vértice superior apontado para cima).',
      'Desenhe um segundo triângulo invertido em plano intermediário, trespassando o primeiro.',
      'Marque círculos perfeitos para as esferas: uma esfera grande em primeiro plano e duas menores no fundo para criar escala de distância.',
      'Conecte as formas com faixas e fitas de velocidade poligonais.'
    ],
    proTips: [
      'Para fazer círculos perfeitos no muro, use um pedaço de barbante com giz ou recorte um stencil circular em papelão resistente.',
      'Sobreponha as formas: faça a esfera azul passar por dentro do prisma triangular vermelho!'
    ],
    mistakesToAvoid: [
      'Não posicione todos os elementos na mesma linha reta; crie uma diagonal dinâmica que guie o olhar do observador.'
    ]
  },
  {
    id: 3,
    title: 'Pintando as Esferas Azuis com Spray 3D (Gradiente Esférico)',
    phase: 'Fase 3: Volume Volumétrico Curvo',
    colorUsed: 'Azul Real, Azul Cobalto & Azul Noite',
    accentColor: '#1d4ed8',
    capRecommended: 'Soft Cap com controle de pressão',
    sprayDistance: '10cm a 15cm com movimento orbital em arco',
    pressure: 'Modulada do centro para a borda',
    summary: 'Como criar uma esfera perfeita que parece saltar para fora do muro com spray.',
    detailedSteps: [
      'Preencha o círculo base com Azul Cobalto suave.',
      'Para criar a sombra da esfera: pulverize Azul Noite em formato de crescente (meia-lua) na parte inferior direita.',
      'Para a luz: pulverize Azul Claro ou Ciano no quadrante superior esquerdo (onde a luz incide).',
      'Aplique a luz refletida (bounce light): dê uma leve névoa de verde limão na borda escura inferior da esfera (simulando a luz rebatida do chão!).'
    ],
    proTips: [
      'O segredo da esfera tridimensional é a luz refletida: nunca deixe a borda inferior 100% preta; deixe um milímetro de luz rebatida.',
      'Segure o stencil circular de papelão a 2cm da parede para criar uma borda ligeiramente suave e realista.'
    ],
    mistakesToAvoid: [
      'Não faça passadas retas dentro da esfera; todo movimento do braço deve ser curvo acompanhando o raio do círculo.'
    ]
  },
  {
    id: 4,
    title: 'Extrusão dos Prismas Triangulares em Vermelho Fogo',
    phase: 'Fase 4: Arestas Facetadas',
    colorUsed: 'Vermelho Vivo, Vermelho Escuro & Vinho',
    accentColor: '#ef4444',
    capRecommended: 'Skinny Cap com máscara de mão',
    sprayDistance: '8cm a 12cm',
    pressure: 'Média-alta com velocidade constante',
    summary: 'Aplique a técnica de faces planas 3D: cada face do triângulo deve ter um tom de vermelho diferente para criar volume facetado.',
    detailedSteps: [
      'Face Superior (Face Iluminada): preencha com Vermelho Vivo e toques de Laranja no ápice superior.',
      'Face Lateral Direita (Face Intermediária): preencha com Vermelho Carmim padrão.',
      'Face Inferior / Interna (Face de Sombra): preencha com Vermelho Escuro ou Vinho misturado com azul cobalto.',
      'O contraste drástico de luminosidade entre as três faces do triângulo faz com que o cérebro humano leia instantaneamente uma estrutura sólida de aço vermelho!'
    ],
    proTips: [
      'Use uma lâmina de papelão (cardboard shield) colada na aresta enquanto borrifa; ao retirar, você terá uma quina com precisão a laser!',
      'Mantenha a transição entre as faces completamente nítida.'
    ],
    mistakesToAvoid: [
      'Não pinte todas as faces do triângulo com a mesma tonalidade de vermelho; sem contraste tonal, ele parecerá um desenho plano 2D.'
    ]
  },
  {
    id: 5,
    title: 'Linhas Dinâmicas de Velocidade & Setas Isométricas em Verde Neon',
    phase: 'Fase 5: Energia Cinética',
    colorUsed: 'Verde Limão Elétrico / Ácido Neon',
    accentColor: '#22c55e',
    capRecommended: 'Skinny Universal ou Astro Fat com stencil de linha',
    sprayDistance: '6cm a 10cm',
    pressure: 'Alta com puxada rápida do braço',
    summary: 'Insira linhas dinâmicas de aceleração (speed lines), cubos flutuantes e setas isométricas em verde que cortam o espaço.',
    detailedSteps: [
      'Puxe feixes de linhas paralelas em Verde Neon cruzando diagonalmente de trás do triângulo vermelho até a frente da esfera azul.',
      'Desenhe pequenos cubos isométricos verdes flutuantes em tamanhos decrescentes para sugerir uma explosão de estilhaços geométricos.',
      'Faça setas de vetor 3D com pontas chanfradas apontando para o centro focal da composição.',
      'O Verde Limão conecta a alta energia do vermelho com a serenidade fria do azul, criando equilíbrio cinético absoluto.'
    ],
    proTips: [
      'Faça as linhas de velocidade com um golpe contínuo e rápido do antebraço sem parar no meio do traço.',
      'Varie as espessuras das linhas verdes: linhas grossas de 20mm alternadas com linhas finas de 5mm.'
    ],
    mistakesToAvoid: [
      'Não cruze linhas verdes aleatoriamente em ângulos caóticos; todas devem seguir o mesmo vetor de movimento da composição.'
    ]
  },
  {
    id: 6,
    title: 'Sombras Projetadas no Muro (Drop Shadows Flutuantes)',
    phase: 'Fase 6: Ilusão de Levitação',
    colorUsed: 'Preto Fosco Diluído ou Azul Noite Escuro',
    accentColor: '#0f172a',
    capRecommended: 'Soft Cap com distância recuada',
    sprayDistance: '20cm a 25cm da parede',
    pressure: 'Muito baixa (névoa suave)',
    summary: 'A técnica definitiva que faz as formas geométricas parecerem estar flutuando a 30cm para fora do muro de concreto.',
    detailedSteps: [
      'Projete a sombra de cada triângulo e esfera na superfície cinza da parede, deslocada 10cm para a direita e 10cm para baixo.',
      'A sombra da esfera deve ser uma elipse achatada e difusa projetada no plano do fundo.',
      'A sombra do triângulo deve reproduzir o contorno triangular com bordas semi-esfumadas.',
      'Quando o observador vê a forma nítida na frente e a sombra projetada no fundo da parede, o efeito de levitação ótica é imediato!'
    ],
    proTips: [
      'Quanto mais longe a sombra estiver do objeto, mais "alto" o objeto parecerá estar flutuando no ar.',
      'Mantenha a sombra mais escura perto do objeto e mais clara/difusa nas bordas externas.'
    ],
    mistakesToAvoid: [
      'Não faça a sombra preta opaca sólida como se fosse outro objeto; a sombra deve ser uma névoa transparente que revela a textura da parede por baixo.'
    ]
  },
  {
    id: 7,
    title: 'Contornos Cirúrgicos & Areamentos com Máscara de Papelão',
    phase: 'Fase 7: Precisão Industrial',
    colorUsed: 'Preto Profundo Sem Brilho',
    accentColor: '#020617',
    capRecommended: 'German Skinny Cap',
    sprayDistance: '5cm a 8cm',
    pressure: 'Cirúrgica',
    summary: 'Selo das arestas e separação entre as camadas sobrepostas com precisão geométrica.',
    detailedSteps: [
      'Trace todas as arestas principais dos prismas com linha preta reta de 8mm a 10mm.',
      'Onde o triângulo passa na frente da esfera azul, use o contorno preto para fazer um recorte perfeitamente limpo.',
      'Contorne os cubos isométricos verdes com linhas pretas finas e pontas limpas.',
      'Limpe qualquer pulverização que tenha vazado nas áreas de sombra do muro.'
    ],
    proTips: [
      'Mantenha a lata a 90 graus perpendicular exata da parede para o traço não abrir em leque.',
      'Use papelão como régua de mão se precisar de linhas perfeitamente retas em extensões de mais de 1 metro.'
    ],
    mistakesToAvoid: [
      'Não hesite nem balance o spray no meio de uma linha reta longa.'
    ]
  },
  {
    id: 8,
    title: 'Brilhos Especulares Esmaltados & Halos de Neon Geométrico',
    phase: 'Fase 8: Finalização Especular',
    colorUsed: 'Branco Puro Brilhante + Verde Neon Fluorescente',
    accentColor: '#ffffff',
    capRecommended: 'Super Skinny ou Needle Cap',
    sprayDistance: '4cm a 6cm',
    pressure: 'Toque seco instantâneo (Micro-puffs)',
    summary: 'Aplique o ponto de brilho especular que dá aspecto vitrificado ou metálico às esferas e prismas.',
    detailedSteps: [
      'Na esfera azul, aplique um ponto branco puro e nítido no ápice superior esquerdo, acompanhado de uma estrela de luz de 4 pontas.',
      'Nas quinas afiadas dos triângulos vermelhos, puxe uma linha fina branca de brilho (chisel highlight) nas arestas que recebem a luz direta.',
      'Aplique uma névoa externa em Verde Limão Neon ao redor de certas arestas dos triângulos para simular lâmpadas de neon brilhando.',
      'Adicione pequenos pontos brancos estelares flutuando no espaço geométrico para criar sensação de universo cibernético abstrato.'
    ],
    proTips: [
      'O brilho especular branco deve ser bem pontual: 1 único ponto branco concentrado dá mais sensação de esfera do que uma mancha grande.',
      'Tire uma foto com a iluminação do pôr do sol ou luz noturna de rua para ver o contraste estourar!'
    ],
    mistakesToAvoid: [
      'Não coloque brilho branco em faces sombreadas voltadas para baixo.'
    ]
  }
];


import { ColorwayPreset, CustomPalette } from '../types/graffiti';

export const DEFAULT_PALETTE: CustomPalette = {
  topFill: '#ef4444',
  bottomFill: '#1d4ed8',
  extrusion3d: '#0f172a',
  powerGreen: '#22c55e',
  outline: '#020617',
  highlights: '#ffffff',
  halo: '#4ade80'
};

export const COLORWAY_PRESETS: ColorwayPreset[] = [
  {
    id: 'rgb-classic',
    name: 'RGB Original (Fogo & Gelo)',
    tag: 'Clássico 3D',
    description: 'A combinação solicitada: Vermelho Fogo, Azul Cobalto profundo e Verde Limão elétrico para corte e halo.',
    palette: {
      topFill: '#ef4444',
      bottomFill: '#1d4ed8',
      extrusion3d: '#0f172a',
      powerGreen: '#22c55e',
      outline: '#020617',
      highlights: '#ffffff',
      halo: '#4ade80'
    }
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Tokyo',
    tag: 'Ultra Neon',
    description: 'Rosa choque incandescente no topo, ciano elétrico na base e verde ácido de alta vibração.',
    palette: {
      topFill: '#ec4899',
      bottomFill: '#06b6d4',
      extrusion3d: '#1e1b4b',
      powerGreen: '#84cc16',
      outline: '#020617',
      highlights: '#ffffff',
      halo: '#22d3ee'
    }
  },
  {
    id: 'sunset-safari',
    name: 'Sunset Tropical',
    tag: 'Pôr do Sol',
    description: 'Laranja vulcânico ardente com roxo noturno na base e amarelo canário em cortes de luz.',
    palette: {
      topFill: '#f97316',
      bottomFill: '#7e22ce',
      extrusion3d: '#2e1065',
      powerGreen: '#eab308',
      outline: '#0f172a',
      highlights: '#ffffff',
      halo: '#facc15'
    }
  },
  {
    id: 'toxic-acid',
    name: 'Tóxico Nuclear',
    tag: 'Bio-Hazard',
    description: 'Verde limão ácido radioativo fundindo em azul turquesa com toques de violeta elétrico.',
    palette: {
      topFill: '#84cc16',
      bottomFill: '#0284c7',
      extrusion3d: '#091e42',
      powerGreen: '#a855f7',
      outline: '#020617',
      highlights: '#ffffff',
      halo: '#22c55e'
    }
  },
  {
    id: 'vampire-dark',
    name: 'Vampiro Underground',
    tag: 'Gótico Urbano',
    description: 'Carmim sangue profundo com preto tarblack de carvão e acentos em prata metálico.',
    palette: {
      topFill: '#dc2626',
      bottomFill: '#450a0a',
      extrusion3d: '#020617',
      powerGreen: '#94a3b8',
      outline: '#000000',
      highlights: '#ffffff',
      halo: '#ef4444'
    }
  },
  {
    id: 'gold-chrome',
    name: 'Ouro & Asfalto Street',
    tag: 'Monocromo Nobre',
    description: 'Dourado metálico street com asfalto profundo e branco titânio especular.',
    palette: {
      topFill: '#d97706',
      bottomFill: '#334155',
      extrusion3d: '#0a0d14',
      powerGreen: '#fbbf24',
      outline: '#020617',
      highlights: '#ffffff',
      halo: '#f59e0b'
    }
  }
];

export const FULL_SPRAY_PALETTE: SprayCan[] = [
  // Vermelhos & Laranjas
  {
    id: 'can-red-fire',
    name: 'Molotow Flame Red',
    colorName: 'Vermelho Fogo Intenso',
    hex: '#ef4444',
    tone: 'red',
    roleInDesign: 'Preenchimento superior quente e projeção 3D frontal',
    recommendedCap: 'Fat Cap Level 5',
    pressureType: 'Alta Pressão'
  },
  {
    id: 'can-red-blood',
    name: 'Montana Black Blood Red',
    colorName: 'Carmim Sangue Profundo',
    hex: '#b91c1c',
    tone: 'red',
    roleInDesign: 'Sombra quente e faces inferiores de prismas',
    recommendedCap: 'Skinny Pro',
    pressureType: 'Média Pressão'
  },
  {
    id: 'can-orange-volcano',
    name: 'Ironlak Volcano Orange',
    colorName: 'Laranja Vulcão Brasa',
    hex: '#f97316',
    tone: 'orange',
    roleInDesign: 'Transição solar e iluminação do pôr do sol',
    recommendedCap: 'Fat Cap',
    pressureType: 'Alta Pressão'
  },
  {
    id: 'can-orange-peach',
    name: 'Loop Peach Neon',
    colorName: 'Coral Pêssego',
    hex: '#fb923c',
    tone: 'orange',
    roleInDesign: 'Biséis quentes e brilhos intermediários',
    recommendedCap: 'Soft Cap',
    pressureType: 'Baixa Pressão'
  },
  // Amarelos
  {
    id: 'can-yellow-chrome',
    name: 'MTN 94 Chrome Yellow',
    colorName: 'Amarelo Cromo Ouro',
    hex: '#eab308',
    tone: 'yellow',
    roleInDesign: 'Ápice da luz solar e setas de vetor',
    recommendedCap: 'Skinny Universal',
    pressureType: 'Baixa Pressão'
  },
  {
    id: 'can-yellow-neon',
    name: 'Molotow Shock Yellow',
    colorName: 'Amarelo Canário Neon',
    hex: '#facc15',
    tone: 'yellow',
    roleInDesign: 'Linhas de velocidade e estrelas de brilho',
    recommendedCap: 'Super Skinny',
    pressureType: 'Média Pressão'
  },
  // Verdes
  {
    id: 'can-green-lime',
    name: 'Loop Colors Acid Lime',
    colorName: 'Verde Limão Elétrico',
    hex: '#84cc16',
    tone: 'green',
    roleInDesign: 'Power Outline, corte elétrico e pontas de folhas',
    recommendedCap: 'Skinny Universal & Fat',
    pressureType: 'Média Pressão'
  },
  {
    id: 'can-green-neon',
    name: 'Montana Gold Greenery',
    colorName: 'Verde Ácido Neon',
    hex: '#22c55e',
    tone: 'green',
    roleInDesign: 'Halo externo, cipós 3D e nervuras botânicas',
    recommendedCap: 'Fat Cap para Halo',
    pressureType: 'Alta Pressão'
  },
  {
    id: 'can-green-emerald',
    name: 'Kobra Paint Emerald Jungle',
    colorName: 'Verde Esmeralda Selva',
    hex: '#10b981',
    tone: 'green',
    roleInDesign: 'Base de folhas de Monstera e sombras de vegetação',
    recommendedCap: 'Soft Cap',
    pressureType: 'Média Pressão'
  },
  {
    id: 'can-green-mint',
    name: 'MTN 94 Pastel Mint',
    colorName: 'Menta Suave Glacial',
    hex: '#6ee7b7',
    tone: 'green',
    roleInDesign: 'Reflexos de folhas e luz rebatida',
    recommendedCap: 'Skinny Pro',
    pressureType: 'Baixa Pressão'
  },
  // Azuis & Cianos
  {
    id: 'can-cyan-electric',
    name: 'Ironlak Electric Cyan',
    colorName: 'Ciano Neon Brilhante',
    hex: '#06b6d4',
    tone: 'cyan',
    roleInDesign: 'Luz reflexiva de céu e linhas de fuga',
    recommendedCap: 'Skinny Pro',
    pressureType: 'Média Pressão'
  },
  {
    id: 'can-blue-turquoise',
    name: 'Montana Black Turquoise',
    colorName: 'Azul Turquesa Real',
    hex: '#0284c7',
    tone: 'blue',
    roleInDesign: 'Fusão central e ondas marinhas abstratas',
    recommendedCap: 'Fat Cap',
    pressureType: 'Alta Pressão'
  },
  {
    id: 'can-blue-cobalt',
    name: 'Molotow Shock Blue Middle',
    colorName: 'Azul Cobalto Profundo',
    hex: '#2563eb',
    tone: 'blue',
    roleInDesign: 'Preenchimento base frio e recuo óptico',
    recommendedCap: 'Skinny Pro & Soft Cap',
    pressureType: 'Média Pressão'
  },
  {
    id: 'can-blue-night',
    name: 'Loop Colors Midnight Blue',
    colorName: 'Azul Noite / Fosso 3D',
    hex: '#1d4ed8',
    tone: 'blue',
    roleInDesign: 'Faces de sombra do bloco 3D e sombras de oclusão',
    recommendedCap: 'Skinny Cap Alemão',
    pressureType: 'Baixa Pressão'
  },
  // Roxos & Rosas
  {
    id: 'can-purple-electric',
    name: 'Montana Gold Electric Purple',
    colorName: 'Roxo Elétrico / Violeta',
    hex: '#9333ea',
    tone: 'purple',
    roleInDesign: 'Fusão mágica entre vermelho e azul',
    recommendedCap: 'Soft Cap',
    pressureType: 'Média Pressão'
  },
  {
    id: 'can-purple-dark',
    name: 'Ironlak Deep Plum',
    colorName: 'Violeta Noturno Abstrato',
    hex: '#7e22ce',
    tone: 'purple',
    roleInDesign: 'Sombras profundas de prismas e fendas 3D',
    recommendedCap: 'Skinny Pro',
    pressureType: 'Baixa Pressão'
  },
  {
    id: 'can-pink-hot',
    name: 'Molotow Shock Pink',
    colorName: 'Rosa Choque / Magenta',
    hex: '#ec4899',
    tone: 'pink',
    roleInDesign: 'Pontos focais quentes e linhas cinéticas',
    recommendedCap: 'Skinny Universal',
    pressureType: 'Alta Pressão'
  },
  {
    id: 'can-pink-coral',
    name: 'MTN 94 Vivid Coral',
    colorName: 'Coral Vivo Intenso',
    hex: '#f43f5e',
    tone: 'pink',
    roleInDesign: 'Cortes de energia e detalhes secundários',
    recommendedCap: 'Super Skinny',
    pressureType: 'Baixa Pressão'
  },
  // Neutros, Metais & Contorno
  {
    id: 'can-gold-street',
    name: 'Montana Gold Metallic',
    colorName: 'Dourado Metálico Street',
    hex: '#d97706',
    tone: 'gold',
    roleInDesign: 'Biséis nobres e reflexos de aresta',
    recommendedCap: 'Skinny Pro',
    pressureType: 'Média Pressão'
  },
  {
    id: 'can-silver-chrome',
    name: 'Molotow Burner Chrome Silver',
    colorName: 'Prata Cromo Espelhado',
    hex: '#94a3b8',
    tone: 'grey',
    roleInDesign: 'Reflexos metálicos industriais',
    recommendedCap: 'Fat Cap ou Skinny',
    pressureType: 'Alta Pressão'
  },
  {
    id: 'can-white-titanium',
    name: 'Signal White / Titânio Puro',
    colorName: 'Branco Titânio Especular',
    hex: '#ffffff',
    tone: 'white',
    roleInDesign: 'Highlights, estrelas de luz e gotas de orvalho',
    recommendedCap: 'Super Skinny / Needle Cap',
    pressureType: 'Baixa Pressão'
  },
  {
    id: 'can-black-tar',
    name: 'Tarblack / Nitro 2G Preto Fosco',
    colorName: 'Preto Tarblack Cirúrgico',
    hex: '#090d16',
    tone: 'black',
    roleInDesign: 'Master outline, cortes de separação e sombra de queda',
    recommendedCap: 'German Skinny ou Pocket Cap',
    pressureType: 'Baixa Pressão'
  }
];

export const SPRAY_CANS: SprayCan[] = FULL_SPRAY_PALETTE;

export const SPRAY_CAPS: SprayCap[] = [
  {
    id: 'fat-cap',
    name: 'New York Fat Cap',
    strokeWidth: '4cm a 10cm',
    pressure: 'Alta Vazão',
    bestFor: 'Preenchimento rápido de fundos e gradientes suaves de grandes áreas',
    iconType: 'fat'
  },
  {
    id: 'skinny-cap',
    name: 'German Skinny Cap',
    strokeWidth: '1cm a 2.5cm',
    pressure: 'Baixa Vazão',
    bestFor: 'Contornos nítidos (Master Outline), cortes limpos e detalhes estruturais',
    iconType: 'skinny'
  },
  {
    id: 'soft-cap',
    name: 'Grey Soft Cap',
    strokeWidth: '2cm a 4cm',
    pressure: 'Média Suave',
    bestFor: 'Fusão de degradês, esfumados de sombra e transição de cores',
    iconType: 'soft'
  },
  {
    id: 'needle-cap',
    name: 'Needle / Pipe Cap',
    strokeWidth: 'Fino com respingo',
    pressure: 'Foco à distância',
    bestFor: 'Gotas, splatters, efeitos de spray distante e detalhes estilizados',
    iconType: 'needle'
  },
  {
    id: 'calligraphy-cap',
    name: 'Transversal Chisel Cap',
    strokeWidth: 'Leque Plano Caligráfico (1cm a 6cm)',
    pressure: 'Alta Precisão Angular',
    bestFor: 'Tags estilo caligrafia, preenchimento chanfrado e cortes em ângulo de 45°',
    iconType: 'calligraphy'
  },
  {
    id: 'splatter-cap',
    name: 'Dirty Splatter Cap',
    strokeWidth: 'Respingo Texturizado & Gotas',
    pressure: 'Vazão Descontínua',
    bestFor: 'Efeitos de respingo urbano, textura de asfalto, sujeira street e estrelas de fundo',
    iconType: 'splatter'
  }
];
