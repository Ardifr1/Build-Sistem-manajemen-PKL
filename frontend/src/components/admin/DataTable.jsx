function DataTable({ headers = [], children, minWidth }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="table" style={minWidth ? { minWidth } : undefined}>
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
