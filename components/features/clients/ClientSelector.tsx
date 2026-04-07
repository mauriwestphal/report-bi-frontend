'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/hooks/useApp';
import { SystemClient } from '@/services/types';
import { clientService } from '@/services';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const STORAGE_KEY = 'bipro-active-client-id';

export function ClientSelector() {
  const { user, activeClientId, setActiveClientId } = useApp();
  const [clients, setClients] = useState<SystemClient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load clients for the user
  useEffect(() => {
    if (!user?.id) return;

    const loadUserClients = async () => {
      setLoading(true);
      setError(null);
      try {
        const userClients = await clientService.getUserClients();
        setClients(userClients);
        
        // If user has only one client, set it as active
        if (userClients.length === 1 && !activeClientId) {
          const singleClient = userClients[0];
          setActiveClientId(singleClient.id);
          localStorage.setItem(STORAGE_KEY, singleClient.id.toString());
        }
      } catch (err) {
        console.error('Error loading user clients:', err);
        setError('No se pudieron cargar los clientes');
      } finally {
        setLoading(false);
      }
    };

    loadUserClients();
  }, [user?.id, activeClientId, setActiveClientId]);

  // Initialize active client from localStorage or user.clientId
  useEffect(() => {
    if (!user?.clientId) return;

    const storedClientId = localStorage.getItem(STORAGE_KEY);
    
    if (storedClientId) {
      const parsedId = parseInt(storedClientId, 10);
      if (!isNaN(parsedId)) {
        setActiveClientId(parsedId);
        return;
      }
    }

    // Fallback to user.clientId
    setActiveClientId(user.clientId);
    localStorage.setItem(STORAGE_KEY, user.clientId.toString());
  }, [user?.clientId, setActiveClientId]);

  const handleClientChange = (value: string) => {
    const clientId = parseInt(value, 10);
    if (!isNaN(clientId)) {
      setActiveClientId(clientId);
      localStorage.setItem(STORAGE_KEY, clientId.toString());
    }
  };

  // Don't show selector if user has only one client or no clients
  if (clients.length <= 1) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Cargando clientes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-3 py-2 text-sm text-destructive">
        {error}
      </div>
    );
  }

  const currentClient = clients.find(client => client.id === activeClientId);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Cliente:</span>
      <Select
        value={activeClientId?.toString() || ''}
        onValueChange={handleClientChange}
      >
        <SelectTrigger className="w-[180px] h-8">
          <SelectValue placeholder="Seleccionar cliente">
            {currentClient ? currentClient.name : 'Seleccionar cliente'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {clients.map((client) => (
            <SelectItem key={client.id} value={client.id.toString()}>
              {client.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}