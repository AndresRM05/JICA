// Consumer — procesa el trabajo en background
// /backend/src/documents/documents.processor.ts
@Processor('documents')
export class DocumentsProcessor {
  private readonly logger = new Logger(DocumentsProcessor.name);
 
  @Process('validate-document')
  async handleValidateDocument(job: Job) {
    const { fileBuffer, fileName, businessId } = job.data;
    // Lógica de validación y subida a Azure Blob Storage
    this.logger.log(`Procesando documento ${fileName} para negocio ${businessId}`);
  }
}