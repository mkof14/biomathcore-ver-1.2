export type FormTheme = {
  shell: string;
  header: {
    card: string;
    title: string;
    desc: string;
  };
  section: {
    wrap: string;
    title: string;
  };
  card: string;
  label: string;
  help: string;
  input: string;
  textarea: string;
  choice: {
    base: string;
    active: string;
  };
  progress: {
    wrap: string;
    bar: string;
  };
  actions: {
    row: string;
    primary: string;
    secondary: string;
  };
};

export const THEME_A: FormTheme = {
  shell: "text-gray-900 dark:text-gray-100",
  header: {
    card:
      "rounded-xl border border-gray-300/70 dark:border-white/10 bg-white/95 dark:bg-[#1b1b1f]/85 backdrop-blur p-6 mb-6",
    title: "text-xl font-semibold",
    desc: "text-sm text-gray-600 dark:text-gray-300 mt-1",
  },
  section: {
    wrap: "mt-6",
    title: "text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3",
  },
  card:
    "rounded-xl border border-gray-300/70 dark:border-white/10 bg-white/95 dark:bg-[#1b1b1f]/85 backdrop-blur p-5",
  label: "block text-sm font-medium text-gray-800 dark:text-gray-100",
  help: "mt-1 text-xs text-gray-600 dark:text-gray-300",
  input:
    "w-full rounded-md bg-zinc-50 dark:bg-[#202025] border border-gray-300/70 dark:border-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-400/50 dark:focus:ring-white/10",
  textarea:
    "w-full rounded-md bg-zinc-50 dark:bg-[#202025] border border-gray-300/70 dark:border-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-400/50 dark:focus:ring-white/10 min-h-[100px]",
  choice: {
    base:
      "px-3 py-2 rounded-md border border-gray-300/70 dark:border-white/10 bg-white dark:bg-[#202025] hover:bg-gray-50 dark:hover:bg-[#232328] text-sm",
    active:
      "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent",
  },
  progress: {
    wrap:
      "relative w-40 h-2 rounded bg-zinc-200 dark:bg-zinc-800 overflow-hidden",
    bar: "absolute left-0 top-0 h-full bg-zinc-500/70",
  },
  actions: {
    row: "mt-6 flex gap-2",
    primary:
      "px-4 py-2 rounded-md bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white text-sm",
    secondary:
      "px-4 py-2 rounded-md border border-gray-300/70 dark:border-white/10 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-[#232328] text-sm",
  },
};
