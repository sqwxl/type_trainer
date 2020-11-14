
const light = {
  "--color-primary": "#fff",
  "--color-secondary": "#eee",
  "--color-tertiary": "#ddd",
  
  "--text-primary": "#0e0e0e",
  "--text-secondary": "#999",

  "--color-accent": "#5e5e5e",
  "--text-accent": "#eee",
  "--text-background-highlight": "#66ffff",
  "--text-color-highlight": "#ffffff",

  "--mistake": "#ff6666",
  "--correct": "#b3ff66",
  color: "var(--text-primary)"
}

const dark = {
  "--color-primary": "#303030",
  "--color-secondary": "#777",
  "--color-tertiary": "#555",
  
  "--text-primary": "#eee",
  "--text-secondary": "#999",
  
  "--color-accent": "#eee",
  "--text-accent": "#111",
  "--text-background-highlight": "#66ffff",
  "--text-color-highlight": "#ffffff",
  "--mistake": "#ff6666",
  "--correct": "#b3ff66",
  color: "var(--text-primary)"
}

export const themes = {
  light: light,
  dark: dark,
}
