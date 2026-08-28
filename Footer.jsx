function Footer() {
  return (
    <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 py-8 px-4 mt-12 text-xs transition-colors duration-200">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
            Graphic Era Social Platform
          </p>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5">
            Connecting Deemed & Hill Universities across Dehradun, Bhimtal & Haldwani campuses.
          </p>
        </div>
        <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
          <span className="hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer">FastAPI REST Backend</span>
          <span>•</span>
          <span className="hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer">React & Vite Frontend</span>
          <span>•</span>
          <span className="hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer">GEU Community</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;