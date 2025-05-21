
"use client";

import type { OrderAppView } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ScrollArea } from '../ui/scroll-area';
import { Package, User, CalendarDays, DollarSign, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from '../ui/button';

interface OrderTableProps {
  orders: OrderAppView[];
}

export default function OrderTable({ orders }: OrderTableProps) {
  if (!orders || orders.length === 0) {
    return <p className="text-center text-muted-foreground py-8">Aucune commande à afficher.</p>;
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy, HH:mm', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="rounded-lg border shadow-sm overflow-hidden">
       <ScrollArea className="h-[calc(100vh-300px)]"> {/* Adjust height as needed */}
        <Table>
          <TableHeader className="sticky top-0 bg-card z-10">
            <TableRow>
              <TableHead className="w-[150px]">ID Commande</TableHead>
              <TableHead className="w-[200px]">Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-center">Articles</TableHead>
              <TableHead className="text-center">Statut</TableHead>
              <TableHead className="text-center w-[100px]">Détails</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">
                  <Badge variant="secondary">{order.id.substring(0, 8)}...</Badge>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-1.5">
                        <User size={16} className="text-muted-foreground"/>
                        {order.userEmail || order.shippingAddress.first_name + ' ' + order.shippingAddress.last_name || 'N/A'}
                    </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <CalendarDays size={16}/>
                        {formatDate(order.orderDate)}
                    </div>
                </TableCell>
                <TableCell className="text-right font-semibold text-primary">
                    <div className="flex items-center justify-end gap-1">
                        <DollarSign size={16}/>
                        {order.totalAmount.toFixed(2)}
                    </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge 
                    variant={
                      order.status === 'Livrée' ? 'default' : 
                      order.status === 'Annulée' ? 'destructive' : 
                      'outline'
                    }
                    className={
                        order.status === 'Livrée' ? 'bg-green-500/20 text-green-700 border-green-500/50' :
                        order.status === 'Expédiée' ? 'bg-blue-500/20 text-blue-700 border-blue-500/50' :
                        order.status === 'En traitement' ? 'bg-yellow-500/20 text-yellow-700 border-yellow-500/50' :
                        ''
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                   <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Info className="h-4 w-4 text-muted-foreground hover:text-primary" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="max-w-xs bg-popover text-popover-foreground p-3 rounded-md shadow-lg border">
                        <div className="space-y-2 text-xs">
                          <p className="font-semibold">Adresse de livraison:</p>
                          <p>{order.shippingAddress.first_name} {order.shippingAddress.last_name}</p>
                          <p>{order.shippingAddress.address_line1}</p>
                          {order.shippingAddress.address_line2 && <p>{order.shippingAddress.address_line2}</p>}
                          <p>{order.shippingAddress.postal_code} {order.shippingAddress.city}, {order.shippingAddress.country}</p>
                          <p>Tel: {order.shippingAddress.phone}</p>
                          <hr className="my-2"/>
                          <p className="font-semibold">Articles ({order.items.reduce((sum, item) => sum + item.quantity, 0)}):</p>
                          <ul className="list-disc list-inside space-y-0.5">
                            {order.items.map(item => (
                              <li key={item.productId}>{item.name} (x{item.quantity})</li>
                            ))}
                          </ul>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
