import type { App, ComponentPublicInstance } from 'vue';
import { ViewModelStoreOwner } from './viewmodel';

export type VueComponentInstance = ComponentPublicInstance &
  ViewModelStoreOwner;

export type VueApp = App;
