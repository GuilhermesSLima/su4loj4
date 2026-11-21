export interface Api {
  name: string;
}

let caminho: Api[] = [
  { name: '/api/health' },
  { name: '/api/produtos' },
];

export async function apresentar(): Promise<Api[]> {
    return caminho;
}