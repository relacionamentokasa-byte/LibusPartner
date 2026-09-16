/**
 * Helper para gerar o link oficial de consulta do Certificado de Aprovação (C.A.) no portal Consulta CA / MTE
 * Permite que técnicos e clientes verifiquem a autenticidade e validade com um clique.
 */
export const getCaConsultUrl = (caNumber?: string | number | null): string => {
  if (!caNumber) return 'https://consultaca.com';
  const cleanCa = String(caNumber).replace(/\D/g, '');
  return cleanCa ? `https://consultaca.com/${cleanCa}` : 'https://consultaca.com';
};
