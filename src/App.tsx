import { useEffect, useState } from 'react'
import { read, utils } from 'xlsx';

export const App = () => {
  const [excelData, setExcelData] = useState<{rows: any[], columns: {key: string; name: string}[]}>();
  const [highlight, setHighlight] = useState<boolean>(false);
  useEffect(() => {
    readFile();
  }, []);

  const readFile = async () => {
    const file = await fetch('https://docs.sheetjs.com/pres.numbers');
    const arrayBuffer = await file.arrayBuffer();

    const workbook = read(arrayBuffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = utils.sheet_to_json(worksheet, { header: 1 });

    const range = utils.decode_range(worksheet["!ref"] || "A1");
    const columns = Array.from({ length: range.e.c + 1 }, (_, i) => ({
      key: String(i),
      name: utils.encode_col(i)
    }));

    setExcelData({rows, columns});
  }

  const renderTextWithHiglight = (columnData: any): string | JSX.Element => {
    if(columnData.toString().includes('Bill')) {
      const indexWord = columnData.indexOf('Bill');
      const otherWords = columnData.split('Bill').join('');
      return (
        <>
          <span className='bg-yellow-500'>{columnData.toString().substring(4, indexWord)}</span>{otherWords}
        </>
      );
    }
    return columnData;
  }

  return (
    <div>
      <button className='border border-gray-400 rounded p-2 mb-4' onClick={() => setHighlight(!highlight)}>Highlight "Bill"</button>
      <table className='min-w-min border border-gray-400'>
        <thead className='bg-gray-300 border border-gray-400'>
          <tr>
            <th className='border border-gray-400'></th>
            {excelData?.columns.map((column) => (
              <th className='border border-gray-400' key={column.key}>{column.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {excelData?.rows.map((row, i) => (
            <tr key={i}>
              <th className='bg-gray-300 border border-gray-400'>{i + 1}</th>
              {row.map((col: any, j: number) => (
                <th className='border border-gray-400 font-normal' key={j}>{highlight ? renderTextWithHiglight(col) : col}</th>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
