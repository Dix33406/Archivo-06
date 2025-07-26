// ✅ Verificación de sesión
if (!localStorage.getItem('usuarioActual')) {
  window.location.href = "login.html";
}

window.addEventListener('beforeunload', () => {
  const usuario = localStorage.getItem('usuarioActual');
  if (usuario) {
    localStorage.removeItem('usuarioActual');
    let usuarios = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
    usuarios = usuarios.filter(u => u !== usuario);
    localStorage.setItem('usuariosRegistrados', JSON.stringify(usuarios));
  }
});

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

// ✅ Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAYsW0aldjctH2-tcdL5J_oLKAdSA7HFe4",
  authDomain: "snapback-c86ba.firebaseapp.com",
  projectId: "snapback-c86ba",
  storageBucket: "snapback-c86ba.appspot.com",
  messagingSenderId: "398326666724",
  appId: "1:398326666724:web:212270bf526481ad94e3f1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// ✅ Publicar post con imagen
async function publicar() {
  const titulo = document.getElementById('titulo-post').value.trim();
  const categoria = document.getElementById('categoria-post').value.trim();
  const imagenInput = document.getElementById('imagen-post');
  const autor = localStorage.getItem('usuarioActual');
  const contenido = document.getElementById('contenido-post').value.trim();

  if (!autor) return location.href = "login.html";
  if (!titulo && !contenido && !imagenInput.files[0]) return alert("Completá algo.");

  let urlImagen = null;
  if (imagenInput.files[0]) {
    const archivo = imagenInput.files[0];
    const ruta = `imagenes/${Date.now()}_${archivo.name}`;
    const storageRef = ref(storage, ruta);
    await uploadBytes(storageRef, archivo);
    urlImagen = await getDownloadURL(storageRef);
  }

  await addDoc(collection(db, "posts"), {
    titulo,
    contenido,
    imagen: urlImagen,
    autor,
    categoria,
    fecha: new Date().toLocaleString()
  });

  mostrarPosts();
}

async function mostrarPosts(filtro = "") {
  const contenedor = document.getElementById("blog-posts");
  contenedor.innerHTML = "";
  const q = query(collection(db, "posts"), orderBy("fecha", "desc"));
  const snapshot = await getDocs(q);

  snapshot.forEach(doc => {
    const post = doc.data();
    if (!filtro || post.categoria === filtro) {
      const div = document.createElement("div");
      div.className = "post";
      const contenidoConLinks = post.contenido.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
      div.innerHTML = `
        <div class="acciones">
          <button onclick="copiarLink('${doc.id}')">🔗</button>
        </div>
        <h3>${post.titulo || "(Sin título)"}</h3>
        <p>${contenidoConLinks}</p>
        ${post.imagen ? `<img src="${post.imagen}" alt="Imagen">` : ""}
        <p style="font-size: 0.85rem; color: #aaa;">📎 ${post.categoria || 'Sin categoría'}</p>
        <p><strong>${post.autor}</strong> - <em>${post.fecha}</em></p>
      `;
      contenedor.appendChild(div);
    }
  });
}

function copiarLink(id) {
  const link = `${location.href}#${id}`;
  navigator.clipboard.writeText(link).then(() => alert("Enlace copiado."));
}

function filtrarCategoria(cat) {
  mostrarPosts(cat);
}

document.addEventListener("DOMContentLoaded", () => {
  mostrarPosts();
});

// ✅ Chat
const input = document.getElementById("chat-input");
const chatBox = document.getElementById("chat-box");
const usuario = localStorage.getItem("usuarioActual") || "Anónimo";

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

document.getElementById("btn-enviar").addEventListener("click", enviarMensaje);
input.addEventListener("keypress", e => {
  if (e.key === "Enter") enviarMensaje();
});

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

  const chatContainer = document.getElementById("chat-float");
  if (chatContainer.classList.contains("minimizado")) {
    chatContainer.style.boxShadow = "0 0 15px 2px #0f0";
    setTimeout(() => {
      chatContainer.style.boxShadow = "0 0 10px #000";
    }, 1500);
  }
});

document.getElementById("toggle-chat").addEventListener("click", () => {
  const chat = document.getElementById("chat-float");
  const boton = document.getElementById("toggle-chat");
  chat.classList.toggle("minimizado");
  boton.textContent = chat.classList.contains("minimizado") ? "🔼" : "🔽";
});

// ✅ Propuesta de categorías
async function proponerCategoria() {
  const nuevaCat = document.getElementById("nueva-categoria").value.trim();
  if (!nuevaCat) return alert("Escribí una categoría");
  await addDoc(collection(db, "categoriasPropuestas"), {
    nombre: nuevaCat,
    autor: usuario,
    fecha: new Date().toLocaleString()
  });
  alert("Gracias por tu propuesta, será revisada.");
  document.getElementById("nueva-categoria").value = "";
}
