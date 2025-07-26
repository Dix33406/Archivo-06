import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔗 Configuración Firebase CHAT
const firebaseConfigChat = {
  apiKey: "AIzaSyAYsW0aldjctH2-tcdL5J_oLKAdSA7HFe4",
  authDomain: "snapback-c86ba.firebaseapp.com",
  projectId: "snapback-c86ba",
  storageBucket: "snapback-c86ba.firebasestorage.app",
  messagingSenderId: "398326666724",
  appId: "1:398326666724:web:212270bf526481ad94e3f1"
};

const chatApp = initializeApp(firebaseConfigChat, "chatApp");
const chatDB = getFirestore(chatApp);

// 🔄 Referencias DOM
const chatInput = document.getElementById("chat-input");
const chatBox = document.getElementById("chat-mensajes");
const chatToggle = document.getElementById("toggle-chat");
const chatFloat = document.getElementById("chat-float");
const btnEnviar = document.getElementById("btn-enviar");

// Nombre usuario
let usuario = localStorage.getItem("usuarioActual") || "Anónimo";

// Enviar mensaje
btnEnviar.addEventListener("click", enviarMensaje);
chatInput.addEventListener("keypress", e => {
  if (e.key === "Enter") enviarMensaje();
});

async function enviarMensaje() {
  const texto = chatInput.value.trim();
  if (!texto) return;

  await addDoc(collection(chatDB, "mensajes"), {
    usuario,
    texto,
    creado: serverTimestamp()
  });

  chatInput.value = "";
}

// Escuchar nuevos mensajes
const q = query(collection(chatDB, "mensajes"), orderBy("creado"));
onSnapshot(q, snapshot => {
  chatBox.innerHTML = "";
  snapshot.forEach(doc => {
    const msg = doc.data();
    const p = document.createElement("p");
    p.innerHTML = `<strong>${msg.usuario}:</strong> ${msg.texto}`;
    chatBox.appendChild(p);
  });

  chatBox.scrollTop = chatBox.scrollHeight;

  if (chatFloat.classList.contains("minimizado")) {
    chatFloat.style.boxShadow = "0 0 15px 2px #0f0";
    setTimeout(() => {
      chatFloat.style.boxShadow = "0 0 10px #000";
    }, 1500);
  }
});

// Minimizar chat
chatToggle.addEventListener("click", () => {
  chatFloat.classList.toggle("minimizado");
  chatToggle.textContent = chatFloat.classList.contains("minimizado") ? "🔼" : "🔽";
});
