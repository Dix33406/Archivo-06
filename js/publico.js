// ✅ Verificación de sesión
if (!localStorage.getItem('usuarioActual')) {
  window.location.href = "login.html";
}

// ✅ Publicar post (base local)
function publicar() {
  const titulo = document.getElementById('titulo-post').value.trim();
  const categoria = document.getElementById('categoria-post').value.trim();
  const imagenInput = document.getElementById('imagen-post');
  const autor = localStorage.getItem('usuarioActual');
  const contenido = document.getElementById('contenido-post').value.trim();

  if (!autor) return location.href = "login.html";
  if (!titulo && !contenido && !imagenInput.files[0]) return alert("Completá algo.");

  if (imagenInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      guardarPost(titulo, contenido, e.target.result, autor, categoria);
    };
    reader.readAsDataURL(imagenInput.files[0]);
  } else {
    guardarPost(titulo, contenido, null, autor, categoria);
  }
}

function guardarPost(titulo, contenido, imagen, autor, categoria) {
  const post = {
    titulo,
    contenido,
    imagen,
    autor,
    categoria,
    fecha: new Date().toLocaleString()
  };
  const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
  posts.unshift(post);
  localStorage.setItem('blogPosts', JSON.stringify(posts));
  mostrarPosts();
}

function mostrarPosts(filtro = "") {
  const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
  const contenedor = document.getElementById('blog-posts');
  contenedor.innerHTML = "";

  posts
    .filter(p => !filtro || p.categoria === filtro)
    .forEach((post, index) => {
      const div = document.createElement("div");
      div.className = "post";

      const contenidoConLinks = post.contenido.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');

      div.innerHTML = `
        <div class="acciones">
          <button onclick="editarPost(${index})">✏️</button>
          <button onclick="eliminarPost(${index})">🗑️</button>
          <button onclick="copiarLink(${index})">🔗</button>
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

function eliminarPost(index) {
  const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
  posts.splice(index, 1);
  localStorage.setItem('blogPosts', JSON.stringify(posts));
  mostrarPosts();
}

function editarPost(index) {
  const posts = JSON.parse(localStorage.getItem('blogPosts'));
  const nuevoTitulo = prompt("Nuevo título:", posts[index].titulo);
  const nuevoContenido = prompt("Nuevo contenido:", posts[index].contenido);
  if (nuevoTitulo !== null) posts[index].titulo = nuevoTitulo;
  if (nuevoContenido !== null) posts[index].contenido = nuevoContenido;
  localStorage.setItem('blogPosts', JSON.stringify(posts));
  mostrarPosts();
}

function copiarLink(index) {
  const link = `${location.href}#post${index}`;
  navigator.clipboard.writeText(link).then(() => {
    alert("Enlace copiado.");
  });
}

function filtrarCategoria(cat) {
  mostrarPosts(cat);
}

// ✅ Mostrar posts al cargar
document.addEventListener('DOMContentLoaded', () => {
  mostrarPosts();
});

// ✅ Firebase Config (chat global)
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

const firebaseConfig = {
  apiKey: "AIzaSyBb88k03OMD6yI4XB4Ic2fT1DFITGhb8Fw",
  authDomain: "snapback-7664b.firebaseapp.com",
  projectId: "snapback-7664b",
  storageBucket: "snapback-7664b.appspot.com",
  messagingSenderId: "493765667584",
  appId: "1:493765667584:web:2ad110dd54b9d0d3d2e1e5",
  measurementId: "G-WN4XYJEWPS"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Chat global
const input = document.getElementById("chat-input");
const chatBox = document.getElementById("chat-mensajes");
const usuario = localStorage.getItem("usuarioActual") || "Anónimo";

document.getElementById("btn-enviar").addEventListener("click", enviarMensaje);
input.addEventListener("keypress", e => {
  if (e.key === "Enter") enviarMensaje();
});

async function enviarMensaje() {
  const texto = input.value.trim();
  if (!texto) return;
  await addDoc(collection(db, "mensajes"), {
    usuario,
    texto,
    creado: serverTimestamp()
  });
  input.value = "";
}

// Escuchar nuevos mensajes en tiempo real
onSnapshot(query(collection(db, "mensajes"), orderBy("creado")), snapshot => {
  chatBox.innerHTML = "";
  snapshot.forEach(doc => {
    const msg = doc.data();
    const p = document.createElement("p");
    p.innerHTML = `<strong>${msg.usuario}:</strong> ${msg.texto}`;
    chatBox.appendChild(p);
  });
  chatBox.scrollTop = chatBox.scrollHeight;

  const chatFloat = document.getElementById("chat-float");
  if (chatFloat.classList.contains("minimizado")) {
    chatFloat.style.boxShadow = "0 0 15px 2px #0f0";
    setTimeout(() => chatFloat.style.boxShadow = "0 0 10px #000", 1500);
  }
});

// ✅ Botón minimizar chat
document.getElementById("toggle-chat").addEventListener("click", () => {
  const chat = document.getElementById("chat-float");
  const boton = document.getElementById("toggle-chat");
  chat.classList.toggle("minimizado");
  boton.textContent = chat.classList.contains("minimizado") ? "🔼" : "🔽";
});
