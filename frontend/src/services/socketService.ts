interface LocalSocket {
  on: (event: string, handler: (data: unknown) => void) => void;
  off: (event: string) => void;
}

export function connectSocket(): void {
  return undefined;
}

export function disconnectSocket(): void {
  return undefined;
}

export function getSocket(): LocalSocket | null {
  return null;
}
