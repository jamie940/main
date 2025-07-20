const admin = require('firebase-admin');
const serviceAccount = require('../firebase-admin-config.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).send('Unauthorized');
  }

  const idToken = header.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error while verifying Firebase ID token:', error);
    res.status(403).send('Unauthorized');
  }
}

module.exports = authMiddleware;
