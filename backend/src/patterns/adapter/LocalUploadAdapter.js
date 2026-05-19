import { IVideoSource } from './IVideoSource.js';

export class LocalUploadAdapter extends IVideoSource {
  constructor(multerFile) {
    super();
    this.file = multerFile;
  }

  async getBuffer() {
    return this.file.buffer;
  }

  async getMetadata() {
    return {
      filename: this.file.originalname,
      mimetype: this.file.mimetype,
      size: this.file.size,
      title: this.file.originalname.split('.')[0]
    };
  }
}