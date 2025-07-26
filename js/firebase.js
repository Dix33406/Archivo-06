// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  getStorage
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// Tu nueva configuración (blog + chat en el mismo proyecto)
const firebaseConfig = {
  apiKey: "AIzaSyAYsW0aldjctH2-tcdL5J_oLKAdSA7HFe4",
  authDomain: "snapback-c86ba.firebaseapp.com",
  projectId: "snapback-c86ba",
  storageBucket: "snapback-c86ba.appspot.com",
  messagingSenderId: "398326666724",
  appId: "1:398326666724:web:212270bf526481ad94e3f1"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar instancias
export const db = getFirestore(app);
export const storage = getStorage(app);
