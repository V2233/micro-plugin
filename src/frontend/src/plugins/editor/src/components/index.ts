import type { App } from 'vue';
import Chart from './basic/chart/Chart.vue';
import Rect from './basic/Rect.vue';
import Area from './editor/Area.vue';
import GridRect from './editor/GridRect.vue';
import Group from './editor/Group.vue';
import MarkLine from './editor/MarkLine.vue';
import TextEditor from './editor/TextEditor.vue';
import ElIconWrapper from './icon/icon.vue';
export { Area, GridRect, Group, MarkLine, TextEditor };
export default {
  install: (app: App) => {
    app.component('es-chart', Chart);
    app.component('v-rect', Rect);
    app.component('es-icon', ElIconWrapper);
    app.component('es-group', Group);
  },
};
