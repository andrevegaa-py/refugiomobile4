/* ==========================================================
   Refugio Mobile — datos semilla del prototipo
   TB2 Lean Management · Design Sprint · UPC
   Todo el contenido es ficticio, creado para la demostración.
   ========================================================== */

const PSICOLOGOS = [
  {
    id: "p1",
    nombre: "Lucía Ramírez",
    rol: "Psicóloga educativa",
    inicial: "L",
    color: "#5B4AE8",
    estado: "en linea",
    horario: "Lun a Vie · 8:00 – 15:00",
    responde: "Suele responder en pocos minutos",
    bio: "Acompaño a estudiantes de secundaria. Puedes escribirme de lo que sea, sin apuro.",
    citas: ["Lun 10:00", "Mar 11:30", "Mié 9:00", "Jue 14:00"]
  },
  {
    id: "p2",
    nombre: "Diego Salas",
    rol: "Psicólogo clínico",
    inicial: "D",
    color: "#00A896",
    estado: "ocupado",
    horario: "Lun, Mié y Vie · 9:00 – 13:00",
    responde: "Suele responder el mismo día",
    bio: "Trabajo temas de ansiedad, presión académica y relaciones con la familia.",
    citas: ["Lun 9:30", "Mié 11:00", "Vie 10:00"]
  },
  {
    id: "p3",
    nombre: "Marta Quispe",
    rol: "Tutora de bienestar",
    inicial: "M",
    color: "#E8814A",
    estado: "desconectado",
    horario: "Mar y Jue · 10:00 – 16:00",
    responde: "Te responde cuando se conecte",
    bio: "Si no sabes por dónde empezar, escríbeme y vemos juntos qué necesitas.",
    citas: ["Mar 14:00", "Jue 10:30"]
  }
];

const CANALES = [
  { id: "todos", nombre: "Todo", emoji: "✨" },
  { id: "desahogo", nombre: "Desahogo", emoji: "💭" },
  { id: "gustos", nombre: "Gustos", emoji: "🎧" },
  { id: "colegio", nombre: "Colegio", emoji: "📚" },
  { id: "testimonios", nombre: "Testimonios", emoji: "🗣️" },
  { id: "logros", nombre: "Logros", emoji: "🌱" }
];

/* Avatares: se guardan con su emoji como clave y se muestran como imagen 3D.
   Imágenes: Fluent Emoji 3D (Microsoft), licencia MIT — ver img/AVATARES_LICENCIA.txt
   
   Nuevas categorías: Personas, Gaming/Fantasía (se muestran con emojis nativos 
   cuando no hay imagen local — el emoji se ve grande y nítido en todos los dispositivos) */

/* ── Animales (originales) ── */
const AVATARES_ANIMALES = ["🦊", "🐨", "🐼", "🦉", "🐙", "🦖", "🐸", "🦄", "🐝", "🐧"];

/* ── Personas ── */
const AVATARES_PERSONAS = ["🧑‍🚀", "🥷", "🧙", "🦸", "🕵️", "👑", "🧝", "🧛"];

/* ── Gaming y Fantasía ── */
const AVATARES_GAMING = ["🤖", "👾", "👻", "🎮", "🐉", "💀", "🧟", "🧞"];

/* Todos juntos */
const AVATARES = [...AVATARES_ANIMALES, ...AVATARES_PERSONAS, ...AVATARES_GAMING];

/* Categorías para el picker */
const AVATAR_CATEGORIAS = [
  { id: "animales", nombre: "Animales", emoji: "🐾", avatares: AVATARES_ANIMALES },
  { id: "personas", nombre: "Personas", emoji: "👤", avatares: AVATARES_PERSONAS },
  { id: "gaming",   nombre: "Gaming",   emoji: "🎮", avatares: AVATARES_GAMING }
];

const AVATAR_IMG = {
  "🦊": "img/avatars/fox.png",
  "🐨": "img/avatars/koala.png",
  "🐼": "img/avatars/panda.png",
  "🦉": "img/avatars/owl.png",
  "🐙": "img/avatars/octopus.png",
  "🦖": "img/avatars/trex.png",
  "🐸": "img/avatars/frog.png",
  "🦄": "img/avatars/unicorn.png",
  "🐝": "img/avatars/honeybee.png",
  "🐧": "img/avatars/penguin.png"
};

