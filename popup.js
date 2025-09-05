const MAX_FREE_USES = 10;

document.addEventListener('DOMContentLoaded', function() {
  const usageCountElement = document.getElementById('usageCount');
  const remainingCountElement = document.getElementById('remainingCount');
  const upgradeBtn = document.getElementById('upgradeBtn');
  const resetBtn = document.getElementById('resetBtn');

  function updateUsageDisplay() {
    chrome.storage.local.get(['usageCount'], function(result) {
      const usageCount = result.usageCount || 0;
      const remainingCount = Math.max(0, MAX_FREE_USES - usageCount);
      
      usageCountElement.textContent = usageCount;
      remainingCountElement.textContent = remainingCount;
      
      if (remainingCount === 0) {
        remainingCountElement.style.color = '#ff4757';
      } else {
        remainingCountElement.style.color = '#2ed573';
      }
    });
  }

  upgradeBtn.addEventListener('click', function() {
    alert('Redirecting to upgrade page...\n\nPro Features:\n✅ Unlimited usage\n✅ More writing styles\n✅ Priority processing\n✅ Dedicated support');
  });

  resetBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to reset the usage count?')) {
      chrome.storage.local.set({ usageCount: 0 }, function() {
        updateUsageDisplay();
        alert('Usage count has been reset!');
      });
    }
  });

  updateUsageDisplay();

  chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace === 'local' && changes.usageCount) {
      updateUsageDisplay();
    }
  });
});