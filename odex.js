export default class Odex {
  constructor(width, height) {
    this.G = {
      layers: [],
      globals: null,
      running: false,
      lastFrameTime: 0,
      loopId: null,
      deltaTime: 0,
      listeners: [],
      sprites: {},
      sounds: {},
      width: null,
      height: null,
      scale: 1
    };

    this.G.width = width;
    this.G.height = height;

    this._updateCallback = null;
    this._renderCallback = null;

    this.loop = this.loop.bind(this);
  }

  text(ctx, textString, x, y, color, font) {
    if (!ctx) throw new Error("No rendering context for canvas found!");

    const textWidth = ctx.measureText(textString).width;

    if (color) {
      ctx.fillStyle = color;
    }

    if (font) {
      ctx.font = font;
    }

    ctx.fillText(textString, x - (textWidth/2), y);
  }

  line(ctx, startX,startY,targetX,targetY, width, color) {
    if (!ctx) throw new Error("No rendering context for canvas found!");

    ctx.lineWidth = width || 1;
    ctx.strokeStyle = color || '#000';
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(targetX, targetY);

    ctx.stroke();
  }

  rect(ctx, color, x, y, w, h, outlineWidth = 0, outlineColor = null) {
    if (!ctx) throw new Error("No rendering context for canvas found!");

    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);

    if (outlineWidth > 0 && outlineColor) {
      ctx.lineWidth = outlineWidth;
      ctx.strokeStyle = outlineColor;
      ctx.strokeRect(x, y, w, h);
    }

    return this;
  }

  circle(ctx, color, x, y, radius, outlineWidth = 0, outlineColor = null) {
    if (!ctx) throw new Error("No rendering context for canvas found!");

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.closePath();

    ctx.fillStyle = color;
    ctx.fill();

    if (outlineWidth > 0 && outlineColor) {
      ctx.lineWidth = outlineWidth;
      ctx.strokeStyle = outlineColor;
      ctx.stroke();
    }

    return this;
  }

  async loadSound(name, src) {
    const sound = new Audio(src);
    sound.onload = () => {
      this.G.sounds[name] = sound;
      resolve(sound);
    }
    sound.onerror = (err) => {
      console.error(`failed to load sound: ${src}`);
      reject(err);
    }
  }

  getSound(name) {
    return this.G.sounds[name] || null;
  }

  loadSprite(name, src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;

      img.onload = () => {
        this.G.sprites[name] = img;
        resolve(img);
      };

      img.onerror = (err) => {
        console.error(`Failed to load sprite: ${src}`);
        reject(err);
      };
    });
  }

  getSprite(name) {
    return this.G.sprites[name] || null;
  }

  loadSound(name, src) {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.src = src;

      audio.onloadeddata = () => {
        this.G.sounds[name] = audio;
        resolve(audio);
      };

      audio.onerror = (err) => {
        console.error(`Failed to load sound: ${src}`);
        reject(err);
      };
    });
  }

  getSound(name) {
    return this.G.sounds[name] || null;
  }

  listen(type, handler, options= {}) {
    if (typeof handler !== 'function') {
      throw new Error("Handler must be a function!");
    }

    const boundHandler = handler.bind(this);
    window.addEventListener(type, boundHandler, options);

    this.G.listeners.push({type, handler: boundHandler, options });
  }

  removeListeners(type = null) {
    this.G.listeners = this.G.listeners.filter(({ type: listenerType, handler, options }) => {
      if (!type || type === listenerType) {
        window.removeEventListener(listenerType, handler, options);
        return false;
      }
      return true;
    });
  }

  update(callback) {
    if (typeof callback === 'function') {
      this._updateCallback = callback;
    } else {
      throw new Error("Update callback must be a function");
    }
  }

  render(callback) {
    if (typeof callback === 'function') {
      this._renderCallback = callback;
    } else {
      throw new Error("Render callback must be a function");
    }
  }

  clear(ctx) {
    ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
  }

  loop() {
    // if (this.G.running) {
    //   console.warn("A game loop is already running!");
    //   return;
    // }

    this.G.running = true;
    const currentLoopId = Symbol("loop"); // uniq. id for this loop
    this.G.currentLoopId = currentLoopId;

    const MAX_DELTA_TIME = 1000 / 60;
    let frameCount = 0;
    let lastFpsUpdateTime = performance.now();
    this.G.fps = 0;

    const TARGET_FPS = 60;
    const FRAME_TIME = 1000 / TARGET_FPS;
    let accumulator = 0;
    let lastTime = performance.now();

    const loop = (timestamp) => {
      if (!this.G.running) return;

      let deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      
      accumulator += deltaTime;

      // while (accumulator >= FRAME_TIME) {
      //   this._update(this.G.layers, FRAME_TIME / 1000); // Use fixed timestep
      //   accumulator -= FRAME_TIME;
      // }

      //new optimized accumulator logic starts

      const MAX_UPDATES_PER_FRAME = 5;
      let updatesThisFrame = 0;

      while (accumulator >= FRAME_TIME && updatesThisFrame < MAX_UPDATES_PER_FRAME) {
        this._update(this.G.layers, FRAME_TIME / 1000);
        accumulator -= FRAME_TIME;
        updatesThisFrame++;
      }

      if (updatesThisFrame >= MAX_UPDATES_PER_FRAME) {
        accumulator = 0; // prevent spiral of death
      }

      //new optimized accumulator logic ends

      this._render(this.G.layers);


      frameCount++;
      if (timestamp - lastFpsUpdateTime >= 1000) {
        this.G.fps = frameCount;
        frameCount = 0;
        lastFpsUpdateTime = timestamp;
      }

      this.G.loopId = requestAnimationFrame(loop);
    };

    this.G.lastFrameTime = null;
    this.G.loopId = requestAnimationFrame(loop);
  }

  start() {
    if (this.G.running) return;
    this.G.running = true;
    this.G.lastFrameTime = performance.now();
    this.loop();
  }

  stop() {
    this.G.running = false;
  }

  _render(layers) {
    if (this._renderCallback) {
      this._renderCallback(layers);
    }
  }

  _update(layers, deltaTime) {
    if (this._updateCallback) {
      this._updateCallback(layers,deltaTime);
    }
  }

  loadSprites(sprites) {
    const promises = Array.from(sprites).map((sprite) => {
      const name = sprite.name;
      const src = sprite.src;
  
      if (!name || !src) {
        console.error('Sprite element is missing a name or src attribute:', sprite);
        return Promise.resolve();
      }
  
      return this.loadSprite(name, src);
    });
  
    return Promise.all(promises);
  }

  async init(sprites, sounds){
    if (sprites) {
      await this.loadSprites(sprites);
    }

    if (sounds) {
      for (let sound of sounds) {

      }
      console.log('all sounds loaded!');
    }
  }

  addLayer(tag) {
    const target = document.querySelector(tag);
    if (!target) throw new Error("No game window found!");
    if (target.tagName !== "CANVAS") throw new Error("Game window must be <canvas>");

    const dpr = window.devicePixelRatio || 1;

    const ctx = target.getContext('2d'); // { willReadFrequently: false }
    //ctx.imageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    ctx.scale(dpr, dpr);

    this.G.layers.push({
      layer: target,
      ctx: ctx,
      width: target.width,
      height: target.height,
      objects: []
    });
  }
}