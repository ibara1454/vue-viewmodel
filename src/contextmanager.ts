import { VueComponentInstance } from './types';

class ContextManager {
  currentContext = null as VueComponentInstance | null;

  setCurrentContext(instance: VueComponentInstance | null): void {
    // console.log('current context:', instance);
    this.currentContext = instance;
  }

  getCurrentContext(): VueComponentInstance | null {
    return this.currentContext;
  }

  fooCurrentContext(): VueComponentInstance {
    const context = this.getCurrentContext();
    if (!context) {
      throw new Error(
        "Current vue instance is null. Did you called method before 'setup'?",
      );
    }
    return context;
  }

  withContext<T>(vm: VueComponentInstance, fn: () => T): T {
    const context = this.getCurrentContext();
    this.setCurrentContext(vm);
    try {
      return fn();
    } finally {
      this.setCurrentContext(context);
    }
  }
}

export default ContextManager;
