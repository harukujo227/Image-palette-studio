<script lang="ts">
  import { contrastLabel, contrastRatio, bestTextOn } from '$lib/color/contrast';
  import type { ThemeTokens } from '$lib/types';

  interface Props {
    theme: ThemeTokens;
  }

  let { theme }: Props = $props();

  let textOnPrimary = $derived(bestTextOn(theme.primary));
  let textOnAccent = $derived(bestTextOn(theme.accent));
  let primaryRatio = $derived(contrastRatio(theme.primary, textOnPrimary));
  let textOnBgRatio = $derived(contrastRatio(theme.text, theme.background));

  const bars = [38, 64, 52, 78, 45, 90, 70];
</script>

<div
  class="preview"
  style="
    --bg: {theme.background};
    --surface: {theme.surface};
    --text: {theme.text};
    --muted: {theme.muted};
    --primary: {theme.primary};
    --secondary: {theme.secondary};
    --accent: {theme.accent};
    --border: {theme.border};
    --text-on-primary: {textOnPrimary};
    --text-on-accent: {textOnAccent};
  "
>
  <div class="stage">
    <header class="bar">
      <div class="brand">
        <span class="logo" aria-hidden="true"></span>
        <span>Acme</span>
      </div>
      <nav>
        <span class="link active">Overview</span>
        <span class="link">Activity</span>
        <span class="link">Reports</span>
      </nav>
      <div class="avatar" aria-hidden="true">A</div>
    </header>

    <section class="dashboard">
      <article class="card big">
        <div class="card-head">
          <div>
            <div class="eyebrow">Revenue</div>
            <div class="metric">$48,290</div>
          </div>
          <span class="badge accent">+12.4%</span>
        </div>
        <div class="chart" aria-hidden="true">
          {#each bars as h, i (i)}
            <span class="bar-fill" style="height: {h}%; animation-delay: {i * 40}ms"></span>
          {/each}
        </div>
      </article>

      <article class="card">
        <div class="eyebrow">Quick action</div>
        <label class="field">
          <span>Email</span>
          <input type="email" placeholder="you@studio.com" />
        </label>
        <div class="actions">
          <button class="btn primary" type="button">Invite</button>
          <button class="btn secondary" type="button">Cancel</button>
        </div>
        <div class="tags">
          <span class="tag">Design</span>
          <span class="tag accent-tag">Beta</span>
          <span class="tag">Engineering</span>
        </div>
      </article>

      <article class="toast">
        <span class="dot" aria-hidden="true"></span>
        <div>
          <strong>Palette updated</strong>
          <span class="muted">Theme regenerated from image</span>
        </div>
      </article>
    </section>
  </div>

  <footer class="footer">
    <div class="pair">
      <span class="swatch" style="background: var(--primary)"></span>
      <span>Primary</span>
      <span class="badge subtle">{contrastLabel(primaryRatio)} · {primaryRatio.toFixed(1)}</span>
    </div>
    <div class="pair">
      <span class="swatch" style="background: var(--bg); border-color: var(--border)"></span>
      <span>Text on Background</span>
      <span class="badge subtle">{contrastLabel(textOnBgRatio)} · {textOnBgRatio.toFixed(1)}</span>
    </div>
  </footer>
</div>

<style>
  .preview {
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 28px 70px -32px rgba(11, 13, 18, 0.5);
    border: 1px solid color-mix(in srgb, var(--ui-fg) 8%, transparent);
    background: var(--ui-surface);
    transition: background 250ms ease;
  }
  .stage {
    background: var(--bg);
    color: var(--text);
    padding: 1rem;
    transition: background 250ms ease, color 250ms ease;
  }
  .bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.55rem 0.8rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    margin-bottom: 0.85rem;
  }
  .brand {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 700;
    letter-spacing: -0.01em;
  }
  .logo {
    width: 18px;
    height: 18px;
    border-radius: 6px;
    background: linear-gradient(135deg, var(--primary), var(--accent));
  }
  nav {
    display: flex;
    gap: 0.85rem;
    font-size: 0.78rem;
  }
  .link {
    color: var(--muted);
    cursor: pointer;
  }
  .link.active {
    color: var(--primary);
    font-weight: 600;
    position: relative;
  }
  .link.active::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -6px;
    height: 2px;
    border-radius: 2px;
    background: var(--primary);
  }
  .avatar {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: var(--accent);
    color: var(--text-on-accent);
    display: grid;
    place-items: center;
    font-size: 0.7rem;
    font-weight: 700;
  }
  .dashboard {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    grid-template-rows: auto auto;
    gap: 0.75rem;
  }
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 0.85rem;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }
  .big {
    grid-row: span 2;
  }
  .card-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .eyebrow {
    font-size: 0.68rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
    font-weight: 600;
  }
  .metric {
    font-size: 1.45rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-top: 0.2rem;
  }
  .badge {
    font-size: 0.7rem;
    font-weight: 700;
    padding: 0.2rem 0.5rem;
    border-radius: 999px;
  }
  .badge.accent {
    background: color-mix(in srgb, var(--accent) 18%, transparent);
    color: var(--accent);
  }
  .badge.subtle {
    background: color-mix(in srgb, var(--ui-fg) 10%, transparent);
    color: var(--ui-fg);
    font-weight: 600;
    letter-spacing: 0;
  }
  .chart {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    align-items: end;
    gap: 0.4rem;
    height: 88px;
    padding: 0.3rem 0;
  }
  .bar-fill {
    background: linear-gradient(180deg, var(--primary), color-mix(in srgb, var(--accent) 70%, var(--primary)));
    border-radius: 6px 6px 4px 4px;
    transform-origin: bottom;
    animation: rise 420ms ease both;
  }
  @keyframes rise {
    from { transform: scaleY(0.4); opacity: 0.6; }
    to { transform: scaleY(1); opacity: 1; }
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    font-size: 0.78rem;
    color: var(--muted);
  }
  .field input {
    background: var(--bg);
    border: 1px solid var(--border);
    color: var(--text);
    padding: 0.5rem 0.65rem;
    border-radius: 8px;
    font: inherit;
    font-size: 0.85rem;
  }
  .field input:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--primary) 60%, transparent);
    outline-offset: 1px;
  }
  .actions {
    display: flex;
    gap: 0.4rem;
  }
  .btn {
    flex: 1;
    font: inherit;
    font-size: 0.82rem;
    font-weight: 600;
    padding: 0.5rem 0.7rem;
    border-radius: 9px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: filter 150ms ease, transform 150ms ease;
  }
  .btn:hover { transform: translateY(-1px); }
  .btn.primary {
    background: var(--primary);
    color: var(--text-on-primary);
  }
  .btn.secondary {
    background: transparent;
    border-color: var(--border);
    color: var(--text);
  }
  .tags {
    display: flex;
    gap: 0.35rem;
    flex-wrap: wrap;
  }
  .tag {
    font-size: 0.7rem;
    padding: 0.2rem 0.55rem;
    border-radius: 999px;
    background: color-mix(in srgb, var(--text) 8%, transparent);
    color: var(--text);
  }
  .tag.accent-tag {
    background: color-mix(in srgb, var(--accent) 22%, transparent);
    color: var(--accent);
    font-weight: 600;
  }
  .toast {
    grid-column: 2;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.65rem 0.8rem;
    border-radius: 12px;
    background: var(--surface);
    border: 1px solid var(--border);
    font-size: 0.8rem;
  }
  .toast strong {
    display: block;
    margin-bottom: 0.1rem;
  }
  .muted {
    color: var(--muted);
    font-size: 0.75rem;
  }
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 25%, transparent);
  }
  .swatch {
    width: 14px;
    height: 14px;
    border-radius: 4px;
    border: 1px solid transparent;
  }
  .footer {
    display: flex;
    gap: 0.6rem;
    flex-wrap: wrap;
    padding: 0.75rem 1rem;
    background: color-mix(in srgb, var(--ui-fg) 4%, transparent);
    font-size: 0.78rem;
    color: var(--ui-fg);
  }
  .pair {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }
  @media (max-width: 560px) {
    .dashboard {
      grid-template-columns: 1fr;
    }
    .big {
      grid-row: auto;
    }
    .toast {
      grid-column: auto;
    }
  }
</style>
