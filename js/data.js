/* Road to Lolla · datos del universo
   Todo lo que es contenido (Facciones, test, semanas, Diario) vive acá,
   para poder cambiar textos sin tocar la lógica. */

window.RTL = window.RTL || {};

/* Íconos de línea (viewBox 0 0 48 48). Los usa el sprite SVG y el canvas de la tarjeta para compartir. */
RTL.ICONS = {
  eye: [
    'M4 26c5-8 12-13 20-13s15 5 20 13c-5 8-12 13-20 13S9 34 4 26z',
    'M24 20a6 6 0 1 1 0 12a6 6 0 1 1 0-12z',
    'M24 4v5', 'M13 7l2.5 4.5', 'M35 7l-2.5 4.5', 'M5 13l4 3', 'M43 13l-4 3'
  ],
  flame: [
    'M24 45c-8.5 0-14-5.8-14-13.5 0-6.8 4.6-10.6 6.6-16.4 1.3 3.6 3.2 5.6 5.6 6.6-.4-6.6 2.6-11.9 7.8-15.7-.8 6 1.2 9.7 4.4 13 3.1 3.2 5.6 7 5.6 12.4C40 39.3 33.4 45 24 45z',
    'M24 45c-3.9 0-6.6-2.7-6.6-6.3 0-3.8 2.7-5.6 3.7-8.6 1 1.8 2.3 2.7 3.6 2.9.1-2.8 1.3-4.9 3.4-6.6-.2 3 .9 4.8 2.2 6.4 1.2 1.5 1.9 3.1 1.9 5.2 0 4.1-3.6 7-8.2 7z'
  ],
  globe: [
    'M24 7a17 17 0 1 1 0 34a17 17 0 1 1 0-34z',
    'M24 7c-5 4.6-7.6 10.3-7.6 17s2.6 12.4 7.6 17', 'M24 7c5 4.6 7.6 10.3 7.6 17s-2.6 12.4-7.6 17',
    'M7 24h34', 'M9.5 15.5h29', 'M9.5 32.5h29', 'M24 7v34',
    'M42 3v6', 'M39 6h6', 'M6 39v5', 'M3.5 41.5h5'
  ],
  spark: [
    'M24 4v40', 'M6.7 14l34.6 20', 'M6.7 34l34.6-20',
    'M41 4v5', 'M38.5 6.5h5'
  ],
  crown: ['M7 36L4 14l11 9 9-15 9 15 11-9-3 22z', 'M9 42h30'],
  ticket: ['M5 15h38v6a3 3 0 0 0 0 6v6H5v-6a3 3 0 0 0 0-6z', 'M30 15v18'],
  share: ['M14 20a5 5 0 1 1 0 8a5 5 0 1 1 0-8z', 'M34 8a5 5 0 1 1 0 8a5 5 0 1 1 0-8z', 'M34 32a5 5 0 1 1 0 8a5 5 0 1 1 0-8z', 'M18.5 21.5l11-6', 'M18.5 26.5l11 6'],
  test: ['M12 8h24v34H12z', 'M18 5h12v6H18z', 'M17 19l2.5 2.5L24 17', 'M27 19.5h5', 'M17 28l2.5 2.5L24 26', 'M27 28.5h5', 'M17 36.5h15'],
  arrow: ['M8 24h30', 'M28 14l10 10-10 10'],
  chevron: ['M18 10l14 14-14 14'],
  back: ['M30 10L16 24l14 14'],
  close: ['M12 12l24 24', 'M36 12L12 36'],
  lock: ['M13 22h22v19H13z', 'M17 22v-6a7 7 0 0 1 14 0v6', 'M24 29v5'],
  check: ['M10 25l9 9 19-20'],
  mail: ['M6 11h36v26H6z', 'M6 12l18 14 18-14'],
  play: ['M17 11l21 13-21 13z'],
  music: ['M18 36V10l22-4v26', 'M18 36a5 5 0 1 1-10 0a5 5 0 1 1 10 0z', 'M40 32a5 5 0 1 1-10 0a5 5 0 1 1 10 0z'],
  pin: ['M24 44S10 30 10 19a14 14 0 0 1 28 0c0 11-14 25-14 25z', 'M24 14a5 5 0 1 1 0 10a5 5 0 1 1 0-10z'],
  bolt: ['M27 4L10 27h12l-3 17 19-25H26z'],
  flag: ['M10 44V5', 'M10 6c8-4 14 4 22 0s8 0 8 0v20s-4-4-10 0-14-4-20 0'],
  menu: ['M7 14h34', 'M7 24h34', 'M7 34h34'],
  copy: ['M16 16h24v26H16z', 'M10 32V8h22'],
  download: ['M24 6v26', 'M14 22l10 10 10-10', 'M8 40h32'],
  sliders: ['M8 14h32', 'M8 24h32', 'M8 34h32', 'M16 10v8', 'M30 20v8', 'M20 30v8']
};

