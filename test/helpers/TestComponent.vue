<template>
  <div>{count}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { viewModels } from '@/index';
import TestViewModel from './TestViewModel';

export default defineComponent({
  setup() {
    const viewModel = viewModels(TestViewModel);
    return {
      count: viewModel.count,
    };
  },
});
</script>
