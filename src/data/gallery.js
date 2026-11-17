// Fotky galerie — jediný zdroj pravdy (ScenaGallery, počet fotek v hlavičce /galerie).
// Texty `alt` slouží jen čtečkám obrazovky — v galerii se nikde nezobrazují.
export const images = [
  { src: 'gallery-1', alt: 'Tábořiště s dobovými stany, stolem a vybavením', area: 'g1', w: 1400, h: 666 },
  { src: 'gallery-2', alt: 'Stanové ležení s dřevěným nábytkem a nádobím', area: 'g2', w: 1400, h: 915 },
  { src: 'gallery-21', alt: 'Usměvavý šermíř ve fialovém kabátě zkříží čepel se soupeřem', area: 'g3', w: 1400, h: 932 },
  { src: 'gallery-20', alt: 'Šermíř ve zlatozelené vestě s mečem u plotu hřiště', area: 'g4', w: 1400, h: 932 },
  { src: 'gallery-5', alt: 'Dobové ležení se stanem a postavou v červeném kostýmu', area: 'g5', w: 1050, h: 1400 },
  { src: 'gallery-9', alt: 'Šermíři v kostýmech na trávníku před hradbou a stany', area: 'g6', w: 1400, h: 646 },
  { src: 'gallery-11', alt: 'Skupinový souboj na trávníku, v pozadí stany a hradba', area: 'g7', w: 1400, h: 646 },
  { src: 'gallery-23', alt: 'Dva šermíři v těsném souboji, jeden s mečem u země', area: 'g8', w: 1400, h: 932 },
];

// Zbytek fotek ze sezóny 2026 — jen v rozšířené galerii na /galerie.
// `cols` × `rows` = velikost dlaždice v šestisloupcovém rytmu (dohromady bez děr).
export const extraImages = [
  { src: 'gallery-10', alt: 'Souboj dvojice šermířů před barevnými stany pod hradbou', cols: 4, rows: 2, w: 1400, h: 646 },
  { src: 'gallery-12', alt: 'Dva souboje najednou na nádvoří dobového ležení', cols: 2, rows: 1, w: 1400, h: 646 },
  { src: 'gallery-13', alt: 'Šermířské vystoupení před diváky na městském nádvoří', cols: 2, rows: 1, w: 1400, h: 646 },
  { src: 'gallery-14', alt: 'Dva členové skupiny v dobových kostýmech před hradbou', cols: 2, rows: 2, w: 646, h: 1400 },
  { src: 'gallery-16', alt: 'Šermíř v předklonu proti soupeři, v pozadí ležení a diváci', cols: 4, rows: 1, w: 1400, h: 646 },
  { src: 'gallery-17', alt: 'Dva šermíři se střetávají meči před stanem', cols: 2, rows: 1, w: 1400, h: 646 },
  { src: 'gallery-18', alt: 'Šermíři v pohybu na trávníku, v pozadí barevný stan', cols: 2, rows: 1, w: 1400, h: 646 },
  { src: 'gallery-19', alt: 'Večerní vystoupení na pódiu před publikem na náměstí', cols: 3, rows: 2, w: 1400, h: 788 },
  { src: 'gallery-24', alt: 'Šermířka v černém a šermíř ve fialovém kabátě v dramatickém okamžiku souboje', cols: 3, rows: 1, w: 1400, h: 932 },
  { src: 'gallery-25', alt: 'Šermíř v akrobatickém pádu a soupeř s mečem v humorné scéně', cols: 3, rows: 1, w: 1400, h: 932 },
  { src: 'gallery-15', alt: 'Šermíř s rozpřaženýma rukama uprostřed hrané scény, za ním diváci', cols: 4, rows: 2, w: 1400, h: 646 },
  { src: 'gallery-22', alt: 'Šermíř ve fialovém kabátě v předklonu s mečem v ruce', cols: 2, rows: 1, w: 1400, h: 932 },
  { src: 'gallery-26', alt: 'Dva šermíři v tuhém zápase zblízka', cols: 2, rows: 1, w: 1400, h: 932 },
  { src: 'gallery-27', alt: 'Šermíř v šedé vestě a soupeřka s mečem v souboji', cols: 2, rows: 1, w: 1400, h: 932 },
  { src: 'gallery-28', alt: 'Dva šermíři se střetávají v souboji s meči', cols: 2, rows: 1, w: 1400, h: 932 },
  { src: 'gallery-29', alt: 'Šermíř ve fialovém kabátě a šermířka v bílé košili se střetávají meči', cols: 2, rows: 1, w: 1400, h: 932 },
];

export const galleryCount = images.length + extraImages.length;
