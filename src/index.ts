import { VueComponentInstance, VueApp } from './types';
import { ViewModelStore } from './viewmodel';
import ContextManager from './contextmanager';

function onBeforeCreate(this: VueComponentInstance) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const vm = this;
  const $options = vm.$options;
  const { render, setup } = $options;
  if (render) {
    // eslint-disable-next-line arrow-body-style
    $options.render = (...args: [any, any]) => {
      // console.log(`before ${vm.$options.name || 'no name'} render`);
      const result = ContextManager.withContext(vm, () =>
        render.apply(vm, args),
      );
      // console.log(`after ${vm.$options.name || 'no name'} render`);
      return result;
    };
  }

  if (setup) {
    // eslint-disable-next-line arrow-body-style
    $options.setup = (props, ctx) => {
      // console.log(`before ${vm.$options.name || 'no name'} setup`);
      const result = ContextManager.withContext(vm, () => setup(props, ctx));
      // console.log(`after ${vm.$options.name || 'no name'} setup`);
      return result;
    };
  }
}

/**
 * Releases resources before the component is destroyed.
 * @param this - The current vue instance.
 */
function onBeforeDestroy(this: VueComponentInstance): void {
  const viewModelStore = this.getViewModelStore();
  const keys = Array.from(viewModelStore.keys());

  // Clear all existing viewModels.
  keys.forEach((key) => {
    // The viewModel is obviously existed.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const viewModel = viewModelStore.get(key)!;
    viewModel.clear();
  });
}

export default class Plugin {
  /**
   * The install method for registering the plugin.
   *
   * For applying the plugin to a Vue 3 project, it would be:
   * ```typescript
   * import { createApp } from 'vue';
   * import Plugin from 'vue-viewmodel';
   * import App from './App.vue'
   *
   * const app = createApp(App);
   * app.use(Plugin);
   * app.mount('#app');
   * ```
   *
   * And for Vue 2 project, it would be:
   * ```typescript
   * import Vue from 'vue';
   * import Plugin from 'vue-viewmodel';
   * import App from './App.vue'
   *
   * Vue.use(Plugin);
   *
   * new Vue({
   *   render: (h) => h(App),
   * }).$mount('#app');
   * ```
   *
   * For more information, see https://v3.vuejs.org/guide/plugins.html#using-a-plugin.
   *
   * @param Vue - The vue constructor function.
   */
  static install(Vue: VueApp): void {
    Vue.mixin({
      beforeCreate: onBeforeCreate,
      beforeDestroy: onBeforeDestroy,
      methods: {
        getViewModelStore(this: VueComponentInstance) {
          if (!this.$viewModelStore) {
            this.$viewModelStore = new ViewModelStore();
          }
          return this.$viewModelStore;
        },
      },
    });
  }
}

export {
  ViewModel,
  ViewModelStore,
  ViewModelStoreOwner,
  ViewModelFactory,
  ViewModelProvider,
  viewModels,
} from './viewmodel';
