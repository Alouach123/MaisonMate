
// src/app/actions/orderActions.ts
'use server';

import { connectToDatabase } from '@/lib/mongodb';
import type { OrderDocument, OrderAppView, CartItem, ShippingAddress, OrderItem } from '@/types';
import type { User } from '@supabase/supabase-js';

// Helper to serialize an order document
function serializeOrder(doc: OrderDocument | null): OrderAppView | null {
  if (!doc) return null;
  const { _id, orderDate, ...rest } = doc;
  return {
    ...rest,
    id: _id.toString(),
    orderDate: orderDate.toISOString(),
  };
}

interface AddOrderPayload {
  currentUser: User | null; // From useAuth()
  cartItems: CartItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
}

export async function addOrderAction(payload: AddOrderPayload): Promise<{ success: boolean; orderId?: string; error?: string }> {
  const { currentUser, cartItems, totalAmount, shippingAddress } = payload;

  if (!cartItems || cartItems.length === 0) {
    return { success: false, error: "Le panier est vide." };
  }

  try {
    const db = await connectToDatabase();
    const ordersCollection = db.collection<Omit<OrderDocument, '_id'>>('orders');

    // Transform CartItem[] to OrderItem[] for storage, if needed (more lightweight)
    const orderItems: OrderItem[] = cartItems.map(item => ({
      productId: item.id, // Assuming CartItem.id is the product's original ID
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      imageUrl: item.imageUrl, // Optional: store for quick display in admin if needed
    }));

    const newOrderData: Omit<OrderDocument, '_id'> = {
      userId: currentUser?.id,
      userEmail: currentUser?.email,
      items: orderItems,
      totalAmount: totalAmount,
      shippingAddress: shippingAddress,
      orderDate: new Date(),
      status: 'En attente', // Default status for COD
    };

    const result = await ordersCollection.insertOne(newOrderData);

    if (!result.insertedId) {
      return { success: false, error: "Échec de l'enregistrement de la commande dans la base de données." };
    }

    return { success: true, orderId: result.insertedId.toString() };
  } catch (error) {
    console.error("Error adding order:", error);
    return { success: false, error: "Une erreur s'est produite lors de l'enregistrement de la commande." };
  }
}

export async function getOrdersAction(): Promise<OrderAppView[]> {
  try {
    const db = await connectToDatabase();
    const ordersCollection = db.collection<OrderDocument>('orders');
    
    // Fetch all orders, sort by most recent
    const orderDocs = await ordersCollection.find({}).sort({ orderDate: -1 }).toArray();
    return orderDocs.map(doc => serializeOrder(doc)).filter(o => o !== null) as OrderAppView[];
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }
}
