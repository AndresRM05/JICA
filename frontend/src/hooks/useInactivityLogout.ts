// /src/hooks/useInactivityLogout.ts
const INACTIVITY_LIMIT_MS = 30 * 60 * 1000; // 30 minutos

// Eventos a escuchar: mousemove, keydown, click, scroll, touchstart
// Al cumplir el tiempo: logoutUser() + clearSession() + redirect '/login'
// Al desmontar: limpiar todos los listeners y el timer