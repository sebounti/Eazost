import { create } from 'zustand';


interface Order {
  order_id: number;
  uuid: string;
  users_id: string;
  status: string;
  payment_status: string;
  amount: number;
  created_at: Date;
  updated_at: Date;
}

interface OrderStore {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: (accommodationId: number) => Promise<void>;
  addOrder: (order: Order) => Promise<void>;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  isLoading: false,
  error: null,
  fetchOrders: async (accommodationId) => {
	const mockOrders: Order[] = [
		{
			order_id: 1,
			uuid: "uuid-1",
			users_id: "user-1",
			status: "pending",
			payment_status: "pending",
			amount: 100,
			created_at: new Date(),
			updated_at: new Date()
		},
		{
			order_id: 2,
			uuid: "uuid-2",
			users_id: "user-2",
			status: "completed",
			payment_status: "completed",
			amount: 100,
			created_at: new Date(),
			updated_at: new Date()
		}
	];
	set({ orders: mockOrders, isLoading: false, error: null });
  },
  addOrder: async (order) => {
    console.log("addOrder", order);
  },
}));
