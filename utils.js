// utils.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// 🔧 CONFIGURA QUI
const supabase = createClient(
      'https://mtaswzwpoyjfgbxvroxi.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10YXN3endwb3lqZmdieHZyb3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0ODMxMzEsImV4cCI6MjA3NTA1OTEzMX0.GJsLdv9ZRGfJ6LFqz-SLxqC3ooQ7XXLMXy5ZAfv0-tw'
    );

window.supabase = supabase;  // solo per debug

// stato
export function getState() {
  try { return JSON.parse(localStorage.getItem('od.state') || '{}'); }
  catch { return {}; }
}
export function setState(s) {
  localStorage.setItem('od.state', JSON.stringify(s));
}

// payload builder con fallback per NOT NULL
export function buildPayloadFromState(state) {
  const nome    = state?.user?.nome?.trim()    || 'N/D';
  const cognome = state?.user?.cognome?.trim() || 'N/D';
  const email   = state?.user?.email?.trim()   || null;
  const azienda = state?.user?.azienda?.trim() || null;
  const scuola  = state?.user?.scuola?.trim()  || null;

  const answers = (state?.answers && typeof state.answers === 'object') ? state.answers : {};
  const results = (state?.results && typeof state.results === 'object') ? state.results : {};

  return {
    nome, cognome, email, azienda, scuola,
    answers, results,
    version: state?.version ?? 1,
    user_agent: navigator.userAgent
  };
}

// insert con log dettagliato
export async function saveResponse(payload) {
  const { data, error } = await supabase
    .from('responses')
    .insert(payload, {returning: 'minimal'});

  if (error) {
    console.error('Supabase INSERT error →', error);
  } else {
    console.log('Supabase INSERT ok →', data);
  }
  return { data, error };
}
