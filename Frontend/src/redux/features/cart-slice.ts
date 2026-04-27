import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type InitialState = {
  items: CartItem[];
};

type CartItem = {
  id: string | number; // 👈 UBAH: Mendukung format UUID dari Laravel
  title: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
  customizations?: any;
};

const initialState: InitialState = {
  items: [],
};

export const cart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // 👇 FUNGSI BARU UNTUK SINKRONISASI DATABASE 👇
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload; // Menimpa memori lama dengan data fresh dari database
    },
    
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const { id, title, price, quantity, discountedPrice, imgs, customizations } =
        action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id,
          title,
          price,
          quantity,
          discountedPrice,
          imgs,
          customizations, // 👈 Tambahkan ini agar data kustomisasi tidak hilang
        });
      }
    },
    removeItemFromCart: (state, action: PayloadAction<string | number>) => { // 👈 Sesuaikan tipe id
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);
    },
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ id: string | number; quantity: number }> // 👈 Sesuaikan tipe id
    ) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity = quantity;
      }
    },

    removeAllItemsFromCart: (state) => {
      state.items = [];
    },
    clearCart: (state) => {
    state.items = []; // Mengosongkan array items
  },
  },
});

export const selectCartItems = (state: RootState) => state.cartReducer.items;

export const selectTotalPrice = createSelector([selectCartItems], (items) => {
  return items.reduce((total, item) => {
    return total + item.discountedPrice * item.quantity;
  }, 0);
});

export const {
  setCartItems, // 👈 JANGAN LUPA EXPORT FUNGSI BARU INI
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  removeAllItemsFromCart,
  clearCart,
} = cart.actions;
export default cart.reducer;