import { useEffect, useState } from 'react'
import { read, utils } from 'xlsx';

export const App = () => {
  const [excelData, setExcelData] = useState<unknown[]>();
  useEffect(() => {
    readFile();
  }, []);

  const readFile = async () => {
    const file = await fetch('https://docs.sheetjs.com/pres.numbers');
    const arrayBuffer = await file.arrayBuffer();

    const workbook = read(arrayBuffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = utils.sheet_to_json(worksheet);

    setExcelData(data);
  }

  return (
    <div>
      <pre>{JSON.stringify(excelData)}</pre>
    </div>
  )
}
