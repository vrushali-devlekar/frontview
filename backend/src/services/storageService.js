const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs').promises;

// Firebase initialization
const initializeFirebase = () => {
    if (!process.env.FIREBASE_PROJECT_ID) {
        console.warn('⚠️ FIREBASE_PROJECT_ID not found in .env. Storage features will be disabled.');
        return null;
    }

    try {
        if (admin.apps.length === 0) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                }),
                storageBucket: process.env.FIREBASE_STORAGE_BUCKET
            });
        }
        return admin.storage().bucket();
    } catch (error) {
        console.error('❌ Failed to initialize Firebase:', error.message);
        return null;
    }
};

const bucket = initializeFirebase();

/**
 * Uploads a directory recursively to Firebase Storage
 * @param {string} localPath - Local directory path (e.g., /tmp/deployments/123/dist)
 * @param {string} remotePath - Remote path in bucket (e.g., deployments/123)
 */
const uploadDirectory = async (localPath, remotePath) => {
    if (!bucket) throw new Error('Firebase Storage is not configured.');

    const files = await getFilesRecursive(localPath);
    
    // 🌟 Parallel Upload optimization using Promise.all()
    const uploadPromises = files.map(async (file) => {
        const relativePath = path.relative(localPath, file);
        const destination = path.join(remotePath, relativePath).replace(/\\/g, '/');
        
        await bucket.upload(file, {
            destination,
            public: true,
            metadata: {
                cacheControl: 'public, max-age=31536000',
            }
        });
    });

    await Promise.all(uploadPromises);
    return `https://storage.googleapis.com/${bucket.name}/${remotePath}/index.html`;
};

// Helper to get all files in a directory recursively
async function getFilesRecursive(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(entries.map((entry) => {
        const res = path.resolve(dir, entry.name);
        return entry.isDirectory() ? getFilesRecursive(res) : res;
    }));
    return Array.prototype.concat(...files);
}

module.exports = { uploadDirectory };
