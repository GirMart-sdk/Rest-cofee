class CarritoCompras {
  constructor() {
    this.items = JSON.parse(localStorage.getItem("carrito")) || [];
    this.init();
  }

  init() {
    this.mostrarCount();
    this.bindEvents();
  }

  bindEvents() {
    document.addEventListener("click", (e) => {
      if (e.target.matches(".btn-comprar")) {
        e.preventDefault();
        const platillo = e.target.closest(".platillo");
        const nombre = platillo.querySelector("h2").textContent;
        const precioStr = platillo
          .querySelector(".precio p")
          .textContent.replace("$", "")
          .trim();
        const precio = parseFloat(precioStr);
        this.agregarItem(nombre, precio);
      }
    });
  }

  agregarItem(nombre, precio) {
    const itemExistente = this.items.find((item) => item.nombre === nombre);
    if (itemExistente) {
      itemExistente.cantidad++;
    } else {
      this.items.push({ nombre, precio, cantidad: 1 });
    }
    this.guardar();
    this.mostrarNotificacion(
      `✓ ${nombre} añadido al carrito (${this.totalItems()} items)`,
    );
  }

  guardar() {
    localStorage.setItem("carrito", JSON.stringify(this.items));
    this.mostrarCount();
  }

  mostrarCount() {
    const total = this.totalItems();
    let badge = document.querySelector(".carrito-count");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "carrito-count badge";
      document.querySelector(".logo").appendChild(badge);
    }
    badge.textContent = total > 0 ? total : "";
    badge.style.display = total > 0 ? "inline-block" : "none";
  }

  totalItems() {
    return this.items.reduce((sum, item) => sum + item.cantidad, 0);
  }

  totalPrecio() {
    return this.items
      .reduce((sum, item) => sum + item.precio * item.cantidad, 0)
      .toFixed(2);
  }

  mostrarNotificacion(mensaje) {
    const notif = document.createElement("div");
    notif.className = "notif";
    notif.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, var(--verde), #0a4d2e);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      font-weight: bold;
      animation: slideInRight 0.4s ease-out;
    `;
    notif.textContent = mensaje;
    document.body.appendChild(notif);

    setTimeout(() => {
      notif.style.animation = "slideOutRight 0.4s ease-out";
      setTimeout(() => notif.remove(), 400);
    }, 3000);
  }
}

const carrito = new CarritoCompras();

// CSS para badge y animaciones (auto-inyectado)
const style = document.createElement("style");
style.textContent = `
  .badge {
    background: var(--rojo) !important;
    color: white !important;
    border-radius: 50%;
    min-width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    font-weight: bold;
    margin-left: 1rem;
    animation: bounce 0.6s ease-out;
  }

  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
  }

  .notif {
    font-family: var(--parrafos);
  }
`;
document.head.appendChild(style);
