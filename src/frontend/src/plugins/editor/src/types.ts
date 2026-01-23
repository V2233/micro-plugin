import { DragerProps } from 'es-drager';
import type { CSSProperties, ExtractPropTypes } from 'vue';

type DragerType = Partial<ExtractPropTypes<typeof DragerProps>>;

export type ComponentType = DragerType & {
  id?: string;
  component?: string;
  text?: string;
  group?: boolean;
  groupStyle?: any;
  props?: any;
  style?: CSSProperties;
  editable?: boolean;
};
export type EditorDataType = {
  container: {
    snapToGrid: boolean;
    snap: boolean;
    markline: {
      color?: string;
      show?: boolean;
    };
    gridSize: number;
    gridColor?: string;
    style: CSSProperties;
    scaleRatio?: number;
  };
  elements: ComponentType[];
};

export type IconType = DragerType & {
  component?: string;
  text?: string;
  style?: CSSProperties;
  props?: any;
  icon?: string;
};

export type ToolType = {
  label: string;
  icon?: any;
  handler: Function;
};

export interface EditorState {
  data: EditorDataType;
  current: ComponentType;
  preview: boolean;
}
