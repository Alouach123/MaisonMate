
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Product, ProductFormData } from '@/types';
import ProductTable from './product-table';
import ProductForm from './product-form';
import { Button } from '@/components/ui/button';
import { getProductsAction, addProductAction, updateProductAction, deleteProductAction } from '@/app/admin/actions';
import { toast } from '@/hooks/use-toast';
import { Loader2, LogOut, PlusCircle, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";


interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  
  const [showProductForm, setShowProductForm] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedProducts = await getProductsAction();
      setProducts(fetchedProducts);
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de charger les produits." });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleEdit = (product: Product) => {
    setProductToEdit(product);
    setShowProductForm(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.")) {
      return;
    }
    setDeletingProductId(productId);
    try {
      const result = await deleteProductAction(productId);
      if (result.success) {
        toast({ title: "Produit supprimé !", description: "Le produit a été retiré de la liste." });
        fetchProducts(); // Refresh product list
      } else {
        toast({ variant: "destructive", title: "Erreur", description: result.error || "Impossible de supprimer le produit." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: "Une erreur est survenue lors de la suppression." });
    } finally {
      setDeletingProductId(null);
    }
  };
  
  const handleOpenAddForm = () => {
    setProductToEdit(null);
    setShowProductForm(true);
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    let result;
    if (productToEdit && productToEdit.id) { // Editing existing product
      result = await updateProductAction({ ...data, id: productToEdit.id });
    } else { // Adding new product
      result = await addProductAction(data);
    }
    setIsSubmitting(false);

    if (result.success) {
      setShowProductForm(false);
      setProductToEdit(null);
      fetchProducts(); // Refresh product list
    }
    return result; // Return result for ProductForm to handle toast
  };

  const handleCancelForm = () => {
    setShowProductForm(false);
    setProductToEdit(null);
  };


  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Tableau de Bord Admin</h1>
        <div className="flex gap-2">
            <Button variant="outline" onClick={fetchProducts} disabled={isLoading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Actualiser
            </Button>
            <Button onClick={onLogout} variant="outline">
                <LogOut className="mr-2 h-4 w-4" /> Déconnexion
            </Button>
        </div>
      </div>

      <div className="mb-6 flex justify-end">
        <Button onClick={handleOpenAddForm} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un produit
        </Button>
      </div>

      {isLoading && !showProductForm ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <ProductTable products={products} onEdit={handleEdit} onDelete={handleDelete} isLoadingDelete={deletingProductId} />
      )}
      
      <Dialog open={showProductForm} onOpenChange={(open) => { if (!open) handleCancelForm(); else setShowProductForm(true);}}>
        <DialogContent className="max-w-3xl p-0">
            {/* ProductForm is rendered inside DialogContent for modal behavior */}
            {/* We pass a key to ProductForm to force re-mount and reset when productToEdit changes */}
            <ProductForm
                key={productToEdit ? productToEdit.id : 'new'} 
                productToEdit={productToEdit}
                onFormSubmit={handleFormSubmit}
                onCancel={handleCancelForm}
                isLoading={isSubmitting}
            />
        </DialogContent>
      </Dialog>

    </div>
  );
}