/* Nombres legibles para avatares sin imagen (emojis nuevos) */
const AVATAR_NOMBRES = {
  "🦊": "Zorrito", "🐨": "Koala", "🐼": "Panda", "🦉": "Búho", "🐙": "Pulpo",
  "🦖": "Dino", "🐸": "Rana", "🦄": "Unicornio", "🐝": "Abeja", "🐧": "Pingüino",
  "🧑‍🚀": "Astronauta", "🥷": "Ninja", "🧙": "Mago", "🦸": "Héroe",
  "🕵️": "Detective", "👑": "Royal", "🧝": "Elfo", "🧛": "Vampiro",
  "🤖": "Robot", "👾": "Alien", "👻": "Fantasma", "🎮": "Gamer",
  "🐉": "Dragón", "💀": "Skull", "🧟": "Zombie", "🧞": "Genio"
};

const INTERESES = [
  "Música", "Anime", "Videojuegos", "Dibujo", "Fútbol", "Leer",
  "K-pop", "Skate", "Cocinar", "Series", "Fotografía", "Bailar",
  "Escribir", "Básquet", "Astronomía", "Volei"
];

/* Fotos: se cargan por internet desde picsum.photos (fotos reales).
   Si alguna no carga, la app muestra un fondo de color en su lugar.
   Para cambiar una foto, reemplaza el número del id en la URL. */
const foto = (id) => `https://picsum.photos/id/${id}/800/1000`;

/* ═══════════ FOROS TIPO REDDIT ═══════════ */

const FOROS = [
  {
    id: "f_desahogo",
    nombre: "r/Desahogo",
    desc: "Suelta lo que traes adentro. Sin filtro, sin juicio.",
    emoji: "💭",
    color: "#7C4DFF",
    miembros: 342,
    online: 47,
    creado: "hace 6 meses"
  },
  {
    id: "f_ansiedad",
    nombre: "r/Ansiedad",
    desc: "Presión del cole, exámenes, familia. No estás solo en esto.",
    emoji: "😰",
    color: "#FF6B6B",
    miembros: 289,
    online: 31,
    creado: "hace 5 meses"
  },
  {
    id: "f_musica",
    nombre: "r/MiPlaylist",
    desc: "Comparte tu música, descubre qué escuchan los demás.",
    emoji: "🎧",
    color: "#1DB954",
    miembros: 518,
    online: 83,
    creado: "hace 8 meses"
  },
  {
    id: "f_gaming",
    nombre: "r/Gamers",
    desc: "Juegos, memes, clips y LFG. Tu squad del cole.",
    emoji: "🎮",
    color: "#00BCD4",
    miembros: 467,
    online: 72,
    creado: "hace 7 meses"
  },
  {
    id: "f_testimonios",
    nombre: "r/LoLogré",
    desc: "Historias de gente que pidió ayuda y le fue bien.",
    emoji: "🏆",
    color: "#FFC107",
    miembros: 203,
    online: 18,
    creado: "hace 4 meses"
  },
  {
    id: "f_anime",
    nombre: "r/AnimeManga",
    desc: "Discusiones, recomendaciones y fan art del cole.",
    emoji: "⛩️",
    color: "#E91E63",
    miembros: 391,
    online: 55,
    creado: "hace 6 meses"
  },
  {
    id: "f_consejos",
    nombre: "r/Consejos",
    desc: "Pide ayuda sobre cualquier tema. La comunidad responde.",
    emoji: "💡",
    color: "#FF9800",
    miembros: 256,
    online: 28,
    creado: "hace 3 meses"
  },
  {
    id: "f_memes",
    nombre: "r/MemesDelCole",
    desc: "Humor sano del cole. Nada de bullying, solo risas.",
    emoji: "😂",
    color: "#8BC34A",
    miembros: 612,
    online: 94,
    creado: "hace 9 meses"
  }
];

