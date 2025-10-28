const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const util = require('util');

const writeFile = util.promisify(fs.writeFile);
const stat = util.promisify(fs.stat);

const uploadsDir = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const s3ConfigPresent = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.S3_BUCKET;

let s3;
if (s3ConfigPresent) {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1'
  });
  s3 = new AWS.S3();
}

// uploadFile recebe req.file (Multer memoryStorage)
exports.uploadFile = async (file) => {
  const ext = file.originalname ? file.originalname.split('.').pop() : 'bin';
  const filename = `${Date.now()}-${Math.round(Math.random()*1e6)}.${ext}`;

  if (s3 && process.env.S3_BUCKET) {
    // envia para S3
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: filename,
      Body: file.buffer,
      ContentType: file.mimetype
    };
    await s3.putObject(params).promise();
    const url = s3.getSignedUrl('getObject', { Bucket: process.env.S3_BUCKET, Key: filename, Expires: 60 * 60 }); // 1h
    return { filename, storage: 's3', url };
  } else {
    // salva localmente
    const filepath = path.join(uploadsDir, filename);
    await writeFile(filepath, file.buffer);
    const url = `/uploads/${filename}`;
    return { filename, storage: 'local', url, path: filepath };
  }
};

exports.getFileInfo = async (filename) => {
  if (s3 && process.env.S3_BUCKET) {
    // simples checagem: assumimos que arquivo existe no S3 (não chamado headObject por simplicidade)
    const url = s3.getSignedUrl('getObject', { Bucket: process.env.S3_BUCKET, Key: filename, Expires: 60 * 60 });
    return { storage: 's3', filename, url };
  } else {
    const filepath = path.join(uploadsDir, filename);
    if (!fs.existsSync(filepath)) return null;
    const s = await stat(filepath);
    return { storage: 'local', filename, path: filepath, size: s.size, mimeType: 'audio/mpeg' };
  }
};

exports.streamLocalFile = (pathToFile) => {
  return fs.createReadStream(pathToFile);
};
