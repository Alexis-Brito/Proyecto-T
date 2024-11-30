const socket = io();

// Solicitar permisos para notificaciones
if (Notification.permission !== 'granted') {
  Notification.requestPermission();
}

let presupuesto = 0;

// Función para establecer presupuesto
function establecerPresupuesto() {
  const input = document.getElementById('presupuestoInput').value;
  presupuesto = parseFloat(input);
  alert(`Presupuesto establecido: $${presupuesto}`);
  actualizarEstadoPresupuesto(0); // Inicializar estado
}

// Función para verificar presupuesto
function actualizarEstadoPresupuesto(total) {
  const estado = document.getElementById('presupuestoEstado');
  if (total > presupuesto) {
    estado.textContent = `⚠️ Has excedido tu presupuesto. Total: $${total}, Presupuesto: $${presupuesto}`;
    mostrarNotificacion(`Presupuesto excedido: $${total}`);
  } else {
    estado.textContent = `✅ Dentro del presupuesto. Total: $${total}, Presupuesto: $${presupuesto}`;
  }
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje) {
  if (Notification.permission === 'granted') {
    new Notification(mensaje);
  } else {
    alert(mensaje);
  }
}

// Función para compartir lista
async function compartirLista() {
  const lista = {
    name: "Mi Lista de Compras",
    items: [
      { name: "Coca-Cola", quantity: 2, price: 20 },
      { name: "Pan Bimbo", quantity: 1, price: 30 }
    ],
    budget: presupuesto,
  };

  const response = await fetch('/api/share-list', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lista),
  });

  const data = await response.json();
  alert(`¡Lista compartida! Comparte este enlace: ${data.link}`);
}

// Función para inicializar el mapa
function inicializarMapa(lat, lon) {
  var map = L.map('mapid').setView([lat, lon], 13); // Coordenadas del usuario

  // Agregar el mapa de OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Agregar un marcador en el mapa (ubicación del usuario)
  L.marker([lat, lon]).addTo(map)
    .bindPopup("<b>Tu ubicación</b>")
    .openPopup();
}

// Verificar si el navegador soporta geolocalización
if (navigator.geolocation) {
  // Obtener la ubicación del usuario
  navigator.geolocation.getCurrentPosition(function(position) {
    // Usamos la latitud y longitud obtenidas
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    // Inicializar el mapa con la ubicación del usuario
    inicializarMapa(lat, lon);
  }, function(error) {
    alert("No se pudo obtener tu ubicación. Usando la ubicación predeterminada.");
    // Si no se obtiene la ubicación, usamos una ubicación predeterminada (ejemplo: Ciudad de México)
    inicializarMapa(19.432608, -99.133209);
  });
} else {
  alert("Tu navegador no soporta geolocalización. Usando la ubicación predeterminada.");
  // Si la geolocalización no está disponible, usamos una ubicación predeterminada
  inicializarMapa(19.432608, -99.133209);
}
