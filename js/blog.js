// js/blog.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
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

const blogApp = initializeApp(firebaseConfigBlog, "blogApp");
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
      await guardarPost(titulo, contenido, imagenBase64, autor, categoria);
    };
    reader.readAsDataURL(imagenInput.files[0]);
  } else {
    await guardarPost(titulo, contenido, null, autor, categoria);
  }
};

async function guardarPost(titulo, contenido, imagen, autor, categoria) {
  await addDoc(collection(db, "posts"), {
    titulo,
    contenido,
    imagen,
    autor,
    categoria,
    fecha: new Date().toLocaleString()
  });

  document.getElementById('titulo-post').value = "";
  document.getElementById('contenido-post').value = "";
  document.getElementById('imagen-post').value = "";

  mostrarPosts();
}

async function mostrarPosts(filtro = "") {
  const contenedor = document.getElementById('blog-posts');
  contenedor.innerHTML = "";

  const q = query(collection(db, "posts"), orderBy("fecha", "desc"));
  const snapshot = await getDocs(q);

  snapshot.forEach((docSnap, index) => {
    const post = docSnap.data();
    if (filtro && post.categoria !== filtro) return;

    const div = document.createElement('div');
    div.className = 'post';

    const contenidoConLinks = post.contenido.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank">$1</a>'
    );

    div.innerHTML = `
      <div class="acciones">
        <button onclick="editarPost('${docSnap.id}')">✏️</button>
        <button onclick="eliminarPost('${docSnap.id}')">🗑️</button>
      </div>
      <h3>${post.titulo || "(Sin título)"}</h3>
      <p>${contenidoConLinks}</p>
      ${post.imagen ? `<img src="${post.imagen}" alt="Imagen">` : ''}
      <p style="font-size: 0.85rem; color: #aaa;">📎 ${post.categoria || 'Sin categoría'}</p>
      <p><strong>${post.autor}</strong> - <em>${post.fecha}</em></p>
    `;

    contenedor.appendChild(div);
  });
}

window.eliminarPost = async (id) => {
  await deleteDoc(doc(db, "posts", id));
  mostrarPosts();
};

window.editarPost = async (id) => {
  const nuevoTitulo = prompt("Nuevo título:");
  const nuevoContenido = prompt("Nuevo contenido:");

  if (nuevoTitulo !== null || nuevoContenido !== null) {
    await updateDoc(doc(db, "posts", id), {
      titulo: nuevoTitulo || "",
      contenido: nuevoContenido || ""
    });
    mostrarPosts();
  }
};
