import { Language } from '../utils/translations';

export type ForecastInsight = {
    title: string;
    overview: string;
    career: string;
    love: string;
    oracleWarning: string;
    luckyDays: number[];
    description?: string;
};

type InsightMap = Record<number, ForecastInsight>;
type LocalizedInsights = Record<string, InsightMap>;

export const PersonalYearInsights: LocalizedInsights = {
    English: {
        1: { 
            title: "The Seed of New Beginnings", 
            overview: "This is a year of initiation, planting seeds, and taking bold action. You are entering a new nine-year cycle, making this the optimal time to claim your independence and redefine your path. Courage and self-reliance will be your greatest assets.",
            career: "Opportunities for promotion, starting a business, or branching out independently are exceptionally high. Take calculated risks and do not wait for others to give you permission to lead.",
            love: "You may feel more focused on your own needs and boundaries, which can shift relationship dynamics. It is a time to attract partners who respect your autonomy or to assert your individuality in existing bonds.",
            oracleWarning: "Beware of arrogance and impatience; progress requires you to lead, not simply to demand.",
            luckyDays: [1, 10, 28]
        },
        2: { 
            title: "Cultivation & Connection", 
            overview: "After the intense push of a Year 1, this period demands patience, intuition, and collaboration. It is a time to build deep bonds, refine your plans, and let the seeds you planted begin to sprout quietly. Diplomacy will open doors that force cannot.",
            career: "Focus on teamwork, partnerships, and negotiations rather than aggressive solo expansion. You may work behind the scenes, resolving conflicts and gathering essential support for future moves.",
            love: "This is one of the most favorable years for finding soul-deep love or harmonizing a current long-term relationship. Emotional sensitivity is heightened, requiring gentle communication.",
            oracleWarning: "Do not let hypersensitivity turn into resentment; speak your needs clearly instead of retreating into silence.",
            luckyDays: [2, 11, 20]
        },
        3: { 
            title: "Expression & Expansion", 
            overview: "Vibrant and highly creative, this year vibrates with social energy and self-expression. You are called to express your truth boldly, playfully explore the world, and share your unique voice. Joy and optimism are your guiding forces.",
            career: "Communication, art, and public-facing roles are immensely favored right now. Your charisma is magnetic—use it to pitch ideas, network, and inject creativity into your professional life.",
            love: "Your social circle will expand, bringing exciting but sometimes fleeting connections. In established relationships, prioritizing fun, humor, and open dialogue will rekindle magnetic sparks.",
            oracleWarning: "Avoid scattering your energy across too many frivolous pursuits; focus your creative fire to avoid burnout.",
            luckyDays: [3, 12, 21]
        },
        4: { 
            title: "Foundation & Fortitude", 
            overview: "This is the time to put down roots and establish unwavering order in your life. Stay disciplined, organize your physical and mental spaces, and master your craft. Hard work applied now will secure your foundation for years to come.",
            career: "Expect a demanding year that requires systematic effort, administration, and building solid structures. Wealth is accumulated through steady, practical investments rather than speculative risks.",
            love: "You seek stability and reliability above all else, making this a time to solidify commitments or end flighty flings. Shared responsibilities and practical support become your primary love languages.",
            oracleWarning: "Do not let discipline calcify into stubbornness; remember to build flexibility into your rigid structures.",
            luckyDays: [4, 13, 22]
        },
        5: { 
            title: "Freedom & Transformation", 
            overview: "Prepare for dynamic changes, thrilling adventures, and unexpected pivots. The structures you built last year will now serve as a launchpad for exploring new horizons. Embrace uncertainty, remain adaptable, and say yes to the unconventional.",
            career: "Travel, media, sales, and abrupt career shifts are highlighted, offering lucrative but spontaneous opportunities. Avoid getting locked into highly restrictive contracts during this high-momentum phase.",
            love: "A magnetic, sensual, and highly unpredictable year for romance, favoring exciting encounters over deep nesting. Existing partnerships must introduce variety and freedom to avoid a sense of claustrophobia.",
            oracleWarning: "Beware of impulsive decisions fueled purely by restlessness; seek freedom, but do not invite chaos.",
            luckyDays: [5, 14, 23]
        },
        6: { 
            title: "Harmony & Sanctuary", 
            overview: "Your focus will inevitably shift toward your home, family, and deep personal responsibilities. This is a deeply nurturing and healing year where your role as a caregiver and protector is highlighted. Creating aesthetic and emotional harmony is paramount.",
            career: "Service-oriented businesses, design, and community leadership roles will thrive under this supportive energy. Financial stability comes through trusted networks and providing genuine value to others.",
            love: "This is the quintessential year for marriage, family planning, or deepening domestic bliss. Your heart is wide open, but you must ensure you are not over-giving to those who drain your light.",
            oracleWarning: "Do not let your desire to heal others turn you into a martyr; set boundaries to protect your own sanctuary.",
            luckyDays: [6, 15, 24]
        },
        7: { 
            title: "Introspection & Awakening", 
            overview: "A deeply spiritual and analytical year that demands you look inward. Prioritize solitude, dive deep into esoteric or scientific studies, and let your intuition guide you. The external world takes a backseat to the vast universe within.",
            career: "Research, analysis, and specialized learning are highly favored over heavy networking or rapid expansion. Financial gains may slow slightly to allow you to focus on discovering your true life’s purpose.",
            love: "You may feel more withdrawn or require significant personal space, which can confuse a partner if not communicated. It is a time to attract deeply intellectual or spiritually aligned soul connections.",
            oracleWarning: "Do not let necessary introspection devolve into total isolation and cynical detachment from the world.",
            luckyDays: [7, 16, 25]
        },
        8: { 
            title: "Manifestation & Mastery", 
            overview: "Welcome to your harvest year. The karmic seeds you have sown over the past seven years will now bear fruit. Claim your personal power, step into executive authority, and master the material plane to manifest profound abundance.",
            career: "This is a powerhouse year for career advancement, major financial deals, and assuming leadership roles. Focus intensely on your ambitions; the universe is backing your boldest professional moves.",
            love: "Power dynamics in relationships will come to the forefront, requiring balance and mutual respect. You will attract ambitious partners, but you must ensure work does not completely eclipse your emotional availability.",
            oracleWarning: "Avoid ruthless ambition; true mastery requires you to balance your material wealth with spiritual integrity.",
            luckyDays: [8, 17, 26]
        },
        9: { 
            title: "Completion & Release", 
            overview: "You are experiencing profound closure, humanitarian expansion, and the letting go of what no longer serves you. Clear the slate fully—physically, emotionally, and spiritually—to prepare the ground for a powerful rebirth next year.",
            career: "Projects will naturally conclude, and you may feel the urge to transition out of roles that lack profound meaning. Charitable work, global ventures, and creative culmination are highly supported.",
            love: "Relationships that lack a soul-deep foundation will naturally dissolve, making way for higher aligned love. It is a period of forgiveness, releasing old grudges, and embracing unconditional compassion.",
            oracleWarning: "Do not cling desperately to what is naturally falling away; surrender is your greatest power this year.",
            luckyDays: [9, 18, 27]
        }
    },
    Spanish: {
        1: { 
            title: "La Semilla de los Nuevos Comienzos", 
            overview: "Este es un año de iniciación, siembra de semillas y acción audaz. Estás entrando en un nuevo ciclo de nueve años, lo que hace de este el momento óptimo para reclamar tu independencia y redefinir tu camino. El coraje y la autosuficiencia serán tus mayores activos.",
            career: "Las oportunidades de ascenso, de iniciar un negocio o de independizarse son excepcionalmente altas. Toma riesgos calculados y no esperes a que otros te den permiso para liderar.",
            love: "Es posible que te sientas más enfocado en tus propias necesidades y límites, lo que puede cambiar la dinámica de tus relaciones. Es un momento para atraer parejas que respeten tu autonomía o para afirmar tu individualidad en los vínculos existentes.",
            oracleWarning: "Cuidado con la arrogancia y la impaciencia; el progreso requiere que lideres, no simplemente que exijas.",
            luckyDays: [1, 10, 28]
        },
        2: { 
            title: "Cultivo y Conexión", 
            overview: "Tras el intenso impulso del Año 1, este periodo exige paciencia, intuición y colaboración. Es un momento para construir vínculos profundos, refinar tus planes y dejar que las semillas que plantaste broten silenciosamente. La diplomacia abrirá puertas que la fuerza no puede.",
            career: "Enfócate en el trabajo en equipo, las asociaciones y las negociaciones en lugar de la expansión individual agresiva. Podrías trabajar tras bastidores, resolviendo conflictos y reuniendo apoyo esencial para futuros movimientos.",
            love: "Este es uno de los años más favorables para encontrar un amor profundo o armonizar una relación actual de largo plazo. La sensibilidad emocional está aumentada, requiriendo una comunicación suave.",
            oracleWarning: "No dejes que la hipersensibilidad se convierta en resentimiento; expresa tus necesidades claramente en lugar de retirarte al silencio.",
            luckyDays: [2, 11, 20]
        },
        3: { 
            title: "Expresión y Expansión", 
            overview: "Vibrante y altamente creativo, este año vibra con energía social y autoexpresión. Estás llamado a expresar tu verdad con audacia, explorar el mundo con alegría y compartir tu voz única. El gozo y el optimismo son tus fuerzas guía.",
            career: "La comunicación, el arte y los roles públicos están inmensamente favorecidos ahora. Tu carisma es magnético: úsalo para presentar ideas, hacer contactos e inyectar creatividad en tu vida profesional.",
            love: "Tu círculo social se expandirá, trayendo conexiones emocionantes pero a veces fugaces. En las relaciones establecidas, priorizar la diversión, el humor y el diálogo abierto reavivará chispas magnéticas.",
            oracleWarning: "Evita dispersar tu energía en demasiadas búsquedas triviales; enfoca tu fuego creativo para evitar el agotamiento.",
            luckyDays: [3, 12, 21]
        },
        4: { 
            title: "Cimiento y Fortaleza", 
            overview: "Este es el momento de echar raíces y establecer un orden inquebrantable en tu vida. Mantén la disciplina, organiza tus espacios físicos y mentales y domina tu oficio. El trabajo duro aplicado ahora asegurará tu base para los años venideros.",
            career: "Espera un año exigente que requiere esfuerzo sistemático, administración y la construcción de estructuras sólidas. La riqueza se acumula a través de inversiones constantes y prácticas en lugar de riesgos especulativos.",
            love: "Buscas estabilidad y confiabilidad por encima de todo, haciendo de este un momento para solidificar compromisos o terminar aventuras pasajeras. Las responsabilidades compartidas y el apoyo práctico se convierten en tus principales lenguajes del amor.",
            oracleWarning: "No permitas que la disciplina se convierta en terquedad; recuerda construir flexibilidad dentro de tus estructuras rígidas.",
            luckyDays: [4, 13, 22]
        },
        5: { 
            title: "Libertad y Transformación", 
            overview: "Prepárate para cambios dinámicos, aventuras emocionantes y giros inesperados. Las estructuras que construiste el año pasado servirán ahora como plataforma de lanzamiento para explorar nuevos horizontes. Abraza la incertidumbre, mantente adaptable y di sí a lo poco convencional.",
            career: "Los viajes, los medios de comunicación, las ventas y los cambios abruptos de carrera son destacados, ofreciendo oportunidades lucrativas pero espontáneas. Evita quedar atrapado en contratos altamente restrictivos durante esta fase de gran impulso.",
            love: "Un año magnético, sensual y altamente impredecible para el romance, favoreciendo los encuentros emocionantes sobre el anidamiento profundo. Las parejas existentes deben introducir variedad y libertad para evitar una sensación de claustrofobia.",
            oracleWarning: "Ten cuidado con las decisiones impulsivas alimentadas puramente por la inquietud; busca la libertad, pero no invites al caos.",
            luckyDays: [5, 14, 23]
        },
        6: { 
            title: "Armonía y Santuario", 
            overview: "Tu enfoque se desplazará inevitablemente hacia tu hogar, tu familia y tus responsabilidades personales profundas. Este es un año profundamente nutritivo y sanador donde se destaca tu papel como cuidador y protector. Crear armonía estética y emocional es primordial.",
            career: "Los negocios orientados al servicio, el diseño y los roles de liderazgo comunitario prosperarán bajo esta energía de apoyo. La estabilidad financiera llega a través de redes de confianza y brindando valor real a los demás.",
            love: "Este es el año por excelencia para el matrimonio, la planificación familiar o la profundización de la dicha doméstica. Tu corazón está muy abierto, pero debes asegurarte de no dar en exceso a quienes agotan tu luz.",
            oracleWarning: "No permitas que tu deseo de sanar a otros te convierta en un mártir; establece límites para proteger tu propio santuario.",
            luckyDays: [6, 15, 24]
        },
        7: { 
            title: "Introspección y Despertar", 
            overview: "Un año profundamente espiritual y analítico que exige que mires hacia adentro. Prioriza la soledad, sumérgete en estudios esotéricos o científicos y deja que tu intuición te guíe. El mundo exterior pasa a un segundo plano frente al vasto universo interior.",
            career: "La investigación, el análisis y el aprendizaje especializado son muy favorecidos sobre el networking intenso o la expansión rápida. Las ganancias financieras pueden ralentizarse ligeramente para permitirte enfocarte en descubrir tu verdadero propósito de vida.",
            love: "Podrías sentirte más retraído o requerir un espacio personal significativo, lo que puede confundir a tu pareja si no se comunica. Es un momento para atraer conexiones de alma profundamente intelectuales o espiritualmente alineadas.",
            oracleWarning: "No permitas que la introspección necesaria degenere en un aislamiento total y un desapego cínico del mundo.",
            luckyDays: [7, 16, 25]
        },
        8: { 
            title: "Manifestación y Maestría", 
            overview: "Bienvenido a tu año de cosecha. Las semillas kármicas que has sembrado durante los últimos siete años darán frutos ahora. Reclama tu poder personal, asume autoridad ejecutiva y domina el plano material para manifestar una profunda abundancia.",
            career: "Este es un año de gran potencia para el avance profesional, los grandes acuerdos financieros y la asunción de roles de liderazgo. Encamina tus esfuerzos intensamente hacia tus ambiciones; el universo respalda tus movimientos profesionales más audaces.",
            love: "Las dinámicas de poder en las relaciones pasarán al primer plano, requiriendo equilibrio y respeto mutuo. Atraerás a parejas ambiciosas, pero debes asegurarte de que el trabajo no eclipse completamente tu disponibilidad emocional.",
            oracleWarning: "Evita la ambición despiadada; la verdadera maestría requiere que equilibres tu riqueza material con la integridad espiritual.",
            luckyDays: [8, 17, 26]
        },
        9: { 
            title: "Culminación y Liberación", 
            overview: "Estás experimentando cierres profundos, expansión humanitaria y el desprendimiento de lo que ya no te sirve. Limpia el tablero por completo —física, emocional y espiritualmente— para preparar el terreno para un renacimiento poderoso el próximo año.",
            career: "Los proyectos concluirán naturalmente y podrías sentir el impulso de transitar fuera de roles que carecen de un significado profundo. El trabajo caritativo, los emprendimientos globales y la culminación creativa cuentan con gran apoyo.",
            love: "Las relaciones que carecen de una base de alma profunda se disolverán naturalmente, dando paso a un amor mejor alineado. Es un período de perdón, de soltar viejos rencores y de abrazar la compasión incondicional.",
            oracleWarning: "No te aferres desesperadamente a lo que se está alejando naturalmente; la rendición es tu mayor poder este año.",
            luckyDays: [9, 18, 27]
        }
    },
    Portuguese: {
        1: { 
            title: "A Semente dos Novos Começos", 
            overview: "Este é um ano de iniciação, de plantar sementes e de ação audaciosa. Você está entrando em um novo ciclo de nove anos, tornando este o momento ideal para reivindicar sua independência e redefinir seu caminho. Coragem e autossuficiência serão seus maiores trunfos.",
            career: "As oportunidades de promoção, de iniciar um negócio ou de seguir um caminho independente são excepcionalmente altas. Assuma riscos calculados e não espere que os outros lhe deem permissão para liderar.",
            love: "Você pode se sentir mais focado em suas próprias necessidades e limites, o que pode mudar a dinâmica dos seus relacionamentos. É um momento para atrair parceiros que respeitem sua autonomia ou para afirmar sua idade em vínculos existentes.",
            oracleWarning: "Cuidado com a arrogância e a impaciência; o progresso exige que você lidere, não apenas que exija.",
            luckyDays: [1, 10, 28]
        },
        2: { 
            title: "Cultivo e Conexão", 
            overview: "Após o impulso intenso do Ano 1, este período exige paciência, intuição e colaboração. É um momento para construir laços profundos, refinar seus planos e deixar as sementes que você plantou brotarem silenciosamente. A diplomacia abrirá portas que a força não consegue.",
            career: "Foque no trabalho em equipe, parcerias e negociações em vez de uma expansão solo agressiva. Você pode trabalhar nos bastidores, resolvendo conflitos e reunindo o apoio essencial para movimentos futuros.",
            love: "Este é um dos anos mais favoráveis para encontrar um amor de alma ou harmonizar um relacionamento de longo prazo atual. A sensibilidade emocional está aguçada, exigindo uma comunicação gentil.",
            oracleWarning: "Não deixe que a hipersensibilidade se transforme em ressentimento; fale suas necessidades claramente em vez de se retirar no silêncio.",
            luckyDays: [2, 11, 20]
        },
        3: { 
            title: "Expressão e Expansão", 
            overview: "Vibrante e altamente criativo, este ano vibra com energia social e autoexpressão. Você é chamado a expressar sua verdade com ousadia, explorar o mundo com alegria e compartilhar sua voz única. Alegria e otimismo são suas forças guias.",
            career: "Comunicação, arte e papéis voltados ao público são imensamente favorecidos agora. Seu carisma é magnético — use-o para apresentar ideias, fazer networking e injetar criatividade em sua vida profissional.",
            love: "Seu círculo social se expandirá, trazendo conexões emocionantes, mas às vezes fugazes. Em relacionamentos estabelecidos, priorizar a diversão, o humor e o diálogo aberto reacenderá faíscas magnéticas.",
            oracleWarning: "Evite dispersar sua energia em muitas atividades fúteis; foque seu fogo criativo para evitar o esgotamento.",
            luckyDays: [3, 12, 21]
        },
        4: { 
            title: "Fundação e Fortaleza", 
            overview: "Este é o momento de criar raízes e estabelecer uma ordem inabalável em sua vida. Mantenha a disciplina, organize seus espaços físicos e mentais e domine seu ofícios. O trabalho duro aplicado agora garantirá sua base para os próximos anos.",
            career: "Espere um ano exigente que requer esforço sistemático, administração e a construção de estruturas sólidas. A riqueza é acumulada através de investimentos estáveis e práticos, em vez de riscos especulativos.",
            love: "Você busca estabilidade e confiabilidade acima de tudo, tornando este um momento para solidificar compromissos ou encerrar aventuras passageiras. Responsabilidades compartilhadas e apoio prático tornam-se suas principais linguagens do amor.",
            oracleWarning: "Não deixe a disciplina se transformar em teimosia; lembre-se de construir flexibilidade dentro de suas estruturas rígidas.",
            luckyDays: [4, 13, 22]
        },
        5: { 
            title: "Liberdade e Transformação", 
            overview: "Prepare-se para mudanças dinâmicas, aventuras emocionantes e reviravoltas inesperadas. As estruturas que você construiu no ano passado servirão agora como uma plataforma de lançamento para explorar novos horizontes. Abrace a incerteza, mantenha-se adaptável e diga sim ao não convencional.",
            career: "Viagens, mídia, vendas e mudanças abruptas de carreira ganham destaque, oferecendo oportunidades lucrativas, porém espontâneas. Evite ficar preso em contratos altamente restritivos durante esta fase de alto impulso.",
            love: "Um ano magnético, sensual e altamente imprevisível para o romance, favorecendo encontros emocionantes em vez de um aninhamento profundo. Parcerias existentes devem introduzir variedade e liberdade para evitar uma sensação de claustrofobia.",
            oracleWarning: "Cuidado com decisões impulsivas alimentadas puramente pela inquietude; busque a liberdade, mas não convide o caos.",
            luckyDays: [5, 14, 23]
        },
        6: { 
            title: "Harmonia e Santuário", 
            overview: "Seu foco mudará inevitavelmente para seu lar, família e responsabilidades pessoais profundas. Este é um ano profundamente nutritivo e de cura, onde seu papel como cuidador e protetor é destacado. Criar harmonia estética e emocional é primordial.",
            career: "Negócios orientados para serviços, design e papéis de liderança comunitária prosperarão sob esta energia de apoio. A estabilidade financeira vem através de redes de confiança e do fornecimento de valor genuíno aos outros.",
            love: "Este é o ano por excelência para o casamento, planejamento familiar ou aprofundamento da felicidade doméstica. Seu coração está aberto, mas você deve garantir que não está doando em excesso para aqueles que drenam sua luz.",
            oracleWarning: "Não deixe que seu desejo de curar os outros o transforme em um mártir; estabeleça limites para proteger seu próprio santuário.",
            luckyDays: [6, 15, 24]
        },
        7: { 
            title: "Introspecção e Despertar", 
            overview: "Um ano profundamente espiritual e analítico que exige que você olhe para dentro. Priorize a solidão, mergulhe profundamente em estudos esotéricos ou científicos e deixe sua intuição guiá-lo. O mundo exterior fica em segundo plano diante do vasto universo interior.",
            career: "Pesquisa, análise e aprendizado especializado são altamente favorecidos em relação ao networking pesado ou expansão rápida. Os ganhos financeiros podem diminuir ligeiramente para permitir que você se concentre em descobrir o verdadeiro propósito da sua vida.",
            love: "Você pode se sentir mais retraído ou exigir um espaço pessoal significativo, o que pode confundir um parceiro se não for comunicado. É um momento para atrair conexões de alma profundamente intelectuais ou espiritualmente alinhadas.",
            oracleWarning: "Não deixe que a introspecção necessária degenere em isolamento total e desapego cínico do mundo.",
            luckyDays: [7, 16, 25]
        },
        8: { 
            title: "Manifestação e Maestria", 
            overview: "Bem-vindo ao seu ano de colheita. As sementes kármicas que você semeou nos últimos sete anos darão frutos agora. Reivindique seu poder pessoal, assuma autoridade executiva e domine o plano material para manifestar uma abundância profunda.",
            career: "Este é um ano de grande potência para o avanço na carreira, grandes acordos financeiros e assunção de papéis de liderança. Foque intensamente em suas ambições; o universo está apoiando seus movimentos profissionais mais ousados.",
            love: "As dinâmicas de poder nos relacionamentos virão à tona, exigindo equilíbrio e respeito mútuo. Você atrairá parceiros ambiciosos, mas deve garantir que o trabalho não eclipse completamente sua disponibilidade emocional.",
            oracleWarning: "Evite a ambição implacável; a verdadeira maestria exige que você equilibre sua riqueza material com a integridade espiritual.",
            luckyDays: [8, 17, 26]
        },
        9: { 
            title: "Conclusão e Liberação", 
            overview: "Você está experimentando um fechamento profundo, expansão humanitária e a liberação do que não lhe serve mais. Limpe o tabuleiro completamente — física, emocional e espiritualmente — para preparar o terreno para um renascimento poderoso no próximo ano.",
            career: "Os projetos serão concluídos naturalmente e você pode sentir o desejo de transitar para fora de papéis que carecem de um significado profundo. Trabalho de caridade, empreendimentos globais e culminação criativa são altamente apoiados.",
            love: "Relacionamentos que não possuem uma base profunda de alma se dissolverão naturalmente, abrindo caminho para um amor mais alinhado. É um período de perdão, de liberar velhas mágoas e de abraçar a compasão incondicional.",
            oracleWarning: "Não se agarre desesperadamente ao que está se afastando naturalmente; a rendição é o seu maior poder este ano.",
            luckyDays: [9, 18, 27]
        }
    },
    French: {
        1: { 
            title: "La Graine des Nouveaux Départs", 
            overview: "C'est une année d'initiation, de semailles et d'action audacieuse. Vous entrez dans un nouveau cycle de neuf ans, ce qui en fait le moment idéal pour revendiquer votre indépendance et redéfinir votre chemin. Le courage et l'autonomie seront vos plus grands atouts.",
            career: "Les opportunités de promotion, de création d'entreprise ou d'indépendance sont exceptionnellement élevées. Prenez des risques calculés et n'attendez pas la permission des autres pour diriger.",
            love: "Vous pourriez vous sentir plus concentré sur vos propres besoins et limites, ce qui peut modifier la dynamique relationnelle. C'est le moment d'attirer des partenaires qui respectent votre autonomie.",
            oracleWarning: "Méfiez-vous de l'arrogance et de l'impatience ; le progrès exige que vous dirigiez, pas seulement que vous exigiez.",
            luckyDays: [1, 10, 28]
        },
        2: { 
            title: "Culture et Connexion", 
            overview: "Après l'élan intense de l'Année 1, cette période exige de la patience, de l'intuition et de la collaboration. C'est le moment de tisser des liens profonds, d'affiner vos projets et de laisser les graines germer tranquillement. La diplomatie ouvrira des portes que la force ne peut fermer.",
            career: "Privilégiez le travail d'équipe, les partenariats et les négociations plutôt qu'une expansion solo agressive. Vous travaillerez peut-être en coulisses pour rassembler des soutiens essentiels.",
            love: "C'est l'une des années les plus favorables pour trouver un amour d'âme ou harmoniser une relation actuelle. La sensibilité émotionnelle est accrue, nécessitant une communication douce.",
            oracleWarning: "Ne laissez pas l'hypersensibilité se transformer en ressentiment ; exprimez clairement vos besoins au lieu de vous murer dans le silence.",
            luckyDays: [2, 11, 20]
        },
        3: { 
            title: "Expression et Expansion", 
            overview: "Vibrante et hautement créative, cette année vibre d'énergie sociale et d'expression de soi. Vous êtes appelé à exprimer votre vérité avec audace et à partager votre voix unique. La joie et l'optimisme sont vos forces motrices.",
            career: "La communication, l'art et les rôles publics sont immensément favorisés. Votre charisme est magnétique — utilisez-le pour présenter vos idées et injecter de la créativité dans votre vie professionnelle.",
            love: "Votre cercle social s'élargira, apportant des connexions excitantes mais parfois éphémères. Dans les relations établies, prioriser l'humour et le dialogue ravivera les étincelles.",
            oracleWarning: "Évitez de disperser votre énergie dans trop de poursuites futiles ; concentrez votre feu créatif pour éviter l'épuisement.",
            luckyDays: [3, 12, 21]
        },
        4: { 
            title: "Fondation et Courage", 
            overview: "C'est le moment de prendre racine et d'établir un ordre inébranlable dans votre vie. Restez discipliné, organisez vos espaces physiques et mentaux et maîtrisez votre art. Le travail acharné maintenant assurera vos bases pour les années à venir.",
            career: "Attendez-vous à une année exigeante nécessitant un effort systématique et la construction de structures solides. La richesse s'accumule par des investissements pratiques et stables.",
            love: "Vous recherchez la stabilité et la fiabilité avant tout, ce qui en fait un moment propice pour solidifier les engagements. Le soutien pratique devient votre principal langage amoureux.",
            oracleWarning: "Ne laissez pas la discipline se transformer en entêtement ; n’oubliez pas de garder de la souplesse dans vos structures rigides.",
            luckyDays: [4, 13, 22]
        },
        5: { 
            title: "Liberté et Transformation", 
            overview: "Préparez-vous à des changements dynamiques, des aventures palpitantes et des pivots inattendus. Les structures construites l'an dernier serviront de tremplin pour explorer de nouveaux horizons. Embrassez l'incertitude et restez adaptable.",
            career: "Les voyages, les médias et les changements de carrière brusques sont mis en avant, offrant des opportunités lucratives mais spontanées. Évitez les contrats trop restrictifs durant cette phase.",
            love: "Une année magnétique et imprévisible pour la romance, favorisant les rencontres excitantes. Les partenariats existants doivent introduire de la variété pour éviter un sentiment de claustrophobie.",
            oracleWarning: "Gare aux décisions impulsives dictées par l'agitation ; cherchez la liberté, mais n'invitez pas le chaos.",
            luckyDays: [5, 14, 23]
        },
        6: { 
            title: "Harmonie et Sanctuaire", 
            overview: "Votre attention se portera inévitablement sur votre foyer, votre famille et vos responsabilités personnelles. C'est une année de guérison où votre rôle de protecteur est mis en avant. Créer une harmonie émotionnelle est primordial.",
            career: "Les entreprises de services, le design et les rôles de leadership communautaire prospéreront. La stabilité financière passe par des réseaux de confiance et une valeur authentique apportée aux autres.",
            love: "C'est l'année idéale pour le mariage, la planification familiale ou l'approfondissement du bonheur domestique. Votre cœur est grand ouvert, mais veillez à ne pas trop donner à ceux qui épuisent votre lumière.",
            oracleWarning: "Ne laissez pas votre désir de guérir les autres vous transformer en martyr ; fixez des limites pour protéger votre propre sanctuaire.",
            luckyDays: [6, 15, 24]
        },
        7: { 
            title: "Introspection et Éveil", 
            overview: "Une année profondément spirituelle et analytique qui exige que vous regardiez en vous. Privilégiez la solitude, plongez dans des études ésotériques et laissez votre intuition vous guider. Le monde extérieur passe au second plan.",
            career: "La recherche et l'apprentissage spécialisé sont favorisés par rapport au réseautage intensif. Les gains financiers peuvent ralentir légèrement pour vous permettre de découvrir votre véritable but de vie.",
            love: "Vous pourriez vous sentir plus en retrait ou avoir besoin de beaucoup d'espace personnel. C'est le moment d'attirer des connexions d'âme profondément intellectuelles ou spirituelles.",
            oracleWarning: "Ne laissez pas l'introspection nécessaire se transformer en isolement total et en détachement cynique du monde.",
            luckyDays: [7, 16, 25]
        },
        8: { 
            title: "Manifestation et Maîtrise", 
            overview: "Bienvenue dans votre année de récolte. Les graines karmiques semées au cours des sept dernières années portent maintenant leurs fruits. Revendiquez votre pouvoir personnel et maîtrisez le plan matériel pour manifester l'abondance.",
            career: "C'est une année puissante pour l'avancement professionnel et les grands accords financiers. Concentrez-vous intensément sur vos ambitions ; l'univers soutient vos mouvements les plus audacieux.",
            love: "Les dynamiques de pouvoir dans les relations seront au premier plan, exigeant équilibre et respect. Vous attirerez des partenaires ambitieux, mais veillez à ce que le travail n'éclipse pas votre disponibilité émotionnelle.",
            oracleWarning: "Évitez l'ambition impitoyable ; la vraie maîtrise exige d'équilibrer votre richesse matérielle avec l'intégrité spirituelle.",
            luckyDays: [8, 17, 26]
        },
        9: { 
            title: "Achèvement et Libération", 
            overview: "Vous vivez une clôture profonde, une expansion humanitaire et l'abandon de ce qui ne vous sert plus. Faites table rase — physiquement, émotionnellement et spirituellement — pour préparer le terrain à une renaissance l'an prochain.",
            career: "Les projets se termineront naturellement et vous pourriez ressentir le besoin de quitter des rôles manquant de sens profond. Les œuvres caritatives et les projets créatifs sont très soutenus.",
            love: "Les relations sans fondation d'âme profonde se dissoudront naturellement, laissant place à un amour mieux aligné. C'est une période de pardon et de compassion inconditionnelle.",
            oracleWarning: "Ne vous accrochez pas désespérément à ce qui s'en va naturellement ; le lâcher-prise est votre plus grand pouvoir cette année.",
            luckyDays: [9, 18, 27]
        }
    },
    German: {
        1: { 
            title: "Der Samen neuer Anfänge", 
            overview: "Dies ist ein Jahr der Initiation, des Aussäens und des mutigen Handelns. Du trittst in einen neuen Neun-Jahres-Zyklus ein, was dies zum optimalen Zeitpunkt macht, um deine Unabhängigkeit zu beanspruchen. Mut und Selbstvertrauen werden deine größten Stärken sein.",
            career: "Die Chancen für eine Beförderung, eine Unternehmensgründung oder den Schritt in die Selbstständigkeit sind außergewöhnlich hoch. Gehe kalkulierte Risiken ein und warte nicht auf die Erlaubnis anderer.",
            love: "Du fühlst dich vielleicht stärker auf deine eigenen Bedürfnisse fokussiert, was die Beziehungsdynamik verändern kann. Es ist eine Zeit, um Partner anzuziehen, die deine Autonomie respektieren.",
            oracleWarning: "Hüte dich vor Arroganz und Ungeduld; Fortschritt erfordert Führung, nicht bloß Forderungen.",
            luckyDays: [1, 10, 28]
        },
        2: { 
            title: "Pflege und Verbindung", 
            overview: "Nach dem intensiven Vorstoß des 1. Jahres verlangt diese Zeit nach Geduld, Intuition und Zusammenarbeit. Es ist eine Zeit, um tiefe Bindungen aufzubauen und deine Pläne zu verfeinern. Diplomatie wird Türen öffnen, die Gewalt nicht öffnen kann.",
            career: "Konzentriere dich auf Teamarbeit, Partnerschaften und Verhandlungen statt auf aggressive Solo-Expansion. Du arbeitest vielleicht hinter den Kulissen, um wichtige Unterstützung für zukünftige Schritte zu sammeln.",
            love: "Dies ist eines der günstigsten Jahre, um eine tiefe Seelenliebe zu finden oder eine bestehende Beziehung zu harmonisieren. Die emotionale Sensibilität ist erhöht und erfordert sanfte Kommunikation.",
            oracleWarning: "Lasse nicht zu, dass Überempfindlichkeit in Groll umschlägt; äußere deine Bedürfnisse klar, anstatt dich in Schweigen zurückzuziehen.",
            luckyDays: [2, 11, 20]
        },
        3: { 
            title: "Ausdruck und Expansion", 
            overview: "Lebendig und hochgradig kreativ, vibriert dieses Jahr vor sozialer Energie und Selbstausdruck. Du bist aufgerufen, deine Wahrheit kühn auszudrücken, die Welt spielerisch zu erkunden und deine Stimme zu teilen. Freude und Optimismus sind deine Führungskräfte.",
            career: "Kommunikation, Kunst und öffentliche Rollen sind jetzt immens begünstigt. Dein Charisma ist magnetisch — nutze es, um Ideen zu präsentieren und Kreativität in dein Berufsleben zu bringen.",
            love: "Dein sozialer Kreis wird sich erweitern und aufregende, wenn auch manchmal flüchtige Verbindungen bringen. In bestehenden Beziehungen wird Humor und offener Dialog die Leidenschaft neu entfachen.",
            oracleWarning: "Vermeide es, deine Energie auf zu viele triviale Beschäftigungen zu verteilen; konzentriere dein kreatives Feuer, um Burnout zu vermeiden.",
            luckyDays: [3, 12, 21]
        },
        4: { 
            title: "Fundament und Stärke", 
            overview: "Dies ist die Zeit, Wurzeln zu schlagen und eine unerschütterliche Ordnung in deinem Leben zu etablieren. Bleibe diszipliniert, organisiere deine physischen und mentalen Räume und meistere dein Handwerk. Harte Arbeit wird jetzt dein Fundament für die nächsten Jahre sichern.",
            career: "Erwarte ein anspruchsvolles Jahr, das systematische Anstrengung und den Aufbau solider Strukturen erfordert. Wohlstand wird durch stetige, praktische Investitionen statt durch spekulative Risiken aufgebaut.",
            love: "Du suchst vor allem Stabilität und Zuverlässigkeit, was dies zu einer Zeit macht, um Verpflichtungen zu festigen. Gemeinsame Verantwortung wird zu deiner primären Liebessprache.",
            oracleWarning: "Lasse nicht zu, dass Disziplin zu Sturheit verhärtet; denke daran, Flexibilität in deine starren Strukturen einzubauen.",
            luckyDays: [4, 13, 22]
        },
        5: { 
            title: "Freiheit und Transformation", 
            overview: "Bereite dich auf dynamische Veränderungen, spannende Abenteuer und unerwartete Wendungen vor. Die Strukturen, die du im letzten Jahr aufgebaut hast, dienen nun als Startrampe für neue Horizonte. Begrüße die Ungewissheit und bleibe anpassungsfähig.",
            career: "Reisen, Medien, Verkauf und abrupte Karrierewechsel werden hervorgehoben und bieten lukrative Möglichkeiten. Vermeide es, dich während dieser Phase in stark einschränkende Verträge binden zu lassen.",
            love: "Ein magnetisches und unvorhersehbares Jahr für die Romantik, das aufregende Begegnungen begünstigt. Bestehende Partnerschaften müssen Abwechslung einführen, um ein Gefühl der Enge zu vermeiden.",
            oracleWarning: "Hüte dich vor impulsiven Entscheidungen, die nur aus Ruhelosigkeit getroffen werden; suche die Freiheit, aber lade nicht das Chaos ein.",
            luckyDays: [5, 14, 23]
        },
        6: { 
            title: "Harmonie und Zuflucht", 
            overview: "Dein Fokus wird sich unweigerlich auf dein Zuhause, deine Familie und tiefe persönliche Verantwortung verlagern. Dies ist ein nährendes und heilendes Jahr, in dem deine Rolle als Beschützer hervorgehoben wird. Ästhetische und emotionale Harmonie stehen an erster Stelle.",
            career: "Dienstleistungsorientierte Unternehmen, Design und Führungspositionen in der Gemeinschaft werden unter dieser Energie gedeihen. Finanzielle Stabilität kommt durch vertrauenswürdige Netzwerke.",
            love: "Dies ist das Inbegriffsjahr für die Ehe, die Familienplanung oder die Vertiefung des häuslichen Glücks. Dein Herz ist weit offen, aber achte darauf, dich nicht für andere aufzuopfern.",
            oracleWarning: "Lasse nicht zu, dass dein Wunsch, andere zu heilen, dich zum Märtyrer macht; setze Grenzen, um dein eigenes Refugium zu schützen.",
            luckyDays: [6, 15, 24]
        },
        7: { 
            title: "Introspektion und Erwachen", 
            overview: "Ein tief spirituelles und analytisches Jahr, das verlangt, dass du nach innen schaust. Priorisiere die Einsamkeit, tauche tief in esoterische Studien ein und lass dich von deiner Intuition leiten. Die Außenwelt tritt in den Hintergrund.",
            career: "Forschung, Analyse und spezialisiertes Lernen sind gegenüber intensivem Networking stark begünstigt. Der finanzielle Gewinn kann sich leicht verlangsamen, damit du deinen wahren Lebenszweck entdecken kannst.",
            love: "Du fühlst dich vielleicht zurückgezogener oder benötigst viel persönlichen Freiraum. Es ist eine Zeit, um tief intellektuelle oder spirituell ausgerichtete Seelenverbindungen anzuziehen.",
            oracleWarning: "Lasse nicht zu, dass die notwendige Introspektion in völlige Isolation und zynische Distanz zur Welt ausartet.",
            luckyDays: [7, 16, 25]
        },
        8: { 
            title: "Manifestation und Meisterschaft", 
            overview: "Willkommen in deinem Erntejahr. Die karmischen Samen, die du in den letzten sieben Jahren gesät hast, tragen nun Früchte. Beanspruche deine persönliche Macht und meistere die materielle Ebene, um Fülle zu manifestieren.",
            career: "Dies ist ein kraftvolles Jahr für den beruflichen Aufstieg und große Finanzgeschäfte. Konzentriere dich intensiv auf deine Ambitionen; das Universum unterstützt deine kühnsten Schritte.",
            love: "Machtdynamiken in Beziehungen treten in den Vordergrund und erfordern Ausgewogenheit und Respekt. Du wirst ehrgeizige Partner anziehen, aber achte darauf, dass die Arbeit die Emotionen nicht überlagert.",
            oracleWarning: "Vermeide rücksichtslosen Ehrgeiz; wahre Meisterschaft erfordert ein Gleichgewicht zwischen materiellem Reichtum und spiritueller Integrität.",
            luckyDays: [8, 17, 26]
        },
        9: { 
            title: "Vollendung und Loslassen", 
            overview: "Du erlebst tiefgreifenden Abschluss, humanitäre Expansion und das Loslassen dessen, was dir nicht mehr dient. Mache reinen Tisch — physisch, emotional und spirituell — um den Boden für eine kraftvolle Wiedergeburt im nächsten Jahr zu bereiten.",
            career: "Projekte werden natürlich zum Abschluss kommen, und du verspürst vielleicht den Drang, Rollen zu verlassen, die keinen tiefen Sinn mehr haben. Karitative Arbeit wird stark unterstützt.",
            love: "Beziehungen, denen ein tiefes seelisches Fundament fehlt, werden sich natürlich auflösen und Platz für eine besser ausgerichtete Liebe machen. Es ist eine Zeit des Verzeihens und Mitgefühls.",
            oracleWarning: "Klammere dich nicht verzweifelt an das, was natürlich wegfällt; das Loslassen ist in diesem Jahr deine größte Kraft.",
            luckyDays: [9, 18, 27]
        }
    },
    // Adding fallbacks for omitted for brevity right now. Russian/Arabic/Hebrew/Bulgarian map to English temporarily to avoid file huge size limits, or I translate them:
    Russian: {
        1: { 
            title: "Семя Новых Начинаний", 
            overview: "Это год инициации, посева семян и решительных действий. Вы вступаете в новый девятилетний цикл, что делает это время оптимальным для обретения независимости и переосмысления своего пути. Мужество и уверенность в себе станут вашими главными активами.",
            career: "Вероятность повышения, открытия бизнеса или перехода к независимой работе исключительно высока. Рискуйте расчетливо и не ждите разрешения от других, чтобы взять на себя лидерство.",
            love: "Вы можете чувствовать себя более сосредоточенным на своих собственных потребностях, что может изменить динамику отношений. Время привлекать партнеров, которые уважают вашу автономию.",
            oracleWarning: "Остерегайтесь высокомерия и нетерпеливости; прогресс требует лидерства, а не просто требований.",
            luckyDays: [1, 10, 28]
        },
        2: { 
            title: "Развитие и Связь", 
            overview: "После интенсивного напора 1-го года этот период требует терпения, интуиции и сотрудничества. Настало время для глубоких связей, уточнения планов и спокойного прорастания посеянных семян. Дипломатия откроет двери, которые не поддаются силе.",
            career: "Сосредоточьтесь на командной работе, партнерстве и переговорах, а не на агрессивной одиночной экспансии. Ваша работа за кулисами позволит собрать важную поддержку для будущих шагов.",
            love: "Один из самых благоприятных годов для обретения глубокой духовной любви или гармонизации текущих отношений. Эмоциональная чувствительность повышена, требуя мягкости в общении.",
            oracleWarning: "Не позволяйте гиперчувствительности превратиться в обиду; четко заявляйте о своих потребностях вместо того, чтобы уходить в молчание.",
            luckyDays: [2, 11, 20]
        },
        3: { 
            title: "Самовыражение и Расширение", 
            overview: "Яркий и творческий, этот год наполнен социальной энергией и самовыражением. Вам предлагается смело заявлять о своей истине, игриво исследовать мир и делиться своим уникальным голосом. Радость и оптимизм — ваши путеводные силы.",
            career: "Коммуникации, искусство и публичные роли сейчас в почете. Ваш магнетизм велик — используйте его для продвижения идей и внесения творчества в вашу профессиональную жизнь.",
            love: "Ваш круг общения расширится, принося захватывающие, но иногда мимолетные связи. В устоявшихся отношениях юмор и открытый диалог помогут вновь зажечь искру интереса.",
            oracleWarning: "Избегайте распыления энергии на слишком большое количество тривиальных занятий; сфокусируйте свой творческий пыл, чтобы избежать выгорания.",
            luckyDays: [3, 12, 21]
        },
        4: { 
            title: "Фундамент и Сила", 
            overview: "Пришло время пустить корни и установить непоколебимый порядок в своей жизни. Будьте дисциплинированы, организуйте свое физическое и ментальное пространство. Тяжелый труд сейчас обеспечит ваш фундамент на долгие годы.",
            career: "Ожидайте требовательного года, требующего систематических усилий и построения надежных структур. Благосостояние накапливается благодаря стабильным, практичным инвестициям.",
            love: "Вы ищете стабильности и надежности превыше всего, что делает это время подходящим для укрепления обязательств. Общие обязанности становятся вашим основным языком любви.",
            oracleWarning: "Не позволяйте дисциплине превратиться в упрямство; помните о необходимости гибкости даже в самых жестких структурах.",
            luckyDays: [4, 13, 22]
        },
        5: { 
            title: "Свобода и Трансформация", 
            overview: "Готовьтесь к динамичным переменам, волнующим приключениям и неожиданным поворотам. Структуры, построенные вами в прошлом году, станут стартовой площадкой для новых горизонтов. Принимайте неопределенность и будьте адаптивны.",
            career: "Путешествия, медиа, продажи и резкие смены карьеры находятся в центре внимания, предлагая выгодные возможности. Избегайте слишком жестких контрактов в этот активный период.",
            love: "Магнетический и непредсказуемый год для романтики, благоприятствующий захватывающим встречам. Существующим партнерствам необходимо внести разнообразие, чтобы избежать чувства тесноты.",
            oracleWarning: "Остерегайтесь импульсивных решений, продиктованных беспокойством; ищите свободу, но не приглашайте хаос.",
            luckyDays: [5, 14, 23]
        },
        6: { 
            title: "Гармония и Убежище", 
            overview: "Ваше внимание неизбежно переместится на дом, семью и глубокую личную ответственность. Это исцеляющий год, в котором ваша роль защитника выходит на первый план. Создание эстетической и эмоциональной гармонии имеет первостепенное значение.",
            career: "Бизнес, ориентированный на услуги, дизайн и лидерство в сообществе, будет процветать. Финансовая стабильность приходит через проверенные связи и принесение реальной ценности другим.",
            love: "Идеальный год для брака, планирования семьи или углубления домашнего счастья. Ваше сердце открыто, но следите за тем, чтобы не отдавать слишком много тем, кто истощает ваш свет.",
            oracleWarning: "Не позволяйте желанию исцелять других превратить вас в мученика; установите границы, чтобы защитить свое личное пространство.",
            luckyDays: [6, 15, 24]
        },
        7: { 
            title: "Самоанализ и Пробуждение", 
            overview: "Глубоко духовный и аналитический год, требующий внутреннего взгляда. Отдайте приоритет уединению, погрузитесь в эзотерические или научные исследования и позвольте интуиции вести вас. Внешний мир отступает на второй план перед внутренней вселенной.",
            career: "Исследования, анализ и углублённое обучение предпочтительнее агрессивного нетворкинга или стремительного расширения. Финансовый рост может немного замедлиться, чтобы вы могли сосредоточиться на поиске истинного предназначения.",
            love: "Вы можете чувствовать большую потребность в уединении или личном пространстве, что может сбить с толку партнёра без открытого диалога. Время привлекать глубокие интеллектуальные или духовно близкие связи.",
            oracleWarning: "Не позволяйте необходимому самоанализу превратиться в полную изоляцию и циничное отчуждение от мира.",
            luckyDays: [7, 16, 25]
        },
        8: { 
            title: "Манифестация и Мастерство", 
            overview: "Добро пожаловать в год вашего урожая. Кармические семена, посеянные вами за последние семь лет, теперь приносят плоды. Заявите о своей личной силе и освойте материальный план для проявления глубокого изобилия.",
            career: "Мощный год для продвижения по службе, крупных финансовых сделок и занятия лидерских позиций. Сосредоточьтесь на своих амбициях; Вселенная поддерживает ваши самые смелые шаги.",
            love: "Динамика власти в отношениях выйдет на первый план, требуя баланса и взаимного уважения. Вы будете привлекать амбициозных партнеров, но следите за тем, чтобы работа не затмила близость.",
            oracleWarning: "Избегайте безжалостных амбиций; истинное мастерство требует баланса материального богатства с духовной целостностью.",
            luckyDays: [8, 17, 26]
        },
        9: { 
            title: "Завершение и Освобождение", 
            overview: "Вы переживаете глубокое завершение, гуманитарное расширение и освобождение от того, что вам больше не служит. Очистите пространство полностью, чтобы подготовить почву для мощного возрождения в следующем году.",
            career: "Проекты естественным образом завершатся, и вы можете почувствовать желание уйти из ролей, в которых нет глубокого смысла. Приветствуется благотворительная и творческая работа.",
            love: "Отношения, лишенные глубокого душевного фундамента, могут прекратиться, освобождая место для более созвучной любви. Это период прощения и безусловного сострадания.",
            oracleWarning: "Не цепляйтесь отчаянно за то, что уходит само собой; умение отпускать — ваша величайшая сила в этом году.",
            luckyDays: [9, 18, 27]
        }
    },
    Bulgarian: {
        1: { 
            title: "Семето на новите начала", 
            overview: "Това е година на иницииране, засяване на семена и смели действия. Навлизате в нов деветгодишен цикъл, което прави момента оптимален да заявите своята независимост. Смелостта и самоувереността ще бъдат най-големите ви активи.",
            career: "Възможностите за повишение, стартиране на бизнес или самостоятелно развитие са изключително големи. Поемайте премерени рискове и не чакайте разрешение от другите.",
            love: "Може да се почувствате по-съсредоточени върху собствените си нужди и граници, което може да промени динамиката на връзката. Време е да привлечете партньори, които уважават вашата автономия.",
            oracleWarning: "Пазете се от арогантност и нетърпение; прогресът изисква да водите, а не просто да изисквате.",
            luckyDays: [1, 10, 28]
        },
        2: { 
            title: "Култивиране и връзка", 
            overview: "След интензивния тласък на Година 1, този период изисква търпение, интуиция и сътрудничество. Време е за изграждане на дълбоки връзки и усъвършенстване на плановете ви. Дипломацията ще отвори врати, които силата не може.",
            career: "Фокусирайте се върху работата в екип, партньорствата и преговорите вместо върху агресивна соло експанзия. Може да работите зад кулисите, събирайки подкрепа за бъдещи стъпки.",
            love: "Това е една от най-благоприятните години за намиране на сродна душа или хармонизиране на текуща връзка. Емоционалната чувствителност е повишена, изискваща нежна комуникация.",
            oracleWarning: "Не позволявайте на свръхчувствителността да се превърне в негодувание; изразявайте нуждите си ясно, вместо да се затваряте в мълчание.",
            luckyDays: [2, 11, 20]
        },
        3: { 
            title: "Изразяване и разширяване", 
            overview: "Жизнена и силно креативна, тази година вибрира със социална енергия и себеизразяване. Призовани сте да изразявате истината си смело и да споделяте уникалния си глас. Радостта и оптимизмът са водещите ви сили.",
            career: "Комуникацията, изкуството и публичните роли са изключително предпочитани сега. Харизмата ви е магнитна — използвайте я, за да представяте идеи и да внасяте креативност в професионалния си живот.",
            love: "Социалният ви кръг ще се разшири, носейки вълнуващи, но понякога мимолетни връзки. В установените отношения хуморът и откритият диалог ще разпалят отново искрите.",
            oracleWarning: "Избягвайте разпиляването на енергията си в твърде много тривиални занимания; фокусирайте творческия си огън, за да избегнете бърнаут.",
            luckyDays: [3, 12, 21]
        },
        4: { 
            title: "Фондация и устойчивост", 
            overview: "Това е времето да пуснете корени и да установите непоклатим ред в живота си. Бъдете дисциплинирани, организирайте физическите и менталните си пространства. Тежката работа сега ще осигури основите ви за години наред.",
            career: "Очаквайте взискателна година, изискваща систематични усилия и изграждане на солидни структури. Благосъстоянието се натрупва чрез стабилни, практически инвестиции.",
            love: "Търсите стабилност и надеждност преди всичко, което прави момента подходящ за утвърждаване на поетите ангажименти. Споделените отговорности стават ваш основен любовен език.",
            oracleWarning: "Не позволявайте на дисциплината да се превърне в инат; не забравяйте да запазите гъвкавост в структурите си.",
            luckyDays: [4, 13, 22]
        },
        5: { 
            title: "Свобода и трансформация", 
            overview: "Подгответе се за динамични промени, вълнуващи приключения и неочаквани обрати. Структурите, които изградихте миналата година, сега ще служат като стартова площадка. Прегърнете несигурността и останете адаптивни.",
            career: "Пътуванията, медиите, продажбите и внезапните кариерни промени са подчертани. Избягвайте да се обвързвате с твърде ограничителни договори през тази фаза на висок импулст.",
            love: "Магнитна и силно непредсказуема година за романтика, благоприятстваща вълнуващи срещи. Съществуващите партньорства трябва да внесат разнообразие, за да избегнат усещането за клаустрофобия.",
            oracleWarning: "Пазете се от импулсивни решения, продиктувани от безпокойство; търсете свободата, но не канете хаоса.",
            luckyDays: [5, 14, 23]
        },
        6: { 
            title: "Хармония и убежище", 
            overview: "Вниманието ви неизбежно ще се насочи към дома, семейството и дълбоките лични отговорности. Това е изцеляваща година, в която се подчертава ролята ви на пазител. Създаването на емоционална хармония е от първостепенно значение.",
            career: "Бизнеси, ориентирани към услуги, дизайн и лидерски роли в общността, ще процъфтяват. Финансовата стабилност идва чрез надеждни мрежи и предоставяне на реална стойност на другите.",
            love: "Това е идеалната година за брак, планиране на семейство или задълбочаване на домашното щастие. Сърцето ви е широко отворено, но внимавайте да не давате твърде много на онези, които изтощават светлината ви.",
            oracleWarning: "Не позволявайте на желанието ви да лекувате другите да ви превърне в мъченик; поставете граници, за да защитите собственото си убежище.",
            luckyDays: [6, 15, 24]
        },
        7: { 
            title: "Интроспекция и пробуждане", 
            overview: "Дълбоко духовна и аналитична година, която изисква да погледнете навътре. Дайте приоритет на уединението, потопете се в задълбочени изследвания и оставете интуицията да ви води. Външният свят остава на заден план.",
            career: "Изследванията и специализираното обучение са силно предпочитани пред интензивния нетуъркинг. Финансовите печалби може да се забавят леко, за да ви позволят да откриете истинската си цел в живота.",
            love: "Може да се почувствате по-затворени или да се нуждаете от значително лично пространство. Време е да привлечете дълбоко интелектуални или духовни душевни връзки.",
            oracleWarning: "Не позволявайте на необходимата интроспекция да се превърне в пълна изолация и цинично откъсване от света.",
            luckyDays: [7, 16, 25]
        },
        8: { 
            title: "Проявление и майсторство", 
            overview: "Добре дошли във вашата година на реколтата. Кармичните семена, които засяхте през последните седем години, сега ще дадат плод. Заявете личната си мощ и овладейте материалния свят, за да проявите изобилие.",
            career: "Това е мощна година за кариерно израстване и големи финансови сделки. Фокусирайте се интензивно върху амбициите си; вселената подкрепя най-смелите ви професионални стъпки.",
            love: "Динамиката на силата в отношенията ще излезе на преден план, изискваща баланс и взаимно уважение. Ще привличате амбициозни партньори, но работата не трябва да засенчва близостта.",
            oracleWarning: "Избягвайте безмилостната амбиция; истинското майсторство изисква баланс между материалното богатство и духовната почтеност.",
            luckyDays: [8, 17, 26]
        },
        9: { 
            title: "Завършване и освобождаване", 
            overview: "Преживявате дълбоко завършване, хуманитарна експанзия и освобождаване от това, което вече не ви служи. Разчистете терена напълно — физически, емоционално и духовно — за мощно възраждане догодина.",
            career: "Проектите ще приключат естествено и може да почувствате желание да напуснете роли, в които няма дълбок смисъл. Благотворителната и творческата работа ще бъдат силно подкрепени.",
            love: "Връзки без дълбока душевна основа ще приключат естествено, освобождавайки място за по-подходяща любов. Това е период на прошка и безусловно състрадание.",
            oracleWarning: "Не се вкопчвайте отчаяно в това, което си отива естествено; умението да пускате е най-голямата ви сила тази година.",
            luckyDays: [9, 18, 27]
        }
    },
    Arabic: {
        1: { 
            title: "بذرة البدايات الجديدة", 
            overview: "هذا هو عام المبادرة، غرس البذور، واتخاذ إجراءات جريئة. أنت تدخل دورة جديدة مدتها تسع سنوات، مما يجعل هذا الوقت الأمثل للمطالبة باستقلاليتك وإعادة تحديد مسارك. ستكون الشجاعة والاعتماد على الذات أعظم أصولك.",
            career: "فرص الترقية، أو بدء عمل تجاري، أو التفرع بشكل مستقل مرتفعة بشكل استثنائي. خذ مخاطرات محسوبة ولا تنتظر من الآخرين منحك الإذن للقيادة.",
            love: "قد تشعر بمزيد من التركيز على احتياجاتك وحدودك الخاصة، مما قد يغير ديناميكيات العلاقة. إنه وقت لجذب الشركاء الذين يحترمون استقلاليتك.",
            oracleWarning: "احذر من الغرور ونفاذ الصبر؛ التقدم يتطلب منك القيادة، وليس مجرد الطلب.",
            luckyDays: [1, 10, 28]
        },
        2: { 
            title: "الرعاية والاتصال", 
            overview: "بعد الاندفاع المكثف للسنة الأولى، تتطلب هذه الفترة الصبر والحدس والتعاون. إنه وقت لبناء روابط عميقة، وصقل خططك، وترك البذور التي زرعتها تبدأ في النمو بهدوء. الدبلوماسية ستفتح أبواباً لا تستطيع القوة فتحها.",
            career: "ركز على العمل الجماعي والشراكات والمفاوضات بدلاً من التوسع الفردي العدواني. قد تعمل وراء الكواليس، وتحل النزاعات وتجمع الدعم الأساسي للتحركات المستقبلية.",
            love: "هذه واحدة من أكثر السنوات ملاءمة للعثور على حب عميق للروح أو تنسيق علاقة حالية طويلة الأمد. الحساسية العاطفية مرتفعة، مما يتطلب تواصلًا لطيفًا.",
            oracleWarning: "لا تدع الحساسية المفرطة تتحول إلى استياء؛ عبر عن احتياجاتك بوضوح بدلاً من التراجع إلى الصمت.",
            luckyDays: [2, 11, 20]
        },
        3: { 
            title: "التعبير والتوسع", 
            overview: "نابض بالحياة ومبدع للغاية، يهتز هذا العام بالطاقة الاجتماعية والتعبير عن الذات. أنت مدعو للتعبير عن حقيقتك بجرأة، واستكشاف العالم بمرح، ومشاركة صوتك الفريد. الفرح والتفاؤل هما القوى الموجهة لك.",
            career: "التواصل والفن والأدوار العامة مفضلة للغاية الآن. كاريزمتك مغناطيسية - استخدمها لعرض الأفكار والتواصل وحقن الإبداع في حياتك المهنية.",
            love: "ستتوسع دائرتك الاجتماعية، مما يجلب اتصالات مثيرة ولكنها عابرة في بعض الأحيان. في العلاقات القائمة، فإن إعطاء الأولوية للمرح والفكاهة والحوار المفتوح سيعيد إشعال الشرارات المغناطيسية.",
            oracleWarning: "تجنب تشتيت طاقتك في الكثير من المساعي التافهة؛ ركز نارك الإبداعية لتجنب الاحتراق.",
            luckyDays: [3, 12, 21]
        },
        4: { 
            title: "الأساس والقوة", 
            overview: "هذا هو الوقت المناسب لوضع الجذور وإرساء نظام لا يتزعزع في حياتك. ابق منضبطًا، ونظم مساحاتك الجسدية والعقلية، وأتقن حرفتك. العمل الشاق المطبق الآن سيؤمن أساسك لسنوات قادمة.",
            career: "توقع عامًا يتطلب جهدًا منهجيًا وإدارة وبناء هياكل صلبة. يتم تجميع الثروة من خلال استثمارات ثابتة وعملية بدلاً من المخاطر المضاربة.",
            love: "أنت تبحث عن الاستقرار والموثوقية قبل كل شيء، مما يجعل هذا الوقت مناسباً لترسيخ الالتزامات. تصبح المسؤوليات المشتركة والدعم العملي لغات حبك الأساسية.",
            oracleWarning: "لا تدع الانضباط يتحول إلى عناد؛ تذكر بناء المرونة في هياكلك الصلبة.",
            luckyDays: [4, 13, 22]
        },
        5: { 
            title: "الحرية والتحول", 
            overview: "استعد لتغييرات ديناميكية، ومغامرات مثيرة، وتحولات غير متوقعة. الهياكل التي بنيتها العام الماضي ستكون بمثابة منصة انطلاق لاستكشاف آفاق جديدة. تقبل الغموض، وابق مرناً، وقل نعم لما هو غير تقليدي.",
            career: "يتم تسليط الضوء على السفر والإعلام والمبيعات والتحولات المهنية المفاجئة، مما يوفر فرصًا مربحة ولكنها عفوية. تجنب الانغلاق في عقود مقيدة للغاية خلال هذه المرحلة.",
            love: "عام مغناطيسي وحسي ولا يمكن التنبؤ به للرومانسية، يفضل اللقاءات المثيرة على الاستقرار العميق. يجب أن تقدم الشراكات القائمة التنوع والحرية لتجنب الشعور برهاب الأماكن المغلقة.",
            oracleWarning: "احذر من القرارات المندفعة التي يغذيها مجرد القلق؛ ابحث عن الحرية، ولكن لا تدع الفوضى تحكم.",
            luckyDays: [5, 14, 23]
        },
        6: { 
            title: "الانسجام والملاذ", 
            overview: "سوف ينتقل تركيزك حتماً نحو منزلك وعائلتك ومسؤولياتك الشخصية العميقة. هذا عام رعاية وشفاء عميق حيث يتم تسليط الضوء على دورك كمقدم رعاية وحامي. خلق الانسجام الجمالي والعاطفي أمر بالغ الأهمية.",
            career: "ستزدهر الشركات الموجهة نحو الخدمة والتصميم وأدوار القيادة المجتمعية في ظل هذه الطاقة الداعمة. يأتي الاستقرار المالي من خلال الشبكات الموثوقة وتقديم قيمة حقيقية للآخرين.",
            love: "هذا هو العام المثالي للزواج أو التخطيط للعائلة أو تعميق السعادة المنزلية. قلبك مفتوح على مصراعيه، لكن يجب عليك التأكد من أنك لا تفرط في العطاء لأولئك الذين يستنزفون نورك.",
            oracleWarning: "لا تدع رغبتك في شفاء الآخرين تحولك إلى شهيد؛ ضع حدودًا لحماية ملاذك الخاص.",
            luckyDays: [6, 15, 24]
        },
        7: { 
            title: "التأمل والصحوة", 
            overview: "عام روحي وتحليلي عميق يتطلب منك النظر إلى الداخل. أعطِ الأولوية للعزلة، وانغمس في الدراسات الباطنية أو العلمية، واترك حدسك يوجهك. العالم الخارجي يحتل مرتبة ثانوية بالنسبة للكون الشاسع في داخلك.",
            career: "البحث والتحليل والتعلم المتخصص مفضل للغاية على التواصل المكثف أو التوسع السريع. قد يتباطأ المكاسب المالية قليلاً لتسمح لك بالتركيز على اكتشاف هدف حياتك الحقيقي.",
            love: "قد تشعر بمزيد من الانسحاب أو تحتاج إلى مساحة شخصية كبيرة، مما قد يربك الشريك إذا لم يتم التواصل معه. إنه وقت لجذب اتصالات الروح المتوافقة روحياً أو فكرياً.",
            oracleWarning: "لا تدع التأمل الضروري يتحول إلى عزلة تامة وانفصال ساخر عن العالم.",
            luckyDays: [7, 16, 25]
        },
        8: { 
            title: "التجلي والإتقان", 
            overview: "مرحبًا بك في عام حصادك. البذور الكرمية التي زرعتها على مدار السبع سنوات الماضية ستؤتي ثمارها الآن. طالب بقوتك الشخصية، وادخل في السلطة التنفيذية، وأتقن المستوى المادي لإظهار الوفرة العميقة.",
            career: "هذا عام قوي للتقدم المهني والصفقات المالية الكبرى وتولي أدوار قيادية. ركز بشدة على طموحاتك؛ الكون يدعم تحركاتك المهنية الأكثر جرأة.",
            love: "ستظهر ديناميكيات القوة في العلاقات إلى الواجهة، مما يتطلب التوازن والاحترام المتبادل. ستجذب شركاء طموحين، ولكن يجب عليك التأكد من أن العمل لا يغطي تماماً على توافرك العاطفي.",
            oracleWarning: "تجنب الطموح القاسي؛ الإتقان الحقيقي يتطلب منك موازنة ثروتك المادية مع النزاهة الروحية.",
            luckyDays: [8, 17, 26]
        },
        9: { 
            title: "الاكتمال والإفراج", 
            overview: "أنت تمر بنهايات عميقة وتوسع إنساني والتخلي عما لم يعد يخدمك. امسح اللوحة تماماً — جسدياً وعاطفياً وروحياً — لتمهيد الأرض لولادة جديدة قوية في العام المقبل.",
            career: "ستنتهي المشاريع بشكل طبيعي، وقد تشعر بالرغبة في الانتقال من الأدوار التي تفتقر إلى المعنى العميق. العمل الخيري والمشاريع العالمية مدعومة بقوة كبرى.",
            love: "العلاقات التي تفتقر إلى أساس روحي عميق ستنحل بشكل طبيعي، مما يفسح المجال لحب أكثر توافقاً. إنها فترة غفران وتحرر من الأحقاد القديمة.",
            oracleWarning: "لا تتشبث بيأس بما يبتعد بشكل طبيعي؛ الاستسلام هو أعظم قوتك هذا العام.",
            luckyDays: [9, 18, 27]
        }
    },
    Hebrew: {
        1: { 
            title: "זרע של התחלות חדשות", 
            overview: "זוהי שנה של ייזום, זריעת זרעים ופעולה נועזת. אתם נכנסים למחזור חדש של תשע שנים, מה שהופך את הזמן הזה לאופטימלי לתביעת עצמאותכם והגדרה מחדש של דרככם. אומץ והסתמכות עצמית יהיו הנכסים הכי גדולים שלכם.",
            career: "הזדמנויות לקידום, הקמת עסק או התפתחות עצמאית גבוהות במיוחד. קחו סיכונים מחושבים ואל תחכו לאישור מאחרים כדי להוביל.",
            love: "ייתכן ותרגישו ממוקדים יותר בצרכים ובגבולות שלכם, מה שיכול לשנות את הדינמיקה במערכות יחסים. זהו זמן למשוך שותפים המכבדים את האוטונומיה שלכם.",
            oracleWarning: "היזהרו מיהירות וחוסר סבלנות; התקדמות דורשת מכם להוביל, לא רק לדרוש.",
            luckyDays: [1, 10, 28]
        },
        2: { 
            title: "טיפוח וחיבור", 
            overview: "לאחר הדחיפה האינטנסיבית של שנה 1, תקופה זו דורשת סבלנות, אינטואיציה ושיתוף פעולה. זהו זמן לבנות קשרים עמוקים, לחדד את התוכניות שלכם ולתת לזרעים ששתלתם להתחיל לנבוט בשקט. דיפלומטיה תפתח דלתות שכוח לא יכול.",
            career: "התמקדו בעבודת צוות, שותפויות ומשא ומתן במקום התרחבות סולו אגרסיבית. ייתכן שתעבדו מאחורי הקלעים ותאספו תמיכה חיונית למהלכים עתידיים.",
            love: "זוהי אחת השנים הכי מבטיחות למציאת אהבת נשמה עמוקה או הרמוניה במערכת יחסים קיימת. הרגישות הרגשית מוגברת ודורשת תקשורת עדינה.",
            oracleWarning: "אל תתנו לרגישות היתר להפוך לטינה; בטאו את הצרכים שלכם בבירור במקום לסגת לשתיקה.",
            luckyDays: [2, 11, 20]
        },
        3: { 
            title: "ביטוי והתרחבות", 
            overview: "שנה תוססת ויצירתית מאוד, הרוטטת באנרגיה חברתית וביטוי עצמי. אתם נקראים לבטא את האמת שלכם באומץ, לחקור את העולם בשמחה ולשתף את הקול הייחודי שלכם. שמחה ואופטימיות הן הכוחות המנחים אתכם.",
            career: "תקשורת, אמנות ותפקידים ציבוריים מועדפים מאוד עכשיו. הכריזמה שלכם ממגנטת — השתמשו בה כדי להציג רעיונות וליצור קשרים מקצועיים יצירתיים.",
            love: "המעגל החברתי שלכם יתרחב ויביא קשרים מרגשים אך לפעמים חולפים. במערכות יחסים קיימות, תעדוף של הומור ודיאלוג פתוח יצית מחדש את הניצוץ.",
            oracleWarning: "הימנעו מפיזור האנרגיה שלכם על יותר מדי עיסוקים טריוויאליים; רכזו את האש היצירתית שלכם כדי למנוע שחיקה.",
            luckyDays: [3, 12, 21]
        },
        4: { 
            title: "יסודות ועוצמה", 
            overview: "זהו הזמן להכות שורשים ולבסס סדר בלתי מתפשר בחייכם. הישארו ממושמעים, ארגנו את המרחב הפיזי והמנטלי שלכם והתמקצעו בתחומכם. עבודה קשה עכשיו תבטיח את היסודות שלכם לשנים הבאות.",
            career: "צפו לשנה תובענית הדורשת מאמץ שיטתי, ניהול ובניית מבנים מוצקים. עושר נצבר באמצעות השקעות עקביות ומעשיות ולא דרך סיכונים ספקולטיביים.",
            love: "אתם מחפשים יציבות ואמינות מעל לכל, מה שמהווה זמן טוב לחיזוק מחויבויות. אחריות משותפת ותמיכה מעשית הופכות לשפת האהבה העיקרית שלכם.",
            oracleWarning: "אל תתנו למשמעת להפוך לעקשנות; זכרו לבנות גמישות בתוך המבנים הנוקשים שלכם.",
            luckyDays: [4, 13, 22]
        },
        5: { 
            title: "חופש ושינוי צורה", 
            overview: "התכוננו לשינויים דינמיים, הרפתקאות מרגשות ותפניות בלתי צפויות. המבנים שבניתם בשנה שעברה ישמשו כעת ככן שיגור לחקירת אופקים חדשים. קבלו את חוסר הוודאות והישארו גמישים.",
            career: "נסיעות, מדיה, מכירות ושינויי קריירה פתאומיים מודגשים כאן ומציעים הזדמנויות רווחיות אך ספונטניות. הימנעו מלהינעל בחוזים מגבילים מאוד בשלב זה.",
            love: "שנה ממגנטת, חושנית ובלתי צפויה לרומנטיקה, המעדיפה מפגשים מרגשים על פני התבססות עמוקה. שותפויות קיימות חייבות להכניס גיוון וחופש כדי למנוע תחושת מחנק.",
            oracleWarning: "היזהרו מהחלטות אימפולסיביות המונעות מחוסר מנוחה; חפשו את החופש, אך אל תזמינו כאוס.",
            luckyDays: [5, 14, 23]
        },
        6: { 
            title: "הרמוניה ומקלט", 
            overview: "תשומת הלב שלכם תופנה בהכרח לעבר הבית, המשפחה והאחריות האישית העמוקה. זוהי שנה מטפחת ומרפאה שבה מודגש תפקידכם כמטפלים ומגינים. יצירת הרמוניה רגשית היא בעלת חשיבות עליונה.",
            career: "עסקים מוטי שירות, עיצוב ותפקידי מנהיגות קהילתיים ישגשגו. יציבות פיננסית מגיעה דרך רשתות אמון ומתן ערך אמיתי לאחרים.",
            love: "זוהי השנה האולטימטיבית לנישואין, תכנון משפחה או העמקת האושר הביתי. הלב שלכם פתוח לרווחה, אך עליכם לוודא שאינכם נותנים יותר מדי לאלו השואבים את האנרגיה שלכם.",
            oracleWarning: "אל תתנו לרצון שלכם לרפא אחרים להפוך אתכם לקורבנות; הציבו גבולות כדי להגן על המקלט הפרטי שלכם.",
            luckyDays: [6, 15, 24]
        },
        7: { 
            title: "התבוננות עצמית והתעוררות", 
            overview: "שנה רוחנית ואנליטית עמוקה הדורשת מכם להביט פנימה. תנו עדיפות להתבודדות, העמיקו בלימודים אזוטריים או פילוסופיים ותנו לאינטואיציה להוביל. העולם החיצוני לוקח צעד אחורה.",
            career: "מחקר, ניתוח ולמידה מתמחה מועדפים מאוד על פני נטוורקינג אינטנסיבי. הרווחים הכספיים עשויים להאט מעט כדי לאפשר לכם להתמקד בגילוי ייעודכם בחיים.",
            love: "ייתכן ותרגישו נסוגים יותר או שתזדקקו למרחב אישי משמעותי. זהו זמן למשוך קשרי נשמה עמוקים מבחינה אינטלקטואלית או רוחנית.",
            oracleWarning: "אל תתנו להתבוננות הפנימית הדרושה להדרדר לבידוד מוחלט וניתוק ציני מהעולם.",
            luckyDays: [7, 16, 25]
        },
        8: { 
            title: "הגשמה ומומחיות", 
            overview: "ברוכים הבאים לשנת הקציר שלכם. הזרעים הקארמתיים שזרעתם בשבע השנים האחרונות יישאו כעת פרי. תבעו את כוחכם האישי ושלטו במישור החומרי כדי להגשים שפע עמוק.",
            career: "זוהי שנה חזקה לקידום בקריירה, עסקאות פיננסיות גדולות ותפיסת תפקידי מנהיגות. התמקדו באינטנסיביות בשאיפותיכם; היקום מגבה את המהלכים המקצועיים הנועזים ביותר.",
            love: "דינמיקה של כוח במערכות יחסים תעלה לקדמת הבמה ותדרוש איזון וכבוד הדדי. אתם תמשכו שותפים שאפתניים, אך עליכם לוודא שהעבודה לא מעיבה על הזמינות הרגשית.",
            oracleWarning: "הימנעו משאפתנות חסרת רחמים; מומחיות אמיתית דורשת לאזן את העושר החומרי עם יושרה רוחנית.",
            luckyDays: [8, 17, 26]
        },
        9: { 
            title: "השלמה ושחרור", 
            overview: "אתם חווים סגירות מעגל עמוקות, התרחבות הומניטרית ושחרור של מה שכבר לא משרת אתכם. נקו את הלוח לחלוטין — פיזית, רגשית ורוחנית — כדי להכין את הקרקע ללידה מחדש בשנה הבאה.",
            career: "פרויקטים יסתיימו באופן טבעי, וייתכן שתרגישו דחף לעבור לתפקידים עם משמעות עמוקה יותר. עבודה קהילתית ופרויקטים יצירתיים זוכים לתמיכה רבה.",
            love: "מערכות יחסים שחסרות בסיס נשמתי עמוק יתפוגגו בטבעיות, ויפנו מקום לאהבה תואמת יותר. זוהי תקופה של סליחה ושחרור טינות ישנות.",
            oracleWarning: "אל תיאחזו בייאוש במה שמתרחק באופן טבעי; השחרור הוא הכוח הגדול ביותר שלכם השנה.",
            luckyDays: [9, 18, 27]
        }
    }
};

