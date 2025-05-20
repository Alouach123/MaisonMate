
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Product, ProductFormData, AdminUserView } from '@/types';
import ProductTable from './product-table';
import UserTable from './user-table';
import ProductForm from './product-form';
import { Button } from '@/components/ui/button';
import { getProductsAction, addProductAction, updateProductAction, deleteProductAction, getUsersAction, deleteUserAction } from '@/app/admin/actions';
import { toast } from '@/hooks/use-toast';
import { Loader2, LogOut, PlusCircle, RefreshCw, Users, Package, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<AdminUserView[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  
  const [showProductForm, setShowProductForm] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState("products");

  const [showDeleteUserDialog, setShowDeleteUserDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; email?: string } | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    try {
      const fetchedProducts = await getProductsAction();
      setProducts(fetchedProducts);
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de charger les produits." });
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    try {
      const fetchedUsers = await getUsersAction();
      setUsers(fetchedUsers);
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de charger les utilisateurs." });
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "products") {
      fetchProducts();
    } else if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab, fetchProducts, fetchUsers]);

  const handleEditProduct = (product: Product) => {
    setProductToEdit(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.")) {
      return;
    }
    setDeletingProductId(productId);
    try {
      const result = await deleteProductAction(productId);
      if (result.success) {
        toast({ title: "Produit supprimé !", description: "Le produit a été retiré de la liste." });
        fetchProducts(); 
      } else {
        toast({ variant: "destructive", title: "Erreur", description: result.error || "Impossible de supprimer le produit." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: "Une erreur est survenue lors de la suppression du produit." });
    } finally {
      setDeletingProductId(null);
    }
  };

  const handleOpenDeleteUserDialog = (userId: string, userEmail?: string) => {
    setUserToDelete({ id: userId, email: userEmail });
    setShowDeleteUserDialog(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    setDeletingUserId(userToDelete.id);
    setShowDeleteUserDialog(false);
    try {
      const result = await deleteUserAction(userToDelete.id);
      if (result.success) {
        toast({ title: "Utilisateur supprimé !", description: `L'utilisateur ${userToDelete.email || userToDelete.id} a été supprimé.` });
        fetchUsers();
      } else {
        toast({ variant: "destructive", title: "Erreur de suppression", description: result.error || "Impossible de supprimer l'utilisateur." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: "Une erreur est survenue lors de la suppression de l'utilisateur." });
    } finally {
      setDeletingUserId(null);
      setUserToDelete(null);
    }
  };
  
  const handleOpenAddProductForm = () => {
    setProductToEdit(null);
    setShowProductForm(true);
  };

  const handleProductFormSubmit = async (data: ProductFormData) => {
    setIsSubmittingProduct(true);
    let result;
    if (productToEdit && productToEdit.id) { 
      result = await updateProductAction({ ...data, id: productToEdit.id });
    } else { 
      result = await addProductAction(data);
    }
    setIsSubmittingProduct(false);

    if (result.success) {
      setShowProductForm(false);
      setProductToEdit(null);
      fetchProducts(); 
    }
    return result; 
  };

  const handleCancelProductForm = () => {
    setShowProductForm(false);
    setProductToEdit(null);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Tableau de Bord Admin</h1>
        <Button onClick={onLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" /> Déconnexion
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2 lg:w-1/3 mb-6">
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" /> Gestion des Produits
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Gestion des Utilisateurs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="text-2xl font-semibold">Produits</h2>
            <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={fetchProducts} disabled={isLoadingProducts}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingProducts ? 'animate-spin' : ''}`} /> Actualiser Produits
                </Button>
                <Button onClick={handleOpenAddProductForm} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un produit
                </Button>
            </div>
          </div>
          {isLoadingProducts && !showProductForm ? (
             <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
             </div>
          ) : (
            <ProductTable products={products} onEdit={handleEditProduct} onDelete={handleDeleteProduct} isLoadingDelete={deletingProductId} />
          )}
        </TabsContent>

        <TabsContent value="users">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="text-2xl font-semibold">Utilisateurs Enregistrés</h2>
            <Button variant="outline" onClick={fetchUsers} disabled={isLoadingUsers}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingUsers ? 'animate-spin' : ''}`} /> Actualiser Utilisateurs
            </Button>
          </div>
          {isLoadingUsers ? (
            <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <UserTable users={users} onDeleteUser={handleOpenDeleteUserDialog} deletingUserId={deletingUserId} />
          )}
        </TabsContent>
      </Tabs>
      
      <Dialog open={showProductForm} onOpenChange={(open) => { if (!open) handleCancelProductForm(); else setShowProductForm(true);}}>
        <DialogContent className="max-w-3xl p-0"> {/* Changed to Dialog from ShadCN */}
            <ProductForm
                key={productToEdit ? productToEdit.id : 'new'} 
                productToEdit={productToEdit}
                onFormSubmit={handleProductFormSubmit}
                onCancel={handleCancelProductForm}
                isLoading={isSubmittingProduct}
            />
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteUserDialog} onOpenChange={setShowDeleteUserDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l'utilisateur {userToDelete?.email || userToDelete?.id}? Cette action est irréversible et supprimera définitivement l'utilisateur de Supabase.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteUser} 
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              disabled={deletingUserId === userToDelete?.id}
            >
              {deletingUserId === userToDelete?.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
