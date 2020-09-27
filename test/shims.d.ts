// Declare the type definition for '*.vue'
// https://github.com/vuejs/vue-next-webpack-preview/issues/5#issuecomment-579823346
declare module '*.vue' {
  import { ComponentOptions } from 'vue';
  // *.vue files only export object-format components in v3
  const component: ComponentOptions;
  export default component;
}
