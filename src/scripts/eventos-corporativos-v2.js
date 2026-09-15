(function () {
  // Header ao rolar
  var header = document.querySelector(".site-header");
  if (header) {
    var aoRolar = function () {
      header.classList.toggle("header--rolado", window.scrollY > 60);
    };
    window.addEventListener("scroll", aoRolar, { passive: true });
    aoRolar();
  }

  // Carrosseis de espaço
  document.querySelectorAll(".carrossel-espaco").forEach(function (carrossel) {
    var trilho = carrossel.querySelector(".carrossel-trilho");
    if (!trilho) return;
    var itens = Array.prototype.slice.call(trilho.querySelectorAll(".carrossel-item"));
    var dotsContainer = carrossel.parentElement.querySelector('.carrossel-dots[data-alvo="' + trilho.id + '"]');
    var realCount = itens.length;
    var cloneCount = Math.min(3, realCount);
    if (!realCount) return;

    var clonesFim = itens.slice(0, cloneCount).map(function (item) { return item.cloneNode(true); });
    var clonesInicio = itens.slice(realCount - cloneCount).map(function (item) { return item.cloneNode(true); });
    clonesInicio.forEach(function (clone) { trilho.insertBefore(clone, trilho.firstChild); });
    clonesFim.forEach(function (clone) { trilho.appendChild(clone); });

    var todos = Array.prototype.slice.call(trilho.querySelectorAll(".carrossel-item"));
    var dots = [];
    var posicao = cloneCount;
    var ajustando = false;

    function moverPara(alvoEl, comAnimacao) {
      var trilhoRect = trilho.getBoundingClientRect();
      var alvoRect = alvoEl.getBoundingClientRect();
      var destino = trilho.scrollLeft + (alvoRect.left - trilhoRect.left);
      trilho.scrollTo({ left: destino, behavior: comAnimacao ? "smooth" : "auto" });
    }

    function atualizarDestaque() {
      todos.forEach(function (item, i) { item.classList.toggle("item-centro", i === posicao); });
      var indiceReal = ((posicao - cloneCount) % realCount + realCount) % realCount;
      dots.forEach(function (d, i) { d.classList.toggle("ativo", i === indiceReal); });
    }

    function irPara(novaPosicao) {
      posicao = novaPosicao;
      moverPara(todos[posicao], true);
      atualizarDestaque();
    }

    function corrigirSeNecessario() {
      var passouDoFim = posicao >= cloneCount + realCount;
      var passouDoInicio = posicao < cloneCount;
      if (!passouDoFim && !passouDoInicio) return;

      posicao += passouDoFim ? -realCount : realCount;

      ajustando = true;
      trilho.style.scrollSnapType = "none";
      moverPara(todos[posicao], false);
      atualizarDestaque();
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          trilho.style.scrollSnapType = "";
          ajustando = false;
        });
      });
    }

    if ("onscrollend" in window) {
      trilho.addEventListener("scrollend", function () {
        if (ajustando) return;
        corrigirSeNecessario();
      });
    } else {
      var settleTimer = null;
      trilho.addEventListener("scroll", function () {
        if (ajustando) return;
        if (settleTimer) window.clearTimeout(settleTimer);
        settleTimer = window.setTimeout(corrigirSeNecessario, 150);
      }, { passive: true });
    }

    if (dotsContainer) {
      itens.forEach(function (item, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "dot" + (i === 0 ? " ativo" : "");
        dot.setAttribute("aria-label", "Ir para foto " + (i + 1));
        dot.addEventListener("click", function () {
          irPara(cloneCount + i);
          reiniciarAutoplay();
        });
        dotsContainer.appendChild(dot);
      });
      dots = Array.prototype.slice.call(dotsContainer.querySelectorAll(".dot"));
    }

    carrossel.querySelectorAll(".carrossel-seta").forEach(function (botao) {
      botao.addEventListener("click", function () {
        var direcao = parseInt(botao.getAttribute("data-direcao"), 10);
        irPara(posicao + direcao);
        reiniciarAutoplay();
      });
    });

    moverPara(todos[posicao], false);
    atualizarDestaque();

    var autoplayMs = 4000;
    var temporizador = null;
    function reiniciarAutoplay() {
      if (temporizador) window.clearInterval(temporizador);
      temporizador = window.setInterval(function () { irPara(posicao + 1); }, autoplayMs);
    }
    reiniciarAutoplay();
  });
})();
