export interface NavItem {
  title: string;
  link?: string;
  icon: string;
  items?: Array<{
    label: string;
    link: string;
    icon?: string;
    subitems?: Array<{
      label: string;
      link: string;
    }>;
  }>;
}

export const navItems: NavItem[] = [
  {
    title: "Vender",
    link: "#",
    icon: "mdi mdi-sale",
  },
  {
    title: "Dashboard",
    link: "/",
    icon: "mdi mdi-desktop-mac-dashboard",
  },
  {
    title: "POS",
    icon: "fas fa-cash-register",
    items: [
      { label: "Cajas", link: "#" },
      { label: "Notas Credito", link: "" },
      { label: "Notas Debito", link: "" },
      { label: "Devoluciones", link: "" },
    ],
  },
  {
    title: "Terceros",
    icon: "fa fa-users",
    items: [
      { label: "Clientes", link: "/customers" },
      { label: "Proveedores", link: "#" },
    ],
  },
  {
    title: "Inventario",
    icon: "fas fa-boxes",
    items: [
      {
        label: "Bodegas",
        link: "#",
        subitems: [
          {
            label: "Traslados",
            link: "#",
          },
        ],
      },
      { label: "Productos", link: "" },
      { label: "Movimientos", link: "" },
      { label: "Compras", link: "" },
    ],
  },
  {
    title: "Reportes",
    icon: "mdi mdi-finance",
    items: [{ label: "Balance General", link: "#" }],
  },
];
