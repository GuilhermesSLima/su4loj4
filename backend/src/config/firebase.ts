import { readFileSync, existsSync } from 'node:fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let chave;

if (process.env.FIREBASE_KEY) {
  chave = JSON.parse(process.env.FIREBASE_KEY);
} else if (existsSync('/etc/secrets/firebase-key.json')) {
  chave = JSON.parse(readFileSync('/etc/secrets/firebase-key.json', 'utf-8'));
} else {
  const caminhoChave = new URL('../../firebase-key.json', import.meta.url);
  chave = JSON.parse(readFileSync(caminhoChave, 'utf-8'));
}

initializeApp({ credential: cert(chave) });

export const db = getFirestore();