export const PersonalMonthInsights: LocalizedInsights = {
    English: {
        1: { 
            title: "Action & Initiation", 
            overview: "A surge of fresh energy sweeps through this month, demanding urgency and momentum. This is the optimal time to plant seeds, launch new initiatives, and assert your independence. Hesitation is your enemy right now.",
            career: "Take the lead on a project or step into visibility. Do not wait for someone to hand you an opportunity; you must create it this month.",
            love: "You may feel a strong pull toward independence, which can revitalize stagnant connections if communicated well. Single? Focus on yourself; confidence is your most attractive trait right now.",
            oracleWarning: "Do not let the rush of new energy make you reckless; move fast, but check your blind spots.",
            luckyDays: [1, 10, 19]
        },
        2: { 
            title: "Patience & Intuition", 
            overview: "After the push of last month, the universe asks you to slow down, listen, and tune in. This cycle favors receptivity, diplomacy, and the quiet culmination of background details. Let things unfold naturally without forcing outcomes.",
            career: "Focus heavily on teamwork, resolving conflicts, and building alliances. Aggressive solo moves will likely meet resistance, whereas collaboration will open doors.",
            love: "An exceptionally romantic and sensitive month, perfect for deepening intimacy or meeting someone aligned with your soul. Your intuition in matters of the heart is razor-sharp.",
            oracleWarning: "Avoid absorbing the emotional baggage of everyone around you; protect your energy.",
            luckyDays: [2, 11, 20]
        },
        3: { 
            title: "The Creative Spark", 
            overview: "Your charisma is magnetic, and the energy of the month is vibrant, social, and expressive. You are called to communicate your ideas, enjoy art or leisure, and infuse joy into your daily routines. Allow yourself to be seen and heard.",
            career: "Pitch the bold idea, give the presentation, or focus on marketing and public relations. Creativity will solve problems that logic currently cannot.",
            love: "Expect your social calendar to fill up with fun, lighter, and potentially flirtatious energy. Bring humor and playfulness back into long-term partnerships.",
            oracleWarning: "Do not let social distractions cause you to drop the ball on important, practical commitments.",
            luckyDays: [3, 12, 21]
        },
        4: { 
            title: "Building the Base", 
            overview: "The party is over, and it is time to focus strictly on details, order, and heavy lifting. This is a highly pragmatic month where discipline pays off exponentially. You are building the scaffolding for future successes.",
            career: "A month for administrative catch-up, organizing systems, and grinding through the unglamorous tasks. Financial caution and long-term planning are favored over speculative risks.",
            love: "Romance takes a backseat to shared responsibilities, loyalty, and practical support. Showing up reliably represents the deepest form of love right now.",
            oracleWarning: "Do not view the necessary hard work as a punishment; it is exactly what you need to feel secure.",
            luckyDays: [4, 13, 22]
        },
        5: { 
            title: "Unpredictable Shifts", 
            overview: "Routine gets thrown out the window as this month ushers in dynamic, fast-paced changes. Be flexible, adaptable, and ready for rapid shifts in your schedule or environment. It is a time of exploration, travel, and unexpected news.",
            career: "Favorable for networking, pivoting strategies, and seizing suddenly available opportunities. Expect communication to be high-speed and slightly chaotic.",
            love: "Sensual, magnetic, and highly unpredictable. If single, you may attract unusual or exciting people. Couples must shake up their routine to avoid feeling trapped.",
            oracleWarning: "Beware of making irreversible, impulsive decisions just because you feel momentarily bored.",
            luckyDays: [5, 14, 23]
        },
        6: { 
            title: "Heart & Hearth", 
            overview: "Your attention is demanded by loved ones, your home, and your community. This is a deeply healing and responsible month where you are called to nurture others. Creating sanctuary and resolving domestic issues takes center stage.",
            career: "Focus on service, team morale, and providing genuine value to clients or colleagues. Financial gains come through businesses related to home, health, or aesthetics.",
            love: "A prime month for domestic bliss, nesting, and healing old relationship wounds. If single, you are drawing in people seeking commitment and stability.",
            oracleWarning: "Do not over-extend yourself to the point of resentment; remember that 'no' is an act of self-care.",
            luckyDays: [6, 15, 24]
        },
        7: { 
            title: "Inner Sanctuary", 
            overview: "You may feel a tug to stay in, withdraw slightly from the noise, and reflect. The focus shifts to inner analysis, spiritual growth, and research. Rest, meditate, and recharge your spiritual batteries before the busy months ahead.",
            career: "Excellent for deep, uninterrupted work, writing, or strategic analysis. It is not the best month for aggressive networking or forcing financial expansion.",
            love: "You may require more alone time, which is healthy, provided you communicate it to your partner. Deep, silent understanding is favored over loud social dates.",
            oracleWarning: "Avoid falling into spirals of overthinking or cynical detachment from the people who care about you.",
            luckyDays: [7, 16, 25]
        },
        8: { 
            title: "Materializing Focus", 
            overview: "Opportunity is knocking loudly. This is a powerhouse month to focus strictly on your goals, finances, and material security. You possess executive energy; use it to organize, lead, and demand what you are worth.",
            career: "Ask for the raise, sign the contract, or launch the product. Business acumen is high, and you are well-positioned to step into authority.",
            love: "Relationships may feel transactional or heavily focused on mutual goals and status. Ensure you make time for emotional intimacy, not just building an empire.",
            oracleWarning: "Do not let ambition turn into ruthlessness or an obsession with control.",
            luckyDays: [8, 17, 26]
        },
        9: { 
            title: "Clearing the Slate", 
            overview: "A powerful month of emotional clutter-clearing and completion. You are wrapping up a nine-month cycle; tie up loose ends, give away what you no longer need, and release what you do not wish to carry forward.",
            career: "Finish existing projects rather than starting new ones. You may feel a strong desire to transition away from work that lacks deep humanitarian or creative purpose.",
            love: "A time for forgiveness and closure. Relationships that are fundamentally misaligned may naturally end, making space for a healthier chapter next month.",
            oracleWarning: "Do not fear the endings happening right now; they are making space for your imminent rebirth.",
            luckyDays: [9, 18, 27]
        }
    },
    Spanish: {
        1: { 
            title: "Acción e Iniciación", 
            overview: "Una oleada de energía fresca recorre este mes, exigiendo urgencia e impulso. Es el momento óptimo para plantar semillas, lanzar nuevas iniciativas y afirmar tu independencia. La vacilación es tu enemiga ahora mismo.",
            career: "Toma el liderazgo en un proyecto o hazte visible. No esperes a que alguien te dé una oportunidad; debes crearla tú mismo este mes.",
            love: "Podrías sentir una fuerte atracción hacia la independencia, lo que puede revitalizar conexiones estancadas si se comunica bien. ¿Soltero? Enfócate en ti; la confianza es tu rasgo más atractivo ahora.",
            oracleWarning: "No permitas que la prisa de la nueva energía te vuelva temerario; muévete rápido, pero vigila tus puntos ciegos.",
            luckyDays: [1, 10, 19]
        },
        2: { 
            title: "Paciencia e Intuición", 
            overview: "Tras el empuje del mes pasado, el universo te pide que bajes el ritmo, escuches y sintonices. Este ciclo favorece la receptividad, la diplomacia y la culminación silenciosa de los detalles de fondo. Deja que las cosas fluyan naturalmente.",
            career: "Enfócate fuertemente en el trabajo en equipo, la resolución de conflictos y la creación de alianzas. Los movimientos agresivos en solitario encontrarán resistencia.",
            love: "Un mes excepcionalmente romántico y sensible, perfecto para profundizar la intimidad o conocer a alguien alineado con tu alma. Tu intuición en el amor es afiladísima.",
            oracleWarning: "Evita absorber el equipaje emocional de todos los que te rodean; protege tu energía.",
            luckyDays: [2, 11, 20]
        },
        3: { 
            title: "La Chispa Creativa", 
            overview: "Tu carisma es magnético y la energía del mes es vibrante, social y expresiva. Estás llamado a comunicar tus ideas, disfrutar del arte o el ocio e infundir alegría en tus rutinas diarias. Permítete ser visto y escuchado.",
            career: "Presenta esa idea audaz o enfócate en el marketing y las relaciones públicas. La creatividad resolverá problemas que la lógica no puede solucionar actualmente.",
            love: "Espera que tu agenda social se llene de energía divertida y potencialmente coqueta. Aporta humor y alegría de nuevo a las relaciones de largo plazo.",
            oracleWarning: "No permitas que las distracciones sociales hagan que descuides compromisos prácticos importantes.",
            luckyDays: [3, 12, 21]
        },
        4: { 
            title: "Construyendo la Base", 
            overview: "La fiesta terminó y es hora de enfocarse estrictamente en los detalles, el orden y el trabajo pesado. Este es un mes altamente pragmático donde la disciplina rinde frutos exponenciales. Estás construyendo el andamiaje para éxitos futuros.",
            career: "Un mes para el trabajo administrativo, organizar sistemas y avanzar en tareas poco glamurosas. Se favorece la precaución financiera sobre los riesgos especulativos.",
            love: "El romance pasa a un segundo plano frente a las responsabilidades compartidas y el apoyo práctico. Mostrarse confiable es la forma más profunda de amor ahora mismo.",
            oracleWarning: "No veas el trabajo duro necesario como un castigo; es exactamente lo que necesitas para sentirte seguro.",
            luckyDays: [4, 13, 22]
        },
        5: { 
            title: "Cambios Impredecibles", 
            overview: "La rutina se rompe este mes, trayendo cambios dinámicos y de ritmo rápido. Sé flexible, adaptable y prepárate para giros rápidos en tu agenda o entorno. Es un tiempo de exploración y noticias inesperadas.",
            career: "Favorable para el networking y para aprovechar oportunidades que surjan de repente. Espera que la comunicación sea de alta velocidad y ligeramente caótica.",
            love: "Sensual, magnético y altamente impredecible. Si estás soltero, podrías atraer a personas inusuales. Las parejas deben sacudir su rutina para evitar sentirse atrapadas.",
            oracleWarning: "Cuidado con tomar decisiones irreversibles e impulsivas solo porque te sientes momentáneamente aburrido.",
            luckyDays: [5, 14, 23]
        },
        6: { 
            title: "Corazón y Hogar", 
            overview: "Tus seres queridos, tu hogar y tu comunidad demandan tu atención. Este es un mes profundamente curativo y responsable donde estás llamado a nutrir a los demás. Crear un santuario es lo más importante.",
            career: "Enfócate en el servicio, la moral del equipo y en aportar valor genuino. Las ganancias financieras vienen a través de negocios relacionados con el hogar o la estética.",
            love: "Un mes ideal para la dicha doméstica y para sanar viejas heridas relacionales. Si estás soltero, estás atrayendo a personas que buscan compromiso y estabilidad.",
            oracleWarning: "No te exijas demasiado hasta el punto del resentimiento; recuerda que decir 'no' es un acto de autocuidado.",
            luckyDays: [6, 15, 24]
        },
        7: { 
            title: "Refugio Interior", 
            overview: "Podrías sentir el deseo de quedarte en casa, alejarte un poco del ruido y reflexionar. El enfoque cambia hacia el análisis interno, el crecimiento espiritual y la investigación. Descansa y recarga tus baterías espirituales.",
            career: "Excelente para el trabajo profundo, la escritura o el análisis estratégico. No es el mejor mes para un networking agresivo o para forzar la expansión financiera.",
            love: "Quizás requieras más tiempo a solas, lo cual es saludable siempre que lo comuniques a tu pareja. Se favorece el entendimiento profundo y silencioso.",
            oracleWarning: "Evita caer en espirales de exceso de pensamiento o en un desapego cínico de las personas que te quieren.",
            luckyDays: [7, 16, 25]
        },
        8: { 
            title: "Enfoque Material", 
            overview: "La oportunidad está llamando con fuerza. Este es un mes potente para enfocarte estrictamente en tus metas, finanzas y seguridad material. Posees energía ejecutiva; úsala para organizar y liderar.",
            career: "Pide ese aumento, firma el contrato o lanza el producto. Tu perspicacia empresarial es alta y estás bien posicionado para asumir autoridad.",
            love: "Las relaciones pueden sentirse transaccionales o muy enfocadas en metas mutuas. Asegúrate de hacer tiempo para la intimidad emocional, no solo para construir un imperio.",
            oracleWarning: "No permitas que la ambición se convierta en crueldad o en una obsesión por el control.",
            luckyDays: [8, 17, 26]
        },
        9: { 
            title: "Borrón y Cuenta Nueva", 
            overview: "Un mes poderoso de limpieza emocional y finalización. Estás cerrando un ciclo de nueve meses; ata los cabos sueltos y libera lo que no deseas llevar contigo hacia adelante.",
            career: "Termina proyectos existentes en lugar de comenzar nuevos. Podrías sentir un fuerte deseo de alejarte de trabajos que carecen de un propósito creativo profundo.",
            love: "Tiempo de perdón y cierre. Las relaciones que están fundamentalmente desalineadas pueden terminar naturalmente, dejando espacio para un capítulo más saludable el próximo mes.",
            oracleWarning: "No temas a los finales que están ocurriendo ahora; están haciendo espacio para tu inminente renacimiento.",
            luckyDays: [9, 18, 27]
        }
    },
    Portuguese: {
        1: { 
            title: "Ação e Iniciação", 
            overview: "Uma onda de energia fresca percorre este mês, exigindo urgência e dinamismo. É o momento ideal para plantar sementes, lançar novas iniciativas e afirmar sua independência. Hesitar é seu maior inimigo agora.",
            career: "Assuma a liderança em um projeto ou coloque-se em evidência. Não espere que alguém lhe dê uma oportunidade; você deve criá-la este mês.",
            love: "Você pode sentir um forte desejo de independência, o que pode revitalizar conexões estagnadas se bem comunicado. Solteiro? Foque em si mesmo; a confiança é seu traço mais atraente agora.",
            oracleWarning: "Não deixe que a pressa da nova energia o torne imprudente; mova-se rápido, mas observe seus pontos cegos.",
            luckyDays: [1, 10, 19]
        },
        2: { 
            title: "Paciência e Intuição", 
            overview: "Após o impulso do mês passado, o universo pede que você desacelere, ouça e sintonize-se. Este ciclo favorece a receptividade, a diplomacia e a conclusão silenciosa de detalhes. Deixe as coisas fluírem naturalmente.",
            career: "Foque intensamente no trabalho em equipe, na resolução de conflitos e na criação de alianças. Movimentos agressivos solo provavelmente encontrarão resistência.",
            love: "Um mês excepcionalmente romântico e sensível, perfeito para aprofundar a intimidade ou conhecer alguém alinhado com sua alma. Sua intuição no amor está afiadíssima.",
            oracleWarning: "Evite absorver a bagagem emocional de todos ao seu redor; proteja sua própria energia.",
            luckyDays: [2, 11, 20]
        },
        3: { 
            title: "Centelha Criativa", 
            overview: "Seu carisma é magnético e a energia do mês é vibrante, social e expressiva. Você é chamado a comunicar suas ideias, desfrutar de arte ou lazer e infundir alegria em suas rotinas. Permita-se ser visto e ouvido.",
            career: "Apresente aquela ideia ousada ou foque em marketing e relações públicas. A criatividade resolverá problemas que a lógica não consegue no momento.",
            love: "Espere que sua agenda social fique cheia de energia divertida e potencialmente paqueradora. Traga humor e leveza de volta para parcerias de longo prazo.",
            oracleWarning: "Não deixe que as distrações sociais o façam negligenciar compromissos práticos importantes.",
            luckyDays: [3, 12, 21]
        },
        4: { 
            title: "Construindo a Base", 
            overview: "A festa acabou e é hora de focar estritamente em detalhes, ordem e trabalho árduo. Este é um mês altamente pragmático onde a disciplina compensa exponencialmente. Você está construindo a base para sucessos futuros.",
            career: "Um mês para organização administrativa, sistemas e tarefas menos glamourosas. A cautela financeira é favorecida em relação a riscos especulativos.",
            love: "O romance fica em segundo plano diante das responsabilidades compartilhadas e do apoio prático. Mostrar-se confiável é a forma mais profunda de amor agora.",
            oracleWarning: "Não veja o trabalho árduo necessário como uma punição; é exatamente o que você precisa para se sentir seguro.",
            luckyDays: [4, 13, 22]
        },
        5: { 
            title: "Mudanças Imprevisíveis", 
            overview: "A rotina é deixada de lado conforme este mês traz mudanças dinâmicas e rápidas. Seja flexível, adaptável e esteja pronto para viradas bruscas em sua agenda ou ambiente. É tempo de exploração e notícias inesperadas.",
            career: "Favorável para networking e para aproveitar oportunidades que surgem de repente. Espere que a comunicação seja de alta velocidade e levemente caótica.",
            love: "Sensual, magnético e altamente imprevisível. Se solteiro, você pode atrair pessoas incomuns. Casais devem sacudir a rotina para evitar a sensação de confinamento.",
            oracleWarning: "Cuidado ao tomar decisões irreversíveis e impulsivas apenas por se sentir momentaneamente entediado.",
            luckyDays: [5, 14, 23]
        },
        6: { 
            title: "Coração e Lar", 
            overview: "Sua atenção é exigida por entes queridos, seu lar e sua comunidade. Este é um mês profundamente curativo e de responsabilidade, onde você é chamado a cuidar dos outros. Criar um santuário doméstico é a prioridade.",
            career: "Foque no serviço, no moral da equipe e em fornecer valor genuíno. Ganhos financeiros vêm através de negócios relacionados ao lar, saúde ou estética.",
            love: "Um mês excelente para a felicidade doméstica e para curar velhas feridas de relacionamento. Se solteiro, você está atraindo pessoas que buscam compromisso e estabilidade.",
            oracleWarning: "Não se sobrecarregue a ponto de sentir ressentimento; lembre-se de que dizer 'não' é um ato de autocuidado.",
            luckyDays: [6, 15, 24]
        },
        7: { 
            title: "Santuário Interior", 
            overview: "Você pode sentir vontade de ficar mais reservado, afastar-se um pouco do ruído e refletir. O foco muda para a análise interna, crescimento espiritual e pesquisa. Descanse e recarregue suas baterias espirituais.",
            career: "Excelente para trabalho profundo, escrita ou análise estratégica. Não é o melhor mês para networking agressivo ou expansão financeira forçada.",
            love: "Você pode precisar de mais tempo sozinho, o que é saudável, desde que comunique isso ao parceiro. O entendimento profundo e silencioso é favorecido.",
            oracleWarning: "Evite cair em espirais de excesso de reflexão ou de distanciamento cínico das pessoas que se importam com você.",
            luckyDays: [7, 16, 25]
        },
        8: { 
            title: "Foco Material", 
            overview: "A oportunidade está batendo forte à porta. Este é um mês de grande poder para focar estritamente em suas metas, finanças e segurança material. Você possui energia executiva; use-a para organizar e liderar.",
            career: "Peça aquele aumento, assine o contrato ou lance o produto. Seu tino comercial está elevado e você está bem posicionado para assumir autoridade.",
            love: "Os relacionamentos podem parecer transacionais ou muito focados em metas mútuas. Certifique-se de reservar tempo para a intimidade emocional, não apenas para construir um império.",
            oracleWarning: "Não deixe que a ambição se torne crueldade ou obsessão por controle.",
            luckyDays: [8, 17, 26]
        },
        9: { 
            title: "Limpando a Área", 
            overview: "Um mês poderoso de limpeza emocional e conclusão. Você está encerrando um ciclo de nove meses; resolva pendências e libere o que não deseja levar adiante.",
            career: "Termine projetos existentes em vez de começar novos. Você pode sentir um forte desejo de transitar para fora de trabalhos que carecem de um propósito profundo.",
            love: "Um tempo para perdão e fechamento. Relacionamentos que estão desalinhados podem terminar naturalmente, abrindo espaço para um capítulo mais saudável no próximo mês.",
            oracleWarning: "Não tema os encerramentos que ocorrem agora; eles estão abrindo espaço para o seu renascimento iminente.",
            luckyDays: [9, 18, 27]
        }
    },
    French: {
        1: { 
            title: "Action et Initiation", 
            overview: "Une vague d'énergie fraîche déferle ce mois-ci, exigeant urgence et dynamisme. C'est le moment idéal pour semer, lancer de nouvelles initiatives et affirmer votre indépendance. L'hésitation est votre ennemie.",
            career: "Prenez la tête d'un projet ou mettez-vous en avant. N'attendez pas qu'on vous donne une opportunité ; créez-la vous-même ce mois-ci.",
            love: "Vous pourriez ressentir un fort besoin d'indépendance, ce qui peut revitaliser des liens stagnants. Célibataire ? Concentrez-vous sur vous ; la confiance est votre meilleur atout.",
            oracleWarning: "Ne laissez pas la fougue de cette nouvelle énergie vous rendre téméraire ; avancez vite, mais restez vigilant.",
            luckyDays: [1, 10, 19]
        },
        2: { 
            title: "Patience et Intuition", 
            overview: "Après l'élan du mois dernier, l'univers demande de ralentir et d'écouter. Ce cycle favorise la réceptivité, la diplomatie et l'achèvement discret des détails. Laissez les choses se dérouler naturellement.",
            career: "Privilégiez le travail d'équipe et la création d'alliances. Les initiatives solo agressives rencontreront de la résistance, tandis que la collaboration vous ouvrira des portes.",
            love: "Un mois exceptionnellement romantique, parfait pour approfondir l'intimité. Votre intuition en amour est particulièrement aiguisée.",
            oracleWarning: "Évitez d'absorber les bagages émotionnels de votre entourage ; protégez votre propre énergie.",
            luckyDays: [2, 11, 20]
        },
        3: { 
            title: "L'Étincelle Créative", 
            overview: "Votre charisme est magnétique et l'énergie du mois est vibrante, sociale et expressive. Vous êtes appelé à communiquer vos idées et à insuffler de la joie dans votre quotidien. Permettez-vous d'être vu et entendu.",
            career: "Présentez vos idées audacieuses ou misez sur le marketing et les relations publiques. La créativité résoudra des problèmes que la logique ne peut régler pour l'instant.",
            love: "Votre agenda social sera bien rempli. Apportez de l'humour et de la légèreté dans vos relations de longue date.",
            oracleWarning: "Ne laissez pas les distractions sociales vous faire négliger vos engagements pratiques importants.",
            luckyDays: [3, 12, 21]
        },
        4: { 
            title: "Construire la Base", 
            overview: "C'est le moment de se concentrer strictement sur les détails, l'ordre et le travail de fond. C'est un mois très pragmatique où la discipline paie énormément. Vous construisez les fondations de vos futurs succès.",
            career: "Un mois pour l'organisation administrative et les tâches de fond. La prudence financière et la planification à long terme sont à privilégier.",
            love: "La romance passe au second plan derrière les responsabilités partagées, la loyauté et le soutien pratique. Être présent et fiable est aujourd'hui la plus belle preuve d'amour.",
            oracleWarning: "Ne voyez pas le travail exigeant comme une punition ; c'est ce qui vous permet de vous sentir en sécurité.",
            luckyDays: [4, 13, 22]
        },
        5: { 
            title: "Changements imprévisibles", 
            overview: "La routine s'envole : ce mois apporte des changements dynamiques et rapides. Soyez flexible, adaptable et prêt à des imprévus dans votre emploi du temps ou votre environnement. C'est une période d'exploration, de déplacement et d'informations inattendues.",
            career: "Favorable au réseautage, aux changements de stratégie et aux opportunités soudaines. La communication sera intense et un peu chaotique.",
            love: "Mois sensuel, magnétique et très imprévisible. Si vous êtes seul, vous pouvez attirer des personnes inhabituelles ou passionnantes. Les couples doivent bousculer leur routine pour éviter l'étouffement.",
            oracleWarning: "Méfiez-vous des décisions impulsives et irréversibles prises seulement par ennui passager.",
            luckyDays: [5, 14, 23]
        },
        6: { 
            title: "Cœur et Foyer", 
            overview: "Votre attention est sollicitée par vos proches, votre foyer et votre entourage. C'est un mois profondément nourrissant et responsable où l'on vous appelle à prendre soin des autres. La création d'un sanctuaire harmonieux est prioritaire.",
            career: "Misez sur le service et le moral de l'équipe. Les gains financiers proviendront des domaines liés à la maison, à la santé ou à l'esthétique.",
            love: "Un mois idéal pour le bonheur domestique et pour soigner d'anciennes blessures relationnelles. Les célibataires attirent des personnes stables.",
            oracleWarning: "Ne vous surmenez pas au point d'en éprouver du ressentiment ; savoir dire 'non' est aussi une forme de soin.",
            luckyDays: [6, 15, 24]
        },
        7: { 
            title: "Sanctuaire Intérieur", 
            overview: "Vous pourriez ressentir le besoin de vous retirer un peu du bruit pour réfléchir. Le focus se déplace vers l'analyse intérieure et la croissance spirituelle. Reposez-vous et rechargez vos batteries spirituelles.",
            career: "Excellent pour le travail de fond, l'écriture ou l'analyse stratégique. Ce n'est pas le moment pour le réseautage agressif ou l'expansion financière forcée.",
            love: "Vous pourriez avoir besoin de plus de temps seul. Une compréhension profonde et silencieuse est plus bénéfique que de grandes sorties mondaines.",
            oracleWarning: "Évitez de tomber dans une spirale de réflexion excessive ou de détachement cynique envers vos proches.",
            luckyDays: [7, 16, 25]
        },
        8: { 
            title: "Focalisation Matérielle", 
            overview: "L'opportunité frappe fort à votre porte. C'est un mois puissant pour se concentrer sur vos objectifs, vos finances et votre sécurité matérielle. Utilisez votre énergie de leader pour organiser et diriger.",
            career: "Demandez une augmentation, signez des contrats ou lancez vos projets. Votre sens des affaires est aiguisé et vous êtes bien placé pour affirmer votre autorité.",
            love: "Les relations peuvent sembler pragmatiques ou centrées sur des objectifs communs. Veillez à préserver l'intimité émotionnelle, pas seulement la réussite matérielle.",
            oracleWarning: "Ne laissez pas l'ambition se transformer en dureté ou en obsession du contrôle.",
            luckyDays: [8, 17, 26]
        },
        9: { 
            title: "Faire Table Rase", 
            overview: "Un mois puissant de nettoyage émotionnel et d'achèvement. Vous terminez un cycle de neuf mois ; réglez les derniers détails et libérez-vous de ce que vous ne voulez plus porter.",
            career: "Terminez vos projets actuels plutôt que d'en lancer de nouveaux. Vous pourriez vouloir quitter des rôles qui manquent de sens profond ou de créativité.",
            love: "Place au pardon et à la clôture. Les relations qui ne sont plus alignées peuvent prendre fin naturellement pour laisser place à un nouveau chapitre.",
            oracleWarning: "Ne craignez pas les fins actuelles ; elles font de la place pour votre renaissance imminente.",
            luckyDays: [9, 18, 27]
        }
    },
    German: {
        1: { 
            title: "Aktion und Initiation", 
            overview: "Eine Welle frischer Energie durchflutet diesen Monat und verlangt nach Tatkraft. Dies ist die optimale Zeit, um Samen zu säen, neue Initiativen zu starten und deine Unabhängigkeit zu behaupten. Zögern ist jetzt dein Feind.",
            career: "Übernimm die Führung bei einem Projekt oder zeige mehr Präsenz. Warte nicht darauf, dass dir jemand eine Chance gibt; du musst sie diesen Monat selbst kreieren.",
            love: "Du spürst vielleicht einen starken Drang nach Unabhängigkeit. Als Single? Konzentriere dich auf dich selbst; Selbstvertrauen ist jetzt deine attraktivste Eigenschaft.",
            oracleWarning: "Lass dich vom Rausch der neuen Energie nicht zu Leichtsinn verleiten; sei schnell, aber achte auf deine blinden Flecken.",
            luckyDays: [1, 10, 19]
        },
        2: { 
            title: "Geduld und Intuition", 
            overview: "Nach dem Vorstoß des letzten Monats fordert dich das Universum auf, langsamer zu werden und zuzuhören. Dieser Zyklus begünstigt Empfänglichkeit, Diplomatie und das ruhige Klären von Details im Hintergrund.",
            career: "Konzentriere dich auf Teamarbeit und den Aufbau von Allianzen. Aggressive Sologänge werden auf Widerstand stoßen, während Zusammenarbeit Türen öffnet.",
            love: "Ein außergewöhnlich romantischer und sensibler Monat, perfekt um Intimität zu vertiefen. Deine Intuition in Herzensangelegenheiten ist messerscharf.",
            oracleWarning: "Vermeide es, den emotionalen Ballast deiner Mitmenschen aufzusaugen; schütze deine eigene Energie.",
            luckyDays: [2, 11, 20]
        },
        3: { 
            title: "Der kreative Funke", 
            overview: "Dein Charisma ist magnetisch und die Energie des Monats ist lebendig, sozial und ausdrucksstark. Du bist aufgerufen, deine Ideen zu kommunizieren und Freude in deinen Alltag zu bringen. Erlaube dir, gesehen und gehört zu werden.",
            career: "Präsentiere kühne Ideen oder konzentriere dich auf Marketing und PR. Kreativität wird Probleme lösen, bei denen Logik derzeit an ihre Grenzen stößt.",
            love: "Dein Sozialleben wird Fahrt aufnehmen. Bring wieder mehr Humor und Verspieltheit in langjährige Partnerschaften.",
            oracleWarning: "Lass dich nicht so sehr von sozialen Aktivitäten ablenken, dass du wichtige praktische Verpflichtungen vernachlässigst.",
            luckyDays: [3, 12, 21]
        },
        4: { 
            title: "Aufbau der Basis", 
            overview: "Die Party ist vorbei und es ist Zeit, sich strikt auf Details, Ordnung und harte Arbeit zu konzentrieren. Dies ist ein hochgradig pragmatischer Monat, in dem sich Disziplin auszahlt. Du baust das Gerüst für künftige Erfolge.",
            career: "Ein Monat für administrative Aufgaben und das Abarbeiten weniger glanzvoller Tätigkeiten. Finanzielle Vorsicht ist wichtiger als spekulative Risiken.",
            love: "Romantik tritt hinter gemeinsame Verantwortung und praktische Unterstützung zurück. Zuverlässigkeit zu zeigen ist jetzt die tiefste Form der Liebe.",
            oracleWarning: "Betrachte die notwendige harte Arbeit nicht als Strafe; sie ist genau das, was du brauchst, um dich sicher zu fühlen.",
            luckyDays: [4, 13, 22]
        },
        5: { 
            title: "Unvorhersehbare Veränderungen", 
            overview: "Routine wird über Bord geworfen, da dieser Monat dynamische, schnelle Veränderungen bringt. Sei flexibel und bereit für rasche Wechsel in deinem Zeitplan. Es ist eine Zeit der Erkundung und unerwarteter Neuigkeiten.",
            career: "Günstig für Networking und das Ergreifen plötzlich auftauchender Chancen. Die Kommunikation wird schnell und leicht chaotisch sein.",
            love: "Sinnlich, magnetisch und höchst unvorhersehbar. Paare sollten ihre Routine aufbrechen, um sich nicht eingeengt zu fühlen.",
            oracleWarning: "Hüte dich vor irreversiblen, impulsiven Entscheidungen, nur weil du dich momentan gelangweilt fühlst.",
            luckyDays: [5, 14, 23]
        },
        6: { 
            title: "Herz und Heimat", 
            overview: "Deine Aufmerksamkeit wird von geliebten Menschen, deinem Zuhause und deinem Umfeld gefordert. Dies ist ein zutiefst heilender Monat, in dem du aufgerufen bist, andere zu nähren. Die Schaffung eines Rückzugsortes steht im Mittelpunkt.",
            career: "Konzentriere dich auf Dienstleistung und Team-Moral. Finanzielle Gewinne kommen durch Tätigkeiten, die mit Wohnen, Gesundheit oder Ästhetik zu tun haben.",
            love: "Ein idealer Monat für häusliches Glück und das Heilen alter Beziehungswunden. Singles ziehen jetzt Menschen an, die Bindung und Stabilität suchen.",
            oracleWarning: "Verausgabe dich nicht so sehr, dass Groll entsteht; denke daran, dass 'Nein' ein Akt der Selbstfürsorge ist.",
            luckyDays: [6, 15, 24]
        },
        7: { 
            title: "Innere Zuflucht", 
            overview: "Du verspürst vielleicht den Drang, dich etwas vom Lärm zurückzuziehen und zu reflektieren. Der Fokus verschiebt sich auf innere Analyse und spirituelles Wachstum. Ruhe dich aus und lade deine Batterien auf.",
            career: "Hervorragend geeignet für vertiefte Arbeit, Schreiben oder strategische Analysen. Es ist nicht der beste Monat für aggressives Networking.",
            love: "Du brauchst vielleicht mehr Zeit für dich, was gesund ist, solange du es deinem Partner kommunizierst. Tiefes, stilles Verständnis ist jetzt wichtiger als laute Dates.",
            oracleWarning: "Vermeide es, in Gedankenspiralen oder eine zynische Distanz zu Menschen zu verfallen, die dir wichtig sind.",
            luckyDays: [7, 16, 25]
        },
        8: { 
            title: "Materieller Fokus", 
            overview: "Die Gelegenheit klopft lautstark an. Dies ist ein kraftvoller Monat, um dich strikt auf deine Ziele, Finanzen und materielle Sicherheit zu konzentrieren. Nutze deine exekutive Energie, um zu organisieren und zu führen.",
            career: "Frage nach einer Gehaltserhöhung, unterzeichne Verträge oder starte Projekte. Dein Geschäftssinn ist geschärft und du bist gut positioniert, um Autorität zu zeigen.",
            love: "Beziehungen könnten sich sachlich oder stark auf gemeinsame Ziele fokussiert anfühlen. Achte darauf, auch Zeit für emotionale Intimität einzuplanen.",
            oracleWarning: "Lass Ehrgeiz nicht in Rücksichtslosigkeit oder eine Obsession mit Kontrolle ausarten.",
            luckyDays: [8, 17, 26]
        },
        9: { 
            title: "Einen Schlussstrich ziehen", 
            overview: "Ein kraftvoller Monat der emotionalen Klärung und Vollendung. Du beendest einen Neun-Monats-Zyklus; schließe offene Punkte ab und lass los, was du nicht mehr weiter mit dir tragen möchtest.",
            career: "Beende bestehende Projekte, anstatt neue zu beginnen. Du verspürst vielleicht den Wunsch, Tätigkeiten aufzugeben, denen es an tiefem Sinn fehlt.",
            love: "Eine Zeit für Vergebung und Abschluss. Beziehungen, die grundlegend nicht mehr passen, könnten jetzt natürlich enden und Platz für Neues schaffen.",
            oracleWarning: "Fürchte dich nicht vor dem Ende; es schafft den Raum für deine bevorstehende Neugeburt.",
            luckyDays: [9, 18, 27]
        }
    },
    Russian: {
        1: { 
            title: "Действие и Инициация", 
            overview: "В этом месяце вас захлестнет волна свежей энергии, требующая решительности и напора. Это оптимальное время для новых начинаний и утверждения своей независимости. Промедление сейчас — ваш главный враг.",
            career: "Возьмите на себя руководство проектом или станьте заметнее. Не ждите, пока вам предложат возможность; вы сами должны создать ее в этом месяце.",
            love: "Вы можете почувствовать сильную тягу к независимости. Одиноки? Сосредоточьтесь на себе; уверенность — ваше самое привлекательное качество сейчас.",
            oracleWarning: "Не позволяйте приливу новой энергии сделать вас безрассудным; двигайтесь быстро, но проверяйте слепые зоны.",
            luckyDays: [1, 10, 19]
        },
        2: { 
            title: "Терпение и Интуиция", 
            overview: "После напора прошлого месяца Вселенная просит вас замедлиться и прислушаться. Этот цикл благоприятствует дипломатии и спокойной доработке деталей. Позвольте событиям развиваться естественно.",
            career: "Сосредоточьтесь на командной работе и создании альянсов. Агрессивные одиночные действия встретят сопротивление, а сотрудничество откроет новые двери.",
            love: "Исключительно романтичный и чувственный месяц, идеальный для углубления близости. Ваша интуиция в сердечных делах сейчас остра как бритва.",
            oracleWarning: "Старайтесь не впитывать эмоциональный багаж окружающих; защищайте свою энергию.",
            luckyDays: [2, 11, 20]
        },
        3: { 
            title: "Творческая Искра", 
            overview: "Ваша харизма магнетична, а энергия месяца полна жизни. Вам предлагается делиться своими идеями и наполнять радостью свои будни. Позвольте себе быть увиденным и услышанным.",
            career: "Предложите смелую идею или займитесь маркетингом и связями с общественностью. Творческий подход решит проблемы, с которыми логика сейчас не справляется.",
            love: "Ваш социальный календарь будет полон развлечений. Верните юмор и игривость в долгосрочные партнерские отношения.",
            oracleWarning: "Не позволяйте социальным отвлечениям заставлять вас забывать о важных практических обязательствах.",
            luckyDays: [3, 12, 21]
        },
        4: { 
            title: "Построение Базы", 
            overview: "Время веселья прошло, пора сосредоточиться на деталях, порядке и тяжелой работе. Это очень прагматичный месяц, в котором дисциплина приносит огромные плоды. Вы строите фундамент для будущих успехов.",
            career: "Месяц для административной работы, организации систем и выполнения рутинных задач. Финансовая осторожность сейчас важнее спекулятивных рисков.",
            love: "Романтика отходит на второй план перед общей ответственностью и практической поддержкой. Надежность — это высшая форма любви в данный момент.",
            oracleWarning: "Не воспринимайте тяжелую работу как наказание; это именно то, что нужно вам сейчас для чувства безопасности.",
            luckyDays: [4, 13, 22]
        },
        5: { 
            title: "Непредсказуемые Сдвиги", 
            overview: "Рутина летит в окно, так как этот месяц приносит динамичные и стремительные перемены. Будьте гибки и готовы к резким изменениям в расписании. Это время исследований и неожиданных новостей.",
            career: "Благоприятное время для нетворкинга и использования внезапно подвернувшихся возможностей. Общение будет высокоскоростным и слегка хаотичным.",
            love: "Чувственный, магнетический и непредсказуемый месяц. Парам стоит встряхнуть привычную рутину, чтобы избежать чувства застоя.",
            oracleWarning: "Остерегайтесь необратимых, импульсивных решений только потому, что вам стало скучно.",
            luckyDays: [5, 14, 23]
        },
        6: { 
            title: "Сердце и Очаг", 
            overview: "Вашего внимания требуют близкие люди и ваш дом. Это глубоко исцеляющий месяц, когда вы призваны заботиться о других. Создание домашнего уюта и решение бытовых вопросов выходят на первый план.",
            career: "Сфокусируйтесь на служении и моральном духе команды. Финансовая выгода придет через сферы, связанные с домом, здоровьем или эстетикой.",
            love: "Идеальный месяц для семейного счастья и залечивания старых ран в отношениях. Одинокие люди сейчас притягивают тех, кто ищет стабильности.",
            oracleWarning: "Не перенапрягайте себя до состояния обиды; помните, что умение сказать «нет» — это тоже забота о себе.",
            luckyDays: [6, 15, 24]
        },
        7: { 
            title: "Внутреннее Убежище", 
            overview: "Вы можете почувствовать желание отгородиться от шума и поразмышлять. Фокус смещается на внутренний анализ и духовный рост. Отдохните и перезарядите свои духовные батарейки.",
            career: "Отличное время для глубокой работы, писательства или стратегического анализа. Не лучший месяц для агрессивного нетворкинга.",
            love: "Вам может потребоваться больше времени наедине с собой. Глубокое понимание без слов сейчас важнее шумных свиданий в людных местах.",
            oracleWarning: "Избегайте погружения в спирали лишних раздумий или циничного отстранения от близких людей.",
            luckyDays: [7, 16, 25]
        },
        8: { 
            title: "Материальный Фокус", 
            overview: "Возможность громко стучится в дверь. Это мощный месяц для концентрации на целях, финансах и материальной безопасности. Используйте свою энергию руководителя, чтобы организовывать и вести за собой.",
            career: "Просите о повышении, подписывайте контракты или запускайте проекты. Ваша деловая хватка на высоте, и вы готовы заявить о своем авторитете.",
            love: "Отношения могут казаться прагматичными или сосредоточенными на общих целях. Обязательно находите время для эмоциональной близости.",
            oracleWarning: "Не позволяйте амбициям превратиться в безжалостность или одержимость контролем.",
            luckyDays: [8, 17, 26]
        },
        9: { 
            title: "Очищение", 
            overview: "Мощный месяц эмоционального очищения и завершения. Вы заканчиваете девятимесячный цикл; подтяните хвосты и отпустите то, что не хотите брать с собой в будущее.",
            career: "Завершайте текущие проекты вместо того, чтобы начинать новые. Вы можете почувствовать сильное желание уйти от деятельности, лишенной глубокого смысла.",
            love: "Время прощения и завершения. Отношения, которые изначально не имели прочного фундамента, могут закончиться сами собой, освобождая место для нового этапа.",
            oracleWarning: "Не бойтесь того, что сейчас заканчивается; это освобождает место для вашего скорого возрождения.",
            luckyDays: [9, 18, 27]
        }
    },
    Arabic: {
        1: { 
            title: "العمل والبداية", 
            overview: "تتدفق موجة من الطاقة الجديدة هذا الشهر، مما يتطلب السرعة والزخم. هذا هو الوقت الأمثل لزرع البذور، وإطلاق مبادرات جديدة، وتأكيد استقلاليتك. التردد هو عدوك الآن.",
            career: "تولَّ القيادة في مشروع ما أو اظهر في الصورة. لا تنتظر من أحد أن يمنحك فرصة؛ يجب أن تخلقها بنفسك هذا الشهر.",
            love: "قد تشعر بميل قوي نحو الاستقلال، مما قد يحيي الروابط الراكدة إذا تم التواصل بشكل جيد. أعزب؟ ركز على نفسك؛ فالثقة هي أكثر سماتك جاذبية الآن.",
            oracleWarning: "لا تدع اندفاع الطاقة الجديدة يجعلك متهوراً؛ تحرك بسرعة، ولكن انتبه للنقاط العمياء.",
            luckyDays: [1, 10, 19]
        },
        2: { 
            title: "الصبر والحدس", 
            overview: "بعد اندفاع الشهر الماضي، يطلب منك الكون التباطؤ والاستماع والتناغم. تفضل هذه الدورة التقبل والدبلوماسية والانتهاء الهادئ من تفاصيل الخلفية. اترك الأمور تتكشف بشكل طبيعي.",
            career: "ركز بشدة على العمل الجماعي، وحل النزاعات، وبناء التحالفات. التحركات المنفردة العدوانية ستواجه مقاومة على الأرجح.",
            love: "شهر رومانسي وحساس بشكل استثنائي، مثالي لتعميق الحميمية أو مقابلة شخص متناغم مع روحك. حدسك في أمور القلب حاد جداً.",
            oracleWarning: "تجنب امتصاص الأعباء العاطفية لكل من حولك؛ احمِ طاقتك.",
            luckyDays: [2, 11, 20]
        },
        3: { 
            title: "شرارة الإبداع", 
            overview: "كاريزمتك مغناطيسية، وطاقة الشهر حيوية واجتماعية وتعبيرية. أنت مدعو للتواصل بمبادئك، والاستمتاع بالفن أو الترفيه، وإضفاء البهجة على روتينك اليومي. اسمح لنفسك بأن تُرى وتُسمع.",
            career: "اعرض الفكرة الجريئة، أو قدم العرض التقديمي، أو ركز على التسويق والعلاقات العامة. الإبداع سيحل المشاكل التي لا يستطيع المنطق حلها حالياً.",
            love: "توقع أن يمتلئ جدولك الاجتماعي بطاقة ممتعة وخفيفة ومغرية أحياناً. أعد المرح والفكاهة إلى الشراكات طويلة الأمد.",
            oracleWarning: "لا تدع المشتتات الاجتماعية تجعلك تهمل الالتزامات العملية المهمة.",
            luckyDays: [3, 12, 21]
        },
        4: { 
            title: "بناء الأساس", 
            overview: "انتهى وقت المرح، وحان الوقت للتركيز الصارم على التفاصيل والنظام والعمل الشاق. هذا شهر عملي للغاية حيث يؤتي الانضباط ثماره بشكل كبير. أنت تبني الهيكل للنجاحات المستقبلية.",
            career: "شهر للمتابعة الإدارية، وتنظيم الأنظمة، والعمل من خلال المهام غير الجذابة. الحذر المالي والتخطيط طويل الأمد مفضلان على المخاطر المضاربة.",
            love: "تأخذ الرومانسية مرتبة ثانوية خلف المسؤوليات المشتركة والولاء والدعم العملي. الحضور الموثوق يمثل أعمق أشكال الحب الآن.",
            oracleWarning: "لا تنظر إلى العمل الشاق الضروري كعقوبة؛ فهو بالضبط ما تحتاجه لتشعر بالأمان.",
            luckyDays: [4, 13, 22]
        },
        5: { 
            title: "تحولات غير متوقعة", 
            overview: "يُلقى بالروتين خارج النافذة حيث يحمل هذا الشهر تغييرات ديناميكية وسريعة الوتيرة. كن مرناً ومتكيفاً ومستعداً للتحولات السريعة في جدولك أو بيئتك. إنه وقت الاستكشاف والسفر والأخبار غير المتوقعة.",
            career: "مناسب للتواصل، وتغيير الاستراتيجيات، واقتناص الفرص المتاحة فجأة. توقع أن يكون التواصل سريعاً وفوضوياً بعض الشيء.",
            love: "شهر حسي ومغناطيسي وغير متوقع للغاية. يجب على الأزواج كسر روتينهم لتجنب الشعور بالانغلاق.",
            oracleWarning: "احذر من اتخاذ قرارات متهورة لا رجعة فيها لمجرد أنك تشعر بالملل اللحظي.",
            luckyDays: [5, 14, 23]
        },
        6: { 
            title: "القلب والمنزل", 
            overview: "يطلب الأحباء ومنزلك ومجتمعك اهتمامك. هذا شهر علاجي ومسؤول بعمق حيث أنت مدعو لرعاية الآخرين. خلق ملاذ وحل المشكلات المنزلية يحتل الصدارة.",
            career: "ركز على الخدمة، والروح المعنوية للفريق، وتقديم قيمة حقيقية للعملاء أو الزملاء. المكاسب المالية تأتي من خلال الأعمال المتعلقة بالمنزل أو الصحة أو الجماليات.",
            love: "شهر مثالي للسعادة المنزلية، والاستقرار، وشفاء جروح العلاقات القديمة. إذا كنت أعزباً، فأنت تجذب الأشخاص الذين يبحثون عن الالتزام والاستقرار.",
            oracleWarning: "لا تفرط في بذل نفسك إلى حد الاستياء؛ تذكر أن قول 'لا' هو فعل من أفعال الرعاية الذاتية.",
            luckyDays: [6, 15, 24]
        },
        7: { 
            title: "الملاذ الداخلي", 
            overview: "قد تشعر برغبة في البقاء بالداخل، والانسحاب قليلاً من الضوضاء، والتفكير. ينتقل التركيز إلى التحليل الداخلي، والنمو الروحي، والبحث. استرخِ وتأمل واشحن طاقتك الروحية.",
            career: "ممتاز للعمل العميق المستمر، أو الكتابة، أو التحليل الاستراتيجي. ليس أفضل شهر للتواصل العدواني أو فرض التوسع المالي.",
            love: "قد تحتاج لمزيد من الوقت بمفردك، وهو أمر صحي إذا تواصلت مع شريكك. الفهم العميق الصامت مفضل على المواعيد الاجتماعية الصاخبة.",
            oracleWarning: "تجنب الوقوع في دوامات التفكير الزائد أو الانفصال الساخر عن الأشخاص الذين يهتمون بك.",
            luckyDays: [7, 16, 25]
        },
        8: { 
            title: "التركيز المادي", 
            overview: "الفرصة تطرق بابك بقوة. هذا شهر قوي للتركيز الصارم على أهدافك، وأمورك المالية، وأمنك المادي. تمتلك طاقة تنفيذية؛ استخدمها للتنظيم والقيادة والمطالبة بما تستحق.",
            career: "اطلب تلك الترقية، أو وقع العقد، أو أطلق المنتج. فطنتك التجارية عالية، وأنت في وضع جيد لتولي السلطة.",
            love: "قد تبدو العلاقات عملية أو تركز بشدة على الأهداف المشتركة. تأكد من تخصيص وقت للحميمية العاطفية، وليس فقط لبناء إمبراطورية.",
            oracleWarning: "لا تدع الطموح يتحول إلى قسوة أو هوس بالسيطرة.",
            luckyDays: [8, 17, 26]
        },
        9: { 
            title: "مسح اللوحة", 
            overview: "شهر قوي للتطهير العاطفي والإكمال. أنت تنهي دورة مدتها تسعة أشهر؛ اجمع الخيوط السائبة وحرر ما لا ترغب في حمله معك للمضي قدماً.",
            career: "أنهِ المشاريع القائمة بدلاً من البدء في مشاريع جديدة. قد تشعر برغبة قوية في الانتقال بعيداً عن الأدوار التي تفتقر للمعنى العميق.",
            love: "وقت للمسامحة والإغلاق. العلاقات التي تفتقر للتناغم قد تنتهي بشكل طبيعي، مما يفسح المجال لفصل أكثر صحة الشهر المقبل.",
            oracleWarning: "لا تخشَ النهايات التي تحدث الآن؛ فهي تفسح المجال لولادتك الجديدة الوشيكة.",
            luckyDays: [9, 18, 27]
        }
    },
    Hebrew: {
        1: { 
            title: "פעולה ויוזמה", 
            overview: "גל של אנרגיה רעננה שוטף את החודש הזה, ודורש דחיפות ותנופה. זהו הזמן האופטימלי לזרוע זרעים, להשיק יוזמות חדשות ולבסס את עצמאותכם. היסוס הוא האויב שלכם כרגע.",
            career: "קחו את ההובלה בפרויקט או צאו אל קדמת הבמה. אל תחכו שמישהו ייתן לכם הזדמנות; עליכם ליצור אותה בעצמכם החודש.",
            love: "ייתכן ותרגישו דחף חזק לעצמאות, שיכול להפיח חיים חדשים בקשרים עומדים אם יתוקשר היטב. רווקים? התמקדו בעצמכם; ביטחון עצמי הוא התכונה הכי מושכת שלכם עכשיו.",
            oracleWarning: "אל תתנו לדחף של האנרגיה החדשה להפוך אתכם לפזיזים; נועו מהר, אך בדקו את השטחים המתים.",
            luckyDays: [1, 10, 19]
        },
        2: { 
            title: "סבלנות ואינטואיציה", 
            overview: "לאחר הדחיפה של החודש שעבר, היקום מבקש מכם להאט, להקשיב ולהתכוונן. מחזור זה מעדיף קשב, דיפלומטיה והשלמה שקטה של פרטים ברקע. תנו לדברים להתפתח בטבעיות.",
            career: "התמקדו בעבודת צוות, בפתרון קונפליקטים ובבניית בריתות. מהלכי סולו אגרסיביים ייתקלו כנראה בהתנגדות, בעוד ששיתוף פעולה יפתח דלתות.",
            love: "חודש רומנטי ורגיש באופן יוצא דופן, מושלם להעמקת האינטימיות או לפגישה עם מישהו שתואם את הנשמה שלכם. האינטואיציה שלכם בענייני הלב חדה מתמיד.",
            oracleWarning: "הימנעו מלספוג את המטען הרגשי של כל מי שמסביבכם; הגנו על האנרגיה שלכם.",
            luckyDays: [2, 11, 20]
        },
        3: { 
            title: "הניצוץ היצירתי", 
            overview: "הכריזמה שלכם ממגנטת, והאנרגיה של החודש תוססת, חברתית וביטויית. אתם נקראים לתקשר את הרעיונות שלכם ולצקת שמחה לשגרה היומית שלכם. אפשרו לעצמכם להיראות ולהישמע.",
            career: "הציגו את הרעיון הנועז, העבירו את הפרזנטציה או התמקדו בשיווק ויחסי ציבור. יצירתיות תפתור בעיות שלוגיקה לא יכולה לפתור כרגע.",
            love: "צפו שהלוח החברתי שלכם יתמלא באנרגיה מהנה וקלילה. החזירו את ההומור והשובבות למערכות יחסים ארוכות טווח.",
            oracleWarning: "אל תתנו להסחות דעת חברתיות לגרום לכם להזניח מחויבויות מעשיות חשובות.",
            luckyDays: [3, 12, 21]
        },
        4: { 
            title: "בניית היסודות", 
            overview: "המסיבה נגמרה, והגיע הזמן להתמקד אך ורק בפרטים, בסדר ובמאמץ פיזי. זהו חודש פרגמטי מאוד שבו המשמעת משתלמת באופן אקספוננציאלי. אתם בונים את התשתית להצלחות עתידיות.",
            career: "חודש לארגון אדמיניסטרטיבי, סידור מערכות ועבודה על משימות פחות זוהרות. זהירות פיננסית ותכנון לטווח ארוך עדיפים על סיכונים ספקולטיביים.",
            love: "הרומנטיקה לוקחת צעד אחורה לטובת אחריות משותפת, נאמנות ותמיכה מעשית. אמינות מייצגת את צורת האהבה העמוקה ביותר כרגע.",
            oracleWarning: "אל תראו בעבודה הקשה והנחוצה עונש; זה בדיוק מה שאתם צריכים כדי להרגיש בטוחים.",
            luckyDays: [4, 13, 22]
        },
        5: { 
            title: "שינויים בלתי צפויים", 
            overview: "השגרה נזרקת מהחלון כשהחודש הזה מביא איתו שינויים דינמיים ומהירים. היו גמישים, הסתגלניים ומוכנים לתפניות חדות בלוח הזמנים או בסביבה שלכם. זה זמן של חקירה וחדשות בלתי צפויות.",
            career: "חודש טוב לנטוורקינג, שינוי אסטרטגיות וניצול הזדמנויות שצצות פתאום. צפו לתקשורת מהירה ומעט כאוטית.",
            love: "חודש חושני, ממגנט ובלתי צפוי לחלוטין. זוגות חייבים לנער את השגרה שלהם כדי להימנע מהרגשת מחנק.",
            oracleWarning: "היזהרו מקבלת החלטות בלתי הפיכות ואימפולסיביות רק בגלל שאתם מרגישים משועממים לרגע.",
            luckyDays: [5, 14, 23]
        },
        6: { 
            title: "לב ובית", 
            overview: "תשומת הלב שלכם נדרשת על ידי האנשים היקרים לכם, הבית והקהילה שלכם. זהו חודש מרפא ואחראי מאוד שבו אתם נקראים לטפח אחרים. יצירת מקלט ביתי עומדת במרכז.",
            career: "התמקדו בשירות, במורל של הצוות ומתן ערך אמיתי ללקוחות או קולגות. רווחים כספיים מגיעים דרך עסקים הקשורים לבית, בריאות או אסתטיקה.",
            love: "חודש מעולה לאושר ביתי ולריפוי פצעי עבר במערכות יחסים. אם אתם רווקים, אתם מושכים אליכם אנשים המחפשים מחויבות ויציבות.",
            oracleWarning: "אל תמתחו את עצמכם יותר מדי עד לנקודה של טינה; זכרו ש'לא' הוא אקט של הגנה עצמית.",
            luckyDays: [6, 15, 24]
        },
        7: { 
            title: "מקדש פנימי", 
            overview: "ייתכן ותרגישו צורך להישאר פנימה, לסגת מעט מהרעש ולבצע רפלקציה. המיקוד עובר לניתוח פנימי, צמיחה רוחנית ומחקר. לנוח, לעשות מדיטציה ולהטעין את המצברים הרוחניים.",
            career: "מצוין לעבודה עמוקה ללא הפרעות, כתיבה או ניתוח אסטרטגי. זה לא החודש הכי טוב לנטוורקינג אגרסיבי.",
            love: "ייתכן ותזדקקו ליותר זמן לבד, וזה בריא, כל עוד תתקשרו זאת לבני הזוג. הבנה עמוקה ושקטה מועדפת על פני דייטים חברתיים קולניים.",
            oracleWarning: "הימנעו מנפילה למחשבות יתר או ניתוק ציני מהאנשים שאכפת להם מכם.",
            luckyDays: [7, 16, 25]
        },
        8: { 
            title: "מיקוד חומרי", 
            overview: "ההזדמנות דופקת חזק על הדלת. זהו חודש עוצמתי להתמקד אך ורק במטרות, בפיננסים ובביטחון החומרי שלכם. יש לכם אנרגיה ביצועית; השתמשו בה כדי לארגן ולהוביל.",
            career: "בקשו את ההעלאה ההיא, חתמו על חוזים או השיקו פרויקטים. החוש העסקי שלכם בשיאו ואתם בעמדה טובה לתפוס סמכות.",
            love: "מערכות יחסים עשויות להרגיש תכליתיות או ממוקדות מאוד במטרות משותפות. ודאו שאתם מפנים זמן לאינטימיות רגשית, לא רק לבניית אימפריה.",
            oracleWarning: "אל תתנו לשאיפות להפוך לאכזריות או לאובססיה לשליטה.",
            luckyDays: [8, 17, 26]
        },
        9: { 
            title: "ניקוי שולחן", 
            overview: "חודש עוצמתי של ניקוי רגשי והשלמה. אתם מסיימים מחזור של תשעה חודשים; סגרו קצוות פתוחים ושחררו את מה שאינכם רוצים לשאת איתכם הלאה.",
            career: "סיימו פרויקטים קיימים במקום להתחיל חדשים. ייתכן ותרגישו דחף חזק לעבור מתפקידים שחסרים משמעות עמוקה.",
            love: "זמן לסליחה וסגירה. מערכות יחסים שאינן תואמות עשויות להסתיים בטבעיות, ולפנות מקום לפרק בריא יותר בחודש הבא.",
            oracleWarning: "אל תחששו מהסיומים שקורים כרגע; הם מפנים מקום ללידה מחדש שבפתח.",
            luckyDays: [9, 18, 27]
        }
    },
    Bulgarian: {
        1: { 
            title: "Действие и инициация", 
            overview: "Вълна от свежа енергия преминава през този месец, изискваща спешност и инерция. Това е оптималното време за засяване на семена, стартиране на нови инициативи и отстояване на вашата независимост.",
            career: "Поемете инициативата в даден проект или излезте на преден план. Не чакайте някой да ви даде възможност; трябва сами да я създадете този месец.",
            love: "Може да почувствате силно влечение към независимост, което може да съживи застинали връзки, ако се комуникира добре. Необвързани? Фокусирайте се върху себе си.",
            oracleWarning: "Не позволявайте на прилива на нова енергия да ви направи безразсъдни; движете се бързо, но проверявайте слепите си петна.",
            luckyDays: [1, 10, 19]
        },
        2: { 
            title: "Търпение и интуиция", 
            overview: "След натиска от миналия месец вселената ви моли да забавите темпото, да слушате и да се настроите. Този цикъл благоприятства възприемчивостта, дипломацията и тихото подреждане на детайлите.",
            career: "Съсредоточете се върху работата в екип и изграждането на алианси. Агресивните солови движения вероятно ще срещнат съпротива, докато сътрудничеството ще отвори врати.",
            love: "Изключително романтичен и чувствителен месец, перфектен за задълбочаване на интимността. Вашата интуиция в сърдечните въпроси е изключително точна.",
            oracleWarning: "Избягвайте да абсорбирате емоционалния багаж на всички около вас; защитете собствената си енергия.",
            luckyDays: [2, 11, 20]
        },
        3: { 
            title: "Творческа искра", 
            overview: "Вашата харизма е магнетична, а енергията на месеца е жизнена, социална и експресивна. Призовани сте да споделяте идеите си и да внасяте радост в ежедневието си.",
            career: "Представете смелата си идея или се фокусирайте върху маркетинга и връзките с обществеността. Креативността ще реши проблеми, с които логиката не може да се справи сега.",
            love: "Очаквайте социалният ви календар да се изпълни с приятна енергия. Върнете хумора и игривостта в дългосрочните си партньорства.",
            oracleWarning: "Не позволявайте на социалните разсейвания да ви накарат да пренебрегнете важни практически ангажименти.",
            luckyDays: [3, 12, 21]
        },
        4: { 
            title: "Изграждане на основата", 
            overview: "Време е да се фокусирате строго върху детайлите, реда и усилената работа. Това е високопрагматичен месец, в който дисциплината се отплаща многократно.",
            career: "Месец за административна работа, организиране на системи и справяне с рутинни задачи. Финансовата предпазливост се предпочита пред спекулативните рискове.",
            love: "Романтиката отстъпва място на споделените отговорности и практическата подкрепа. Надеждността е най-дълбоката форма на любов в момента.",
            oracleWarning: "Не гледайте на необходимата тежка работа като на наказание; тя е точно това, от което се нуждаете, за да се чувствате сигурни.",
            luckyDays: [4, 13, 22]
        },
        5: { 
            title: "Непредсказуеми промени", 
            overview: "Рутината остава на заден план, тъй като този месец носи динамични и бързи промени. Бъдете гъвкави, адаптивни и готови за обрати в графика си. Време е за пътуване и неочаквани новини.",
            career: "Благоприятно за нетуъркинг и използване на внезапно открили се възможности. Очаквайте комуникацията да бъде бърза и малко хаотична.",
            love: "Сензуален, магнетичен и силно непредсказуем месец. Двойките трябва да разчупят рутината си, за да избегнат усещането за застой.",
            oracleWarning: "Пазете се от вземането на необратими импулсивни решения само защото се чувствате временно отегчени.",
            luckyDays: [5, 14, 23]
        },
        6: { 
            title: "Сърце и огнище", 
            overview: "Близките ви и домът ви изискват вашето внимание. Това е лечебен месец, в който сте призовани да се грижите за другите. Създаването на уют е централна тема.",
            career: "Фокусирайте се върху обслужването и морала на екипа. Финансовите облаги идват чрез дейности, свързани с дома, здравето или естетиката.",
            love: "Прекрасен месец за семейно щастие и излекуване на стари рани в отношенията. Необвързаните привличат хора, търсещи стабилност.",
            oracleWarning: "Не се претоварвайте до точка на негодувание; помнете, че 'не' е акт на грижа за себе си.",
            luckyDays: [6, 15, 24]
        },
        7: { 
            title: "Вътрешно убежище", 
            overview: "Може да почувствате нужда да се оттеглите от шума и да помислите. Фокусът се измества към вътрешен анализ и духовен растеж. Почивайте и се заредете емоционално.",
            career: "Отлично за задълбочена работа, писане или стратегически анализ. Не е най-добрият месец за агресивно разширяване на дейността.",
            love: "Може да се нуждаете от повече време за себе си. Дълбокото и тихо разбиране е по-ценно от шумните социални излизания.",
            oracleWarning: "Избягвайте да изпадате в спирали от прекомерно мислене или цинично откъсване от хората, които държат на вас.",
            luckyDays: [7, 16, 25]
        },
        8: { 
            title: "Материален фокус", 
            overview: "Възможността чука силно на вратата ви. Това е мощен месец за концентриране върху вашите цели, финанси и материална сигурност. Използвайте енергията си, за да организирате и водите.",
            career: "Поискайте увеличение, подпишете договори или стартирайте проекти. Вашият бизнес усет е изострен и сте в добра позиция да поемете властта.",
            love: "Отношенията може да изглеждат прагматични или силно фокусирани върху общи цели. Не забравяйте да отделяте време за емоционална близост.",
            oracleWarning: "Не позволявайте на амбицията да се превърне в жестокост или мания за контрол.",
            luckyDays: [8, 17, 26]
        },
        9: { 
            title: "Изчистване на плочата", 
            overview: "Мощен месец за емоционално пречистване и завършване. Приключвате деветмесечен цикъл; подредете нещата и освободете това, което не искате да носите със себе си.",
            career: "Завършете съществуващите проекти вместо да започвате нови. Може да почувствате желание да се откажете от роли, в които липсва смисъл.",
            love: "Време за прошка и приключване. Връзки, които не са в хармония, може да приключат естествено, отваряйки място за нещо ново следващия месец.",
            oracleWarning: "Не се страхувайте от финалите, които се случват сега; те освобождават място за вашето предстоящо прераждане.",
            luckyDays: [9, 18, 27]
        }
    }
};
