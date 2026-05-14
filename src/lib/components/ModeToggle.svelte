<script lang="ts">
  import type { ThemeMode } from '$lib/types';

  interface Props {
    mode: ThemeMode;
    onchange: (m: ThemeMode) => void;
  }

  let { mode, onchange }: Props = $props();
</script>

<div class="toggle" role="tablist" aria-label="Preview mode">
  <button
    type="button"
    role="tab"
    aria-selected={mode === 'light'}
    class:active={mode === 'light'}
    onclick={() => onchange('light')}
  >
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>
    Light
  </button>
  <button
    type="button"
    role="tab"
    aria-selected={mode === 'dark'}
    class:active={mode === 'dark'}
    onclick={() => onchange('dark')}
  >
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
    Dark
  </button>
</div>

<style>
  .toggle {
    display: inline-flex;
    background: color-mix(in srgb, var(--ui-fg) 6%, transparent);
    border-radius: 999px;
    padding: 0.25rem;
    gap: 0.25rem;
  }
  button {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    border: none;
    background: transparent;
    color: color-mix(in srgb, var(--ui-fg) 70%, transparent);
    font: inherit;
    font-size: 0.78rem;
    font-weight: 600;
    padding: 0.4rem 0.85rem;
    border-radius: 999px;
    cursor: pointer;
    transition: background 200ms ease, color 200ms ease, box-shadow 200ms ease;
  }
  button:hover {
    color: var(--ui-fg);
  }
  button:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--brand) 70%, transparent);
    outline-offset: 2px;
  }
  .active {
    background: var(--ui-surface);
    color: var(--ui-fg);
    box-shadow: 0 4px 14px -8px rgba(11, 13, 18, 0.35);
  }
</style>
