require('dotenv').config();
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

async function main() {
  const entries = {
    freeUsageLimit: 5,
    supportEmail: "support@codeway.co",
    privacyPage: "https://codeway.com/privacy_en.html",
    minimumVersion: "1.0",
    latestVersion: "2.1",
    compressionQuality: 0.7,
    btnText: "Try now!",
  };

  const batch = db.batch();
  Object.entries(entries).forEach(([key, value]) => {
    const ref = db.collection('configs').doc(key);
    batch.set(ref, { value }, { merge: true });
  });

  await batch.commit();
  console.log('configs seeded ✔');
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
