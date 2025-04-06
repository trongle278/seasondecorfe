"use client";

import React from "react";
import { MdAdd } from "react-icons/md";
import Button from "@/app/components/ui/Buttons/Button";
import Input from "@/app/components/ui/inputs/Input";
import { IoIosRemove } from "react-icons/io";
import { formatCurrency } from "@/app/helpers";
import { AiOutlineStop, AiOutlineExclamationCircle } from "react-icons/ai";

const ConstructionTab = ({
  constructionTasks,
  onTaskChange,
  onAddTask,
  onRemoveTask,
  calculateConstructionTotal,
  register,
  control,
}) => {
  // Register all tasks with react-hook-form
  React.useEffect(() => {
    constructionTasks.forEach((task, index) => {
      Object.keys(task).forEach((key) => {
        register(`constructionTasks.${index}.${key}`);
      });
    });
  }, [constructionTasks, register]);

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Length
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Width
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remove
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-500 divide-y divide-gray-200">
              {constructionTasks.length > 0 ? (
                constructionTasks.map((task, index) => (
                  <tr key={`task-${index}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Input
                        id={`constructionTasks.${index}.taskName`}
                        name={`constructionTasks.${index}.taskName`}
                        value={task.taskName || ""}
                        onChange={(e) =>
                          onTaskChange(index, "taskName", e.target.value)
                        }
                        className="pl-3"
                        placeholder="Task name"
                        register={() => ({})}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Input
                        id={`constructionTasks.${index}.cost`}
                        name={`constructionTasks.${index}.cost`}
                        type="text" 
                        pattern="^\d+(\.\d{1,2})?$"
                        maxLength="10"
                        value={task.cost}
                        onChange={(e) => {
                          // Store the raw input value without parsing
                          const rawValue = e.target.value;
                          //console.log(`Setting task ${index} cost to:`, rawValue);
                          onTaskChange(index, "cost", rawValue);
                        }}
                        className="pl-3"
                        placeholder="0"
                        register={() => ({})}
                        control={control}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Input
                        id={`constructionTasks.${index}.unit`}
                        name={`constructionTasks.${index}.unit`}
                        value={task.unit || ""}
                        onChange={(e) =>
                          onTaskChange(index, "unit", e.target.value)
                        }
                        className="pl-3"
                        placeholder="Unit"
                        register={() => ({})}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Input
                        id={`constructionTasks.${index}.length`}
                        name={`constructionTasks.${index}.length`}
                        value={task.length || 0}
                        onChange={(e) =>
                          onTaskChange(
                            index,
                            "length",
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
                        id={`constructionTasks.${index}.width`}
                        name={`constructionTasks.${index}.width`}
                        value={task.width || 0}
                        onChange={(e) =>
                          onTaskChange(
                            index,
                            "width",
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
                      {constructionTasks.length > 1 ? (
                        <Button
                          label="Remove"
                          onClick={() => onRemoveTask(index)}
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
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No construction tasks added. Add a new task to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Button
          label="Add Construction Task"
          onClick={onAddTask}
          icon={<MdAdd size={20} />}
        />

        <div className="text-right">
          <div className="text-sm text-gray-500 mb-1">
            Total Construction Cost:
          </div>
          <div className="text-xl font-bold text-gray-900">
            {formatCurrency(calculateConstructionTotal())}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConstructionTab;
