# Vue-ViewModel: An Android-like ViewModel implementation for Vue 3.0

[![Version](https://img.shields.io/npm/v/vue-viewmodel)](https://www.npmjs.com/package/vue-viewmodel)
[![GitHub Actions](https://github.com/ibara1454/vue-viewmodel/workflows/build/badge.svg)](https://github.com/ibara1454/vue-viewmodel/actions?query=workflow%3Abuild)
[![codecov](https://codecov.io/gh/ibara1454/vue-viewmodel/branch/master/graph/badge.svg)](https://codecov.io/gh/ibara1454/vue-viewmodel)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/77bac24504cc4fe9a6d638251c0d912a)](https://www.codacy.com/gh/ibara1454/vue-viewmodel/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ibara1454/vue-viewmodel&amp;utm_campaign=Badge_Grade)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Vue-ViewModel is a plugin for managing states over components and lifecycles, which is inspired by [Android Jetpack ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel).

## Features

TBD.

## Installation

Install via npm:

```bash
npm install --save vue-viewmodel
```

Install via Yarn:

```bash
yarn add vue-viewmodel
```

## Usage

To use this plugin in your project, you have to apply the plugin to your application instance at first:

```typescript
import { createApp } from 'vue';
import Plugin from 'vue-viewmodel';
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

export default class MyViewModel extends ViewModel {
  count = ref(0);

  clear() {
    // Release your resources and listeners *HERE*.
  }
}
```

Finally, you can get the ViewModel scoped by the current vue instance:

```vue
<!-- MyComponent.vue -->
<template>
  <div>count: {{ count }}</div>
</template>

<script>
import { defineComponent } from 'vue';
import { viewModels } from 'vue-viewmodel';
import MyViewModel from './MyViewModel.ts';

export default defineComponent({
  setup() {
    const viewModel = viewModels(MyViewModel);
    return { count: viewModel.count };
  }
});
</script>
```

## Documentation

TBD.

## Contribution

TBD.

## License

[MIT](./LICENSE) license.

Copyright 2020 Chiajun Wang (ibara1454).
