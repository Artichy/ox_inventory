import { Slot } from './slot';

export enum InventoryType {
  PLAYER = 'player',
  SHOP = 'shop',
  CONTAINER = 'container',
  CRAFTING = 'crafting',
  DROP = 'drop',
  NEWDROP = 'newdrop',
  STASH = 'stash',
  EVIDENCE = 'policeevidence',
  GLOVEBOX = 'glovebox',
  TRUNK = 'trunk',
}

export type Inventory = {
  id: string;
  type: string;
  slots: number;
  items: Slot[];
  maxWeight?: number;
  label?: string;
  groups?: Record<string, number>;
};
