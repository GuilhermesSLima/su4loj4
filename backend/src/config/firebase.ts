import { readFileSync } from 'node:fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const caminhoChave = new URL('../../firebase-key.json', import.meta.url);
const chave = JSON.parse(readFileSync(caminhoChave, 'utf-8'));

initializeApp({ credential: cert(chave) });

export const db = getFirestore();
