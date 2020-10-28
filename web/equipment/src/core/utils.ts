import color from 'color';
import { EquipmentMachineType } from 'core/api';
import { colors, ColorsSet } from 'styles';

const colorsCache: Record<string, ColorsSet> = {};

export const colorSetFromColor = (val: string): ColorsSet => {
  if (colorsCache[val]) {
    return colorsCache[val];
  }
  colorsCache[val] = {
    light: val,
    dark: color(val).darken(0.5).toString(),
  };
  return colorsCache[val];
};

export const equipmentTypeToColor = (type?: EquipmentMachineType) => {
  switch (type) {
    case EquipmentMachineType.Sweeper:
      return colors.orange;
    case EquipmentMachineType.Spreader:
      return colors.orange;
    case EquipmentMachineType.GarbageTruck:
      return colors.red;
    case EquipmentMachineType.Tractor:
      return colors.blue;
    default:
      return colors.blue;
  }
};
