(function () {
  // Header ao rolar
  var header = document.querySelector(".site-header");
  if (!header) return;
  var aoRolar = function () {
    header.classList.toggle("header--rolado", window.scrollY > 60);
  };
  window.addEventListener("scroll", aoRolar, { passive: true });
  aoRolar();
})();

// Galeria de fotos — desktop e mobile
// Os caminhos das fotos são lidos do atributo data-fotos do elemento da galeria
// (injetado pelo Astro com os paths processados). Fallback para paths hardcoded.
(function () {
  var galeriaEl = document.getElementById("foto-galeria");
  var fotosData = galeriaEl && galeriaEl.closest('[data-galeria-fotos]');
  var fotos;
  if (fotosData) {
    try { fotos = JSON.parse(fotosData.getAttribute('data-galeria-fotos')); } catch(e) {}
  }
  if (!fotos) {
    fotos = [
      { src: "imagens/galeria-01.jpg", legenda: "galeria 1", posicao: "50% 35%" },
      { src: "imagens/galeria-02.jpg", legenda: "galeria 2", posicao: "50% 15%" },
      { src: "imagens/galeria-03.jpg", legenda: "galeria 3", posicao: "50% 50%" },
      { src: "imagens/galeria-04.jpg", legenda: "galeria 4", posicao: "50% 68%" },
      { src: "imagens/galeria-05.jpg", legenda: "galeria 5", posicao: "50% 50%" }
    ];
  }
  var indiceAtual = 0;
  var imgGaleria = document.getElementById("foto-galeria");
  var imgGaleriaMobile = document.getElementById("foto-galeria-mobile");
  var btnAnterior = document.querySelector("#galeria .btn-anterior");
  var btnProximo = document.querySelector("#galeria .btn-proximo");
  var btnAnteriorMobile = document.querySelector("#galeria .btn-anterior-mobile");
  var btnProximoMobile = document.querySelector("#galeria .btn-proximo-mobile");
  var segmentosProgresso = document.querySelectorAll("#progresso-galeria-mobile span");

  function mostrarFoto(indice) {
    indiceAtual = (indice + fotos.length) % fotos.length;
    var foto = fotos[indiceAtual];
    var alt = "Festa de debutante no Leopoldo House — " + foto.legenda;
    [imgGaleria, imgGaleriaMobile].forEach(function (img) {
      if (!img) return;
      img.src = foto.src;
      img.alt = alt;
      img.style.objectPosition = foto.posicao || "50% 50%";
    });
    segmentosProgresso.forEach(function (segmento, i) {
      segmento.classList.toggle("ativo", i === indiceAtual);
    });
  }

  if (btnAnterior && btnProximo) {
    btnAnterior.addEventListener("click", function () { mostrarFoto(indiceAtual - 1); });
    btnProximo.addEventListener("click", function () { mostrarFoto(indiceAtual + 1); });
  }
  if (btnAnteriorMobile && btnProximoMobile) {
    btnAnteriorMobile.addEventListener("click", function () { mostrarFoto(indiceAtual - 1); });
    btnProximoMobile.addEventListener("click", function () { mostrarFoto(indiceAtual + 1); });
  }
})();

// Carrossel da seção Estrutura (apenas mobile)
// Lê os cards do grid para obter os src processados pelo Astro
(function () {
  var cards = document.querySelectorAll('#estrutura .grid-estrutura .card img');
  var titulos = document.querySelectorAll('#estrutura .grid-estrutura .card h3');
  var ambientes;
  if (cards.length >= 3) {
    ambientes = Array.prototype.map.call(cards, function(img, i) {
      return {
        src: img.src || img.getAttribute('src'),
        alt: img.alt,
        titulo: titulos[i] ? titulos[i].textContent.trim().replace(/\s+/g, ' ') : '',
        posicao: img.style.objectPosition || '50% 50%'
      };
    });
  } else {
    ambientes = [
      { src: "imagens/estrutura-salao.jpg", alt: "Salão amplo do Leopoldo House com pé-direito alto", titulo: "Salão amplo com 7m² de pé-direito", posicao: "50% 50%" },
      { src: "imagens/estrutura-mezanino.jpg", alt: "Mezanino do Leopoldo House montado como lounge", titulo: "Mezanino", posicao: "64% 50%" },
      { src: "imagens/estrutura-rooftop.jpg", alt: "Rooftop garden do Leopoldo House", titulo: "Rooftop Garden", posicao: "50% 50%" }
    ];
  }
  var indiceEstrutura = 0;
  var imgEstrutura = document.getElementById("foto-estrutura");
  var tituloEstrutura = document.getElementById("titulo-estrutura");
  var btnEstruturaAnterior = document.querySelector("#estrutura .btn-estrutura-anterior");
  var btnEstruturaProximo = document.querySelector("#estrutura .btn-estrutura-proximo");

  function mostrarAmbiente(indice) {
    indiceEstrutura = (indice + ambientes.length) % ambientes.length;
    imgEstrutura.src = ambientes[indiceEstrutura].src;
    imgEstrutura.alt = ambientes[indiceEstrutura].alt;
    imgEstrutura.style.objectPosition = ambientes[indiceEstrutura].posicao || "50% 50%";
    tituloEstrutura.textContent = ambientes[indiceEstrutura].titulo;
  }

  if (btnEstruturaAnterior && btnEstruturaProximo) {
    btnEstruturaAnterior.addEventListener("click", function () { mostrarAmbiente(indiceEstrutura - 1); });
    btnEstruturaProximo.addEventListener("click", function () { mostrarAmbiente(indiceEstrutura + 1); });
  }
})();

// Carrossel da seção Gastronomia (apenas mobile)
// Lê os items do grid para obter os src processados pelo Astro
(function () {
  var gastroImgs = document.querySelectorAll('#gastronomia .grid-gastro .item-gastro img');
  var pratos;
  if (gastroImgs.length >= 4) {
    pratos = Array.prototype.map.call(gastroImgs, function(img) {
      return {
        src: img.src || img.getAttribute('src'),
        alt: img.alt,
        posicao: img.style.objectPosition || '50% 50%'
      };
    });
  } else {
    pratos = [
      { src: "imagens/gastronomia-coffee-break.jpg", alt: "Coffee break servido no Leopoldo House", posicao: "50% 65%" },
      { src: "imagens/gastronomia-almoco-jantar.jpg", alt: "Almoço e jantar servido no Leopoldo House", posicao: "58% 55%" },
      { src: "imagens/gastronomia-ilhas.jpg", alt: "Ilhas gastronômicas do Leopoldo House", posicao: "50% 50%" },
      { src: "imagens/gastronomia-coquetel-volante.jpg", alt: "Coquetel volante servido no Leopoldo House", posicao: "50% 50%" }
    ];
  }
  var indiceGastro = 0;
  var imgGastro = document.getElementById("foto-gastro");
  var pontosGastro = document.querySelectorAll("#gastronomia .ponto-gastro");

  function mostrarPrato(indice) {
    indiceGastro = (indice + pratos.length) % pratos.length;
    imgGastro.src = pratos[indiceGastro].src;
    imgGastro.alt = pratos[indiceGastro].alt;
    imgGastro.style.objectPosition = pratos[indiceGastro].posicao || "50% 50%";
    pontosGastro.forEach(function (ponto, i) {
      ponto.classList.toggle("ativo", i === indiceGastro);
    });
  }

  pontosGastro.forEach(function (ponto) {
    ponto.addEventListener("click", function () {
      mostrarPrato(parseInt(ponto.getAttribute("data-indice"), 10));
    });
  });
})();
