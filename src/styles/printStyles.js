export const PRINT_STYLES = `
  @media print {
    @page { margin: 1cm; size: auto; }
    body * { visibility: hidden; }
    #printable-content, #printable-content * { visibility: visible; }
    #printable-content { position: absolute; left: 0; top: 0; width: 100%; background: white !important; color: black !important; }
    .no-print, .print\\:hidden { display: none !important; }
    .bg-slate-50, .bg-white, .dark\\:bg-slate-900, .dark\\:bg-slate-800 { background-color: white !important; border: none !important; }
    td, th, p, span, h1, h2, h3 { color: black !important; }
    .overflow-x-auto { overflow: visible !important; }
    table { width: 100% !important; border-collapse: collapse; }
    th, td { border: 1px solid #ddd !important; padding: 8px !important; }
  }
`;
