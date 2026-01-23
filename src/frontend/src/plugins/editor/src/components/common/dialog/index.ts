import { type VNode, createVNode, render } from 'vue';
import { useEditorContainer } from '../../../hooks';
import Dialog from './Dialog.vue';

let vm: VNode | null = null;
export function $dialog(option: object) {
  if (!vm) {
    // 手动挂载组件
    const { container: globalContainer } = useEditorContainer();
    const container = document.createElement('div');
    vm = createVNode(Dialog, { option });

    // 将组件渲染成真实节点
    render(vm, container);

    globalContainer.appendChild(container.firstElementChild!);
  }

  const { open } = vm.component!.exposed!;
  open(option);
}
