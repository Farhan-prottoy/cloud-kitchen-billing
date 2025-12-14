import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Bill, BillingState, LineItem } from './types';

const loadState = (): Bill[] => {
  try {
    const serializedState = localStorage.getItem('billing_data');
    if (serializedState === null) {
      return [];
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return [];
  }
};

const initialState: BillingState = {
  bills: loadState(),
  packages: [
    { name: 'Economy', price: 150 },
    { name: 'Standard', price: 250 },
    { name: 'Premium', price: 450 },
  ],
};

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    addBill: (state, action: PayloadAction<Bill>) => {
      state.bills.push(action.payload);
      localStorage.setItem('billing_data', JSON.stringify(state.bills));
    },
    updateBill: (state, action: PayloadAction<Bill>) => {
      const index = state.bills.findIndex((b) => b.id === action.payload.id);
      if (index !== -1) {
        state.bills[index] = action.payload;
        localStorage.setItem('billing_data', JSON.stringify(state.bills));
      }
    },
    deleteBill: (state, action: PayloadAction<string>) => {
      state.bills = state.bills.filter((b) => b.id !== action.payload);
      localStorage.setItem('billing_data', JSON.stringify(state.bills));
    },
  },
});

export const { addBill, updateBill, deleteBill } = billingSlice.actions;
export default billingSlice.reducer;
