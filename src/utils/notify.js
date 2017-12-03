const INIT = Symbol('INIT');
const RUNNING = Symbol('RUNNING');
const RUNNING_WITH_PENDING = Symbol('RUNNING_WITH_PENDING');

export class SingletonWorker {
  constructor(name, f, data, init = true) {
    this.name = name;
    this.ctx = new SingletonContext(init);
    // 任务函数
    this.f = f;
    this.data = data;
  }

  async start(data, checkData = (prevData, data) => data) {
    this.data = checkData(this.data, data);
    if (this.ctx.start()) {
      do {
        const r = this.f(this.data);
        if (r instanceof Promise) {
          try {
            await r;
          } catch (err) {
            console.error(`SingletonWorker: ${this.name}, ${err}`);
          }
        }
      } while (this.ctx.is_pending());
    }
  }
}

const singletonContexts = {};

export function newSingletonContext(name, ...args) {
  let ctx = singletonContexts[name];
  if (!ctx) {
    ctx = new SingletonContext(...args);
    ctx.destroy = destroy(name);
    singletonContexts[name] = ctx;
  }
  return ctx;

  function destroy(name) {
    return () => {
      delete singletonContexts[name];
    };
  }
}

export class SingletonContext {
  constructor(init = true) {
    // 是否已经初始化完成
    this._init = init;
    this._pending = false;
    // 状态
    this.status = INIT;
  }

  // 设置初始化完成
  init() {
    this._init = true;
    if (this._pending) {
      this._pending = false;
      this.start();
    }
  }

  // 反初始化完成
  uninit() {
    this._init = false;
  }

  __cmpAndSetStatus(expect, target) {
    if (expect === this.status) {
      this.status = target;
      return true;
    }
    return false;
  }

  start() {
    if (this._init) {
      if (this.__cmpAndSetStatus(INIT, RUNNING)) {
        return true;
      }
      this.__cmpAndSetStatus(RUNNING, RUNNING_WITH_PENDING);
    } else {
      this._pending = true;
    }
    return false;
  }

  stop() {
    this.status = INIT;
  }

  done() {
    if (this.__cmpAndSetStatus(RUNNING, INIT)) {
      return true;
    }
    this.__cmpAndSetStatus(RUNNING_WITH_PENDING, RUNNING);
    return false;
  }

  is_pending() {
    return !this.done();
  }

  run(f) {
    if (this.start()) {
      do {
        try {
          f();
        } catch(err) {
          this.stop();
          throw err;
        }
      } while(this.is_pending());
    }
  }
}