/* Posts de los foros con apodos variados tipo gamertag */
const FORUM_POSTS = [
  {
    id: "fp1",
    foro: "f_desahogo",
    autor: "xShadowKnight",
    avatar: "🥷",
    titulo: "Mis papás se pelean todos los días y me afecta en el cole",
    texto: "No puedo concentrarme porque en mi casa gritan todas las noches. Llego al cole cansado y con la cabeza en otro lado. ¿A alguien más le pasa esto?",
    tiempo: "hace 3 h",
    upvotes: 147,
    downvotes: 2,
    voto: 0,
    comentarios: [
      { id: "fc1", autor: "Zorrito_04", avatar: "🦊", texto: "Me pasó el año pasado. Lo que me ayudó fue hablar con el psicólogo del cole, nadie se enteró.", upvotes: 43, voto: 0, tiempo: "hace 2 h" },
      { id: "fc2", autor: "NightOwl_99", avatar: "🦉", texto: "Te entiendo bro, no estás solo. Acá estamos.", upvotes: 38, voto: 0, tiempo: "hace 2 h" },
      { id: "fc3", autor: "CyberPanda", avatar: "🐼", texto: "A mí me pasa igual. Pongo música para no escuchar y aveces funciona, aveces no.", upvotes: 29, voto: 0, tiempo: "hace 1 h" }
    ]
  },
  {
    id: "fp2",
    foro: "f_ansiedad",
    autor: "AstroGirl_77",
    avatar: "🧑‍🚀",
    titulo: "Tengo exámenes y siento que me va a dar algo",
    texto: "Cada vez que pienso en los finales se me cierra el pecho y siento que me va a dar algo. Mi mamá dice que exagero pero de verdad lo siento. ¿Alguien tiene tips que de verdad sirvan?",
    tiempo: "hace 5 h",
    upvotes: 203,
    downvotes: 1,
    voto: 0,
    comentarios: [
      { id: "fc4", autor: "DragonSlayer_X", avatar: "🐉", texto: "Yo hago la técnica 4-7-8 para respirar y me calma un montón. Inhalas 4 segundos, aguantas 7, exhalas 8.", upvotes: 67, voto: 0, tiempo: "hace 4 h" },
      { id: "fc5", autor: "Koala_azul", avatar: "🐨", texto: "Habla con Lucía, la psicóloga. Yo fui por lo mismo y no es como crees, es bien tranqui.", upvotes: 51, voto: 0, tiempo: "hace 3 h" },
      { id: "fc6", autor: "PixelHero42", avatar: "🎮", texto: "Estudia en bloques de 25 min con descansos. Se llama pomodoro y a mí me salvó.", upvotes: 44, voto: 0, tiempo: "hace 2 h" }
    ]
  },
  {
    id: "fp3",
    foro: "f_musica",
    autor: "Pulpo_azul",
    avatar: "🐙",
    titulo: "Playlist para cuando no puedes dormir porque piensas mucho 🌙",
    texto: "Armé una playlist de lofi y ambient para esas noches donde tu cerebro no se calla. Si quieren se las comparto. Tiene como 4 horas de música sin letra.",
    tiempo: "hace 7 h",
    upvotes: 312,
    downvotes: 3,
    voto: 0,
    comentarios: [
      { id: "fc7", autor: "GhostRider_XV", avatar: "👻", texto: "Pásala porfa, la necesito para hoy jaja", upvotes: 89, voto: 0, tiempo: "hace 6 h" },
      { id: "fc8", autor: "Abeja_07", avatar: "🐝", texto: "Yo pongo lluvia + lofi y me duermo en 20 min.", upvotes: 71, voto: 0, tiempo: "hace 5 h" },
      { id: "fc9", autor: "RoboMind_01", avatar: "🤖", texto: "¿Está en Spotify? Yo uso una que se llama 'sleepy beats' pero ya me aburrí.", upvotes: 34, voto: 0, tiempo: "hace 3 h" }
    ]
  },
  {
    id: "fp4",
    foro: "f_gaming",
    autor: "PixelHero42",
    avatar: "🎮",
    titulo: "¿Quién juega Valorant en el cole? Necesito squad",
    texto: "Estoy harto de jugar solo y con randoms que flamean. Si alguien del cole juega, armemos un equipo. Soy plata 3 pero le meto ganas jaja.",
    tiempo: "hace 4 h",
    upvotes: 189,
    downvotes: 5,
    voto: 0,
    comentarios: [
      { id: "fc10", autor: "xShadowKnight", avatar: "🥷", texto: "Yo juego, soy oro 1. Agrega mi dc: shadow#4521", upvotes: 56, voto: 0, tiempo: "hace 3 h" },
      { id: "fc11", autor: "Dino_verde", avatar: "🦖", texto: "JAJAJA plata 3 pero le metemos. Yo soy plata 2, peores hay.", upvotes: 47, voto: 0, tiempo: "hace 3 h" },
      { id: "fc12", autor: "MysticMage_22", avatar: "🧙", texto: "Yo juego Sage y Cypher. Me sumo.", upvotes: 38, voto: 0, tiempo: "hace 2 h" }
    ]
  },
  {
    id: "fp5",
    foro: "f_testimonios",
    autor: "Rana_saltarina",
    avatar: "🐸",
    titulo: "Fui a mi primera sesión con el psicólogo y nadie se enteró",
    texto: "Pedí mi cita desde la app y fui en mi hora libre. Entré, hablé 20 minutos y salí. Nadie preguntó nada. Pensaba que me iba a sentir raro y fue al revés, salí con la cabeza más liviana.",
    tiempo: "hace 1 día",
    upvotes: 478,
    downvotes: 2,
    voto: 0,
    comentarios: [
      { id: "fc13", autor: "ElvenArcher_8", avatar: "🧝", texto: "Gracias por compartir esto. Yo lo estoy pensando y tu post me ayuda.", upvotes: 112, voto: 0, tiempo: "hace 20 h" },
      { id: "fc14", autor: "Unicornio_22", avatar: "🦄", texto: "Me da un poco de roche pero este post me dio ganas. Gracias.", upvotes: 89, voto: 0, tiempo: "hace 18 h" },
      { id: "fc15", autor: "VampLord_666", avatar: "🧛", texto: "Facts. Yo también fui y no es como dicen. Es literalmente hablar nomás.", upvotes: 73, voto: 0, tiempo: "hace 15 h" }
    ]
  },
  {
    id: "fp6",
    foro: "f_anime",
    autor: "MysticMage_22",
    avatar: "🧙",
    titulo: "Chainsaw Man temporada 2 confirmada y estoy gritando",
    texto: "Acaban de confirmar la segunda temporada y ya no puedo con la emoción. ¿Alguien más del cole lo ve? Necesito gente con quien hablar del tema porque nadie de mi salón lo ve 😭",
    tiempo: "hace 8 h",
    upvotes: 267,
    downvotes: 4,
    voto: 0,
    comentarios: [
      { id: "fc16", autor: "DragonSlayer_X", avatar: "🐉", texto: "YOOOO SIIII el manga está buenísimo, la adaptación va a estar crack.", upvotes: 78, voto: 0, tiempo: "hace 7 h" },
      { id: "fc17", autor: "GhostRider_XV", avatar: "👻", texto: "Armemos un grupo del cole para verlo juntos, anónimo claro.", upvotes: 56, voto: 0, tiempo: "hace 6 h" }
    ]
  },
  {
    id: "fp7",
    foro: "f_memes",
    autor: "Dino_verde",
    avatar: "🦖",
    titulo: "Cuando el profe dice 'el examen está fácil' 💀",
    texto: "Y luego la primera pregunta es sobre un tema que nunca vimos en clase. Classic. ¿A ustedes también les pasa o solo en mi cole somos los elegidos?",
    tiempo: "hace 6 h",
    upvotes: 534,
    downvotes: 8,
    voto: 0,
    comentarios: [
      { id: "fc18", autor: "Pingüino_1", avatar: "🐧", texto: "JAJAJAJA literal, 'fácil' para el profe que ya tiene maestría", upvotes: 156, voto: 0, tiempo: "hace 5 h" },
      { id: "fc19", autor: "AstroGirl_77", avatar: "🧑‍🚀", texto: "Estoy en esta foto y no me gusta 😂", upvotes: 123, voto: 0, tiempo: "hace 4 h" },
      { id: "fc20", autor: "RoboMind_01", avatar: "🤖", texto: "El examen: 'Resuelve este problema que ni Einstein podría hacer'", upvotes: 98, voto: 0, tiempo: "hace 3 h" }
    ]
  },
  {
    id: "fp8",
    foro: "f_consejos",
    autor: "ElvenArcher_8",
    avatar: "🧝",
    titulo: "¿Cómo le digo a mis papás que quiero ir al psicólogo?",
    texto: "Mis papás son de los que piensan que 'el psicólogo es para locos'. Yo sé que no es así pero no sé cómo decirles sin que se preocupen o se molesten. ¿Alguien pasó por algo parecido?",
    tiempo: "hace 12 h",
    upvotes: 356,
    downvotes: 1,
    voto: 0,
    comentarios: [
      { id: "fc21", autor: "Búho_nocturno", avatar: "🦉", texto: "Yo les dije que era como ir al médico cuando te duele algo. Eso lo entendieron.", upvotes: 134, voto: 0, tiempo: "hace 11 h" },
      { id: "fc22", autor: "xShadowKnight", avatar: "🥷", texto: "Puedes empezar por el psicólogo del cole, no necesitas permiso de tus papás para eso.", upvotes: 98, voto: 0, tiempo: "hace 10 h" },
      { id: "fc23", autor: "Panda_gris", avatar: "🐼", texto: "La psicóloga Lucía me ayudó a hablar con mis papás. Escríbele.", upvotes: 76, voto: 0, tiempo: "hace 8 h" }
    ]
  }
];

