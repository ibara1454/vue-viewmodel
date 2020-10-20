# Vue-ViewModel: An Android-like ViewModel implementation for Vue 3.0

Vue-ViewModel is a plugin for managing states over components and lifecycles, which is inspired by [Android Jetpack ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel).

## Installation

```bash
npm install --save vue-viewmodel
```

## Usage

To use this plugin in your project, you have to apply the plugin to your application instance at first:

```typescript
import { createApp } from 'vue';
import { Plugin } from 'vue-viewmodel';
import App from './App.vue'

const app = createApp(App);
// Apply this plugin to your application.
app.use(Plugin);
app.mount('#app');
```

And write your own ViewModel class to extends `ViewModel`:

```typescript
// MyViewModel.ts
import { ref } from 'vue';
import { ViewModel } from 'vue-viewmodel';

export class MyViewModel extends ViewModel {
  count = ref(0);

  clear() {
    // Release your resources and listeners *HERE*.
  }
}
```

Finally, you can get the ViewModel scoped by the current vue instance:

```vue
// MyComponent.vue
<template></template>

import { defineComponent } from 'vue';
import { viewModels } from 'vue-viewmodel';
import MyViewModel from './MyViewModel.ts';

export default defineComponent({
  setup() {
    const viewModel = viewModels(MyViewModel);
    return { count: viewModel.count };
  }
});
```

## Documentation

TBD.

## Contribution

TBD.

## License

[MIT](./LICENSE) license.

Copyright 2020 Chiajun Wang (ibara1454).
