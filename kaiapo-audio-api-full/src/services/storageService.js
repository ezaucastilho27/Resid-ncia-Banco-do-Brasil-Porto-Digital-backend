const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const util = require('util');

const writeFile = util.promisify(fs.writeFile);
const stat = util.promisify(fs.stat);

const uploadsDir = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const b2ConfigPresent = process.env.B2_KEY_ID && process.env.B2_APP_KEY && process.env.B2_BUCKET;

let s3;
if (b2ConfigPresent) {
  s3 = new AWS.S3({
    accessKeyId: process.env.B2_KEY_ID,
    secretAccessKey: process.env.B2_APP_KEY,
    region: 'us-east-005', // use qualquer, não importa muito
    endpoint: process.env.B2_ENDPOINT,
    s3ForcePathStyle: true, // obrigatório para Backblaze
    signatureVersion: 'v4'
  });
}

// uploadFile recebe req.file (Multer memoryStorage)
exports.uploadFile = async (file) => {
  const ext = file.originalname ? file.originalname.split('.').pop() : 'bin';
  const filename = `${Date.now()}-${Math.round(Math.random()*1e6)}.${ext}`;

  if (s3 && process.env.B2_BUCKET) {
    const params = {
      Bucket: process.env.B2_BUCKET,
      Key: filename,
      Body: file.buffer,
      ContentType: file.mimetype
    };
    await s3.putObject(params).promise();

    const url = s3.getSignedUrl('getObject', {
      Bucket: process.env.B2_BUCKET,
      Key: filename,
      Expires: 60 * 60
    });

    return { filename, storage: 's3', url };
  } else {
    const filepath = path.join(uploadsDir, filename);
    await writeFile(filepath, file.buffer);
    const url = `/uploads/${filename}`;
    return { filename, storage: 'local', url, path: filepath };
  }
};


exports.getFileInfo = async (filename) => {
  if (s3 && process.env.B2_BUCKET) {
    const url = s3.getSignedUrl('getObject', {
      Bucket: process.env.B2_BUCKET,
      Key: filename,
      Expires: 60 * 60
    });
    return { storage: 's3', filename, url };
  } else {
    const filepath = path.join(uploadsDir, filename);
    if (!fs.existsSync(filepath)) return null;
    const s = await stat(filepath);
    return { storage: 'local', filename, path: filepath, size: s.size };
  }
};

exports.streamLocalFile = (pathToFile) => {
  return fs.createReadStream(pathToFile);
};
