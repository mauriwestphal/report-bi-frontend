import { useAppContext } from '@/context/AppContext';

export function useActiveClient() {
  const { activeClientId, setActiveClientId, clearActiveClientId } = useAppContext();

  return {
    activeClientId,
    setActiveClientId,
    clearActiveClientId,
  };
}