export interface ReservaForm {
  id: number;
  customerName: string;
  customerPhone: string;
  guests: number;
  date: string;
  time: string;
  tableId: string;
  status: string;
}

export interface ReservaRequest {

  customerName: string;
  customerPhone: string;
  guests: number;
  date: string;
  time: string;
  tableId: string;
  status: string;
}

