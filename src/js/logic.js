// Lógica de CampusFest: funciones puras, sin DOM.
// La app (app.js) y las pruebas (tests/) usan estas mismas funciones.

const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Convierte "2026-11-24" en una fecha a mediodía para evitar problemas de zona horaria.
function toDate(dateStr) {
  return new Date(`${dateStr}T12:00:00`);
}

function pad(number) {
  return String(number).padStart(2, '0');
}

// ---------- Cupos ----------

export function spotsLeft(event) {
  const capacity = Number(event?.capacity ?? 0);
  const registered = Number(event?.registered ?? 0);
  return Math.max(0, capacity - registered);
}

export function isFull(event) {
  const capacity = Number(event?.capacity ?? 0);
  const registered = Number(event?.registered ?? 0);
  return registered >= capacity || spotsLeft(event) === 0;
}

export function spotsLabel(event) {
  const left = spotsLeft(event);
  return `${left} ${left === 1 ? 'lugar' : 'lugares'}`;
}

// ---------- Precio ----------

export function formatPrice(price) {
  const numeric = Number(price ?? 0);
  if (numeric === 0) return 'Gratis';
  return `$${numeric}`;
}

// ---------- Fechas ----------

export function formatShortDate(dateStr) {
  const parts = String(dateStr ?? '').split('-');
  if (parts.length >= 3) {
    const day = parts[2].slice(0, 2).padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    return `${day}/${month}`;
  }
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
}

export function weekdayName(dateStr) {
  return WEEKDAYS[toDate(dateStr).getDay()];
}

export function daysUntil(dateStr, todayStr) {
  return Math.round((toDate(dateStr) - toDate(todayStr)) / MS_PER_DAY);
}

export function countdownLabel(eventDate, currentDate) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const diffDays = Math.round((toUtcDayMs(eventDate) - toUtcDayMs(currentDate)) / msPerDay);

  if (diffDays < 0) {
    return 'Finalizado';
  }
  return `Faltan ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
}

export function sortByDate(events = []) {
  return [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

// ---------- Búsqueda y filtros ----------

export function matchesSearch(event, query) {
  const text = `${event.title} ${event.venue} ${event.categoryLabel}`.toLowerCase();
  return text.includes(query.trim().toLowerCase());
}

export function filterEvents(events, { query = '', category = 'todas', day = null, onlyMine = false, mine = [] } = {}) {
  return events.filter((event) => {
    if (category !== 'todas' && event.category !== category) return false;
    if (day && event.date !== day) return false;
    if (onlyMine && !mine.includes(event.id)) return false;
    if (query && !matchesSearch(event, query)) return false;
    return true;
  });
}


