<script lang="ts">
  import { onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import ImageDropzone from '$lib/components/ImageDropzone.svelte';
  import PaletteGrid from '$lib/components/PaletteGrid.svelte';
  import ThemePreview from '$lib/components/ThemePreview.svelte';
  import CssVariablesPanel from '$lib/components/CssVariablesPanel.svelte';
  import ModeToggle from '$lib/components/ModeToggle.svelte';
  import CopyButton from '$lib/components/CopyButton.svelte';
  import SavedPalettes from '$lib/components/SavedPalettes.svelte';
  import {
    DEFAULT_PALETTE,
    extractPaletteFromImage
  } from '$lib/color/extractPalette';
  import { generateTheme } from '$lib/color/theme';
  import type { SavedPalette, ThemeMode } from '$lib/types';

  const STORAGE_KEY = 'ips:saved-palettes';

  let palette = $state<string[]>(DEFAULT_PALETTE.slice(0, 8));
  let imageUrl = $state<string | null>(null);
  let mode = $state<ThemeMode>('light');
  let extracting = $state(false);
  let extractError = $state<string | null>(null);
  let saved = $state<SavedPalette[]>([]);

  let theme = $derived(generateTheme(palette, mode));
  let isDemo = $derived(!imageUrl && palette.join() === DEFAULT_PALETTE.slice(0, 8).join());

  if (browser) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) saved = JSON.parse(raw) as SavedPalette[];
    } catch {
      saved = [];
    }
  }

  function persistSaved() {
    if (!browser) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {
      // localStorage unavailable; ignore
    }
  }

  async function handleFile(file: File) {
    extractError = null;
    extracting = true;
    revokeImage();
    const url = URL.createObjectURL(file);
    imageUrl = url;

    const img = new Image();
    img.onload = () => {
      try {
        const colors = extractPaletteFromImage(img);
        if (colors.length >= 6) {
          palette = colors;
        } else {
          extractError = "Couldn't find enough distinct colors. Try a different image.";
          palette = DEFAULT_PALETTE.slice(0, 8);
        }
      } catch {
        extractError = 'Something went wrong while reading that image.';
        palette = DEFAULT_PALETTE.slice(0, 8);
      } finally {
        extracting = false;
      }
    };
    img.onerror = () => {
      extracting = false;
      extractError = "Couldn't load that image.";
    };
    img.src = url;
  }

  function revokeImage() {
    if (imageUrl) {
      try {
        URL.revokeObjectURL(imageUrl);
      } catch {
        // ignore
      }
    }
  }

  function reset() {
    revokeImage();
    imageUrl = null;
    palette = DEFAULT_PALETTE.slice(0, 8);
    extractError = null;
  }

  function savePalette() {
    const id = crypto?.randomUUID?.() ?? String(Date.now());
    const entry: SavedPalette = {
      id,
      name: new Date().toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      colors: palette,
      createdAt: Date.now()
    };
    saved = [entry, ...saved].slice(0, 12);
    persistSaved();
  }

  function applySaved(p: SavedPalette) {
    palette = p.colors;
  }

  function deleteSaved(id: string) {
    saved = saved.filter((s) => s.id !== id);
    persistSaved();
  }

  onDestroy(() => {
    revokeImage();
  });
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<main>
  <div class="shell">
    <header class="page-header">
      <div class="brand-mark">
        <span class="brand-dot" aria-hidden="true"></span>
        <span class="brand-text">Image Palette Studio</span>
        <span class="brand-pill" aria-hidden="true">Svelte 5</span>
      </div>
      <div class="header-actions">
        <span class="mode-label">Preview</span>
        <ModeToggle {mode} onchange={(m) => (mode = m)} />
      </div>
    </header>

    <section class="hero">
      <h1>Turn any image into a UI&nbsp;theme.</h1>
      <p>
        Drop an image, get a polished palette with WCAG contrast checks, preview it on a live
        interface, and copy the CSS variables. Runs entirely in your browser - no upload, no
        backend.
      </p>
    </section>

    <div class="layout">
      <aside class="col upload-col">
        <div class="card-block">
          <ImageDropzone
            {imageUrl}
            onfile={handleFile}
            onreset={reset}
          />
          {#if extracting}
            <div class="status" role="status" aria-live="polite">
              <span class="spinner" aria-hidden="true"></span>
              Extracting palette…
            </div>
          {/if}
          {#if extractError}
            <div class="status warn" role="status" aria-live="polite">{extractError}</div>
          {/if}
        </div>

        <SavedPalettes
          items={saved}
          onapply={applySaved}
          ondelete={deleteSaved}
          onsave={savePalette}
          canSave={palette.length > 0}
        />
      </aside>

      <section class="col palette-col" aria-label="Extracted palette">
        <div class="section-head">
          <div>
            <div class="eyebrow">
              Palette
              {#if isDemo}
                <span class="demo-tag" title="Showing the default demo palette. Drop an image to replace it.">demo</span>
              {/if}
            </div>
            <div class="section-title">{palette.length} colors</div>
          </div>
          <CopyButton
            value={palette.map((c) => c.toUpperCase()).join(', ')}
            label="Copy all"
            copiedLabel="Copied!"
            variant="ghost"
            ariaLabel="Copy all hex values"
          />
        </div>
        <PaletteGrid colors={palette} />
      </section>

      <section class="col preview-col" aria-label="Live theme preview">
        <div class="section-head">
          <div>
            <div class="eyebrow">Live preview</div>
            <div class="section-title">Theme in context</div>
          </div>
        </div>
        <ThemePreview {theme} />
        <CssVariablesPanel {theme} />
      </section>
    </div>

    <footer class="page-footer">
      <span>Built with SvelteKit · Canvas API · 100% client-side.</span>
      <span class="hint">Tip: drop a photo, screenshot, or artwork - any image works.</span>
    </footer>
  </div>
</main>

<style>
  main {
    min-height: 100vh;
    padding: clamp(1rem, 2.5vw, 2rem);
  }
  .shell {
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: clamp(1.25rem, 2.5vw, 2rem);
  }
  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
  .brand-mark {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    font-weight: 700;
    letter-spacing: -0.01em;
  }
  .brand-text {
    font-size: 0.98rem;
  }
  .brand-pill {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 0.2rem 0.5rem;
    border-radius: 999px;
    background: color-mix(in srgb, var(--brand) 12%, transparent);
    color: var(--brand);
    border: 1px solid color-mix(in srgb, var(--brand) 22%, transparent);
  }
  .brand-dot {
    width: 22px;
    height: 22px;
    border-radius: 8px;
    background:
      conic-gradient(from 210deg, #5b6bff, #ff7ab6, #ffd166, #22d3a4, #5b6bff);
    box-shadow: 0 6px 18px -8px rgba(91, 107, 255, 0.6);
  }
  .header-actions {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
  }
  .mode-label {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--ui-fg-soft);
  }

  .hero {
    max-width: 720px;
  }
  .hero h1 {
    font-size: clamp(2rem, 4.2vw, 3.1rem);
    line-height: 1.05;
    letter-spacing: -0.025em;
    margin: 0 0 0.6rem;
    background: linear-gradient(135deg, #0b0d12 0%, #2a3b8a 50%, #c83a8a 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .hero p {
    margin: 0;
    color: var(--ui-fg-soft);
    font-size: clamp(0.98rem, 1.5vw, 1.1rem);
    line-height: 1.55;
    max-width: 60ch;
  }

  .layout {
    display: grid;
    grid-template-columns: minmax(280px, 0.85fr) minmax(0, 1.05fr) minmax(0, 1.1fr);
    gap: clamp(1rem, 1.6vw, 1.5rem);
    align-items: start;
  }

  .col {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-width: 0;
  }

  .card-block {
    background: var(--ui-surface);
    border: 1px solid color-mix(in srgb, var(--ui-fg) 8%, transparent);
    border-radius: 18px;
    padding: 1rem;
    box-shadow: 0 14px 40px -28px rgba(11, 13, 18, 0.4);
  }

  .section-head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 0.5rem;
  }
  .eyebrow {
    font-size: 0.68rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ui-fg-soft);
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
  }
  .demo-tag {
    font-size: 0.6rem;
    letter-spacing: 0.08em;
    padding: 0.1rem 0.4rem;
    border-radius: 999px;
    background: color-mix(in srgb, var(--accent) 16%, transparent);
    color: color-mix(in srgb, var(--accent) 80%, #5a1a3a);
    border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
    cursor: help;
  }
  .section-title {
    font-size: 1.1rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    margin-top: 0.1rem;
  }

  .status {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.75rem;
    font-size: 0.82rem;
    color: var(--ui-fg-soft);
  }
  .status.warn {
    color: #c0392b;
  }
  .spinner {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid color-mix(in srgb, var(--brand) 25%, transparent);
    border-top-color: var(--brand);
    animation: spin 700ms linear infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .page-footer {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem;
    font-size: 0.78rem;
    color: var(--ui-fg-soft);
    padding-top: 1rem;
    border-top: 1px solid color-mix(in srgb, var(--ui-fg) 8%, transparent);
  }

  @media (max-width: 1080px) {
    .layout {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    }
    .preview-col {
      grid-column: span 2;
    }
  }
  @media (max-width: 720px) {
    .layout {
      grid-template-columns: 1fr;
    }
    .preview-col {
      grid-column: auto;
    }
    .page-header {
      flex-wrap: wrap;
      row-gap: 0.6rem;
    }
    .brand-pill {
      display: none;
    }
  }
  @media (max-width: 420px) {
    .header-actions .mode-label {
      display: none;
    }
  }
</style>
