export type ProfileSummary = {
  name: string;
  email: string;
  imageSrc: string;
};

export type ProfileOrderStatus = "processing" | "paid" | "shipped";

export type ProfileOrderItem = {
  id: string;
  title: string;
  quantity: number;
};

export type ProfileOrder = {
  id: string;
  orderNumber: string;
  placedAt: string;
  totalAmount: number;
  status: ProfileOrderStatus;
  items: ProfileOrderItem[];
};

export type ProfilePageData = {
  profile: ProfileSummary;
  orders: ProfileOrder[];
};
