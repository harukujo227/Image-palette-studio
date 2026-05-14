<script lang="ts">
  interface Props {
    imageUrl: string | null;
    onfile: (file: File) => void;
    onreset: () => void;
  }

  let { imageUrl, onfile, onreset }: Props = $props();

  let dragging = $state(false);
  let inputEl: HTMLInputElement | null = $state(null);
  let error = $state<string | null>(null);

  function handleFile(file: File | null | undefined) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      error = 'That file isn’t an image. Try a PNG, JPG, or WebP.';
      return;
    }
    error = null;
    onfile(file);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    dragging = false;
    handleFile(e.dataTransfer?.files?.[0]);
  }

  function onPick(e: Event) {
    const target = e.target as HTMLInputElement;
    handleFile(target.files?.[0]);
    target.value = '';
  }

  function onDragOver(e: DragEvent) {
    e.preventDefault();
    dragging = true;
  }

  function onDragLeave() {
    dragging = false;
  }

  function clickPicker() {
    inputEl?.click();
  }
</script>

<div class="wrap">
  {#if imageUrl}
    <figure class="preview">
      <img src={imageUrl} alt="Uploaded reference" />
      <figcaption>
        <button type="button" class="link" onclick={clickPicker}>Replace image</button>
        <span aria-hidden="true">·</span>
        <button type="button" class="link" onclick={onreset}>Reset to demo</button>
      </figcaption>
    </figure>
  {:else}
    <button
      type="button"
      class="dropzone"
      class:dragging
      onclick={clickPicker}
      ondrop={onDrop}
      ondragover={onDragOver}
      ondragleave={onDragLeave}
      aria-label="Upload image to extract palette"
    >
      <div class="art" aria-hidden="true">
        <span class="dot d1"></span>
        <span class="dot d2"></span>
        <span class="dot d3"></span>
        <span class="dot d4"></span>
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
          <circle cx="9" cy="10.5" r="1.6" />
          <path d="m3.5 17 4.5-4 3.5 3 4-5 5.5 6" />
        </svg>
      </div>
      <div class="title">Drop an image to extract a palette</div>
      <div class="subtitle">or <span class="emphasis">click to upload</span> · PNG, JPG, WebP</div>
      <div class="tiny">Nothing leaves your browser.</div>
    </button>
  {/if}

  {#if error}
    <div class="error" role="status">{error}</div>
  {/if}

  <input
    bind:this={inputEl}
    type="file"
    accept="image/*"
    onchange={onPick}
    hidden
    tabindex="-1"
  />
</div>

<style>
  .wrap {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .dropzone {
    position: relative;
    width: 100%;
    aspect-ratio: 4 / 3;
    border-radius: 18px;
    border: 1.5px dashed color-mix(in srgb, var(--ui-fg) 18%, transparent);
    background:
      radial-gradient(120% 100% at 10% 0%, color-mix(in srgb, var(--brand) 14%, transparent), transparent 55%),
      radial-gradient(120% 100% at 100% 100%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 60%),
      color-mix(in srgb, var(--ui-surface) 96%, transparent);
    color: var(--ui-fg);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1.25rem;
    transition: border-color 200ms ease, transform 200ms ease, box-shadow 200ms ease;
    font: inherit;
  }
  .dropzone:hover,
  .dragging {
    border-color: color-mix(in srgb, var(--brand) 70%, transparent);
    transform: translateY(-2px);
    box-shadow: 0 20px 50px -28px color-mix(in srgb, var(--brand) 60%, transparent);
  }
  .dropzone:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--brand) 70%, transparent);
    outline-offset: 3px;
  }
  .title {
    font-size: 1.05rem;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  .subtitle {
    font-size: 0.85rem;
    color: color-mix(in srgb, var(--ui-fg) 65%, transparent);
  }
  .tiny {
    font-size: 0.72rem;
    color: color-mix(in srgb, var(--ui-fg) 48%, transparent);
    margin-top: 0.5rem;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }
  .tiny::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #22d3a4;
    box-shadow: 0 0 0 3px color-mix(in srgb, #22d3a4 25%, transparent);
  }
  .emphasis {
    color: var(--brand);
    font-weight: 600;
  }
  .art {
    position: relative;
    width: 64px;
    height: 64px;
    border-radius: 16px;
    background: color-mix(in srgb, var(--ui-fg) 6%, transparent);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--ui-fg);
    margin-bottom: 0.25rem;
  }
  .dot {
    position: absolute;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    box-shadow: 0 4px 10px -2px rgba(0, 0, 0, 0.18);
  }
  .d1 { background: var(--brand); top: -6px; left: -6px; }
  .d2 { background: var(--accent); top: -6px; right: -6px; }
  .d3 { background: #ffd166; bottom: -6px; left: -6px; }
  .d4 { background: #22d3a4; bottom: -6px; right: -6px; }
  .preview {
    margin: 0;
    border-radius: 18px;
    overflow: hidden;
    background: var(--ui-surface);
    border: 1px solid color-mix(in srgb, var(--ui-fg) 10%, transparent);
    box-shadow: 0 24px 60px -32px rgba(11, 13, 18, 0.45);
  }
  .preview img {
    display: block;
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    transition: transform 400ms ease;
  }
  .preview:hover img {
    transform: scale(1.02);
  }
  figcaption {
    padding: 0.6rem 0.85rem;
    display: flex;
    gap: 0.5rem;
    align-items: center;
    font-size: 0.82rem;
    color: color-mix(in srgb, var(--ui-fg) 70%, transparent);
    background: color-mix(in srgb, var(--ui-fg) 4%, transparent);
  }
  .link {
    background: none;
    border: none;
    color: var(--brand);
    font: inherit;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
  }
  .link:hover {
    text-decoration: underline;
  }
  .error {
    font-size: 0.82rem;
    color: #c0392b;
    background: rgba(192, 57, 43, 0.08);
    padding: 0.55rem 0.75rem;
    border-radius: 10px;
  }
</style>
