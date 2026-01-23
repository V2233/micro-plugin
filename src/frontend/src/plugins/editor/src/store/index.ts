import { defineStore } from 'pinia';
import type { ComponentType, EditorDataType } from '../types';

interface EditorState {
  data: EditorDataType;
  current: ComponentType;
  preview: boolean;
  initWidth: number;
  initHeight: number;
  theme: string;
  container?: any;
}

const defaultData = {
  container: {
    markline: {
      show: true,
      color: '',
    },
    snapToGrid: true,
    snap: true,
    gridSize: 10,
    gridColor: '',
    style: {},
    scaleRatio: 1,
  },
  elements: [],
};

export const useEditorStore = defineStore('editor', {
  state: (): EditorState => {
    return {
      data: defaultData,
      current: {
        style: {
          borderWidth: 0,
          borderRadius: 0,
          borderColor: 'gray',
        },
      },
      preview: false,
      initWidth: 1180,
      initHeight: 960,
      theme: localStorage.getItem('theme') || 'light',
    };
  },
  actions: {
    update(val: EditorDataType) {
      if (!val?.container) {
        val.container = { ...defaultData.container };
      }
      this.data = val || {};
    },
  },
});
