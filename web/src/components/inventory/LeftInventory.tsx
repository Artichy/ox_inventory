import React from 'react';
import InventoryGrid from './InventoryGrid';
import { useAppSelector } from '../../store';
import { selectLeftInventory } from '../../store/inventory';
import { motion } from "motion/react"

const LeftInventory = React.forwardRef<HTMLDivElement>((_props, ref) => {
  const leftInventory = useAppSelector(selectLeftInventory);

  return <motion.div layout ref={ref}
    className='inventory-grid-root'
    initial={{ opacity: 0, y: 300 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 300 }}>
      
    <InventoryGrid inventory={leftInventory} />
  </motion.div>
});

export default LeftInventory;
