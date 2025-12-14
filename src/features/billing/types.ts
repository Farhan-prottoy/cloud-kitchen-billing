
export type BillType = 'Corporate' | 'Event';

export interface LineItem {
  id: string;
  description: string; // "Package Name" or "Service Date"
  quantity: number; // "Number of Persons"
  unitPrice: number;
  total: number;
  // Specific for Corporate:
  serviceDate?: string; 
  packageType?: string; // Economy, Standard, Premium
  // Specific for Event:
  packageName?: string;
}

export interface Bill {
  id: string;
  type: BillType;
  clientName: string; // Corporate Name or Event Name
  contactPerson: string;
  contactNumber: string;
  date: string; // Billing Date or Event Date
  items: LineItem[];
  grandTotal: number;
  createdAt: string;
}

export interface BillingState {
  bills: Bill[];
  packages: {
    name: string;
    price: number;
  }[];
}