/* ═══════════ POSTS DE COMUNIDAD (originales) ═══════════ */

const POSTS_SEMILLA = [
  {
    id: "post1",
    autor: "Zorrito_04",
    avatar: "🦊",
    canal: "desahogo",
    tiempo: "hace 2 h",
    titulo: "Nadie se dio cuenta de que la estaba pasando mal",
    texto: "Estuve como tres semanas raro y nadie preguntó nada. Al final le conté a mi mejor amigo y me dijo que él andaba igual. Me pareció bien loco que estábamos los dos así y ninguno decía nada.",
    foto: foto(1036),
    votos: 47,
    voto: 0,
    guardado: false,
    comentarios: [
      { id: "c1", autor: "NightOwl_99", avatar: "🦉", texto: "Me pasó igual el año pasado. A veces uno cree que es el único.", votos: 12, voto: 0, tiempo: "hace 1 h" },
      { id: "c2", autor: "CyberPanda", avatar: "🐼", texto: "Qué bueno que se lo dijiste. Yo todavía no me animo.", votos: 8, voto: 0, tiempo: "hace 45 min" }
    ]
  },
  {
    id: "post7",
    autor: "Rana_saltarina",
    avatar: "🐸",
    canal: "testimonios",
    tiempo: "hace 3 h",
    titulo: "Fui a mi primera sesión y nadie se enteró",
    texto: "Pedí mi cita desde acá y fui en mi hora de tutoría. Entré, conversé veinte minutos y salí. Nadie preguntó nada. Pensé que me iba a sentir raro y fue al revés: salí con la cabeza más liviana.",
    foto: foto(1011),
    votos: 92,
    voto: 0,
    guardado: false,
    comentarios: [
      { id: "c15", autor: "Koala_azul", avatar: "🐨", texto: "Yo todavía lo estoy pensando, pero leer esto me ayuda.", votos: 18, voto: 0, tiempo: "hace 2 h" },
      { id: "c16", autor: "Unicornio_22", avatar: "🦄", texto: "Qué bacán que lo hayas hecho. A mí me da roche pero me dieron ganas.", votos: 14, voto: 0, tiempo: "hace 1 h" }
    ]
  },
  {
    id: "post2",
    autor: "Pulpo_azul",
    avatar: "🐙",
    canal: "gustos",
    tiempo: "hace 5 h",
    titulo: "Mi playlist para cuando no puedo dormir",
    texto: "Armé una playlist con puros temas lentos para cuando me quedo pensando de noche. Si alguien quiere que se la pase, le escribo. ¿Alguien más le pasa que en la noche piensa de más?",
    foto: foto(1043),
    votos: 63,
    voto: 0,
    guardado: false,
    comentarios: [
      { id: "c3", autor: "Dino_verde", avatar: "🦖", texto: "A mí me pasa todas las noches jaja. Pásamela porfa.", votos: 21, voto: 0, tiempo: "hace 3 h" },
      { id: "c4", autor: "Abeja_07", avatar: "🐝", texto: "Yo pongo lluvia de fondo, ayuda un montón.", votos: 15, voto: 0, tiempo: "hace 2 h" },
      { id: "c5", autor: "Koala_azul", avatar: "🐨", texto: "Justo ayer estuve hasta las 2am dándole vueltas a una cosa.", votos: 9, voto: 0, tiempo: "hace 1 h" }
    ]
  },
  {
    id: "post3",
    autor: "Unicornio_22",
    avatar: "🦄",
    canal: "colegio",
    tiempo: "hace 8 h",
    titulo: "¿Cómo hacen para concentrarse en clase?",
    texto: "Me desconecto en media clase y después no entiendo nada. Después me preocupo pero tampoco hago nada al respecto y se me acumula. Alguien con tips reales, no el típico 'presta atención'.",
    foto: foto(180),
    votos: 89,
    voto: 0,
    guardado: false,
    comentarios: [
      { id: "c6", autor: "Pingüino_1", avatar: "🐧", texto: "Yo anoto palabras sueltas en vez de frases completas, me ayuda a seguir el hilo.", votos: 34, voto: 0, tiempo: "hace 6 h" },
      { id: "c7", autor: "Rana_saltarina", avatar: "🐸", texto: "Hablé de esto con Lucía y me dio unos ejercicios. Me sirvió.", votos: 28, voto: 0, tiempo: "hace 4 h" }
    ]
  },
  {
    id: "post8",
    autor: "NightOwl_99",
    avatar: "🦉",
    canal: "testimonios",
    tiempo: "hace 6 h",
    titulo: "Pedir ayuda no me hace "el problema"",
    texto: "Me daba miedo que me vieran como "el problema". Con el tiempo me di cuenta de que pedir ayuda es como ir al médico cuando te duele algo: no hay nada de qué avergonzarse.",
    foto: foto(1025),
    votos: 118,
    voto: 0,
    guardado: false,
    comentarios: [
      { id: "c17", autor: "CyberPanda", avatar: "🐼", texto: "Eso de ir al médico cuando te duele algo me quedó.", votos: 31, voto: 0, tiempo: "hace 5 h" },
      { id: "c18", autor: "Zorrito_04", avatar: "🦊", texto: "Gracias por contarlo, de verdad.", votos: 22, voto: 0, tiempo: "hace 4 h" }
    ]
  },
  {
    id: "post4",
    autor: "CyberPanda",
    avatar: "🐼",
    canal: "testimonios",
    tiempo: "hace 1 día",
    titulo: "Hoy por fin hablé con alguien",
    texto: "Llevaba meses diciendo que iba a escribir y hoy lo hice. No fue tan terrible como pensaba. Si alguien lo está dudando: no pasa nada malo, nadie se entera.",
    foto: foto(1018),
    votos: 156,
    voto: 0,
    guardado: false,
    comentarios: [
      { id: "c8", autor: "Zorrito_04", avatar: "🦊", texto: "Grande. Eso cuesta un montón.", votos: 42, voto: 0, tiempo: "hace 20 h" },
      { id: "c9", autor: "NightOwl_99", avatar: "🦉", texto: "Necesitaba leer esto justo hoy, gracias.", votos: 38, voto: 0, tiempo: "hace 18 h" },
      { id: "c10", autor: "Unicornio_22", avatar: "🦄", texto: "¿Y cómo empezaste la conversación? Me da roche no saber qué decir.", votos: 19, voto: 0, tiempo: "hace 12 h" }
    ]
  },
  {
    id: "post5",
    autor: "Dino_verde",
    avatar: "🦖",
    canal: "gustos",
    tiempo: "hace 1 día",
    titulo: "Empecé a dibujar otra vez",
    texto: "Dejé de dibujar como dos años porque sentía que no me salía bien. Volví hace poco y me di cuenta de que me relaja aunque salga feo. Comparto uno por acá.",
    foto: foto(20),
    votos: 74,
    voto: 0,
    guardado: false,
    comentarios: [
      { id: "c11", autor: "Abeja_07", avatar: "🐝", texto: "El punto no es que salga bonito, es que te desconecte un rato.", votos: 25, voto: 0, tiempo: "hace 22 h" }
    ]
  },
  {
    id: "post9",
    autor: "Pingüino_1",
    avatar: "🐧",
    canal: "testimonios",
    externo: true,
    tiempo: "hace 1 día",
    titulo: "Desde otro colegio: yo también voy",
    texto: "En mi cole también se burlaban al principio, pero cuando varios empezamos a ir dejó de ser tema. Si lo estás pensando, no estás solo.",
    foto: foto(10),
    votos: 134,
    voto: 0,
    guardado: false,
    comentarios: [
      { id: "c19", autor: "Rana_saltarina", avatar: "🐸", texto: "Qué bueno saber que en otros colegios también pasa.", votos: 27, voto: 0, tiempo: "hace 20 h" },
      { id: "c20", autor: "Dino_verde", avatar: "🦖", texto: "Eso de que dejó de ser tema cuando fuimos varios tiene sentido.", votos: 19, voto: 0, tiempo: "hace 16 h" }
    ]
  },
  {
    id: "post6",
    autor: "Koala_azul",
    avatar: "🐨",
    canal: "desahogo",
    tiempo: "hace 2 días",
    titulo: "Me da roche que me vean entrando a psicología",
    texto: "En mi salón se burlan del que va. Yo quiero ir pero pienso en las caras que van a poner y ya no. Sé que suena tonto pero es real.",
    foto: foto(1039),
    votos: 203,
    voto: 0,
    guardado: false,
    comentarios: [
      { id: "c12", autor: "Rana_saltarina", avatar: "🐸", texto: "No suena tonto para nada, a mí me pasa igual.", votos: 67, voto: 0, tiempo: "hace 2 días" },
      { id: "c13", autor: "Pulpo_azul", avatar: "🐙", texto: "Por eso uso esto, acá nadie sabe quién soy.", votos: 54, voto: 0, tiempo: "hace 1 día" },
      { id: "c14", autor: "CyberPanda", avatar: "🐼", texto: "Se burlan porque no entienden. Igual tu salud va primero.", votos: 41, voto: 0, tiempo: "hace 1 día" }
    ]
  }
];

