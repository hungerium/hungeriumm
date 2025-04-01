/**
 * Debug scriptini çalıştırmak için:
 * node scripts/debug-claim.js
 * 
 * Bu script, token claim işlemindeki hataları tespit etmeye yardımcı olur.
 */

const fs = require('fs');
const path = require('path');

// Game store dosyasını kontrol et
const gameStorePath = path.join(__dirname, '..', 'store', 'gameStore.js');
if (fs.existsSync(gameStorePath)) {
  const gameStoreContent = fs.readFileSync(gameStorePath, 'utf8');
  
  // coffyBalance ile ilgili sorunlar için kontrol
  if (gameStoreContent.includes('parseFloat(state.coffyBalance || 0) + 50')) {
    console.log('✅ GameStore: coffyBalance parseFloat dönüşümü mevcut');
  } else {
    console.log('❌ GameStore: coffyBalance parseFloat dönüşümü eksik');
  }
  
  // claimCoffyTokens fonksiyonu kontrolü
  if (gameStoreContent.includes('coffyBalance: 0')) {
    console.log('✅ GameStore: claimCoffyTokens doğru şekilde balanceyi sıfırlıyor');
  } else {
    console.log('❌ GameStore: claimCoffyTokens balanceyi sıfırlamıyor olabilir');
  }
}

// Header bileşenini kontrol et
const headerPath = path.join(__dirname, '..', 'components', 'Header.js');
if (fs.existsSync(headerPath)) {
  const headerContent = fs.readFileSync(headerPath, 'utf8');
  console.log('✅ Header bileşeni mevcut');
  
  // onClick metodunu kontrol et
  if (headerContent.includes('onClick={onClaimReward}') || 
      headerContent.includes('onClick={() => onClaimReward()}') ||
      headerContent.includes('onClick={() => hasTokens ? onClaimReward() : null}')) {
    console.log('✅ Header: Claim butonu onClick eventi mevcut');
  } else {
    console.log('❌ Header: Claim butonu onClick eventi eksik olabilir');
  }
} else {
  console.log('❌ Header bileşeni bulunamadı');
}

// Diğer bağımlılıkları kontrol et
console.log('\nGenel kontroller:');
try {
  require.resolve('zustand');
  console.log('✅ zustand yüklü');
} catch (e) {
  console.log('❌ zustand yüklü değil');
}

try {
  require.resolve('ethers');
  console.log('✅ ethers yüklü');
} catch (e) {
  console.log('❌ ethers yüklü değil');
}

try {
  require.resolve('framer-motion');
  console.log('✅ framer-motion yüklü');
} catch (e) {
  console.log('❌ framer-motion yüklü değil');
}

console.log('\nDosya kontrolleri tamamlandı.');
