import React from 'react';
import InventoryGrid from './InventoryGrid';
import { useAppSelector } from '../../store';
import { selectRightInventory } from '../../store/inventory';
import { motion } from "motion/react"

const RightInventory = React.forwardRef<HTMLDivElement>((_props, ref) => {
  const rightInventory = useAppSelector(selectRightInventory);

  return <motion.div layout ref={ref}
    className='inventory-grid-root'
    initial={{ opacity: 0, y: 300 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 300 }}>

    <InventoryGrid inventory={rightInventory} />
  </motion.div>
});

export default RightInventory; 