const RESPUESTAS_PSICOLOGO = [
  "Gracias por escribirme. Cuéntame un poco más, ¿desde cuándo te sientes así?",
  "Entiendo. No tienes que tener todo claro para hablarlo, así está bien.",
  "Eso suena pesado para llevarlo solo. ¿Se lo has contado a alguien más?",
  "Tómate tu tiempo. Lo que me escribas acá queda entre nosotros dos.",
  "Me gustaría que conversemos con más calma. ¿Te acomoda algún horario esta semana?",
  "Lo que describes es más común de lo que crees, y sí se puede trabajar."
];

/* Conteo ficticio que ve el equipo de psicología (solo números, nunca nombres) */
const CONTEO_BASE = { amarillo: 11, rojo: 5 };

/* Alumnos que "ya buscaron apoyo esta semana" (indicador de la Comunidad) */
const BUSCARON_APOYO_BASE = 24;

/* ═══════════ RESUMEN ANUAL (Spotify Wrapped Style) ═══════════ */

const WRAPPED_DATA = {
  year: 2026,
  emociones: [
    { emoji: "😐", nombre: "Normal", pct: 35, color: "#FFC107" },
    { emoji: "🙂", nombre: "Bien", pct: 28, color: "#4CAF50" },
    { emoji: "😄", nombre: "Genial", pct: 18, color: "#58CC02" },
    { emoji: "😕", nombre: "Mal", pct: 12, color: "#FF9800" },
    { emoji: "😞", nombre: "Fatal", pct: 7, color: "#FF5252" }
  ],
  emocionTop: { emoji: "😐", nombre: "Normal" },
  vecesAlPsicologo: 4,
  comentarioTop: {
    texto: "No suena tonto para nada, a mí me pasa igual.",
    likes: 67,
    post: "Me da roche que me vean entrando a psicología"
  },
  emojiMasUsado: { emoji: "🙂", nombre: "Bien", veces: 23 },
  gustosTop: ["Música", "Videojuegos", "Anime", "Dibujo"],
  procesoEmocional: {
    inicio: 2.3,
    fin: 3.8,
    mejora: true,
    pctMejora: 65,
    meses: [
      { mes: "Ene", valor: 2.3 }, { mes: "Feb", valor: 2.5 },
      { mes: "Mar", valor: 2.1 }, { mes: "Abr", valor: 2.8 },
      { mes: "May", valor: 3.0 }, { mes: "Jun", valor: 3.2 },
      { mes: "Jul", valor: 2.9 }, { mes: "Ago", valor: 3.4 },
      { mes: "Sep", valor: 3.5 }, { mes: "Oct", valor: 3.7 },
      { mes: "Nov", valor: 3.6 }, { mes: "Dic", valor: 3.8 }
    ]
  },
  totalCheckins: 84,
  totalComentarios: 37,
  totalEntradas: 12
};
