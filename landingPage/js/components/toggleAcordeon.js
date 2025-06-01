
export function toggleAcordeon(selector = '.accordion-item') {
  const items = document.querySelectorAll(selector);

  items.forEach(item => {
    const header = item.querySelector('.accordion-header');

    header.addEventListener('click', () => {
      // Cerrar los otros
      items.forEach(i => {
        if (i !== item) i.classList.remove('active');
      });

      
      item.classList.toggle('active');
    });
  });
}
