import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DocumentsProcessor {
  private readonly logger = new Logger(DocumentsProcessor.name);

  async handleValidateDocument(job: { data: { fileName: string; businessId: string } }): Promise<void> {
    const { fileName, businessId } = job.data;
    this.logger.log(`Procesando documento ${fileName} para negocio ${businessId}`);
  }
}
