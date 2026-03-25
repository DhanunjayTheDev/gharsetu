import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import logger from '../shared/utils/logger';

export const configureCloudinary = (): void => {
  if (config.cloudinary.cloudName) {
    cloudinary.config({
      cloud_name: config.cloudinary.cloudName,
      api_key: config.cloudinary.apiKey,
      api_secret: config.cloudinary.apiSecret,
    });
    logger.info('Cloudinary configured');
  } else {
    logger.warn('Cloudinary not configured - file uploads will be stored locally');
  }
};

export const uploadToCloudinary = async (
  filePath: string,
  folder: string
): Promise<{ url: string; publicId: string }> => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: `gharsetu/${folder}`,
    resource_type: 'auto',
  });
  return { url: result.secure_url, publicId: result.public_id };
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};

export default cloudinary;
