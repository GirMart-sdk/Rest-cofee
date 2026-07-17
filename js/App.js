// ===== APP PRINCIPAL - ORGANIZADA =====
class App {
  constructor() {
    this.menuToggle = document.querySelector(".Hamburguesa");
    this.navegacion = document.querySelector(".navegacion");
    this.btnsFiltro = document.querySelectorAll(".btn-verde");
    this.contenedorPlatillos = document.querySelector(".platillos");
    this.formReserva = document.getElementById("reserva-form");

    this.init();
  }

  init() {
    this.initLazyLoad();
    this.initMenuMobile();
    this.initFiltrosMenu();
    this.initFormReserva();
    this.initSmoothScroll();
  }

  // 1. Lazy Loading mejorado con fallback
  initLazyLoad() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const tempImg = new Image();

            tempImg.onload = () => {
              img.src = img.dataset.src;
              img.classList.add("loaded");
            };

            tempImg.onerror = () => {
              img.src =
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==";
              img.classList.add("error");
            };

            tempImg.src = img.dataset.src;
          }
        });
      },
      { rootMargin: "50px" },
    );

    document
      .querySelectorAll("img[data-src]")
      .forEach((img) => observer.observe(img));
  }

  // 2. Menú móvil con accesibilidad completa
  initMenuMobile() {
    this.menuToggle.addEventListener("click", () => this.toggleMenu());

    // Cerrar al click en links
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => this.cerrarMenu());
    });

    // Cerrar con ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.cerrarMenu();
    });

    // Cerrar al resize desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) this.cerrarMenu();
    });
  }

  toggleMenu() {
    const isOpen = this.navegacion.classList.contains("ocultar");
    if (isOpen) {
      this.navegacion.classList.remove("ocultar");
      this.menuToggle.setAttribute("aria-expanded", "true");
    } else {
      this.navegacion.classList.add("ocultar");
      this.menuToggle.setAttribute("aria-expanded", "false");
    }
  }

  cerrarMenu() {
    this.navegacion.classList.add("ocultar");
    this.menuToggle.setAttribute("aria-expanded", "false");
  }

  // 3. Filtros de menú con active state
  initFiltrosMenu() {
    const platillos = Array.from(document.querySelectorAll(".platillo"));

    this.btnsFiltro.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const categoria = e.target.classList[0];
        this.filtrarPlatillos(categoria, platillos);
        this.setActiveBtn(e.target);
      });
    });
  }

  filtrarPlatillos(categoria, platillos) {
    this.limpiarHtml();

    const filtrados =
      categoria === "todos"
        ? platillos
        : platillos.filter(
            (p) => p.dataset.platillo === categoria.slice(0, -4),
          );

    filtrados.forEach((platillo) =>
      this.contenedorPlatillos.appendChild(platillo),
    );
  }

  setActiveBtn(btnActivo) {
    this.btnsFiltro.forEach((btn) => btn.classList.remove("active"));
    btnActivo.classList.add("active");
  }

  limpiarHtml() {
    while (this.contenedorPlatillos.firstChild) {
      this.contenedorPlatillos.removeChild(this.contenedorPlatillos.firstChild);
    }
  }

  // 4. Formulario reservas con validación completa
  initFormReserva() {
    if (this.formReserva) {
      this.formReserva.addEventListener("submit", (e) =>
        this.handleFormSubmit(e),
      );

      // Validación fecha mínima
      const fechaInput = document.getElementById("fecha");
      if (fechaInput) {
        const hoy = new Date().toISOString().split("T")[0];
        fechaInput.min = hoy;
        fechaInput.addEventListener("change", this.validarFecha.bind(this));
      }
    }
  }

  validarFecha(e) {
    const fecha = new Date(e.target.value);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fecha < hoy) {
      e.target.classList.add("invalid");
      this.mostrarError(e.target, "Selecciona una fecha futura");
    } else {
      e.target.classList.remove("invalid");
    }
  }

  handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const datos = Object.fromEntries(formData);

    if (this.validarFormReserva(datos)) {
      // Simular envío (reemplazar con tu endpoint)
      this.mostrarMensaje(
        "✅ ¡Reserva recibida! Te contactaremos en 24h.",
        "success",
      );
      e.target.reset();
    }
  }

  validarFormReserva(datos) {
    let valido = true;

    // Nombre mínimo 3 chars
    if (datos.nombre.length < 3) {
      this.mostrarError("nombre", "Nombre muy corto");
      valido = false;
    }

    // Email formato
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (datos.email && !emailRegex.test(datos.email)) {
      this.mostrarError("email", "Email inválido");
      valido = false;
    }

    // Notas mínimo 5 chars
    if (datos.notas.length < 5) {
      this.mostrarError("notas", "Describe tus necesidades");
      valido = false;
    }

    return valido;
  }

  mostrarError(campoId, mensaje) {
    const campo = document.getElementById(campoId);
    const errorSpan =
      document.getElementById(`${campoId}-error`) ||
      document.createElement("span");
    errorSpan.id = `${campoId}-error`;
    errorSpan.className = "error-msg";
    errorSpan.textContent = mensaje;
    errorSpan.style.color = "var(--rojo)";

    if (!campo.parentNode.querySelector(".error-msg")) {
      campo.parentNode.appendChild(errorSpan);
    }
    campo.classList.add("error");
  }

  mostrarMensaje(texto, tipo = "info") {
    const mensajeDiv = document.createElement("div");
    mensajeDiv.className = `mensaje ${tipo}`;
    mensajeDiv.textContent = texto;
    mensajeDiv.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: ${tipo === "success" ? "var(--verde)" : "var(--rojo)"};
      color: white;
      padding: 1.5rem;
      border-radius: 8px;
      z-index: 10000;
      max-width: 90%;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;

    document.body.appendChild(mensajeDiv);

    setTimeout(() => {
      mensajeDiv.remove();
    }, 4000);
  }

  // 5. Smooth scroll para navegación
  initSmoothScroll() {
    document.querySelectorAll(".nav-link, .btn").forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = e.target.getAttribute("href");
        if (href.startsWith("#")) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
            this.cerrarMenu();
          }
        }
      });
    });
  }
}

// Inicializar app cuando DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  new App();
});