/* Las cuatro Facciones (nombres del TP, colores del mockup elegido el 02/11) */
RTL.FACTIONS = {
  indie: {
    id: 'indie', name: 'The Indie Tribe', pre: 'The', short: 'Indie Tribe', call: 'Indie Tribe',
    color: '#7B2FF7', on: '#FFFFFF', icon: 'eye', tag: '#IndieTribe',
    tagline: 'Sentí la diferencia.',
    genres: 'Indie, shoegaze y pop alternativo',
    artists: ['Charli xcx', 'Lola Young', 'The Neighbourhood', 'Geese'],
    barrio: 'Telas a cuadros, guirnaldas de luz cálida y vinilos colgados de las carpas. En este barrio se descubre primero lo que mañana suena en todos lados.',
    result: 'Llegás temprano para ver a la banda que mañana va a explotar.',
    referente: 'Mora, la Curadora',
    carta: 'Tribu: esto recién empieza. Nosotros no gritamos más fuerte, escuchamos mejor. Esta semana quiero saber qué banda chica los hizo llorar en el colectivo. Que el Predio sepa que acá llegamos primero.',
    seed: 11, img: null
  },
  rock: {
    id: 'rock', name: 'The Rock Legends', pre: 'The', short: 'Rock Legends', call: 'Rock Legends',
    color: '#E8001C', on: '#FFFFFF', icon: 'flame', tag: '#RockLegends',
    tagline: 'Dejá tu huella.',
    genres: 'Rock y metal',
    artists: ['The Killers', 'Queens of the Stone Age', 'Cage the Elephant', 'Fontaines D.C.'],
    barrio: 'Cuero, tachas y amplificadores apilados como murallas. El barrio donde todo suena un poco más fuerte, y nadie pide que lo bajen.',
    result: 'Volumen al máximo, la voz rota y adelante de todo.',
    referente: 'El Tano Riff',
    carta: 'Legends: el volumen no se negocia. Ya sé que los electrónicos dicen que el Predio es suyo. Que lo digan. Nosotros vamos a responder como sabemos: con un riff. Nos vemos adelante de todo.',
    seed: 23, img: null
  },
  perrys: {
    id: 'perrys', name: "The Perry's Ravers", pre: 'The', short: "Perry's Ravers", call: "Perry's",
    color: '#FF6B00', on: '#0B0A0C', icon: 'globe', tag: '#PerrysRavers',
    tagline: 'Conectá con el beat.',
    genres: 'Electrónica, house y techno',
    artists: ['David Guetta', 'The Prodigy', 'Four Tet', 'Boys Noize'],
    barrio: 'Neón, láseres y una pista que no se apaga nunca. El barrio que late a 128 BPM, al lado del escenario que le da nombre.',
    result: 'Para vos, la noche se mide en BPM.',
    referente: 'Luz Strobo',
    carta: "Ravers: la noche se mide en BPM y nosotros no paramos. Esta semana cada video suma, así que no me dejen sola en la pista. Perry's va a ganar.",
    seed: 37, img: null
  },
  urban: {
    id: 'urban', name: 'The Urban Crew', pre: 'The', short: 'Urban Crew', call: 'Urban Crew',
    color: '#1F5BFF', on: '#FFFFFF', icon: 'spark', tag: '#UrbanCrew',
    tagline: 'Hacé que suene.',
    genres: 'Trap, reggaetón, R&B, hip-hop y pop urbano',
    artists: ['Travis Scott', 'TINI', 'Dillom', 'RAYE'],
    barrio: 'Grafitis frescos, gorras y un parlante en cada esquina. El barrio donde se sabe cada letra y cada paso.',
    result: 'Te sabés cada letra, y el Predio también la va a cantar.',
    referente: 'Sasha Flow',
    carta: 'Crew: arrancamos arriba y no pienso bajarme. Quiero sus barras, sus pasos y sus fotos con la gorra justa. Que se escuche en todo el Predio.',
    seed: 53, img: null
  }
};
RTL.ORDER = ['indie', 'rock', 'perrys', 'urban'];

/* Test de Facción: 5 preguntas, una respuesta por Facción.
   PROVISORIO: las preguntas y respuestas definitivas salen del card sorting. */
