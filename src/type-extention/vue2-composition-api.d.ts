import type Vue from 'vue2';
import type { ComponentPublicInstance, VNode } from 'vue3';
import type { ViewModelStore } from '../viewmodel';

type Data = {
  [key: string]: unknown;
};

type ComponentInstance = ComponentPublicInstance;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SetupContext {
  // The content is not necessary.
}

// eslint-disable-next-line @typescript-eslint/ban-types
declare type SetupFunction<Props, RawBindings = {}> = (
  this: void,
  props: Props,
  ctx: SetupContext,
) => RawBindings | (() => VNode | null) | void;

/**
 * The extension for composition API.
 * https://github.com/vuejs/composition-api
 */
declare module 'vue2/types/options' {
  interface ComponentOptions<V extends Vue> {
    setup?: SetupFunction<Data, Data>;
  }
}

declare module 'vue2/types/vue' {
  interface Vue {
    getViewModelStore: () => ViewModelStore;
    $viewModelStore?: ViewModelStore;
  }
}

// declare module '@vue/runtime-core' {
//   interface ComponentPublicInstance {
//     getViewModelStore: () => ViewModelStore;

//     $viewModelStore?: ViewModelStore;
//   }
// }
