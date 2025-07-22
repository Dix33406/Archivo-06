  // Desvanecer banner al hacer scroll
  const banner = document.getElementById('banner-img');
  window.addEventListener('scroll', () => {
    const maxScroll = 600;
    const scrollY = window.scrollY;
    let opacity = 1 - scrollY / maxScroll;
    banner.style.opacity = Math.max(0, Math.min(1, opacity));
  });

  // Reproductor de música
  const audio = document.getElementById('player');
  const btn = document.getElementById('playPauseBtn');
  let isPlaying = false;

  btn.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      btn.textContent = '⏵';
    } else {
      audio.play();
      btn.textContent = '⏸';
    }
    isPlaying = !isPlaying;
  });

  // Animaciones al hacer scroll
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
  });

  // Carrusel de cartas principales
  const wrapper = document.querySelector('.cartas-wrapper');
  const cartaSections = wrapper.querySelectorAll('.section');
  const prevBtn = document.getElementById('prevCarta');
  const nextBtn = document.getElementById('nextCarta');
  let current = 0;

  function updateCartaView() {
    wrapper.style.transform = `translateX(-${current * 100}%)`;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === cartaSections.length - 1;
    prevBtn.style.opacity = prevBtn.disabled ? 0.3 : 1;
    nextBtn.style.opacity = nextBtn.disabled ? 0.3 : 1;
    prevBtn.style.cursor = prevBtn.disabled ? 'default' : 'pointer';
    nextBtn.style.cursor = nextBtn.disabled ? 'default' : 'pointer';
  }

  prevBtn.addEventListener('click', () => {
    if (current > 0) {
      current--;
      updateCartaView();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (current < cartaSections.length - 1) {
      current++;
      updateCartaView();
    }
  });

  updateCartaView(); // Inicializa carrusel

  // Carrusel de cartas no enviadas
  const noEnviadasWrapper = document.querySelector('.cartas-no-enviadas-wrapper');
  const noEnviadas = noEnviadasWrapper.querySelectorAll('.carta');
  const prevNoEnviada = document.getElementById('prevNoEnviada');
  const nextNoEnviada = document.getElementById('nextNoEnviada');
  let indexNoEnviada = 0;

  function updateNoEnviadaView() {
    noEnviadasWrapper.style.transform = `translateX(-${indexNoEnviada * 100}%)`;
    prevNoEnviada.disabled = indexNoEnviada === 0;
    nextNoEnviada.disabled = indexNoEnviada === noEnviadas.length - 1;
  }

  prevNoEnviada.addEventListener('click', () => {
    if (indexNoEnviada > 0) {
      indexNoEnviada--;
      updateNoEnviadaView();
    }
  });

  nextNoEnviada.addEventListener('click', () => {
    if (indexNoEnviada < noEnviadas.length - 1) {
      indexNoEnviada++;
      updateNoEnviadaView();
    }
  });

  updateNoEnviadaView(); // Inicializa cartas no enviadas
