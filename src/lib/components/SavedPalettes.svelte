<script lang="ts">
  import type { SavedPalette } from '$lib/types';

  interface Props {
    items: SavedPalette[];
    onapply: (p: SavedPalette) => void;
    ondelete: (id: string) => void;
    onsave: () => void;
    canSave: boolean;
  }

  let { items, onapply, ondelete, onsave, canSave }: Props = $props();
</script>

<section class="saved" aria-label="Saved palettes">
  <header>
    <div class="title">
      Saved palettes
      {#if items.length > 0}
        <span class="count" aria-label="{items.length} saved">{items.length}</span>
      {/if}
    </div>
    <button type="button" class="save-btn" onclick={onsave} disabled={!canSave}>
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
      Save current
    </button>
  </header>

  {#if items.length === 0}
    <div class="empty">
      <span class="empty-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
      </span>
      <p>Hit <strong>Save current</strong> to keep this palette. Stored locally in your browser.</p>
    </div>
  {:else}
    <ul>
      {#each items as p (p.id)}
        <li>
          <button type="button" class="row" onclick={() => onapply(p)} aria-label="Apply palette {p.name}">
            <span class="strip" aria-hidden="true">
              {#each p.colors.slice(0, 6) as c (c)}
                <span style="background: {c}"></span>
              {/each}
            </span>
            <span class="name">{p.name}</span>
          </button>
          <button
            type="button"
            class="trash"
            aria-label="Delete palette {p.name}"
            onclick={() => ondelete(p.id)}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /></svg>
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</section>

<style>
  .saved {
    background: var(--ui-surface);
    border: 1px solid color-mix(in srgb, var(--ui-fg) 8%, transparent);
    border-radius: 18px;
    padding: 0.85rem 0.95rem;
  }
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-bottom: 0.6rem;
  }
  .title {
    font-weight: 600;
    font-size: 0.92rem;
    letter-spacing: -0.01em;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }
  .count {
    font-size: 0.7rem;
    font-weight: 600;
    padding: 0.1rem 0.45rem;
    border-radius: 999px;
    background: color-mix(in srgb, var(--ui-fg) 8%, transparent);
    color: var(--ui-fg-soft);
    font-variant-numeric: tabular-nums;
  }
  .save-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font: inherit;
    font-size: 0.78rem;
    font-weight: 600;
    padding: 0.35rem 0.7rem;
    border-radius: 999px;
    background: color-mix(in srgb, var(--brand) 14%, transparent);
    color: var(--brand);
    border: none;
    cursor: pointer;
    transition: background 200ms ease;
  }
  .save-btn:hover:not(:disabled) {
    background: color-mix(in srgb, var(--brand) 22%, transparent);
  }
  .save-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .empty {
    display: flex;
    align-items: flex-start;
    gap: 0.55rem;
    padding: 0.65rem 0.7rem;
    border-radius: 12px;
    background: color-mix(in srgb, var(--ui-fg) 4%, transparent);
    border: 1px dashed color-mix(in srgb, var(--ui-fg) 12%, transparent);
  }
  .empty p {
    margin: 0;
    font-size: 0.8rem;
    line-height: 1.4;
    color: color-mix(in srgb, var(--ui-fg) 65%, transparent);
  }
  .empty strong {
    color: var(--ui-fg);
    font-weight: 600;
  }
  .empty-icon {
    color: color-mix(in srgb, var(--brand) 80%, transparent);
    margin-top: 0.1rem;
    flex-shrink: 0;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  li {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  .row {
    flex: 1;
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    background: color-mix(in srgb, var(--ui-fg) 4%, transparent);
    border: none;
    border-radius: 10px;
    padding: 0.4rem 0.5rem;
    font: inherit;
    color: var(--ui-fg);
    cursor: pointer;
    transition: background 180ms ease;
  }
  .row:hover {
    background: color-mix(in srgb, var(--ui-fg) 8%, transparent);
  }
  .strip {
    display: inline-flex;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);
  }
  .strip span {
    width: 16px;
    height: 22px;
  }
  .name {
    font-size: 0.82rem;
    font-weight: 600;
  }
  .trash {
    background: transparent;
    border: none;
    color: color-mix(in srgb, var(--ui-fg) 50%, transparent);
    cursor: pointer;
    padding: 0.35rem;
    border-radius: 8px;
    display: inline-flex;
    transition: background 180ms ease, color 180ms ease;
  }
  .trash:hover {
    background: color-mix(in srgb, #c0392b 12%, transparent);
    color: #c0392b;
  }
</style>
