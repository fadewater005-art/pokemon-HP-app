(() => {
  const pokemonSelect = document.getElementById("pokemonSelect");
  const hpSelect = document.getElementById("hpSelect");
  const zapButton = document.getElementById("zapButton");

  const typeIcons = document.getElementById("typeIcons");
  const abilityValue = document.getElementById("abilityValue");

  const pokemonImage = document.getElementById("pokemonImage");
  const visual = document.getElementById("visual");
  const imagePlaceholder = document.getElementById("imagePlaceholder");
  const specialWave = document.getElementById("specialWave");

  const flashOverlay = document.getElementById("flashOverlay");
  const koOverlay = document.getElementById("koOverlay");
  const explosion = document.getElementById("explosion");
  const victory = document.getElementById("victory");

  const hpNowEl = document.getElementById("hpNow");
  const hpFill = document.getElementById("hpFill");
  const tapCombo = document.getElementById("tapCombo");

  const state = {
    selectedPokemonId: "",
    initialHP: 0,
    currentHP: 0,
    koShown: false,
    currentAbility: null,
    abilityOverrideText: ""
  };

  // HP候補（固定）
  const HP_OPTIONS = [50, 75, 100, 150, 200, 250, 300, 350, 400];
  const DEFAULT_HP = 300;

  // KO演出のタイマー管理（連打や再設定で破綻しないように）
  let koTimers = [];
  let imageRequestId = 0;
  let comboClearTimer = 0;
  const comboWindowMs = 3200;
  const maxComboDisplay = 30;
  let comboCount = 0;

  // iOSでのズーム/選択誤作動を抑える（雷ボタンだけ）
  zapButton.addEventListener("pointerdown", (e) => {
    e.preventDefault();
  });

  function buildPokemonOptions() {
    const data = window.POKEMON_DATA || [];
    for (const p of data) {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = p.name;
      pokemonSelect.appendChild(opt);
    }
  }

  // HP選択肢（固定）
  function buildHpOptions() {
    for (const v of HP_OPTIONS) {
      const opt = document.createElement("option");
      opt.value = String(v);
      opt.textContent = String(v);
      hpSelect.appendChild(opt);
    }

    // デフォルトは300
    hpSelect.value = String(DEFAULT_HP);
  }
  function renderAbility(ability) {
    // ability: string | {kind:'dice-ban', face:1|3|6, text:'きんし！'} | {kind:'dice-change', from:number, to:number, text?:string}
    if (!ability) {
      abilityValue.textContent = "—";
      return;
    }

    // Helper: replace 🎲1..🎲6 in plain text with CSS dice icons
    const renderDiceText = (text) => {
      const safe = String(text);
      const parts = safe.split(/(🎲[1-6])/g).filter(Boolean);
      // Build HTML with dice spans + escaped text nodes
      const htmlParts = parts.map(part => {
        const m = part.match(/^🎲([1-6])$/);
        if (m) {
          const n = m[1];
          return `<span class="dice d${n}" aria-hidden="true"></span>`;
        }
        return `${part.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}`;
      });
      abilityValue.innerHTML = htmlParts.join("");
    };

    if (typeof ability === "string") {
      const s = ability.trim();
      if (!s) {
        abilityValue.textContent = "—";
        return;
      }
      // If includes dice emoji markers, render as icons
      if (s.includes("🎲")) {
        renderDiceText(s);
      } else {
        abilityValue.textContent = s;
      }
      return;
    }

    if (ability.kind === "dice-ban") {
      const face = Number(ability.face || 1);
      const tail = ability.text || "きんし！";
      abilityValue.innerHTML = `
        <span class="dice d${face}" aria-hidden="true"></span>
        <span>${tail.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</span>
      `;
      return;
    }

    if (ability.kind === "dice-change") {
      const from = Number(ability.from || 1);
      const to = Number(ability.to || 1);
      const tail = ability.text || "になる";
      abilityValue.innerHTML = `
        <span class="dice d${from}" aria-hidden="true"></span><span>は</span>
        <span class="dice d${to}" aria-hidden="true"></span><span>${tail.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</span>
      `;
      return;
    }

    // fallback
    abilityValue.textContent = "—";
  }

  function getPokemonById(id) {
    return (window.POKEMON_DATA || []).find(p => p.id === id) || null;
  }

  function resetKO() {
    state.koShown = false;
    // 予約済みタイマーをクリア
    for (const t of koTimers) clearTimeout(t);
    koTimers = [];
    if (koOverlay) koOverlay.classList.remove("show", "impact");
    victory.classList.remove("show");
    explosion.classList.remove("boom");
    pokemonImage.classList.remove("koBlink", "koGone");
  }

  function renderAbilityFromState() {
    if (state.abilityOverrideText) {
      abilityValue.textContent = state.abilityOverrideText;
      return;
    }
    renderAbility(state.currentAbility);
  }

  function triggerSpecialWave(isStrong) {
    if (!specialWave) return;
    specialWave.classList.remove("emit", "strong");
    void specialWave.offsetWidth;
    specialWave.classList.add("emit");
    if (isStrong) {
      specialWave.classList.add("strong");
    }
  }

  function handleComboFinished() {
    if (comboCount <= 0) return;
    if (state.selectedPokemonId !== "totogengar" || state.initialHP <= 0 || state.currentHP <= 0) return;

    const hpRatio = state.currentHP / state.initialHP;
    if (hpRatio < 0.2) {
      triggerSpecialWave(true);
      state.abilityOverrideText = "次にサイコロをふれるのは二人まで！";
      renderAbilityFromState();
      return;
    }
    if (hpRatio < 0.5) {
      triggerSpecialWave(false);
      state.abilityOverrideText = "次にサイコロをふれるのは二人まで！";
      renderAbilityFromState();
    }
  }


  function clearCombo() {
    comboCount = 0;
    if (comboClearTimer) clearTimeout(comboClearTimer);
    comboClearTimer = 0;
    if (!tapCombo) return;
    tapCombo.classList.remove("show", "burst");
    tapCombo.innerHTML = "";
  }

  function updateCombo() {
    comboCount += 1;

    if (!tapCombo) return;

    const shownCombo = Math.min(comboCount, maxComboDisplay);
    if (comboCount <= 1) {
      tapCombo.classList.remove("show", "burst");
      tapCombo.innerHTML = "";
    } else {
      tapCombo.innerHTML = `<span class="comboNumber">${shownCombo}</span><span class="comboUnit"> HIT!</span>`;
      tapCombo.classList.add("show");
      tapCombo.classList.remove("burst");
      void tapCombo.offsetWidth;
      tapCombo.classList.add("burst");
    }

    if (comboClearTimer) clearTimeout(comboClearTimer);
    comboClearTimer = window.setTimeout(() => {
      handleComboFinished();
      clearCombo();
    }, comboWindowMs);
  }


  function clearCombo() {
    comboCount = 0;
    if (comboClearTimer) clearTimeout(comboClearTimer);
    comboClearTimer = 0;
    if (!tapCombo) return;
    tapCombo.classList.remove("show", "burst");
    tapCombo.innerHTML = "";
  }

  function updateCombo() {
    comboCount += 1;

    if (!tapCombo) return;

    const shownCombo = Math.min(comboCount, maxComboDisplay);
    if (comboCount <= 1) {
      tapCombo.classList.remove("show", "burst");
      tapCombo.innerHTML = "";
    } else {
      tapCombo.innerHTML = `<span class="comboNumber">${shownCombo}</span><span class="comboUnit"> HIT!</span>`;
      tapCombo.classList.add("show");
      tapCombo.classList.remove("burst");
      void tapCombo.offsetWidth;
      tapCombo.classList.add("burst");
    }

    if (comboClearTimer) clearTimeout(comboClearTimer);
    comboClearTimer = window.setTimeout(() => {
      clearCombo();
    }, comboWindowMs);
  }

  function setImage(src) {
    const requestId = ++imageRequestId;

    if (!src) {
      pokemonImage.removeAttribute("src");
      pokemonImage.style.display = "none";
      imagePlaceholder.style.display = "grid";
      return;
    }

    pokemonImage.style.display = "none";
    imagePlaceholder.style.display = "grid";

    pokemonImage.src = src;
    pokemonImage.onload = () => {
      if (requestId !== imageRequestId) return;
      pokemonImage.style.display = "block";
      imagePlaceholder.style.display = "none";
    };
    pokemonImage.onerror = () => {
      if (requestId !== imageRequestId) return;
      pokemonImage.style.display = "none";
      imagePlaceholder.style.display = "grid";
    };
  }

  function renderTypes(types) {
    typeIcons.textContent = "";
    const iconMap = window.TYPE_ICON || {};

    (types || []).slice(0, 2).forEach((t) => {
      const src = iconMap[t];
      const appendBadge = () => {
        const badge = document.createElement("span");
        badge.className = "typeBadge";
        badge.textContent = t;
        typeIcons.appendChild(badge);
      };

      if (!src) {
        appendBadge();
        return;
      }

      const img = document.createElement("img");
      img.src = src;
      img.alt = t;
      img.loading = "lazy";
      img.onerror = () => {
        img.remove();
        appendBadge();
      };
      typeIcons.appendChild(img);
    });
  }

  function canZap() {
    return !!state.selectedPokemonId && state.initialHP > 0 && !state.koShown;
  }

  function updateButtonState() {
    zapButton.disabled = !canZap() || state.currentHP <= 0;
  }

  function setHP(initial) {
    state.initialHP = initial;
    state.currentHP = initial;
    if (state.abilityOverrideText) {
      state.abilityOverrideText = "";
      renderAbilityFromState();
    }
    hpNowEl.textContent = initial > 0 ? String(initial) : "—";
    updateHpBar();
    updateButtonState();
    resetKO();
    clearCombo();
  }

  function updateHpBar() {
    const init = state.initialHP;
    const cur = state.currentHP;

    if (!init || init <= 0) {
      hpFill.style.width = "0%";
      hpFill.style.backgroundColor = "var(--bar-green)";
      return;
    }

    const ratio = Math.max(0, Math.min(1, cur / init));
    hpFill.style.width = (ratio * 100).toFixed(2) + "%";

    // 色変化：>=50% 緑、<50% 黄、<20% 赤
    let colorVar = "var(--bar-green)";
    if (ratio < 0.20) colorVar = "var(--bar-red)";
    else if (ratio < 0.50) colorVar = "var(--bar-yellow)";
    hpFill.style.backgroundColor = colorVar;
  }

  // iPhoneでも確実に再発火させる（class付け直し + reflow）
  function restartClass(el, className) {
    el.classList.remove(className);
    // reflow（iOS Safari向け）
    void el.offsetWidth;
    el.classList.add(className);
  }

  function triggerHitFx() {
    restartClass(visual, "hit");
    restartClass(flashOverlay, "flash");
    restartClass(hpNowEl, "hpPop");
  }

  function triggerKO() {
    if (state.koShown) return;
    state.koShown = true;
    if (koOverlay) {
      koOverlay.classList.add("show");
      restartClass(koOverlay, "impact");
    }
    restartClass(pokemonImage, "koBlink");
    restartClass(explosion, "boom");
    victory.classList.remove("show");
    const vanish = window.setTimeout(() => {
      pokemonImage.classList.add("koGone");
    }, 1200);
    // 爆発を“見える長さ”にしてから勝利表示
    const t = window.setTimeout(() => {
      victory.classList.add("show");
    }, 640);
    koTimers.push(vanish);
    koTimers.push(t);
    updateButtonState();
  }

  // 子供向けの軽い衝撃音（Web Audio生成）
  let audioCtx = null;
  function ensureAudio() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      audioCtx = new AC();
    }
    if (audioCtx.state === "suspended") {
      // iOS Safari: ユーザー操作中にresume可能
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  function playHitSound() {
    const ctx = ensureAudio();
    if (!ctx) return;

    const t0 = ctx.currentTime;

    // 短い「パチッ」系：ノイズ + ピッチダウン
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.08, t0 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.12);

    // ノイズ生成
    const bufferSize = Math.floor(ctx.sampleRate * 0.12);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // ほんのり減衰するノイズ
      const decay = 1 - i / bufferSize;
      data[i] = (Math.random() * 2 - 1) * decay * 0.6;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(1200, t0);
    bp.Q.setValueAtTime(0.9, t0);

    noise.connect(bp).connect(gain).connect(ctx.destination);
    noise.start(t0);
    noise.stop(t0 + 0.12);

    // 軽いトーン（子供向け）
    const osc = ctx.createOscillator();
    const og = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(520, t0);
    osc.frequency.exponentialRampToValueAtTime(360, t0 + 0.09);
    og.gain.setValueAtTime(0.0001, t0);
    og.gain.exponentialRampToValueAtTime(0.03, t0 + 0.01);
    og.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.10);
    osc.connect(og).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + 0.11);
  }

  function updateFromPokemon(pokemon) {
    if (!pokemon) {
      state.selectedPokemonId = "";
      state.currentAbility = null;
      state.abilityOverrideText = "";
      renderTypes([]);
      renderAbilityFromState();
      setImage("");
      updateButtonState();
      return;
    }

    state.selectedPokemonId = pokemon.id;
    state.currentAbility = pokemon.ability;
    state.abilityOverrideText = "";
    renderTypes(pokemon.types);
    renderAbilityFromState();
    setImage(pokemon.image);

    resetKO();
    updateButtonState();
  }

  pokemonSelect.addEventListener("change", () => {
    const id = pokemonSelect.value;
    const pokemon = getPokemonById(id);
    updateFromPokemon(pokemon);

    // ポケモンを切り替えたらHPは初期値に戻す
    const v = parseInt(hpSelect.value, 10);
    const init = Number.isFinite(v) && v > 0 ? v : DEFAULT_HP;
    setHP(init);
  });

  hpSelect.addEventListener("change", () => {
    const v = parseInt(hpSelect.value, 10);
    if (Number.isFinite(v) && v > 0) {
      setHP(v);
    } else {
      // 想定外の状態でもデフォルトへ戻す
      hpSelect.value = String(DEFAULT_HP);
      setHP(DEFAULT_HP);
    }
  });

  zapButton.addEventListener("click", () => {
    if (!canZap()) return;
    if (state.currentHP <= 0) return;

    if (state.abilityOverrideText) {
      state.abilityOverrideText = "";
      renderAbilityFromState();
    }

    // 減らす
    state.currentHP = Math.max(0, state.currentHP - 1);
    hpNowEl.textContent = String(state.currentHP);
    updateHpBar();

    // 演出＆音
    triggerHitFx();
    updateCombo();
    playHitSound();

    if (state.currentHP === 0) {
      triggerKO();
      clearCombo();
    }

    updateButtonState();
  });

  // 初期状態
  buildPokemonOptions();
  buildHpOptions();

  // 初期表示（iOSのフォーム復元 / bfcacheでも破綻しないように同期）
  function syncFromUI() {
    resetKO();
    const v = parseInt(hpSelect.value, 10);
    const init = Number.isFinite(v) && v > 0 ? v : DEFAULT_HP;
    if (!Number.isFinite(v) || v <= 0) hpSelect.value = String(DEFAULT_HP);
    setHP(init);

    const id = pokemonSelect.value;
    const pokemon = getPokemonById(id);
    updateFromPokemon(pokemon);
  }

  // bfcache復帰時にも状態を整える（iPhone Safari対策）
  window.addEventListener("pageshow", () => {
    syncFromUI();
  });

  syncFromUI();
})();
