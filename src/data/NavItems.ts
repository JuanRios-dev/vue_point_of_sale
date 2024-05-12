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
    link: "/sales/create",
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
      { label: "Cajas", link: "/cashes" },
      { label: "Notas Credito - Proxim...", link: "#" },
      { label: "Notas Debito - Proxim...", link: "#" },
    ],
  },
  {
    title: "Terceros",
    icon: "fa fa-users",
    items: [
      { label: "Clientes", link: "/customers" },
      { label: "Proveedores", link: "/providers" },
    ],
  },
  {
    title: "Inventario",
    icon: "fas fa-boxes",
    items: [
      {
        label: "Bodegas",
        link: "/wineries",
        subitems: [
          {
            label: "Traslados",
            link: "/transfers",
          },
        ],
      },
      { label: "Productos", link: "/items" },
      { label: "Movimientos", link: "/movements" },
      { label: "Factura Proveedor", link: "/provider-invoices" },
    ],
  },
  {
    title: "Reportes",
    icon: "mdi mdi-finance",
    items: [{ label: "Balance General", link: "#" }],
  },
];
