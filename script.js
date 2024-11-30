// Variables globales
let presupuesto = 0;
let miLista = [];
const productosHEB = [
  { id: 1, nombre: "Coca-Cola", precio: 20, img: "imagenes/coca_cola.jpg" },
  { id: 2, nombre: "Pan Bimbo", precio: 30, img: "imagenes/pan_bimbo.webp" },
  { id: 3, nombre: "Leche Lala", precio: 25, img: "imagenes/leche_lala.jpg" },
  { id: 4, nombre: "Huevos", precio: 60, img: "imagenes/huevos.webp" },
  { id: 5, nombre: "Queso Oaxaca", precio: 80, img: "imagenes/queso.jpg" },
  { id: 6, nombre: "Aceite", precio: 35, img: "imagenes/aceite.jpg" },
  { id: 7, nombre: "Cereal", precio: 45, img: "imagenes/cereal.jpg" },
  { id: 8, nombre: "Tomate", precio: 20, img: "imagenes/tomates.jpg" },
  { id: 9, nombre: "Pollo", precio: 120, img: "imagenes/pechuga_pollo.jpg" },
  { id: 10, nombre: "Yogur", precio: 28, img: "imagenes/yogur.jpg" },
];

const productosWalmart = [
  { id: 11, nombre: "Arroz", precio: 35, img: "imagenes/arroz.webp" },
  { id: 12, nombre: "Jugo", precio: 45, img: "imagenes/jugo.png" },
  { id: 13, nombre: "Manzana", precio: 40, img: "imagenes/manzanas.webp" },
  { id: 14, nombre: "Shampoo", precio: 64, img: "imagenes/shampoo.jpg" },
  { id: 15, nombre: "Jabón", precio: 104, img: "imagenes/jabon.webp" },
  { id: 16, nombre: "Lechuga", precio: 15, img: "imagenes/lechuga.jpg" },
  { id: 17, nombre: "Papas", precio: 25, img: "imagenes/papas.jpg" },
  { id: 18, nombre: "Pescado", precio: 85, img: "imagenes/pescado.jpg" },
  { id: 19, nombre: "Mantequilla", precio: 40, img: "imagenes/mantequilla.jpg" },
  { id: 20, nombre: "Frijoles", precio: 18, img: "imagenes/frijoles.jpg" },
];

