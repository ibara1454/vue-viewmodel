import type { App, Component, ComponentPublicInstance } from 'vue';
import type { ViewModelStoreOwner } from './viewmodel';

export type VueComponentInstance = ComponentPublicInstance &
  ViewModelStoreOwner;
export type VueConstructor = Component;

export type VueApp = App;
