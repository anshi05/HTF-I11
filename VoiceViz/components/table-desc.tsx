"use client"
import { useState } from 'react';

interface Field {
  name: string;
  type: string;
  description: string;
}

interface TableData {
  name: string;
  fields: Field[];
}

export function TableDesc () {
  // Sample database tables data
  const databaseTables: TableData[] = [
    {
      name: 'supermarket_sales',
      fields: [
        { name: 'invoice_id', type: 'String', description: 'A unique code for each purchase.' },
        { name: 'branch', type: 'String', description: 'The location of the supermarket branch.' },
        { name: 'city', type: 'String', description: 'The city where the supermarket is located.' },
        { name: 'customer_type', type: 'String', description: 'The type of customer (e.g., member or normal).' },
        { name: 'gender', type: 'String', description: 'The gender of the customer.' },
        { name: 'product_line', type: 'String', description: 'The category of product that was sold.' },
      ],
    },
    {
      name: 'customers',
      fields: [
        { name: 'customer_id', type: 'String', description: 'Unique identifier for the customer.' },
        { name: 'name', type: 'String', description: 'Full name of the customer.' },
        { name: 'email', type: 'String', description: 'Contact email address.' },
        { name: 'join_date', type: 'Date', description: 'When the customer first registered.' },
      ],
    },
    {
      name: 'products',
      fields: [
        { name: 'product_id', type: 'String', description: 'Unique product identifier.' },
        { name: 'name', type: 'String', description: 'Product display name.' },
        { name: 'price', type: 'Number', description: 'Current selling price.' },
        { name: 'stock', type: 'Number', description: 'Quantity available in inventory.' },
      ],
    },
  ];

  const [selectedTable, setSelectedTable] = useState<TableData>(databaseTables[0]);
  const [error, setError] = useState<string | null>(null);

  const handleTableChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      const table = databaseTables.find(t => t.name === e.target.value);
      if (!table) {
        throw new Error(`Table ${e.target.value} not found`);
      }
      setSelectedTable(table);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto bg-red-50 border-l-4 border-red-500 p-4">
          <h2 className="text-xl font-bold text-red-800">Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparentp-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-6 bg-[#7E22CE]">
          <label htmlFor="table-select" className="block text-sm font-medium text-gray-700 mb-1">
            Select a table:
          </label>
          <select
            id="table-select"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            value={selectedTable.name}
            onChange={handleTableChange}
          >
            {databaseTables.map((table) => (
              <option key={table.name} value={table.name}>
                {table.name}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">{selectedTable.name}</h2>
            <p className="text-sm text-gray-500 mt-1">Columns and descriptions</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Field Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedTable.fields.map((field, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {field.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {field.type}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {field.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

