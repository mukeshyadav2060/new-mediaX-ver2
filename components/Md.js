import s from "@/styles/site.module.css"

// Just enough Markdown for the CMS's legal and about text, without adding a dependency.
const inline = (text) =>
  text
    .split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g)
    .filter(Boolean)
    .map((part, i) => {
      const bold = part.match(/^\*\*(.+)\*\*$/)
      if (bold) return <strong key={i}>{bold[1]}</strong>
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (link) return <a key={i} href={link[2]}>{link[1]}</a>
      return part
    })

export default function Md({ children, legal }) {
  const blocks = String(children || "").split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean)
  return (
    <div className={`${s.prose} ${legal ? s.proseLegal : ""}`}>
      {blocks.map((b, i) => {
        const h = b.match(/^#{1,6}\s+(.+)$/)
        if (h) return <h2 key={i}>{h[1]}</h2>
        const lines = b.split("\n")
        if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{inline(l.replace(/^\s*[-*]\s+/, ""))}</li>
              ))}
            </ul>
          )
        }
        return <p key={i}>{inline(b.replace(/\n/g, " "))}</p>
      })}
    </div>
  )
}
