import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HeroSection({
  badge = "Sistem BAZNAS Terintegrasi",
  title = "Pemantauan Nasional",
  highlightedWord = "Nasional",
  description = "Pusat kendali data wilayah BAZNAS seluruh Indonesia. Kelola organisasi, awasi perkembangan daerah, dan optimalkan layanan secara terpusat.",
  primaryCta = { label: "Eksplorasi Nasional", href: "/explore" },
  secondaryCta = { label: "Pelajari Lebih Lanjut", href: "#" },
  stats = { value: "34", label: "Provinsi Aktif" },
}) {
  return (
    <section className="relative overflow-hidden px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-5xl text-center">
        <div className="mb-6 flex justify-center">
          <Badge variant="secondary" className="gap-1.5 px-4 py-1 text-xs uppercase tracking-wider">
            <Sparkles className="size-3" />
            {badge}
          </Badge>
        </div>

        <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl uppercase leading-[1.05]">
          {title.includes(highlightedWord) ? (
            <>
              {title.split(highlightedWord)[0]}
              <span className="text-baznas-green block mt-1">{highlightedWord}</span>
              {title.split(highlightedWord)[1]}
            </>
          ) : (
            title
          )}
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-sm text-slate-500 sm:text-base leading-relaxed">
          {description}
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="h-11 rounded-full bg-baznas-green text-white hover:bg-baznas-dark px-6 text-xs font-bold uppercase tracking-wider shadow-xl shadow-baznas-green/20">
            <a href={primaryCta.href}>
              {primaryCta.label}
              <ArrowRight className="ml-1 size-4" />
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-11 rounded-full px-6 text-xs font-bold uppercase tracking-wider border-slate-300">
            <a href={secondaryCta.href}>{secondaryCta.label}</a>
          </Button>
        </div>

        {stats && (
          <div className="mt-12 flex items-center justify-center gap-8 border-t border-slate-100 pt-8">
            <div className="text-center">
              <div className="text-2xl font-black text-baznas-ink">{stats.value}</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{stats.label}</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
