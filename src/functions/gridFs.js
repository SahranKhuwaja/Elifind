const db = require('../db/mongoose');
const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');

exports.imageStorage = new GridFsStorage({
    db,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'Images'
          };
          resolve(fileInfo);
        });
      });
    }
  });
  
  exports.videoStorage = new GridFsStorage({
      db,
      file: (req, file) => {
        return new Promise((resolve, reject) => {
          crypto.randomBytes(16, (err, buf) => {
            if (err) {
              return reject(err);
            }
            const filename = buf.toString('hex') + path.extname(file.originalname);
            const fileInfo = {
              filename: filename,
              bucketName: 'Videos'
            };
            resolve(fileInfo);
          });
        });
      }
    });
