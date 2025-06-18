export async function cargarTestimonios() {
    try {
        const response = await fetch('http://localhost:4000/api/testimonios');
        const testimonios = await response.json();

        const contenedor = document.querySelector('.testimonios_slider_track');

        testimonios.forEach(testimonio => {
            const card = document.createElement('div');
            card.classList.add('testimonio_card');

            let estrellasHTML = '';
            for (let i = 0; i < 5; i++) {
                if (i < testimonio.cantidad_estrellas) {
                    estrellasHTML += '<span class="fa fa-star checked"></span>';
                } else {
                    estrellasHTML += '<span class="fa fa-star"></span>';
                }
            }

            card.innerHTML = `
          <p class="testimonio_mensaje">${testimonio.mensaje_testimonio}</p>
          <div class="nombre_calificacion">
            <h5 class="nombre_testimonio">${testimonio.nombre_testimonio}</h5>
            <div class="calificacion">
              ${estrellasHTML}
            </div>
          </div>
        `;

            contenedor.appendChild(card);
        });

        const tarjetas = contenedor.querySelectorAll('.testimonio_card');
        tarjetas.forEach(card => {
            
            const clone = card.cloneNode(true);
            contenedor.appendChild(clone);
        });
    } catch (error) {
        console.error('Error al cargar los testimonios:', error);
    }
}