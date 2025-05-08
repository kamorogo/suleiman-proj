export function Table({ children, ...props }) {
  return (
    <div className="table-container" {...props}>
      <table>{children}</table>
    </div>
  );
}

export function TableCaption({ children }) {
  return <caption>{children}</caption>;
}

export function TableHeader({ children }) {
  return <thead>{children}</thead>;
}

export function TableBody({ children }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({ children }) {
  return <tr>{children}</tr>;
}

export function TableHead({ children }) {
  return <th>{children}</th>;
}

export function TableCell({ children }) {
  return <td>{children}</td>;
}

