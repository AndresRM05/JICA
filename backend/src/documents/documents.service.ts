// Producer — encola el trabajo desde el Service
// /backend/src/documents/documents.service.ts
@Injectable()
export class DocumentsService {
  constructor(
    @InjectQueue('documents') private documentsQueue: Queue,
  ) {}
 
  async uploadDocument(file: Express.Multer.File, businessId: string): Promise<void> {
    await this.documentsQueue.add('validate-document', {
      fileBuffer: file.buffer,
      fileName: file.originalname,
      businessId,
    });
    // Retorna inmediatamente; el procesamiento ocurre en background
  }
}