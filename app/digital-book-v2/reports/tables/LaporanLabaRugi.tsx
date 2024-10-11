import React from 'react';
// import { dataLaporanLabaRugi } from '../dummy-data/laporanLabaRugi';

const LaporanLabarugi = ({ dataLaporanLabaRugi }) => {
  const { institution, document_name, date, data } = dataLaporanLabaRugi;
  let rowNumber = 1; // Initialize row number

  return (
    <div className="p-1 text-base min-w-screen w-full">
      <h1 className="font-bold text-center">{institution}</h1>
      <h2 className="font-semibold text-center">{document_name}</h2>
      <h3 className="text-center">{date}</h3>

      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr>
            <th className="border border-gray-300 p-[4px] w-1/12"></th>
            <th className="border border-gray-300 p-[4px] w-7/12"></th>
            <th className="border border-gray-300 p-[4px] w-4/12"></th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => (
            <React.Fragment key={index}>
              {/* Main Item Row */}
              <tr>
                <td className="border border-gray-300 p-[4px] font-bold">{rowNumber++}</td> {/* Increment row number */}
                <td className="border border-gray-300 p-[4px] font-bold">{item.name}</td>
                <td className="border border-gray-300 p-[4px]"></td>
              </tr>
              {item.items.map((subItem, subIndex) => (
                <tr key={subIndex}>
                  <td className="border border-gray-300 p-[4px]">{rowNumber++}</td>
                  <td className="border border-gray-300 p-[4px] pl-4">{subItem.name}</td>
                  <td className="border border-gray-300 p-[4px]">
                    <div className="flex items-center justify-between">
                      <span>Rp</span>
                      <span>{subItem.amount > 0 ? `${subItem.amount.toLocaleString('id-ID')}` : '-'}</span>
                    </div>
                  </td>
                </tr>
              ))}
              {/* Total for the main item */}
              <tr className="bg-violet-50">
                <td className="border border-gray-300 p-[4px]">{rowNumber++}</td>
                <td className="border border-gray-300 p-[4px] pl-8 font-semibold">{item.total.name}</td>
                <td className="border border-gray-300 p-[4px]">
                  <div className="flex items-center justify-between">
                    <span>Rp</span>
                    <span>{`${item.total.amount.toLocaleString('id-ID')}`}</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-[4px]"></td>
                <td className="border border-gray-300 p-[4px] font-semibold"></td>
                <td className="border border-gray-300 p-[4px]"></td>
              </tr>
            </React.Fragment>
          ))}
          {/* Total for all items */}
          <tr className="bg-violet-100">
            <td className="border border-gray-300 p-[4px] font-bold">{rowNumber}</td> {/* Increment for total row */}
            <td className="border border-gray-300 p-[4px] font-bold">{data.total.name}</td>
            <td className="border border-gray-300 p-[4px]">
              <div className="flex items-center justify-between">
                <span>Rp</span>
                <span>{data.total.amount > 0 ? `${data.total.amount.toLocaleString('id-ID')}` : '-'}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LaporanLabarugi;
