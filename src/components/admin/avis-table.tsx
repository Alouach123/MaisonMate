
"use client";

import type { Avis } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Star, CalendarDays, UserCircle2, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ScrollArea } from '../ui/scroll-area';

interface AvisTableProps {
  avisList: Avis[];
}

export default function AvisTable({ avisList }: AvisTableProps) {
  if (!avisList || avisList.length === 0) {
    return <p className="text-center text-muted-foreground py-8">Aucun avis à afficher.</p>;
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return formatDistanceToNow(parseISO(dateString), { addSuffix: true, locale: fr });
    } catch (error) {
      // Fallback for potentially invalid date strings, though ISOString should be fine
      return dateString;
    }
  };
  // Helper to parse ISO date string correctly, robust against different environments
  const parseISO = (dateString: string) => new Date(dateString);


  return (
    <div className="rounded-lg border shadow-sm overflow-hidden">
      <ScrollArea className="h-[calc(100vh-300px)]"> {/* Adjust height as needed */}
        <Table>
          <TableHeader className="sticky top-0 bg-card z-10">
            <TableRow>
              <TableHead className="w-[200px]">Produit</TableHead>
              <TableHead className="w-[150px]">Utilisateur</TableHead>
              <TableHead className="text-center w-[100px]">Note</TableHead>
              <TableHead>Commentaire</TableHead>
              <TableHead className="text-right w-[150px]">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {avisList.map((avis) => (
              <TableRow key={avis.id}>
                <TableCell className="font-medium">
                  <Badge variant="outline">{avis.productName || avis.productId}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <UserCircle2 size={16} className="text-muted-foreground" />
                    {avis.userName}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center">
                    {avis.rating} <Star className="ml-1 h-4 w-4 text-accent fill-accent" />
                  </div>
                </TableCell>
                <TableCell>
                  <p className="line-clamp-3 hover:line-clamp-none transition-all" title={avis.comment}>
                    {avis.comment}
                  </p>
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">
                  {formatDate(avis.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
