import { Injectable, Logger } from '@nestjs/common';

type UploadedDocument = {
  buffer: Buffer;
  originalname: string;
};

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  async uploadDocument(file: UploadedDocument, businessId: string): Promise<void> {
    this.logger.log(`Documento ${file.originalname} recibido para negocio ${businessId}`);
  }
}
