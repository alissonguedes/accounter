export interface ItemNode {
  id: number;
  id_parent?: number | null;
  name: string;
  icon?: string;
  color?: string;
  children?: ItemNode[];

  edit?: boolean;
  delete?: string | any | false;
  modal_target?: string;
}
