type Props = {
  activePage: string;
  onPageChange: (page: string) => void;
};

const links = [
  { id: "perioder", label: "1.1 Perioder" },
  { id: "adgangsstyring", label: "1.2 Adgangsstyring" },
  { id: "afsnit", label: "1.3 Afsnit" },
  { id: "personalegrupper", label: "1.4 Personalegrupper" },
  { id: "vagtlag", label: "1.5 Vagtlag" },
  { id: "ansaettelser", label: "1.6 Ansættelser" },
  { id: "personale", label: "2.2 Personale" },
];

export function Sidebar({ activePage, onPageChange }: Props) {
  return (
    <aside className="sidebar">
      <div className="sidebar-title">Fairplan</div>

      <nav className="nav">
        {links.map((link) => (
          <button
            key={link.id}
            className={
              activePage === link.id ? "nav-link active" : "nav-link"
            }
            onClick={() => onPageChange(link.id)}
          >
            {link.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}