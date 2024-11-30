const productos = {
    heb: [
        { nombre: "Coca de 3 litros", precio: 46 },
        { nombre: "Shampoo", precio: 45 },
        { nombre: "Jabón paquete 6pz", precio: 69 },
        { nombre: "Pollo asado", precio: 225 },
        { nombre: "Pan de caja", precio: 35 }
    ],
    walmart: [
        { nombre: "Leche 1 litro", precio: 22 },
        { nombre: "Arroz 1kg", precio: 25 },
        { nombre: "Huevos docena", precio: 36 },
        { nombre: "Carne molida 500g", precio: 85 },
        { nombre: "Manzanas 1kg", precio: 50 }
    ]
};

// Manejo de productos
function verProductos(supermercado) {
    const lista = productos[supermercado];
    const contenedor = document.getElementById("lista-productos");
    contenedor.innerHTML = "";
    lista.forEach((producto, index) => {
        contenedor.innerHTML += `
            <div class="producto">
                <p>${producto.nombre} - $${producto.precio}</p>
                <button onclick="modificarProducto('${supermercado}', ${index}, 1)">+</button>
                <button onclick="modificarProducto('${supermercado}', ${index}, -1)">-</button>
            </div>
        `;
    });
    document.getElementById("productos").classList.remove("hidden");
}

function modificarProducto(supermercado, index, cantidad) {
    const producto = productos[supermercado][index];
    producto.cantidad = (producto.cantidad || 0) + cantidad;
    if (producto.cantidad < 0) producto.cantidad = 0;

    const total = productos[supermercado].reduce((acc, p) => acc + (p.cantidad || 0) * p.precio, 0);
    document.getElementById(`total-${supermercado}`).innerText = total;
}

function cerrarProductos() {
    document.getElementById("productos").classList.add("hidden");
}

// API de geolocalización
function mostrarMapa() {
    const mapa = document.getElementById("mapa");
    const contenedorMapa = document.getElementById("mapa-container");

    if (!navigator.geolocation) {
        alert("La geolocalización no está soportada en este navegador.");
        return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const mapaURL = `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
        contenedorMapa.innerHTML = `<iframe src="${mapaURL}" width="100%" height="300" frameborder="0"></iframe>`;
        mapa.classList.remove("hidden");
    });
}

// API para compartir lista
function compartirLista() {
    if (navigator.share) {
        navigator.share({
            title: "Mi Lista de Compras",
            text: "Revisa esta lista que hice con List-shop.",
            url: window.location.href
        }).catch(console.error);
    } else {
        alert("La funcionalidad para compartir no está disponible en tu navegador.");
    }
}
