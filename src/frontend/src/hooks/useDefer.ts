import { onUnmounted, ref } from 'vue';
/**
 * 延迟渲染
 * @param maxCount
 * @returns
 */
export function useDefer(maxCount = 100) {
  const frameCount = ref(0);
  let rafId: number;
  function updateFrameCount() {
    rafId = requestAnimationFrame(() => {
      frameCount.value++;
      if (frameCount.value >= maxCount) {
        return;
      }
      updateFrameCount();
    });
  }
  updateFrameCount();
  onUnmounted(() => {
    cancelAnimationFrame(rafId);
  });
  return function defer(n: number) {
    return frameCount.value >= n;
  };
}
