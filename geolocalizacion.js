document.addEventListener("DOMContentLoaded", () => {
    const ubicacionElemento = document.getElementById("ubicacion");
    const botonUbicacion = document.getElementById("obtenerUbicacion");
    const icono = document.getElementById("iconoUbicacion");
    const listaUbicaciones = document.getElementById("listaUbicaciones");
    const inputDescripcion = document.getElementById("descripcion");

    // Verifica si el navegador soporta geolocalización
    if ("geolocation" in navigator) {
        botonUbicacion.addEventListener("click", () => {
            ubicacionElemento.textContent = "Obteniendo ubicación...";
            icono.classList.add("rotando");
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude.toFixed(6);
                    const lon = position.coords.longitude.toFixed(6);

                    const descripcion = inputDescripcion.value.trim() || "Sin descripción";

                    // Guardar la ubicación en la lista
                    agregarUbicacion(lat, lon, descripcion);

                    // Resetear la entrada de descripción
                    inputDescripcion.value = "";
                    ubicacionElemento.textContent = `Última Ubicación: 📍 Lat ${lat}, Lon ${lon}`;
                    icono.classList.remove("rotando");
                },
                (error) => {
                    ubicacionElemento.textContent =
                        "No se pudo obtener la ubicación. Asegúrate de permitir el acceso.";
                    icono.classList.remove("rotando");
                    console.error("Error obteniendo la ubicación:", error.message);
                }
            );
        });
    } else {
        ubicacionElemento.textContent =
            "Geolocalización no soportada por este navegador.";
        botonUbicacion.disabled = true;
    }

    // Función para agregar la ubicación a la lista
    function agregarUbicacion(lat, lon, descripcion) {
        const elementoLista = document.createElement("li");
        elementoLista.innerHTML = `
            <strong>📍 Latitud:</strong> ${lat}, <strong>Longitud:</strong> ${lon}<br>
            <em>📝 ${descripcion}</em>
        `;
        listaUbicaciones.appendChild(elementoLista);
    }
});
