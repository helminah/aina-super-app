import { supabase, isSupabaseConfigured } from './supabase';
import type { ChildProfile } from '@/types/child';

export async function pushBabies(
  userId: string,
  babies: ChildProfile[],
  activeBabyId: string | null,
): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    await supabase.from('user_babies').upsert(
      { user_id: userId, data: babies, active_baby_id: activeBabyId, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' },
    );
  } catch { /* réseau — localStorage reste la source de vérité */ }
}

export async function pullBabies(
  userId: string,
): Promise<{ babies: ChildProfile[]; activeBabyId: string | null } | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('user_babies')
      .select('data, active_baby_id')
      .eq('user_id', userId)
      .single();
    if (error || !data) return null;
    return {
      babies: (data.data ?? []) as ChildProfile[],
      activeBabyId: (data.active_baby_id ?? null) as string | null,
    };
  } catch { return null; }
}

export async function pushBabyStore(
  userId: string,
  babyId: string,
  storeKey: string,
  storeData: unknown,
): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    await supabase.from('baby_store').upsert({
      user_id: userId,
      baby_id: babyId,
      store_key: storeKey,
      data: storeData,
      updated_at: new Date().toISOString(),
    });
  } catch { /* réseau */ }
}

export async function pullAllBabyStores(
  userId: string,
  babyId: string,
): Promise<Record<string, unknown>> {
  if (!isSupabaseConfigured) return {};
  try {
    const { data, error } = await supabase
      .from('baby_store')
      .select('store_key, data')
      .eq('user_id', userId)
      .eq('baby_id', babyId);
    if (error || !data) return {};
    return Object.fromEntries(data.map(r => [r.store_key as string, r.data]));
  } catch { return {}; }
}
