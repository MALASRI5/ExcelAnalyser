import React, { useMemo } from 'react';
import { useTable, useSortBy, usePagination, useGlobalFilter, Column } from 'react-table';
import { cn } from '../../lib/utils';
import Button from './Button';
import Input from './Input';
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

interface DataTableProps<T extends object> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  description?: string;
  pagination?: boolean;
  filtering?: boolean;
  className?: string;
  onRowClick?: (row: T) => void;
}

function DataTable<T extends object>({
  data,
  columns,
  title,
  description,
  pagination = true,
  filtering = true,
  className,
  onRowClick
}: DataTableProps<T>) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter }
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 }
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const pageRangeDisplayed = 5;
  const pageNumbers = useMemo(() => {
    const totalPages = pageOptions.length;
    if (totalPages <= pageRangeDisplayed) {
      return pageOptions;
    }

    const halfPageRange = Math.floor(pageRangeDisplayed / 2);
    let startPage = Math.max(pageIndex - halfPageRange, 0);
    const endPage = Math.min(startPage + pageRangeDisplayed - 1, totalPages - 1);

    if (endPage - startPage < pageRangeDisplayed - 1) {
      startPage = Math.max(endPage - pageRangeDisplayed + 1, 0);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }, [pageIndex, pageOptions.length, pageRangeDisplayed]);

  const handleGlobalFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilter(e.target.value || undefined);
  };

  return (
    <div className={cn('w-full bg-white rounded-lg overflow-hidden', className)}>
      {/* Header */}
      {(title || description || filtering) && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
              {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
            </div>
            
            {filtering && (
              <div className="w-full md:max-w-xs">
                <Input
                  value={globalFilter || ''}
                  onChange={handleGlobalFilter}
                  placeholder="Search..."
                  icon={<Search size={18} />}
                  fullWidth
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {headerGroups.map((headerGroup, hgIdx) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={hgIdx}>
                {headerGroup.headers.map((column, colIdx) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    key={colIdx}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.render('Header')}</span>
                      <span>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronUp className="h-4 w-4" />
                          )
                        ) : (
                          <Filter className="h-4 w-4 opacity-0 group-hover:opacity-50" />
                        )}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
            {page.map((row, rowIdx) => {
              prepareRow(row);
              return (
                <tr 
                  {...row.getRowProps()} 
                  key={rowIdx}
                  className={cn(
                    onRowClick ? 'cursor-pointer hover:bg-gray-50' : '',
                    'transition-colors duration-150'
                  )}
                  onClick={() => onRowClick && onRowClick(row.original)}
                >
                  {row.cells.map((cell, cellIdx) => (
                    <td
                      {...cell.getCellProps()}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      key={cellIdx}
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pageCount > 1 && (
        <div className="px-6 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 bg-gray-50">
          <div className="flex items-center text-sm text-gray-500 mb-4 sm:mb-0">
            <span>
              Showing{' '}
              <span className="font-medium">{pageIndex * pageSize + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min((pageIndex + 1) * pageSize, data.length)}
              </span>{' '}
              of <span className="font-medium">{data.length}</span> results
            </span>
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
              }}
              className="ml-2 border-gray-300 rounded-md text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              {[10, 25, 50, 100].map(size => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              size="sm"
              variant="outline"
              icon={<ChevronLeft className="h-4 w-4" />}
              aria-label="Previous page"
            />
            
            {pageNumbers.map(number => (
              <Button
                key={number}
                onClick={() => gotoPage(number)}
                variant={pageIndex === number ? 'primary' : 'outline'}
                size="sm"
                className={pageIndex === number ? '' : 'text-gray-600'}
              >
                {number + 1}
              </Button>
            ))}
            
            <Button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              size="sm"
              variant="outline"
              icon={<ChevronRight className="h-4 w-4" />}
              aria-label="Next page"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;