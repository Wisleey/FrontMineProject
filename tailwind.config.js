/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        fundo: "#020617",
        card: "#0f172a",
        borda: "#1e293b",
        destaque: "#38bdf8",
        sucesso: "#22c55e",
        alerta: "#f59e0b",
        perigo: "#ef4444"
      },
      boxShadow: {
        card: "0 20px 50px -24px rgba(15, 23, 42, 0.75)"
      },
      backgroundImage: {
        grade:
          "radial-gradient(circle at top left, rgba(56,189,248,0.18), transparent 30%), radial-gradient(circle at bottom right, rgba(139,92,246,0.12), transparent 25%)"
      }
    }
  },
  plugins: []
}
