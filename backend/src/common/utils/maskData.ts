// /backend/src/common/utils/maskData.ts
export function maskTaxId(taxId: string): string {
  return taxId.replace(/^.+(.{4})$/, '***-***-$1');
}
 
export function maskAccountNumber(account: string): string {
  return account.replace(/^.+(.{4})$/, '**** **** **** $1');
}
 
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  return `${local.slice(0, 2)}***@${domain}`;
}