// Verificación de sesión
if (!localStorage.getItem('usuarioActual')) {
  window.location.href = "login.html";
}

// Al cerrar o recargar página, limpiar sesión
window.addEventListener('beforeunload', () => {
  const usuario = localStorage.getItem('usuarioActual');
  if (usuario) {
    localStorage.removeItem('usuarioActual');
    let usuarios = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
    usuarios = usuarios.filter(u => u !== usuario);
    localStorage.setItem('usuariosRegistrados', JSON.stringify(usuarios));
  }
});

// Cierre manual de sesión
function cerrarSesion() {
  const usuario = localStorage.getItem('usuarioActual');
  if (usuario) {
    let usuarios = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
    usuarios = usuarios.filter(u => u !== usuario);
    localStorage.setItem('usuariosRegistrados', JSON.stringify(usuarios));
  }
  localStorage.removeItem('usuarioActual');
  localStorage.removeItem('ultimaConexion');
  location.href = "login.html";
}

// Publicar post
function publicar() {
  const titulo = document.getElementById('titulo-post').value.trim();
  const categoria = document.getElementById('categoria-post').value.trim();
  const imagenInput = document.getElementById('imagen-post');
  const autor = localStorage.getItem('usuarioActual');
  const contenido = document.getElementById('contenido-post').value.trim();

  if (!autor) {
    alert("Sesión no válida.");
    return location.href = "login.html";
  }

  if (!titulo && !contenido && !imagenInput.files[0]) {
    alert("Completá algo.");
    return;
  }

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

function mostrarPosts(filtrado = "") {
  const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
  const contenedor = document.getElementById('blog-posts');
  contenedor.innerHTML = '';

  posts.filter(p => !filtrado || p.categoria === filtrado).forEach((post, index) => {
    const div = document.createElement('div');
    div.className = 'post';

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

// Al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  mostrarPosts();
  mostrarMensajesPrivados();
});

// 📦 Conexión Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBb88k03OMD6yI4XB4Ic2fT1DFITGhb8Fw",
  authDomain: "snapback-7664b.firebaseapp.com",
  projectId: "snapback-7664b",
  storageBucket: "snapback-7664b.firebasestorage.app",
  messagingSenderId: "493765667584",
  appId: "1:493765667584:web:2ad110dd54b9d0d3d2e1e5",
  measurementId: "G-WN4XYJEWPS"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✉️ Enviar mensaje
async function enviarMensaje() {
  const input = document.getElementById("chat-input");
  const texto = input.value.trim();
  const usuario = localStorage.getItem("usuarioActual") || "Anónimo";

  if (!texto) return;

  await addDoc(collection(db, "mensajes"), {
    usuario: usuario,
    texto: texto,
    creado: serverTimestamp()
  });

  input.value = "";
}

// 📥 Mostrar mensajes en tiempo real
const chatBox = document.getElementById("chat-box");

const q = query(collection(db, "mensajes"), orderBy("creado"));
onSnapshot(q, snapshot => {
  chatBox.innerHTML = "";
  snapshot.forEach(doc => {
    const msg = doc.data();
    const p = document.createElement("p");
    p.innerHTML = `<strong>${msg.usuario}:</strong> ${msg.texto}`;
    chatBox.appendChild(p);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
});

// BOTÓN
document.getElementById("btn-enviar").addEventListener("click", enviarMensaje);

// ENTER
document.getElementById("chat-input").addEventListener("keypress", function (e) {
  if (e.key === "Enter") enviarMensaje();
});
