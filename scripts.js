// === Reloj (código anterior que ya tenías) ===
function updateClock() {
  const clockElement = document.getElementById('live-clock');
  if (!clockElement) return;

  const now = new Date();
  let hours = now.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const minutes = now.getMinutes().toString().padStart(2, '0');
  clockElement.textContent = `${hours}:${minutes} ${ampm}`;
}

document.addEventListener('DOMContentLoaded', function() {
  updateClock();
  setInterval(updateClock, 60000);
});

  // === Código para creación de ventanas dinámicas ===
  const ventanasCreadas = [];

  function crearVentana(nombreVentana, tituloVentana, parrafoVentana, imagenSrc, guardar = true) {
    const desktop = document.querySelector('.desktop');
  
    // Crear contenedor de ventana + icono
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.marginBottom = '30px';
  
    // Crear icono de descarga
    const icono = document.createElement('div');
    icono.className = 'icon-container';
    icono.style.position = 'absolute';
    icono.style.top = '-10px';
    icono.style.left = '50%';
    icono.style.transform = 'translateX(-50%)';
    icono.style.cursor = 'pointer';
    icono.innerHTML = `
      <div class="icon-link" onclick="exportarVentanaDesdeIcono(this)">
        <img src="imgs/otros/Inetcpl1319_32x32_4.png" class="icon-image" />
        <div class="icon-label">Descargar!</div>
      </div>
    `;
  
    // Crear la ventana
    const ventana = document.createElement('div');
    ventana.className = 'window floating-window';
  
    const parrafoFormateado = parrafoVentana.replace(/\n/g, '<br>');
  
    ventana.innerHTML = `
      <div class="window-header">
        ${nombreVentana}
        <button onclick="cerrarContenedor(this)" style="float:right; background:none; border:none; color:white; font-weight:bold;">X</button>
      </div>
      <div class="window-content">
        <h3 class="window-title">${tituloVentana}</h3>
        <p class="window-text">${parrafoFormateado}</p>
        <img src="${imagenSrc}" alt="Imagen personalizada" style="max-width: 100%; margin-top: 10px;">
      </div>
    `;
  
    // Agregar al contenedor y al DOM
    wrapper.appendChild(icono);
    wrapper.appendChild(ventana);
    desktop.appendChild(wrapper);
  
    if (guardar) {
      ventanasCreadas.push({ nombre: nombreVentana, titulo: tituloVentana, parrafo: parrafoVentana, imagen: imagenSrc });
      guardarEnLocalStorage();
    }
  }
  
  // Cerrar ventana
  function cerrarContenedor(boton) {
    const contenedor = boton.closest('div.window').parentElement;
    contenedor.remove();
    guardarEnLocalStorageDesdeDOM();
  }
  
  // Exportar ventana a PNG
  function exportarVentanaDesdeIcono(iconoLink) {
    // Buscar el contenedor que agrupa ícono + ventana
    const iconContainer = iconoLink.closest('.icon-container');
    const wrapper = iconContainer?.parentElement;
    const ventana = wrapper?.querySelector('.window');
  
    if (!ventana) {
      console.error("No se encontró la ventana para exportar.");
      return;
    }
  
    // Exportar usando html2canvas
    html2canvas(ventana).then(canvas => {
      const link = document.createElement('a');
      link.download = 'ventana_personalizada.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  }
  
  // Validación formulario
  function manejarFormulario(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombreVentana').value.trim();
    const titulo = document.getElementById('tituloVentana').value.trim();
    const parrafo = document.getElementById('parrafoVentana').value.trim();
    const imagenInput = document.getElementById('imagenVentana');
  
    // Validaciones individuales con mensajes por cada tipo de error
    if (!nombre) {
      alert('Debes ingresar un nombre para la ventana.');
      return;
    }
  
    if (!titulo) {
      alert('Por favor, escribe un encabezado para tu parrafo.');
      return;
    }
  
    if (!parrafo) {
      alert('El párrafo no puede estar vacío. Agrega una descripción o contenido.');
      return;
    }
  
    if (!imagenInput.files[0]) {
      alert('No olvides subir una imagen! ;)');
      return;
    }
  
    // Si todo está correcto, procesar imagen y crear ventana
    const reader = new FileReader();
    reader.onload = function(e) {
      crearVentana(nombre, titulo, parrafo, e.target.result);
    }
    reader.readAsDataURL(imagenInput.files[0]);
  
    event.target.reset();
  }

  // Guardar en localStorage
  function guardarEnLocalStorage() {
    localStorage.setItem('ventanasCreadas', JSON.stringify(ventanasCreadas));
  }

  // Leer desde localStorage al cargar
  function cargarDesdeLocalStorage() {
    const guardadas = localStorage.getItem('ventanasCreadas');
    if (guardadas) {
      const arrayVentanas = JSON.parse(guardadas);
      arrayVentanas.forEach(ventana => {
        crearVentana(ventana.nombre, ventana.titulo, ventana.parrafo, ventana.imagen, false);
      });
      ventanasCreadas.push(...arrayVentanas);
    }
  }

  // Si el usuario elimina ventanas manualmente, actualizar localStorage
  function guardarEnLocalStorageDesdeDOM() {
    const desktop = document.querySelector('.desktop');
    const ventanasDOM = desktop.querySelectorAll('.window.floating-window');
    const nuevasVentanas = [];

    ventanasDOM.forEach(v => {
      const header = v.querySelector('.window-header').childNodes[0].nodeValue.trim();
      const titulo = v.querySelector('.window-title')?.textContent.trim() || '';
      const parrafo = v.querySelector('.window-text')?.textContent.trim() || '';
      const imagen = v.querySelector('img')?.src || '';
      if (titulo && parrafo && imagen) {
        nuevasVentanas.push({ nombre: header, titulo: titulo, parrafo: parrafo, imagen: imagen });
      }
    });

    ventanasCreadas.length = 0;
    ventanasCreadas.push(...nuevasVentanas);
    guardarEnLocalStorage();
  }

  // Inicializar
  document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('formularioCrearVentana');
    if (formulario) {
      formulario.addEventListener('submit', manejarFormulario);
    }
    cargarDesdeLocalStorage();
  });
