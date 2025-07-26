// js/auth.js
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
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

// ✅ Evitar duplicación de app
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);

// ✅ Redirección si no hay sesión
onAuthStateChanged(auth, (user) => {
  const enLogin = window.location.pathname.includes("login.html");

  if (!user && !enLogin) {
    window.location.href = "login.html";
  }

  if (user && enLogin) {
    // ya hay sesión, así que no mostrar login
    window.location.href = "publico.html";
  }
});

// ✅ Cerrar sesión manual desde botón
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      signOut(auth).then(() => {
        window.location.href = "login.html";
      });
    });
  }
});

// ✅ Cierre por inactividad (5 minutos)
let tiempoInactividad;
const tiempoMax = 5 * 60 * 1000; // 5 minutos

function cerrarSesionInactividad() {
  signOut(auth).then(() => {
    alert("Sesión cerrada por inactividad.");
    window.location.href = "login.html";
  });
}

function resetearInactividad() {
  clearTimeout(tiempoInactividad);
  tiempoInactividad = setTimeout(cerrarSesionInactividad, tiempoMax);
}

// Detectar cualquier acción del usuario
["mousemove", "keydown", "scroll", "click", "touchstart"].forEach(evt => {
  document.addEventListener(evt, resetearInactividad, false);
});

resetearInactividad();
