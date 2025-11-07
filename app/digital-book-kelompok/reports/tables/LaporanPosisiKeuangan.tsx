import React from 'react';

const LaporanPosisiKeuangan = ({ dataLaporanPosisiKeuangan }) => {
  const { institution, document_name, date, data } = dataLaporanPosisiKeuangan;
  let rowNumber = 1;

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
                <td className="border border-gray-300 p-[4px] font-bold">{rowNumber++}</td>
                <td className="border border-gray-300 p-[4px] font-bold">{item.name}</td>
                <td className="border border-gray-300 p-[4px]"></td>
              </tr>
              {item.items.map((subItem, subIndex) => (
                <React.Fragment key={subIndex}>
                  <tr>
                    <td className="border border-gray-300 p-[4px]">{rowNumber++}</td>
                    <td className="border border-gray-300 p-[4px] pl-4 font-semibold">{subItem.name}</td>
                    <td className="border border-gray-300 p-[4px]"></td>
                  </tr>
                  {subItem.items &&
                    subItem.items.map((subSubItem, subSubIndex) => (
                      <tr key={subSubIndex}>
                        <td className="border border-gray-300 p-[4px]">{rowNumber++}</td>
                        <td className="border border-gray-300 p-[4px] pl-8">{subSubItem.name}</td>
                        <td className="border border-gray-300 p-[4px]">
                          <div className="flex items-center justify-between">
                            <span>Rp</span>
                            <span>{subSubItem.amount.toLocaleString('id-ID')}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  <tr>
                    <td className="border border-gray-300 p-[4px]">{rowNumber++}</td>
                    <td className="border border-gray-300 p-[4px] pl-16 font-semibold">{subItem.total.name}</td>
                    <td className="border border-gray-300 p-[4px]">
                      <div className="flex items-center justify-between">
                        <span>Rp</span>
                        <span>{subItem.total.amount.toLocaleString('id-ID')}</span>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
              {/* Total for the main item */}
              <tr>
                <td className="border border-gray-300 p-[4px]"></td>
                <td className="border border-gray-300 p-[4px]"></td>
                <td className="border border-gray-300 p-[4px]"></td>
              </tr>
              <tr className="bg-blue-100">
                <td className="border border-gray-300 p-[4px]">{rowNumber++}</td>
                <td className="border border-gray-300 p-[4px] font-bold">{item.total.name}</td>
                <td className="border border-gray-300 p-[4px]">
                  <div className="flex items-center justify-between">
                    <span>Rp</span>
                    <span>{item.total.amount.toLocaleString('id-ID')}</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-[4px]"></td>
                <td className="border border-gray-300 p-[4px]"></td>
                <td className="border border-gray-300 p-[4px]"></td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LaporanPosisiKeuangan;
