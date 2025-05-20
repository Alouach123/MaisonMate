
"use client";

import type { AdminUserView } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Trash2 } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale'; 

interface UserTableProps {
  users: AdminUserView[];
  onDeleteUser: (userId: string, userEmail?: string) => void;
  deletingUserId: string | null;
}

export default function UserTable({ users, onDeleteUser, deletingUserId }: UserTableProps) {
  if (users.length === 0) {
    return <p className="text-center text-muted-foreground py-8">Aucun utilisateur à afficher.</p>;
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return formatDistanceToNow(parseISO(dateString), { addSuffix: true, locale: fr });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; 
    }
  };

  return (
    <div className="rounded-lg border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>Créé le</TableHead>
            <TableHead>Dernière connexion</TableHead>
            <TableHead className="text-right w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Badge variant="secondary">{user.email || 'N/A'}</Badge>
              </TableCell>
              <TableCell className="font-medium">{user.lastName || 'N/A'}</TableCell>
              <TableCell>{user.firstName || 'N/A'}</TableCell>
              <TableCell>{formatDate(user.createdAt)}</TableCell>
              <TableCell>{user.lastSignInAt ? formatDate(user.lastSignInAt) : 'Jamais'}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" disabled={deletingUserId === user.id}>
                       {deletingUserId === user.id ? <Trash2 className="h-4 w-4 animate-ping" /> : <MoreVertical className="h-4 w-4" />}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={() => onDeleteUser(user.id, user.email)} 
                      className="flex items-center text-destructive focus:text-destructive focus:bg-destructive/10"
                      disabled={deletingUserId === user.id}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                    </DropdownMenuItem>
                    {/* Add other actions like Edit, View Details here if needed */}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
