
"use client";

import type { AdminUserView } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale'; // For French date formatting

interface UserTableProps {
  users: AdminUserView[];
}

export default function UserTable({ users }: UserTableProps) {
  if (users.length === 0) {
    return <p className="text-center text-muted-foreground py-8">Aucun utilisateur à afficher.</p>;
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return formatDistanceToNow(parseISO(dateString), { addSuffix: true, locale: fr });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // Fallback to raw string if parsing fails
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
            <TableHead className="w-[120px]">User ID</TableHead>
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
              <TableCell className="text-xs text-muted-foreground">{user.id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
