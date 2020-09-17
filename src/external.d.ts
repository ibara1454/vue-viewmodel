import type Vue from 'vue';
import type { ComponentPublicInstance, VNode } from 'vue';
import type { ViewModelStore } from './viewmodel';

type Data = {
  [key: string]: unknown;
};

type ComponentInstance = ComponentPublicInstance;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SetupContext {
  // The content is not necessary.
}

declare type SetupFunction<Props, RawBindings = {}> = (
  this: void,
  props: Props,
  ctx: SetupContext,
) => RawBindings | (() => VNode | null) | void;

// declare module '@vue/runtime-core' {
//   interface ComponentPublicInstance {
//     getViewModelStore: () => ViewModelStore;

//     $viewModelStore?: ViewModelStore;
//   }
// }
