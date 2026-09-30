import { useCallback, useEffect, useRef, useState } from 'react';
import { alertesApi, type AlerteCounts } from '../api/alertes';
import type {
  AlertePeremption,
  AlerteRupture,
  AlerteStockFaible,
} from '@/types';
import { usePermissions } from '@/hooks/usePermissions';

const EMPTY_COUNTS: AlerteCounts = {
  stocksFaibles: 0,
  ruptures: 0,
  peremptions: 0,
  total: 0,
};

/**
 * Charge dynamiquement les alertes depuis le backend (module Alertes existant).
 * Aucun mockData : la logique metier reste cote Laravel
 * (ruptures = stock total <= 0, stocks faibles = stock <= seuil,
 *  peremptions = lots dont la date de peremption <= J).
 */
export function useAlertes() {
  const { hasPermission } = usePermissions();
  const canView = hasPermission('alerte.view');

  const [counts, setCounts] = useState<AlerteCounts>(EMPTY_COUNTS);
  const [stocksFaibles, setStocksFaibles] = useState<AlerteStockFaible[]>([]);
  const [ruptures, setRuptures] = useState<AlerteRupture[]>([]);
  const [peremptions, setPeremptions] = useState<AlertePeremption[]>([]);
  const [jours, setJours] = useState(30);
  const [loading, setLoading] = useState(true);

  // Evite les mises a jour d'etat apres unmount (layout / navigation)
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    if (!canView) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await alertesApi.getToutes(jours);
      if (!mounted.current) return;

      const sf = data?.stocks_faibles ?? [];
      const ru = data?.ruptures ?? [];
      const pe = data?.peremptions ?? [];

      setStocksFaibles(sf);
      setRuptures(ru);
      setPeremptions(pe);
      setCounts({
        stocksFaibles: sf.length,
        ruptures: ru.length,
        peremptions: pe.length,
        total: sf.length + ru.length + pe.length,
      });
    } catch {
      if (!mounted.current) return;
      setStocksFaibles([]);
      setRuptures([]);
      setPeremptions([]);
      setCounts(EMPTY_COUNTS);
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [canView, jours]);

  useEffect(() => {
    void load();
  }, [load]);

  return { counts, stocksFaibles, ruptures, peremptions, loading, jours, setJours, reload: load };
}