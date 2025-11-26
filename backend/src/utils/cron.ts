import { CronJob } from 'cron';
import path from 'path';
import fs from 'fs';

const TEMP_PATH = process.env.UPLOAD_PATH_TEMP || 'temp';
const TEMP_DIR = path.join(__dirname, '../public', TEMP_PATH);

const MAX_FILE_AGE = 60 * 60 * 1000;

const cleanTempFolder = async () => {
  try {
    const files = await fs.promises.readdir(TEMP_DIR);
    const now = Date.now();

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(TEMP_DIR, file);
        const stats = await fs.promises.stat(filePath);
        const fileAge = now - stats.mtimeMs;

        if (fileAge > MAX_FILE_AGE) {
          await fs.promises.unlink(filePath);
          console.log(`Удалён временный файл: ${file}`);
        }
      })
    );
  } catch (error) {
    console.error('Ошибка очистки временной папки:', error);
  }
};

const cronJob = new CronJob('0 * * * *', cleanTempFolder);

export const startCron = () => {
  cronJob.start();
  console.log('Cron для очистки временных файлов запущен');
};

export default cronJob;