RTL.QUESTIONS = [
  {
    q: 'Es viernes a la noche. ¿Dónde te encontramos?',
    a: {
      indie: 'En un bar chico, viendo a una banda que todavía nadie conoce',
      perrys: 'En una pista que no cierra hasta que sale el sol',
      urban: 'En una juntada donde alguien rapea arriba de una base',
      rock: 'Adelante de todo, con la remera de la banda y la voz rota'
    }
  },
  {
    q: '¿Qué suena en tus auriculares a las 3 de la mañana?',
    a: {
      indie: 'Guitarras suaves y letras que duelen lindo',
      perrys: 'Un set de dos horas, sin cortes',
      urban: 'El tema que salió hoy y ya está en todos lados',
      rock: 'Un riff que te hace mover la cabeza en el colectivo'
    }
  },
  {
    q: 'Tu outfit para el Predio:',
    a: {
      indie: 'Camisa a cuadros, tote bag y lentes de feria',
      perrys: 'Visera, algo que brille y zapatillas para bailar diez horas',
      urban: 'Streetwear de pies a cabeza y la gorra justa',
      rock: 'Negro, cuero y alguna tacha'
    }
  },
  {
    q: 'En el festival, tu momento perfecto es…',
    a: {
      indie: 'Descubrir a la banda de las 4 de la tarde y volverte fan',
      perrys: 'Que caiga el drop y salte todo el Perry’s a la vez',
      urban: 'Cantar cada palabra con miles de personas',
      rock: 'El pogo del cierre, con el último acorde'
    }
  },
  {
    q: '¿Cómo convencés a tu grupo de ir?',
    a: {
      indie: 'Les armo una playlist con lo que tenemos que ver sí o sí',
      perrys: 'Les paso el horario del set y les digo que del resto me encargo yo',
      urban: 'Les mando el video del show del año pasado. No hace falta más',
      rock: 'No los convenzo: ya saben que vamos'
    }
  }
];

/* Zonas que se desbloquean semana a semana en el mapa del Predio */
RTL.ZONES = {
  tribuna: { name: 'La Tribuna', unlock: 1, when: 'miércoles 17/2', text: 'Desde acá se ve todo el Predio. Primera pista: los horarios de cada día del festival.' },
  paddock: { name: 'El Paddock', unlock: 2, when: 'miércoles 24/2', text: 'Acá se está armando algo. Si entre las cuatro Facciones llegan a la meta colectiva, la sorpresa se abre para todas.' },
  largada: { name: 'La Largada', unlock: 3, when: 'miércoles 3/3', text: 'El punto de encuentro de cada Facción en el festival: ahí se juntan las banderas antes del primer show.' },
  disco: { name: 'El Disco', unlock: 4, when: 'miércoles 10/3', text: 'Donde termina la carrera. Acá va a flamear la bandera de la Facción ganadora, en el ingreso del Predio.' }
};

/* Línea de tiempo de la campaña (10/2 al 11/3/2027) y el epílogo.
   El prototipo deja simular cada momento para mostrar cómo cambia el universo. */
