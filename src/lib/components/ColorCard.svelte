<script lang="ts">
  import { bestTextOn, contrastRatio } from '$lib/color/contrast';

  interface Props {
    color: string;
    index: number;
  }

  let { color, index }: Props = $props();

  let textColor = $derived(bestTextOn(color));
  let ratio = $derived(contrastRatio(color, textColor));
  let upper = $derived(color.toUpperCase());
  let copied = $state(false);
  let timer: ReturnType<typeof setTimeout> | null = null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(upper);
      copied = true;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => (copied = false), 1200);
    } catch {
      copied = false;
    }
  }
</script>

<button
  type="button"
  class="card"
  class:copied
  style="--bg: {color}; --fg: {textColor}; animation-delay: {index * 40}ms;"
  onclick={copy}
  aria-label="Copy {upper}"
  title="Click to copy {upper}"
>
  <div class="swatch">
    <div class="meta">
      <span class="index">0{index + 1}</span>
      <span class="ratio" title="Contrast ratio between text and this color">{ratio.toFixed(1)}:1</span>
    </div>
    <div class="hex-row">
      <span class="hex">{upper}</span>
      <span class="action" aria-hidden="true">
        {#if copied}
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        {:else}
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>
        {/if}
      </span>
    </div>
  </div>
  <span class="copied-pill" aria-live="polite" aria-atomic="true">
    {copied ? 'Copied' : ''}
  </span>
</button>

<style>
  .card {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    background: var(--bg);
    color: var(--fg);
    border: none;
    padding: 0;
    cursor: pointer;
    box-shadow: 0 10px 30px -18px rgba(11, 13, 18, 0.35);
    transition: transform 220ms ease, box-shadow 220ms ease;
    animation: fade-in 380ms ease both;
    font: inherit;
    text-align: left;
  }
  .card:hover {
    transform: translateY(-3px);
    box-shadow: 0 18px 40px -20px rgba(11, 13, 18, 0.45);
  }
  .card:active {
    transform: translateY(-1px) scale(0.99);
  }
  .card:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--bg) 60%, white);
    outline-offset: 3px;
  }
  .swatch {
    aspect-ratio: 1 / 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0.75rem;
  }
  .meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    opacity: 0.85;
  }
  .ratio {
    background: color-mix(in srgb, var(--fg) 18%, transparent);
    padding: 0.15rem 0.45rem;
    border-radius: 999px;
    font-variant-numeric: tabular-nums;
  }
  .hex-row {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: color-mix(in srgb, var(--bg) 70%, var(--fg));
    color: var(--bg);
    padding: 0.3rem 0.6rem;
    border-radius: 999px;
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.72rem;
    font-weight: 600;
    align-self: flex-start;
    transition: transform 180ms ease;
  }
  .card:hover .hex-row {
    transform: scale(1.04);
  }
  .hex {
    letter-spacing: 0.02em;
  }
  .action {
    display: inline-flex;
    align-items: center;
    opacity: 0.85;
  }
  .copied-pill {
    position: absolute;
    top: 0.6rem;
    left: 50%;
    transform: translate(-50%, -8px);
    background: color-mix(in srgb, var(--fg) 90%, var(--bg));
    color: var(--bg);
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 0.18rem 0.55rem;
    border-radius: 999px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 180ms ease, transform 180ms ease;
  }
  .card.copied .copied-pill {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(6px) scale(0.985);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
</style>
