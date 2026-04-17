export type ProfileSummary = {
  id: string | null;
  name: string;
  email: string;
  imageSrc: string | null;
  phoneNumber: string | null;
  address: string | null;
  loginType: string | null;
  authProvider: string | null;
  isEmailVerified: boolean | null;
};

export type ProfileOrderItem = {
  id: string;
  title: string;
  quantity: number;
};

export type ProfileOrder = {
  id: string;
  orderNumber: string;
  placedAt: string | null;
  customerName: string | null;
  customerPhone: string | null;
  shippingAddress: string | null;
  subtotalAmount: number;
  deliveryFee: number;
  discountAmount: number;
  totalAmount: number;
  status: string;
  items: ProfileOrderItem[];
};

export type ProfilePageData = {
  profile: ProfileSummary;
  orders: ProfileOrder[];
};
