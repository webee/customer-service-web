const INIT = Symbol('INIT');
const RUNNING = Symbol('RUNNING');
const RUNNING_WITH_PENDING = Symbol('RUNNING_WITH_PENDING');

export class SingletonWorker {
  constructor(f, data = undefined, init = true) {
    // 是否已经初始化完成
    this._init = init;
    this._pending = false;
    // 状态
    this.status = INIT;
    // 任务函数
    this.f = f;
    // 数据参数
    this.data = data;
  }

  // 设置初始化完成
  init(...args) {
    this._init = true;
    if (this._pending) {
      this._pending = false;
      this.start(...args);
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

  _try_start() {
    if (this._init) {
      if (this.__cmpAndSetStatus(INIT, RUNNING)) {
        return true;
      }
      this.cmpAndSetStatus(RUNNING, RUNNING_WITH_PENDING);
    } else {
      this._pending = true;
    }
    return false;
  }

  _done() {
    this.__cmpAndSetStatus(RUNNING_WITH_PENDING, RUNNING);
    return this.__cmpAndSetStatus(RUNNING, INIT);
  }

  async start(...args) {
    if (this._try_start()) {
      do {
        let r = this.f(this.data, ...args);
        if (r instanceof Promise) {
          try {
            r = await r;
          } catch (err) {
            r = undefined;
            console.error("SingletonWorker", err);
          }
        }
        if (r !== undefined) {
          // 更新数据参数
          this.data = r;
        }
      } while (!this._done());
    }
  }
}
