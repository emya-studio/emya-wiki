<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

interface Variant {
  label: string
  src: string
}

const props = defineProps<{
  variants: Variant[]
  poster?: string
  alt?: string
}>()

const active = ref(0)
const ready = ref(false)
const loading = ref(true)
const src = computed(() => props.variants[active.value].src)

onMounted(async () => {
  // model-viewer touches `window`, so it is loaded only in the browser
  await import('@google/model-viewer')
  ready.value = true
})

const select = (i: number) => {
  if (i === active.value) return
  loading.value = true
  active.value = i
}
</script>

<template>
  <div class="model3d">
    <div v-if="variants.length > 1" class="model3d-tabs" role="tablist">
      <button
        v-for="(v, i) in variants"
        :key="v.src"
        role="tab"
        :aria-selected="i === active"
        :class="{ active: i === active }"
        @click="select(i)"
      >
        {{ v.label }}
      </button>
    </div>

    <div class="model3d-stage">
      <model-viewer
        v-if="ready"
        :src="src"
        :poster="poster"
        :alt="alt"
        camera-controls
        touch-action="pan-y"
        auto-rotate
        auto-rotate-delay="1500"
        rotation-per-second="18deg"
        interaction-prompt="none"
        shadow-intensity="0.9"
        shadow-softness="0.8"
        exposure="1.05"
        environment-image="neutral"
        camera-orbit="25deg 60deg auto"
        min-camera-orbit="auto auto 5%"
        ar
        @load="loading = false"
      />
      <img v-else-if="poster" :src="poster" :alt="alt" class="model3d-poster" />
      <div v-if="loading" class="model3d-loading">در حال بارگذاری مدل سه‌بعدی…</div>
    </div>

    <p class="model3d-hint">برای چرخش بکشید، برای بزرگ‌نمایی اسکرول کنید (در موبایل: دو انگشت).</p>
  </div>
</template>

<style scoped>
.model3d {
  margin: 1.5rem 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}

.model3d-tabs {
  display: flex;
  gap: 4px;
  padding: 8px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.model3d-tabs button {
  padding: 6px 14px;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 8px;
  color: var(--vp-c-text-2);
  transition: background-color 0.2s, color 0.2s;
}

.model3d-tabs button:hover {
  color: var(--vp-c-text-1);
}

.model3d-tabs button.active {
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.model3d-stage {
  position: relative;
  height: 420px;
  background: radial-gradient(circle at 50% 40%, var(--vp-c-bg) 0%, var(--vp-c-bg-soft) 75%);
}

@media (max-width: 767px) {
  .model3d-stage {
    height: 300px;
  }
}

model-viewer,
.model3d-poster {
  width: 100%;
  height: 100%;
  --poster-color: transparent;
}

.model3d-poster {
  object-fit: contain;
  padding: 24px;
}

.model3d-loading {
  position: absolute;
  inset-inline: 0;
  bottom: 12px;
  text-align: center;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  pointer-events: none;
}

.vp-doc .model3d-hint {
  margin: 0;
  padding: 8px 12px;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  border-top: 1px solid var(--vp-c-divider);
}
</style>
