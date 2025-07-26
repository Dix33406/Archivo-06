// js/blog.js
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔗 Firebase Blog (proyecto separado del chat)
const firebaseConfigBlog = {
  apiKey: "AIzaSyAYsW0aldjctH2-tcdL5J_oLKAdSA7HFe4",
  authDomain: "snapback-c86ba.firebaseapp.com",
  projectId: "snapback-c86ba",
  storageBucket: "snapback-c86ba.appspot.com",
  messagingSenderId: "398326666724",
  appId: "1:398326666724:web:212270bf526481ad94e3f1"
};

// ✅ Evitar inicialización duplicada
let blogApp;
if (!getApps().some(app => app.name === "blogApp")) {
  blogApp = initializeApp(firebaseConfigBlog, "blogApp");
} else {
  blogApp = getApp("blogApp");
}

const db = getFirestore(blogApp);

// 🔁 Mostrar publicaciones
document.addEventListener('DOMContentLoaded', mostrarPosts);
window.filtrarCategoria = (cat) => mostrarPosts(cat);

// 🔼 Publicar nuevo post
window.publicar = async () => {
  const titulo = document.getElementById('titulo-post').value.trim();
  const contenido = document.getElementById('contenido-post').value.trim();
  const categoria = document.getElementById('categoria-post').value;
  const imagenInput = document.getElementById('imagen-post');
  const autor = localStorage.getItem('usuarioActual') || "Anónimo";

  if (!titulo && !contenido && !imagenInput.files[0]) {
    return alert("Completá algo para publicar.");
  }

  let imagenBase64 = null;
  if (imagenInput.files.length) {
    const reader = new FileReader();
    reader.onload = async function (e) {
      imagenBase64 = e.target.result;
      await guardarPost(ti
