export function SiteHeader() {
  return (
    <header className="border-b border-black/10 bg-paper/80 px-8 py-5 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-moss">Nationwide Directory</p>
          <h1 className="mt-1 text-2xl font-semibold text-ink">Michi no Eki Guide</h1>
        </div>
      </div>
    </header>
  );
}
