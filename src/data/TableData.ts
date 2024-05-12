/* DATATABLES */

//CUSTOMERS
export interface Customer {
  id: number;
  tipo_documento: string;
  numero_documento: string;
  nombre_razonsocial: string;
  telefono: string;
  correo: string;
  direccion: string;
  municipio: string;
}

//PROVIDERS
export interface Provider {
  id: number;
  tipo_documento: string;
  numero_documento: string;
  nombre_razonsocial: string;
  telefono: string;
  correo: string;
  direccion: string;
  municipio: string;
  responsable_iva: boolean;
}

/* INVENTARIO */

//WINERIES
export interface Winery {
  id: number;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  predeterminada: boolean;
}

//SALES
export interface Sales {
  customer_id: number;
  codigo: string;
  fechaEmision: Date;
  metodoPago: string;
  subTotal: number;
  impuestos: number;
  total: number;
  descuento_global: number;
  valor_descuentoGlobal: number;
  descuento_total: number;
  products: [
    {
      product_id: number;
      cantidad: number;
      precio_unitario: number;
      descuento: number;
      valor_descuento: number;
      subtotal: number;
      impuestos: number;
      precio_total: number;
    }
  ];
}

/* FUNTIONS */

export interface TableData {
  [key: string]: string | number;
}

export const clearFormData = (
  formData: TableData,
  defaultValue: Partial<TableData> = {}
): void => {
  for (const key in formData) {
    if (Object.prototype.hasOwnProperty.call(formData, key)) {
      if (defaultValue[key as keyof TableData] !== undefined) {
        formData[key as keyof TableData] = defaultValue[
          key as keyof TableData
        ] as string | number;
      } else {
        formData[key as keyof TableData] = "";
      }
    }
  }
};
