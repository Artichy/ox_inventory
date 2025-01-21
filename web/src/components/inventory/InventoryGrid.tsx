import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Inventory, InventoryType } from '../../typings';
import WeightBar from '../utils/WeightBar';
import InventorySlot from './InventorySlot';
import { getTotalWeight } from '../../helpers';
import { useAppSelector } from '../../store';
import { useIntersection } from '../../hooks/useIntersection';
import { faGetPocket } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAmbulance, faBox, faCar, faGun, faHouse, faScrewdriverWrench, faShop, faSnowflake, faStroopwafel, faSuitcase, faTable, faTruckRampBox, faTurnDown, faUserSecret } from '@fortawesome/free-solid-svg-icons';

const PAGE_SIZE = 30;

const InventoryGrid: React.FC<{ inventory: Inventory }> = ({ inventory }) => {
  const weight = useMemo(
    () => (inventory.maxWeight !== undefined ? Math.floor(getTotalWeight(inventory.items) * 1000) / 1000 : 0),
    [inventory.maxWeight, inventory.items]
  );
  const [page, setPage] = useState(0);
  const containerRef = useRef(null);
  const { ref, entry } = useIntersection({ threshold: 0.5 });
  const isBusy = useAppSelector((state) => state.inventory.isBusy);

  const getInventoryProps = () => {
    console.log(inventory)
    switch (inventory.type) {
      case InventoryType.PLAYER:
        return { icon: faGetPocket, label: "INVENTARIO" }
      case InventoryType.NEWDROP:
        return { icon: faTurnDown, label: "SUELO" }
      case InventoryType.DROP:
        return { icon: faTurnDown, label: "SUELO" }
      case InventoryType.SHOP:
        return { icon: faShop, label: "COMERCIO" }
      case InventoryType.CRAFTING:
        return { icon: faScrewdriverWrench, label: "ELABORACIÓN" }
      case InventoryType.CONTAINER:
        return { icon: faBox, label: "CONTENEDOR" }
      case InventoryType.EVIDENCE:
        return { icon: faUserSecret, label: "EVIDENCIAS" }
      case InventoryType.GLOVEBOX:
        return { icon: faCar, label: "GUANTERA" }
      case InventoryType.TRUNK:
        return { icon: faTruckRampBox, label: "MALETERO" }
      default:
        break;
    }

    if (inventory.id.includes("armas")) return { icon: faGun, label: "ARMERÍA" }
    if (inventory.id.includes("ambulance")) return { icon: faAmbulance, label: "AMBULANCIA" }
    if (inventory.id.includes("Refregiator")) return { icon: faSnowflake, label: "NEVERA" }
    if (inventory.id.includes("Table")) return { icon: faTable, label: "MESA" }
    if (inventory.id.includes("Tray")) return { icon: faStroopwafel, label: "BANDEJA" }
    if (inventory.id.includes("Housing")) return { icon: faHouse, label: "ALIJO PERSONAL" }
    if (inventory.id.includes("bag_")) return { icon: faSuitcase, label: "MOCHILA" }

    return { icon: faBox, label: "Alijo" }
  }

  useEffect(() => {
    if (entry && entry.isIntersecting) {
      setPage((prev) => ++prev);
    }
  }, [entry]);
  return (<>
    <div className="inventory-grid-wrapper" style={{ pointerEvents: isBusy ? 'none' : 'auto' }}>

      <div className="inventory-grid-header-wrapper">
        <div className='inventory-grid-header-container'>
          <div className='inventory-grid-header-container-row'>
            <span className='inventory-grid-header-container-title'>
              <FontAwesomeIcon icon={getInventoryProps().icon} />
              <h1>{" " + getInventoryProps().label}</h1>
            </span>
            <div>
              {inventory.maxWeight && (
                <p>
                  {weight / 1000} / {inventory.maxWeight / 1000}kg
                </p>
              )}
              <p>{inventory.label}</p>
            </div>
          </div>
          <WeightBar percent={inventory.maxWeight ? (weight / inventory.maxWeight) * 100 : 0} />
        </div>
      </div>

      <div className="inventory-grid-container" ref={containerRef}>
        <>
          {inventory.items.slice(0, (page + 1) * PAGE_SIZE).map((item, index) => (
            <InventorySlot
              key={`${inventory.type}-${inventory.id}-${item.slot}`}
              item={item}
              ref={index === (page + 1) * PAGE_SIZE - 1 ? ref : null}
              inventoryType={inventory.type}
              inventoryGroups={inventory.groups}
              inventoryId={inventory.id}
            />
          ))}
        </>
      </div>
    </div>
  </>
  );
};

export default InventoryGrid;
