function DataTable({ headers = [], headVariant = "dark", children }) {
  return (
    <div className="dt-wrap">
      <table className={`table dt-${headVariant}`}>
        {headers.length > 0 && (
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i}>{h}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
export default DataTable;
