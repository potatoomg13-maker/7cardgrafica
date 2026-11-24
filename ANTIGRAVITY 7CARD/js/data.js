/* ============================================================
   7CARD Imprenta — Catálogo de promociones
   Todos los precios provienen de las imágenes promocionales.
   `prices: null`  → el precio no figura en la promo (se muestra "Cotizar").
   `prices` es un arreglo indexado por las opciones de `selectors`
   (1 selector → [p0,p1,..] · 2 selectores → [[p00,p01],[p10,p11],..]).
   ============================================================ */
window.SITE = {
  brand: '7CARD Imprenta',
  whatsapp: '59175306663',
  phoneDisplay: '75306663',
  email: '7cargrafica@gmail.com'
};

window.CATEGORIES = [
  { id: 'todas',       label: 'Todas' },
  { id: 'calendarios', label: 'Calendarios' },
  { id: 'poleras',     label: 'Poleras navideñas' },
  { id: 'promocionales', label: 'Promocionales' },
  { id: 'volantes',    label: 'Volantes' },
  { id: 'talonarios',  label: 'Talonarios' },
  { id: 'tarjetas',    label: 'Tarjetas' }
];

window.PRODUCTS = [
  {
    id: 'cal-pared',
    category: 'calendarios',
    badge: 'Promo',
    title: 'Calendarios de pared 44×31 cm',
    short: '1000 unidades · incluye diseño',
    desc: 'Calendario de pared a full color en formato 44×31 cm. Ideal para instituciones, hoteles y negocios que quieren su marca en la pared todo el año.',
    features: ['1000 unidades', 'Couche de 115 gramos', 'Incluye diseño', 'Trabajo garantizado'],
    img: 'img/calendario-promo-1000.jpg', fit: 'cover', pos: 'center',
    selectors: [{ key: 'lote', label: 'Presentación', options: ['1000 unidades'] }],
    prices: [1200],
    unit: 'lote de 1000 unidades', qtyLabel: 'Lotes'
  },
  {
    id: 'cal-taco',
    category: 'calendarios',
    badge: 'Con taco',
    title: 'Calendarios con taco',
    short: '100 unidades · couche de 300 g',
    desc: 'Calendarios con taco mensual en tres tamaños. Diseño personalizado con tu marca, listos para repartir a tus clientes.',
    features: ['100 unidades por lote', 'Couche de 300 gramos', 'Incluye diseño', 'Tres tamaños a elegir'],
    img: 'img/calendario-con-taco.jpg', fit: 'cover', pos: 'center',
    selectors: [{ key: 'tam', label: 'Tamaño', options: [
      'Mediano 28×48 cm · taco bimensual',
      'Grande 32×60 cm · taco mensual',
      'Extra grande 35×70 cm · taco mensual'
    ] }],
    prices: [700, 800, 900],
    unit: 'lote de 100 unidades', qtyLabel: 'Lotes'
  },
  {
    id: 'cal-escritorio',
    category: 'calendarios',
    badge: 'Promo',
    title: 'Calendario de escritorio',
    short: '1000 unidades · impresión a colores',
    desc: 'Calendario de escritorio con impresión a full color. Ideal para mantener tu marca presente todo el año en el escritorio de tus clientes.',
    features: ['1000 unidades', 'Impresión a colores', 'Formato de escritorio', 'Incluye diseño'],
    img: 'img/calendario-escritorio.jpg', fit: 'cover', pos: 'center',
    selectors: [{ key: 'lote', label: 'Presentación', options: ['1000 unidades'] }],
    prices: [1200],
    unit: 'lote de 1000 unidades', qtyLabel: 'Lotes'
  },
  {
    id: 'pol-01-02',
    category: 'poleras',
    badge: 'Navidad',
    title: 'Polera navideña · Santa y reno',
    short: 'Cód. 01 y 02 · sublimada',
    desc: 'Poleras sublimadas con diseño de Papá Noel y reno, en versión roja (Cód. 01) y blanca (Cód. 02). Venta por mayor y menor.',
    features: ['Sublimado a full color', 'Venta por mayor y menor', 'Cód. 01 y Cód. 02'],
    img: 'img/poleras-01-02.jpg', fit: 'cover', pos: 'center',
    selectors: [{ key: 'cod', label: 'Código', options: ['Cód. 01 · roja', 'Cód. 02 · blanca'] }],
    prices: null,
    unit: 'por mayor y menor', qtyLabel: 'Unidades'
  },
  {
    id: 'pol-03-08',
    category: 'poleras',
    badge: 'Navidad',
    title: 'Polera navideña · Grinch y renos',
    short: 'Cód. 03 sublimada · Cód. 08 algodón',
    desc: 'Cód. 03: polera sublimada con el Grinch y su perrito. Cód. 08: polera negra 100% algodón con árbol y renos, estampada en serigrafía.',
    features: ['Cód. 03 sublimada', 'Cód. 08 100% algodón', 'Sublimados & serigrafía'],
    img: 'img/poleras-03-08.jpg', fit: 'cover', pos: 'center',
    selectors: [{ key: 'cod', label: 'Código', options: ['Cód. 03 · sublimada', 'Cód. 08 · negra 100% algodón'] }],
    prices: null,
    unit: 'por mayor y menor', qtyLabel: 'Unidades'
  },
  {
    id: 'pol-04-06',
    category: 'poleras',
    badge: 'Navidad',
    title: 'Polera navideña · Ho Ho Ho',
    short: 'Cód. 04 negra · Cód. 06 blanca',
    desc: 'Diseño Ho Ho Ho con Papá Noel y bastones de caramelo, en polera negra (Cód. 04) o blanca (Cód. 06) con cuello rojo.',
    features: ['Negra o blanca', 'Cuello y puños rojos', 'Venta por mayor y menor'],
    img: 'img/poleras-04-06.jpg', fit: 'cover', pos: 'center',
    selectors: [{ key: 'cod', label: 'Código', options: ['Cód. 04 · negra', 'Cód. 06 · blanca'] }],
    prices: null,
    unit: 'por mayor y menor', qtyLabel: 'Unidades'
  },
  {
    id: 'pol-05',
    category: 'poleras',
    badge: 'Navidad',
    title: 'Polera navideña · Árbol y Santa',
    short: 'Cód. 05 · cuello redondo o en V',
    desc: 'Polera azul sublimada con árbol de Navidad y Papá Noel. Disponible en cuello redondo o cuello en V.',
    features: ['Cuello redondo o en V', 'Sublimado a full color', 'Cód. 05'],
    img: 'img/poleras-05.jpg', fit: 'cover', pos: 'center',
    selectors: [{ key: 'cuello', label: 'Cuello', options: ['Cuello redondo', 'Cuello en V'] }],
    prices: null,
    unit: 'por mayor y menor', qtyLabel: 'Unidades'
  },
  {
    id: 'llaveros',
    category: 'promocionales',
    badge: 'Promo',
    title: 'Llaveros personalizados',
    short: '100 unidades con tu logo',
    desc: 'Llaveros con tu logo o marca, en forma redonda o semirectangular. Una forma económica de que te recuerden.',
    features: ['100 unidades', 'Forma redonda o semirectangular', 'Impresión de tu logo'],
    img: 'img/llaveros.jpg', fit: 'cover', pos: 'center',
    selectors: [{ key: 'forma', label: 'Forma', options: ['Redondo', 'Semirectangular'] }],
    prices: [450, 450],
    unit: 'lote de 100 unidades', qtyLabel: 'Lotes'
  },
  {
    id: 'boligrafos',
    category: 'promocionales',
    badge: 'Promo',
    title: 'Bolígrafos con tu marca',
    short: '100 unidades · serigrafía',
    desc: 'Bolígrafos blancos con tu logo o marca impresos en serigrafía. Elige el color de tinta de tu identidad.',
    features: ['100 unidades', 'Imprimimos tu logo o marca', 'Serigrafía a un color'],
    img: 'img/boligrafos.jpg', fit: 'cover', pos: 'center',
    selectors: [{ key: 'tinta', label: 'Color de impresión', options: ['Negro', 'Rojo', 'Verde'] }],
    prices: [450, 450, 450],
    unit: 'lote de 100 unidades', qtyLabel: 'Lotes'
  },
  {
    id: 'volantes',
    category: 'volantes',
    badge: 'Promo',
    title: 'Volantes ½ oficio full color',
    short: 'Bond de 75 g · desde 1000 unidades',
    desc: 'Volantes media hoja oficio a full color en papel bond de 75 gramos. Elige cantidad e impresión a uno o ambos lados.',
    features: ['Papel bond 75 grs', '½ oficio full color', 'Impreso a 1 lado o ambos lados'],
    img: 'img/volantes.jpg', fit: 'contain', pos: 'center',
    selectors: [
      { key: 'cant', label: 'Cantidad', options: ['1000 volantes', '2000 volantes', '4000 volantes'] },
      { key: 'lados', label: 'Impresión', options: ['Impreso 1 lado', 'Ambos lados'] }
    ],
    prices: [[220, 250], [280, 320], [390, 490]],
    unit: 'paquete', qtyLabel: 'Paquetes'
  },
  {
    id: 'volantes-feria',
    category: 'volantes',
    badge: 'Feria',
    title: 'Volantes y flyers · Promo feria',
    short: 'Full color · edición especial de feria',
    desc: 'Volantes y flyers a full color para promocionar tu negocio, campaña o evento. Escríbenos por WhatsApp para cotizar según la cantidad y acabado que necesites.',
    features: ['Impresión full color', 'Ideal para ferias y eventos', 'Cotización personalizada'],
    img: 'img/volantes-feria.jpg', fit: 'contain', pos: 'center',
    selectors: [{ key: 'lados', label: 'Impresión', options: ['1 lado', 'Ambos lados'] }],
    prices: null,
    unit: 'según cantidad', qtyLabel: 'Paquetes'
  },
  {
    id: 'talonarios',
    category: 'talonarios',
    badge: 'Promo',
    title: 'Talonarios y formularios',
    short: 'Recibos, notas y formularios personalizados',
    desc: 'Impresión de talonarios y formularios personalizados para empresas, consultorios y comercios. Original y copias según lo que requiera tu negocio.',
    features: ['Talonarios y formularios a medida', 'Diseño personalizado con tu marca', 'Cotización según cantidad y copias'],
    img: 'img/talonarios.jpg', fit: 'contain', pos: 'center',
    selectors: [{ key: 'tipo', label: 'Tipo', options: ['Talonarios', 'Formularios'] }],
    prices: null,
    unit: 'según cantidad', qtyLabel: 'Talonarios'
  },
  {
    id: 'tarjetas-personales',
    category: 'tarjetas',
    badge: 'Oferta',
    title: 'Tarjetas personales',
    short: '1000 unidades · plastificado brillo',
    desc: 'Tarjetas personales a todo color con acabado plastificado brillo. Presentación en oferta especial de 1000 unidades para tu negocio o emprendimiento.',
    features: ['1000 unidades', 'Plastificado brillo', 'Impresión a full color', 'Oferta especial'],
    img: 'img/tarjetas-personales.jpg', fit: 'cover', pos: 'center',
    selectors: [{ key: 'lote', label: 'Presentación', options: ['1000 unidades · plastificado brillo'] }],
    prices: [95],
    unit: 'lote de 1000 unidades', qtyLabel: 'Lotes'
  }
];

/* Orden de las imágenes del carrusel principal */
window.HERO_SLIDES = ['cal-pared', 'pol-01-02', 'volantes', 'pol-05', 'cal-taco', 'boligrafos'];

/* Galería (usa las imágenes tal cual vinieron de las promos) */
window.GALLERY = [
  { img: 'img/poleras-01-02.jpg',        title: 'Poleras Cód. 01 y 02' },
  { img: 'img/calendario-promo-1000.jpg', title: 'Calendarios de pared' },
  { img: 'img/poleras-03-08.jpg',        title: 'Poleras Cód. 03 y 08' },
  { img: 'img/llaveros.jpg',             title: 'Llaveros personalizados' },
  { img: 'img/poleras-05.jpg',           title: 'Polera Cód. 05' },
  { img: 'img/calendario-con-taco.jpg',  title: 'Calendarios con taco' },
  { img: 'img/poleras-04-06.jpg',        title: 'Poleras Cód. 04 y 06' },
  { img: 'img/boligrafos.jpg',           title: 'Bolígrafos con tu marca' }
];
