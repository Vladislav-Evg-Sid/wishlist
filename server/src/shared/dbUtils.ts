export function concatTableAndColumn(
  tableName: string,
  columnName: string,
): string {
  return `${tableName}.${columnName}`;
}
