import React from 'react';

interface YearFilterProps {
    years: number[];
    selectedYears: number[];
    onChange: (years: number[]) => void;
}

export const YearFilter: React.FC<YearFilterProps> = ({ years, selectedYears, onChange }) => {
    return (
        <div className="mb-6 bg-white rounded-lg shadow-md p-6">
            <div className="font-semibold mb-3 text-gray-900 text-lg">Filtrar por ano</div>
            <div className="bg-gray-50 rounded-lg p-4 flex flex-wrap gap-4">
                {years.map(year => (
                    <label key={year} className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={selectedYears.includes(year)}
                            onChange={e => {
                                if (e.target.checked) {
                                    onChange([...selectedYears, year]);
                                } else {
                                    onChange(selectedYears.filter(y => y !== year));
                                }
                            }}
                            className="accent-blue-600"
                        />
                        <span className="text-gray-700 font-medium">{year}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};
