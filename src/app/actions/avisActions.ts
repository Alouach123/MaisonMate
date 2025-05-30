
// src/app/actions/avisActions.ts
'use server';

import { connectToDatabase } from '@/lib/mongodb';
import type { Avis, AvisDocument, AvisFormData } from '@/types';
import { AvisSchema } from '@/types';
import { revalidatePath } from 'next/cache';
import type { ObjectId } from 'mongodb';

function serializeAvis(doc: AvisDocument | null): Avis | null {
  if (!doc) return null;
  const { _id, createdAt, ...rest } = doc;
  return {
    ...rest,
    id: _id.toString(),
    productName: doc.productName, // Ensure productName is serialized
    createdAt: createdAt.toISOString(),
  };
}

export async function addAvisAction(data: AvisFormData): Promise<{ success: boolean; avis?: Avis; error?: string }> {
  const validation = AvisSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.errors.map(e => e.message).join(', ') };
  }

  try {
    const db = await connectToDatabase();
    const avisCollection = db.collection<Omit<AvisDocument, '_id'>>('avis');
    
    const newAvisData: Omit<AvisDocument, '_id'> = {
      ...validation.data,
      productName: validation.data.productName, // Ensure productName is included
      createdAt: new Date(),
    };

    const result = await avisCollection.insertOne(newAvisData);
    
    if (!result.insertedId) {
      return { success: false, error: "Failed to insert avis into database." };
    }

    // Construct the Avis object for return, ensuring dates are ISO strings
    // and _id is converted to string id
    const insertedAvis: Avis = {
      ...validation.data,
      id: result.insertedId.toString(),
      productName: validation.data.productName,
      createdAt: newAvisData.createdAt.toISOString(),
    };
    
    // Revalidate the product page path to show the new comment
    revalidatePath(`/products/${data.productId}`);
    // Optionally, revalidate a path for admin if they view all reviews somewhere
    // revalidatePath('/admin/avis');
    
    return { success: true, avis: insertedAvis };
  } catch (error) {
    console.error("Error adding avis:", error);
    return { success: false, error: "An error occurred while adding the avis." };
  }
}

export async function getAvisForProductAction(productId: string): Promise<Avis[]> {
  try {
    const db = await connectToDatabase();
    const avisCollection = db.collection<AvisDocument>('avis');
    
    const avisDocs = await avisCollection.find({ productId }).sort({ createdAt: -1 }).toArray();
    return avisDocs.map(doc => serializeAvis(doc)).filter(a => a !== null) as Avis[];
  } catch (error) {
    console.error(`Failed to fetch avis for product ${productId}:`, error);
    return [];
  }
}
