// /src/features/documents/hooks/useUploadFinancialDocument.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadFinancialDocument } from '@/services/documentService';
 
export function useUploadFinancialDocument() {
  const queryClient = useQueryClient();
 
  return useMutation({
    mutationFn: uploadFinancialDocument,
    onSuccess: () => {
      // Invalidar caché de documentos para forzar refetch
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    retry: 0, // No reintentar uploads automáticamente
  });
}
 
// Uso en componente:
// const { mutate, isPending, isError, error } = useUploadFinancialDocument();
// isPending → mostrar barra de progreso
// isError   → mostrar mensaje de error con botón de reintento