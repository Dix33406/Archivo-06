// js/auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ✅ Usamos la misma Firebase del chat para auth
const firebaseConfig = {
  apiKey: "AIzaSyBb88k03OMD6yI4XB4Ic2fT1DFITGhb8Fw",
  authDomain: "snapback-7664b.firebaseapp.com",
  projectId: "snapback-7664b",
  storageBucket: "snapback-7664b.appspot.com",
  messagingSenderId: "493765667584",
  appId: "1:493765667584:web:2ad110dd54b9d0d3d2e1e5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ Redirección si no hay sesión
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html"; // tu pantalla de login
  } else {
    console.log("Usuario activo:", user.email);
  }
});

// ✅ Cerrar sesión manual
window.cerrarSesion = () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
};

// ✅ Cierre por inactividad (5 minutos)
let tiempoInactividad;
const tiempoMax = 5 * 60 * 1000; // 5 minutos

function resetearInactividad() {
  clearTimeout(tiempoInactividad);
  tiempoInactividad = setTimeout(() => {
    cerrarSesion();
    alert("Sesión cerrada por inactividad.");
  }, tiempoMax);
}

// Detectar cualquier acción del usuario
["mousemove", "keydown", "scroll", "click", "touchstart"].forEach(evt => {
  document.addEventListener(evt, resetearInactividad, false);
});

resetearInactividad();
