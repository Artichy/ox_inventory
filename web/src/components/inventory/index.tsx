import React, { useState, useEffect } from 'react';
import useNuiEvent from '../../hooks/useNuiEvent';
import InventoryControl from './InventoryControl';
import InventoryHotbar from './InventoryHotbar';
import { useAppDispatch, useAppSelector } from '../../store';
import { refreshSlots, setAdditionalMetadata, setupInventory, selectRightInventory } from '../../store/inventory';
import { useExitListener } from '../../hooks/useExitListener';
import type { Inventory as InventoryProps } from '../../typings';
import RightInventory from './RightInventory';
import LeftInventory from './LeftInventory';
import Tooltip from '../utils/Tooltip';
import { closeTooltip } from '../../store/tooltip';
import InventoryContext from './InventoryContext';
import { closeContextMenu } from '../../store/contextMenu';
import Fade from '../utils/transitions/Fade';
import { AnimatePresence, MotionConfig } from "motion/react"

const Inventory: React.FC = () => {
  const [inventoryVisible, setInventoryVisible] = useState(false);
  const [rightInventoryVisible, setRightInventoryVisible] = useState(false);
  const rightInventory = useAppSelector(selectRightInventory);
  const dispatch = useAppDispatch();
  const spring = {
    type: "spring",
    damping: 30,
    stiffness: 290
  };

  useNuiEvent<boolean>('setInventoryVisible', setInventoryVisible);
  useNuiEvent<false>('closeInventory', () => {
    setInventoryVisible(false);
    dispatch(closeContextMenu());
    dispatch(closeTooltip());
  });
  useExitListener(setInventoryVisible);

  useNuiEvent<{
    leftInventory?: InventoryProps;
    rightInventory?: InventoryProps;
  }>('setupInventory', (data) => {
    dispatch(setupInventory(data));
    !inventoryVisible && setInventoryVisible(true);
  });

  useNuiEvent('refreshSlots', (data) => dispatch(refreshSlots(data)));

  useNuiEvent('displayMetadata', (data: Array<{ metadata: string; value: string }>) => {
    dispatch(setAdditionalMetadata(data));
  });

  useEffect(() => {
    const isEmptyDrop = rightInventory.type == 'newdrop' && !rightInventory.items.find(item => item.count && item.count > 0)
    setRightInventoryVisible(!isEmptyDrop)

  }, [rightInventoryVisible, rightInventory.id, rightInventory.items]);

  return (
    <MotionConfig transition={spring}>
      <Fade in={inventoryVisible}>
        <div className="inventory-wrapper">
          <InventoryControl />
          <div className="inventory-inner-wrapper">
            <AnimatePresence mode='popLayout'>
              <LeftInventory key="left" />
              {rightInventoryVisible && <RightInventory key="right" />}
              <Tooltip key="tooltip" />
              <InventoryContext key="context" />
            </AnimatePresence>
          </div>
        </div>
      </Fade>
      <InventoryHotbar />
    </MotionConfig>
  );
};

export default Inventory;
