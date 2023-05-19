// import prisma from '../../../db';
import * as fs from 'fs/promises';
import * as path from 'path';
import { MultipartFile } from '@fastify/multipart';
import * as md5 from 'js-md5';
import { res } from '../../../utils/result';

export default class VideoService {
  static async create(file: MultipartFile) {
    const fileData = new Uint8Array(await file.toBuffer());
    let fileName;
    try {
      fileName = md5(fileData);
    } catch (error) {
      fileName = md5(file.filename);
    }
    const ext = file.filename.split('.').pop() || 'mp4';
    const videoName = `${fileName}.${ext}`;
    const videoPath = path.resolve(
      __dirname,
      process.env.STATIC_PATH!,
      `./videos/${videoName}`
    );
    try {
      await fs.writeFile(videoPath, fileData);
      return res({
        code: 0,
        result: {
          fileUrl: path
            .join(
              process.env.PUBLIC_PREFIX_PATH!,
              './static',
              `.${videoPath.split(process.env.STATIC_PATH!).pop()!}`
            )
            .replaceAll('\\', '/'),
        },
        message: '上传成功',
      });
    } catch (error) {
      return res({
        code: -1,
        result: error,
        message: '保存文件失败',
      });
    }
  }
}
