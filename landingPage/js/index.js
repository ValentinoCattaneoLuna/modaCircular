import {toggleMenu} from './components/toggleMenu.js'
import { cargarTestimonios } from './components/loadTestimonios.js';
document.addEventListener("DOMContentLoaded", async() => {
    toggleMenu();
    cargarTestimonios();
  });