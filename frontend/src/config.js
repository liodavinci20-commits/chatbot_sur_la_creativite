// Configuration de l'API
// En dev local, VITE_API_URL n'est pas défini, donc ça utilise '' (qui passe par le proxy Vite)
// Sur Vercel, on définira VITE_API_URL = 'https://web-production-1a1d.up.railway.app'
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';
