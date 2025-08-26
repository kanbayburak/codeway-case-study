const express = require("express");
const { db } = require("../config/firebase");
const verifyFirebaseToken = require("../middlewares/verifyFirebase");
const verifyApiToken = require("../middlewares/verifyApiToken");
const { FieldValue } = require("firebase-admin/firestore");

const router = express.Router();
const configsCollection = db.collection("configs");

router.get("/config", verifyApiToken, async (req, res) => {
  try {
    const snapshot = await configsCollection.get();
    const configData = {};
    snapshot.forEach((doc) => {
      configData[doc.id] = doc.data().value;
    });
    res.json(configData);
  } catch (error) {
    console.error("Firestore error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/config", verifyFirebaseToken, async (req, res) => {
  try {
    const snapshot = await configsCollection.get();
    const configList = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      configList.push({
        key: doc.id,
        value: data.value,
        description: data.description || "", 
        audiences: data.audiences || {},
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
      });
    });
    res.json(configList);
  } catch (error) {
    console.error("Firestore error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.put("/admin/config/:key", verifyFirebaseToken, async (req, res) => {
  try {
    const { key } = req.params;
    const { value, clientUpdatedAt } = req.body;

    const docRef = configsCollection.doc(key);
    const doc = await docRef.get();

    // Çakışma kontrolü
    if (doc.exists) {
      const serverUpdatedAt = doc.data().updatedAt?.toMillis();
      if (clientUpdatedAt && serverUpdatedAt && clientUpdatedAt < serverUpdatedAt) {
        return res.status(409).json({ error: "Conflict - data is newer on server" });
      }
    }

    await docRef.set(
      {
        value,
        updatedAt: FieldValue.serverTimestamp(), 
        createdAt: doc.exists ? doc.data().createdAt : FieldValue.serverTimestamp(), 
      },
      { merge: true }
    );

    res.json({ success: true, message: `${key} güncellendi` });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/admin/config", verifyFirebaseToken, async (req, res) => {
  try {
    const { key, value, description, audiences } = req.body;

    if (!key || value === undefined) {
      return res.status(400).json({ error: "Key ve value zorunlu!" });
    }

    const docRef = configsCollection.doc(key);

    await docRef.set({
      value: value,
      description: description || "",
      audiences: audiences || {},   
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    res.json({ success: true, message: `${key} başarıyla eklendi` });
  } catch (error) {
    console.error("Create error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/admin/config/:key", verifyFirebaseToken, async (req, res) => {
  try {
    const { key } = req.params;
    await configsCollection.doc(key).delete();
    res.json({ success: true, message: `${key} silindi` });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
