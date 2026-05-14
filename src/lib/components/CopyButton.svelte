<script lang="ts">
  interface Props {
    value: string;
    label?: string;
    copiedLabel?: string;
    variant?: 'ghost' | 'solid' | 'chip';
    ariaLabel?: string;
  }

  let {
    value,
    label = 'Copy',
    copiedLabel = 'Copied',
    variant = 'ghost',
    ariaLabel
  }: Props = $props();

  let copied = $state(false);
  let timer: ReturnType<typeof setTimeout> | null = null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      copied = true;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => (copied = false), 1400);
    } catch {
      copied = false;
    }
  }
</script>

<button
  type="button"
  class="copy {variant}"
  class:copied
  onclick={copy}
  aria-label={ariaLabel ?? label}
>
  <span class="icon" aria-hidden="true">
    {#if copied}
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
    {:else}
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>
    {/if}
  </span>
  <span class="text">{copied ? copiedLabel : label}</span>
</button>

<style>
  .copy {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    border: 1px solid transparent;
    border-radius: 999px;
    padding: 0.45rem 0.85rem;
    font: inherit;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.01em;
    cursor: pointer;
    transition: transform 120ms ease, background 200ms ease, color 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
    color: var(--ui-fg, #0b0d12);
    background: transparent;
  }
  .copy:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--brand) 70%, transparent);
    outline-offset: 2px;
  }
  .copy:active {
    transform: scale(0.97);
  }
  .copy .icon {
    transition: transform 200ms ease;
  }
  .copy.copied .icon {
    transform: scale(1.15);
  }
  .ghost {
    background: color-mix(in srgb, var(--ui-fg, #0b0d12) 8%, transparent);
    color: var(--ui-fg, #0b0d12);
  }
  .ghost:hover {
    background: color-mix(in srgb, var(--ui-fg, #0b0d12) 14%, transparent);
    transform: translateY(-1px);
  }
  .solid {
    background: var(--brand, #5b6bff);
    color: white;
    box-shadow: 0 6px 18px -8px color-mix(in srgb, var(--brand, #5b6bff) 65%, transparent);
  }
  .solid:hover {
    transform: translateY(-1px);
    filter: brightness(1.05);
  }
  .chip {
    padding: 0.3rem 0.6rem;
    font-size: 0.7rem;
    background: rgba(255, 255, 255, 0.85);
    color: #0b0d12;
    backdrop-filter: blur(4px);
    border: 1px solid rgba(0, 0, 0, 0.08);
  }
  .chip:hover {
    background: white;
  }
  .copied {
    color: #0a8f5d !important;
  }
  .copied.solid {
    background: #10b981;
    color: white !important;
  }
  .icon {
    display: inline-flex;
    align-items: center;
  }
</style>
