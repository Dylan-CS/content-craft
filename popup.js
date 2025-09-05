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
    alert('即将跳转到升级页面...\n\nPro版本功能:\n✅ 无限使用次数\n✅ 更多写作风格\n✅ 优先处理\n✅ 专属支持');
  });

  resetBtn.addEventListener('click', function() {
    if (confirm('确定要重置使用计数吗？')) {
      chrome.storage.local.set({ usageCount: 0 }, function() {
        updateUsageDisplay();
        alert('使用计数已重置！');
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