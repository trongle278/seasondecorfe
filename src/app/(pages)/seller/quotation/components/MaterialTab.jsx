"use client";

import React from "react";
import { MdAdd } from "react-icons/md";
import Button from "@/app/components/ui/Buttons/Button";
import { IoIosRemove } from "react-icons/io";
import Input from "@/app/components/ui/inputs/Input";
import { formatCurrency } from "@/app/helpers";
import { AiOutlineStop, AiOutlineExclamationCircle } from "react-icons/ai";

const MaterialTab = ({
  materials,
  onMaterialChange,
  onAddMaterial,
  onRemoveMaterial,
  calculateMaterialTotal,
  register,
  control,
}) => {
  // Register all materials with react-hook-form
  React.useEffect(() => {
    materials.forEach((material, index) => {
      Object.keys(material).forEach((key) => {
        register(`materials.${index}.${key}`);
      });
    });
  }, [materials, register]);

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Material Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remove
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-500 divide-y divide-gray-200">
              {materials.length > 0 ? (
                materials.map((material, index) => (
                  <tr key={`material-${index}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Input
                        id={`materials.${index}.materialName`}
                        name={`materials.${index}.materialName`}
                        value={material.materialName || ""}
                        onChange={(e) =>
                          onMaterialChange(
                            index,
                            "materialName",
                            e.target.value
                          )
                        }
                        className="pl-3"
                        placeholder="Material name"
                        register={() => ({})}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Input
                        id={`materials.${index}.quantity`}
                        name={`materials.${index}.quantity`}
                        value={material.quantity || 0}
                        onChange={(e) =>
                          onMaterialChange(
                            index,
                            "quantity",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="pl-3"
                        min="0"
                        placeholder="0"
                        register={() => ({})}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Input
                        id={`materials.${index}.cost`}
                        name={`materials.${index}.cost`}
                        type="text"
                        value={material.cost}
                        onChange={(e) => {
                          // Store the raw input value without parsing
                          const rawValue = e.target.value;
                          //console.log(`Setting material ${index} cost to:`, rawValue);
                          onMaterialChange(index, "cost", rawValue);
                        }}
                        className="pl-3"
                        placeholder="0"
                        register={() => ({})}
                        control={control}
                      />
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {materials.length > 1 ? (
                        <Button
                          label="Remove"
                          onClick={() => onRemoveMaterial(index)}
                          className="bg-red"
                          icon={<IoIosRemove size={20} />}
                        />
                      ) : (
                        <AiOutlineStop size={20} />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No materials added. Add a new material to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Button
          label="Add Material"
          onClick={onAddMaterial}
          icon={<MdAdd size={20} />}
        />

        <div className="text-right">
          <div className="text-sm text-gray-500 mb-1">
            Total Materials Cost:
          </div>
          <div className="text-xl font-bold text-gray-900">
            {formatCurrency(calculateMaterialTotal())}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialTab;
