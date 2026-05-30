/ Correcto: hook dedicado
// /src/hooks/useWindowSize.ts
export function useWindowSize() {
  // escucha 'resize', retorna { width, height }
}
 
// Incorrecto: addEventListener directo en componente
useEffect(() => {
  window.addEventListener('resize', handler); // NO
}, []);