// Inicializar mapa
function initMap() {
  const map = L.map('map').setView([21.8782, -102.2916], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  const supermercados = [
    { nombre: "Supermercado A", lat: 21.8782, lng: -102.2916 },
    { nombre: "Supermercado B", lat: 21.8772, lng: -102.2906 },
  ];

  supermercados.forEach((supermercado) => {
    L.marker([supermercado.lat, supermercado.lng]).addTo(map)
      .bindPopup(supermercado.nombre);
  });
}
window.onload = initMap;

// Establecer presupuesto
document.getElementById("btnPresupuesto").addEventListener("click", () => {
  presupuesto = parseInt(document.getElementById("presupuestoInput").value);
  if (presupuesto > 0) {
    Swal.fire("¡Presupuesto Establecido!", `Tu presupuesto es $${presupuesto}`, "success");
    actualizarEmoji();
  } else {
    Swal.fire("Error", "Por favor ingresa un presupuesto válido.", "error");
  }
});

// Función para actualizar emoji según presupuesto
function actualizarEmoji() {
  const emojiContainer = document.getElementById("emojiContainer");
  let emoji = "";

  const total = calcularTotalLista();

  if (total < presupuesto) {
    emoji = "😊";
  } else if (total >= presupuesto && total <= presupuesto * 1.2) {
    emoji = "😟";
  } else if (total > presupuesto * 1.2) {
    emoji = "😱";
  }

  emojiContainer.innerHTML = emoji;

  if (presupuesto > 0 && total > presupuesto) {
    Swal.fire("¡Presupuesto Excedido!", `Te has excedido en $${(total - presupuesto).toFixed(2)}.`, "warning");
  }
}

// Calcular total de la lista
function calcularTotalLista() {
  return miLista.reduce((total, item) => total + item.precio * item.cantidad, 0);
}

// Renderizar productos
function renderProductos(listaProductos, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  listaProductos.forEach((producto) => {
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
      <img src="${producto.img}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p>$${producto.precio}</p>
      <button onclick="agregarProducto(${producto.id})">Agregar</button>
    `;
    container.appendChild(div);
  });
}

// Agregar producto
function agregarProducto(id) {
  const producto = productosHEB.concat(productosWalmart).find((prod) => prod.id === id);
  const existente = miLista.find((item) => item.id === id);

  if (producto) {
    if (existente) {
      existente.cantidad++;
    } else {
      miLista.push({ ...producto, cantidad: 1 });
    }
    actualizarLista();
  }
}

// Actualizar lista
function actualizarLista() {
  const container = document.getElementById("miListaContainer");
  container.innerHTML = "";
  miLista.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `${item.nombre} - ${item.cantidad} x $${item.precio}`;
    container.appendChild(li);
  });
  actualizarEmoji();
}

// Obtener recetas
document.getElementById("obtenerRecetas").addEventListener("click", () => {
  if (miLista.length === 0) {
    Swal.fire("Lista vacía", "Por favor, agrega productos a tu lista antes de buscar recetas.", "warning");
    return;
  }

  const ingredientes = miLista
    .map((producto) => producto.nombre.toLowerCase())
    .join(","); // Enviar todos los ingredientes como una lista separada por comas

  const apiKey = "4f2ec0bb5c45486f9c0663fca12532a9";
  const url = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${apiKey}&ingredients=${ingredientes}&number=5`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const recetasContainer = document.getElementById("recetasContainer");
      recetasContainer.innerHTML = "";

      if (data.length > 0) {
        data.forEach((receta) => {
          const div = document.createElement("div");
          div.className = "receta";
          div.innerHTML = `
            <h3>${receta.title}</h3>
            <img src="${receta.image}" alt="${receta.title}">
            <a href="https://spoonacular.com/recipes/${receta.id}" target="_blank">Ver receta</a>
          `;
          recetasContainer.appendChild(div);
        });
      } else {
        recetasContainer.innerHTML = "<p>No se encontraron recetas con los ingredientes seleccionados.</p>";
      }
    })
    .catch((error) => {
      console.error("Error al obtener recetas:", error);
      Swal.fire("Error", "Hubo un problema al obtener las recetas. Por favor, intenta nuevamente.", "error");
    });
});
// Función para compartir la lista
document.getElementById("compartirBtn").addEventListener("click", () => {
  if (miLista.length === 0) {
    Swal.fire("Lista vacía", "No puedes compartir una lista vacía. ¡Agrega productos primero!", "warning");
    return;
  }

  const listaTexto = miLista.map((item) => `${item.nombre}: ${item.cantidad} x $${item.precio}`).join("\n");
  const total = calcularTotalLista();
  const textoCompartir = `Mi lista de compras:\n${listaTexto}\nTotal: $${total.toFixed(2)}`;

  if (navigator.share) {
    navigator.share({
      title: 'Mi Lista de Compras',
      text: textoCompartir,
    }).then(() => {
      console.log('Lista compartida con éxito');
      Swal.fire("Lista compartida", "Tu lista ha sido compartida exitosamente", "success");
    }).catch((error) => {
      console.error('Error al compartir', error);
      Swal.fire("Error", "Hubo un problema al compartir la lista. Por favor, intenta nuevamente.", "error");
    });
  } else {
    // Si el navegador no soporta navigator.share
    const enlaceTexto = encodeURIComponent(textoCompartir);
    const enlace = `mailto:?subject=Mi Lista de Compras&body=${enlaceTexto}`;
    window.location.href = enlace; // Redirige a un enlace de correo
  }
});
// Inicializar render
renderProductos(productosHEB, "productosHEBContainer");
renderProductos(productosWalmart, "productosWalmartContainer");
