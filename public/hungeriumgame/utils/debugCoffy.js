/**
 * Tarayıcı konsolunda COFFY token sorunlarını hızlıca ayıklamak için kullanılabilecek
 * yardımcı fonksiyonlar
 */

// GameStore'daki COFFY token değerini kontrol et ve düzelt
export function fixCoffyBalance() {
  if (typeof window === 'undefined') return;
  
  // useGameStore'u dinamik olarak yükleyin
  const gameStoreModule = require('../store/gameStore');
  const useGameStore = gameStoreModule.default;
  
  if (!useGameStore) {
    console.error("gameStore yüklenemedi!");
    return;
  }
  
  // Mevcut durumu kontrol et
  const state = useGameStore.getState();
  console.log("Mevcut COFFY durumu:", {
    coffyBalance: state.coffyBalance,
    coffyBalanceType: typeof state.coffyBalance,
    coffyClaimed: state.coffyClaimed,
    coffyClaimedType: typeof state.coffyClaimed
  });
  
  // Type düzeltme
  if (typeof state.coffyBalance !== 'number') {
    const fixedBalance = parseFloat(state.coffyBalance || '0');
    console.log(`COFFY balance tipi düzeltiliyor: ${state.coffyBalance} (${typeof state.coffyBalance}) => ${fixedBalance} (number)`);
    useGameStore.setState({ coffyBalance: fixedBalance });
  }
  
  if (typeof state.coffyClaimed !== 'number') {
    const fixedClaimed = parseFloat(state.coffyClaimed || '0');
    console.log(`COFFY claimed tipi düzeltiliyor: ${state.coffyClaimed} (${typeof state.coffyClaimed}) => ${fixedClaimed} (number)`);
    useGameStore.setState({ coffyClaimed: fixedClaimed });
  }
  
  // Düzeltme sonrası durumu kontrol et
  const updatedState = useGameStore.getState();
  console.log("Düzeltme sonrası COFFY durumu:", {
    coffyBalance: updatedState.coffyBalance,
    coffyBalanceType: typeof updatedState.coffyBalance,
    coffyClaimed: updatedState.coffyClaimed,
    coffyClaimedType: typeof updatedState.coffyClaimed
  });
  
  return updatedState;
}

// 50 COFFY token ekle
export function addCoffy(amount = 50) {
  if (typeof window === 'undefined') return;
  
  const gameStoreModule = require('../store/gameStore');
  const useGameStore = gameStoreModule.default;
  
  if (!useGameStore) {
    console.error("gameStore yüklenemedi!");
    return;
  }
  
  const state = useGameStore.getState();
  const currentBalance = typeof state.coffyBalance === 'number' ? state.coffyBalance : 0;
  const newBalance = currentBalance + amount;
  
  console.log(`${amount} COFFY tokeni ekleniyor:`, {
    önceki: currentBalance,
    eklenen: amount,
    yeni: newBalance
  });
  
  useGameStore.setState({ coffyBalance: newBalance });
  return newBalance;
}

// Token bakiyesini sıfırla
export function resetCoffy() {
  if (typeof window === 'undefined') return;
  
  const gameStoreModule = require('../store/gameStore');
  const useGameStore = gameStoreModule.default;
  
  if (!useGameStore) {
    console.error("gameStore yüklenemedi!");
    return;
  }
  
  console.log("COFFY tokenleri sıfırlanıyor...");
  useGameStore.setState({ coffyBalance: 0 });
  
  return 0;
}

// Bu işlevleri global window nesnesine bağlama
if (typeof window !== 'undefined') {
  window.coffyDebug = {
    fix: fixCoffyBalance,
    add: addCoffy,
    reset: resetCoffy
  };
  
  console.log("COFFY Debug araçları yüklendi! Şunları kullanabilirsiniz:");
  console.log("- coffyDebug.fix() : COFFY değerlerini düzeltir");
  console.log("- coffyDebug.add(50) : 50 COFFY token ekler");
  console.log("- coffyDebug.reset() : COFFY bakiyesini sıfırlar");
}
