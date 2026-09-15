import * as XLSX from 'xlsx';

const pathOrig = 'C:/Users/Ariel Matos/Desktop/Depara de Produtos Libus - 2024 -.xlsx';
const wb = XLSX.readFile(pathOrig);

for (const name of wb.SheetNames) {
  if (name === 'Hoja24') continue;
  const sheet = wb.Sheets[name];
  const matrix: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  console.log(`\n========================================`);
  console.log(`ABA: "${name}"`);
  for (let r = 0; r < Math.min(10, matrix.length); r++) {
    const row = matrix[r];
    if (row && row.some(Boolean)) {
      console.log(`  Row ${r+1}: ${JSON.stringify(row)}`);
    }
  }
}
