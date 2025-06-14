export interface ItemNode {
  id?: number | null;
  id_parent?: number | null;
  name: string;
  icon?: string;
  color?: string;
  status: string;
  children?: ItemNode[];

  edit?: boolean;
  delete?: string | any | false;
  modal_target?: string;
}
