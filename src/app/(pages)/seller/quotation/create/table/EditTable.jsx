import { useMemo } from "react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { MdDelete } from "react-icons/md";

const EditTable = ({ data, onItemChange, onRemoveItem }) => {
    const columns = useMemo(() => [
      {
        header: "Description",
        accessorKey: "description",
        cell: ({ row, getValue }) => (
          <input
            type="text"
            value={getValue() || ""}
            onChange={(e) => onItemChange(row.index, "description", e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Service description"
          />
        ),
      },
      {
        header: "Price",
        accessorKey: "price",
        cell: ({ row, getValue }) => (
          <input
            type="number"
            value={getValue() || 0}
            onChange={(e) => onItemChange(row.index, "price", parseFloat(e.target.value))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.00"
          />
        ),
      },
      {
        header: "Quantity",
        accessorKey: "quantity",
        cell: ({ row, getValue }) => (
          <input
            type="number"
            value={getValue() || 1}
            onChange={(e) => onItemChange(row.index, "quantity", parseInt(e.target.value))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="1"
          />
        ),
      },
      {
        header: "Total",
        accessorKey: "total",
        cell: ({ row }) => {
          const price = parseFloat(row.original.price || 0);
          const quantity = parseInt(row.original.quantity || 1);
          const total = (price * quantity).toFixed(2);
          return <span className="font-medium">${total}</span>;
        },
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => (
          <button
            onClick={() => onRemoveItem(row.index)}
            className="text-red-600 hover:text-red-900"
          >
            <MdDelete size={20} />
          </button>
        ),
      },
    ], [onItemChange, onRemoveItem]);
  
    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
    });
  
    return (
      <div className="w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th 
                    key={header.id}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

export default EditTable;