RTL.TIMELINE = [
  {
    id: 's1', label: 'Semana 1', date: 'Miércoles 10/2', days: 30, step: 0,
    energy: { urban: 3420, perrys: 3100, indie: 2300, rock: 2050 }, tests: 6240,
    reto: {
      n: 1, title: 'Mostrá tu bandera', range: '10/2 al 16/2',
      what: 'Un video de hasta 15 segundos con tu resultado y por qué esa es tu música.',
      with: 'El filtro de tu Facción, #RoadToLolla y el hashtag de tu Facción.',
      until: 'Martes 16/2, 23:59.',
      how: 'Cada video válido suma 10 de energía a tu Facción.'
    },
    diario: {
      ed: 1, fecha: 'Miércoles 10 de febrero de 2027',
      title: 'Arrancó la previa: cuatro Facciones, un solo Predio',
      bajada: 'Se levantaron los cuatro barrios y la Urban Crew salió a la cancha con todo: después del primer día, es la que más energía suma.'
    }
  },
  {
    id: 's2', label: 'Semana 2', date: 'Miércoles 17/2', days: 23, step: 1,
    energy: { perrys: 9800, urban: 9100, rock: 7200, indie: 6900 }, tests: 15870,
    reto: {
      n: 2, title: 'Facción vs. Facción', range: '17/2 al 23/2',
      what: 'Desafiá a otra Facción con un video, o respondé el desafío que te hicieron con un dúo o un pegar.',
      with: 'El filtro de tu Facción, #RoadToLolla y el hashtag de la Facción que desafiás.',
      until: 'Martes 23/2, 23:59.',
      how: 'Cada respuesta suma 15 de energía a la Facción que responde.'
    },
    diario: {
      ed: 2, fecha: 'Miércoles 17 de febrero de 2027',
      title: 'Perry’s da vuelta el marcador y se abre La Tribuna',
      bajada: 'Los dúos de Facción vs. Facción cambiaron todo. Primera pista: en La Tribuna ya se ven los horarios de cada día.'
    }
  },
  {
    id: 's3', label: 'Semana 3', date: 'Miércoles 24/2', days: 16, step: 2,
    energy: { indie: 15600, perrys: 15300, urban: 14800, rock: 12900 }, tests: 26410,
    reto: {
      n: 3, title: 'Alianzas', range: '24/2 al 2/3',
      what: 'Armá un dúo con alguien de otra Facción. Esta semana, la rivalidad se juega en equipo.',
      with: 'Los dos filtros, #RoadToLolla y los hashtags de las dos Facciones.',
      until: 'Martes 2/3, 23:59.',
      how: 'Si las dos Facciones usan su filtro, la energía vale doble para ambas.'
    },
    diario: {
      ed: 3, fecha: 'Miércoles 24 de febrero de 2027',
      title: 'Alianza inesperada: la Indie Tribe pega el salto',
      bajada: 'Los dúos entre Facciones valieron doble y la Indie Tribe supo aprovecharlo. Se abrió El Paddock: algo se está armando ahí.'
    }
  },
  {
    id: 's4', label: 'Semana 4', date: 'Miércoles 3/3', days: 9, step: 3,
    energy: { perrys: 23900, indie: 22700, urban: 22100, rock: 20400 }, tests: 34950,
    reto: {
      n: 4, title: 'Llevá tu bandera', range: '3/3 al 9/3',
      what: 'Encontrá un QR de Road to Lolla en la vía pública o en un parador de verano y escanealo.',
      with: 'Tu celular y tu Facción: el QR suma a la Facción de quien lo escanea.',
      until: 'Martes 9/3, 23:59.',
      how: 'Cada QR escaneado suma 20 de energía.'
    },
    diario: {
      ed: 4, fecha: 'Miércoles 3 de marzo de 2027',
      title: 'Última semana: las banderas salen a la calle',
      bajada: 'Llegaron los QR a la vía pública y a los paradores de verano. En La Largada ya está marcado el punto de encuentro de cada Facción.'
    }
  },
  {
    id: 'vispera', label: 'Víspera', date: 'Miércoles 10/3', days: 2, step: 4,
    energy: { perrys: 30200, urban: 29500, indie: 28800, rock: 27900 }, tests: 40380,
    reto: {
      n: 5, title: 'El último grito', range: '10/3 y 11/3',
      what: 'Un video cantando el himno de tu Facción con tu grupo.',
      with: 'El filtro de tu Facción y #RoadToLolla.',
      until: 'Jueves 11/3, 23:59. Ahí se congela el marcador.',
      how: 'Cada video suma 10. A las 23:59 se cierra la competencia.'
    },
    diario: {
      ed: 5, fecha: 'Miércoles 10 de marzo de 2027',
      title: 'Víspera: se congela el marcador',
      bajada: 'Mañana a las 23:59 termina la competencia. Entre las cuatro ya pasaron las 40.000 banderas: la sorpresa está desbloqueada.'
    }
  },
  {
    id: 'epilogo', label: 'Epílogo', date: 'Lunes 15/3', days: 0, step: 5, final: true, winner: 'perrys',
    energy: { perrys: 31480, urban: 30910, indie: 29640, rock: 28770 }, tests: 41120,
    reto: {
      n: 0, title: 'La galería', range: 'Desde el 15/3',
      what: 'La competencia terminó. En la galería quedan los mejores aportes de cada Facción.',
      with: 'Todo lo que se publicó con #RoadToLolla.',
      until: 'Queda abierta hasta 2028.',
      how: 'Las Facciones vuelven en 2028.'
    },
    diario: {
      ed: 6, fecha: 'Lunes 15 de marzo de 2027',
      title: 'Ganó Perry’s, pero la previa fue de todas',
      bajada: 'La bandera de The Perry’s Ravers flameó en el ingreso del Predio. Entre las cuatro Facciones sumaron más de 40.000 banderas y desbloquearon la sorpresa. Las Facciones vuelven en 2028.'
    }
  }
];

RTL.GOAL = 40000;

/* Aportes destacados de TikTok (personajes de ficción para el prototipo) */
RTL.CLIPS = [
  { f: 'perrys', user: '@luli.bpm', text: 'Perry’s va a ganar y lo sabe todo el Predio', likes: '18,4 mil' },
  { f: 'indie', user: '@juanitodiscos', text: 'Mi bandera es la que llegó primero', likes: '9.812' },
  { f: 'urban', user: '@sofi.flow', text: 'Le respondo a la Rock Legends con un dúo', likes: '12,1 mil' }
];
