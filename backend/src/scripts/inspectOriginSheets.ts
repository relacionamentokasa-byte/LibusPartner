import * as XLSX from 'xlsx';

const pathOrig = 'C:/Users/Ariel Matos/Desktop/Depara de Produtos Libus - 2024 -.xlsx';
const wb = XLSX.readFile(pathOrig);
console.log('Abas da planilha original:', wb.SheetNames);
