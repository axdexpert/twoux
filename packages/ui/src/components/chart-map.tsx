/**
 * TwoUX map chart: regions shaded by one value (a choropleth), or circles sized by a count at points.
 * Built on d3-geo and topojson-client; the app passes its own TopoJSON, so no map data ships in the package.
 * Same rules as charts-more: own SVG, one tab stop, arrow keys between marks (here: regions or markers with
 * data, highest value first), Enter pins the details, Esc clears, and mapTable() for the Table view.
 * Colour is the five-step sequential scale (q1…q5) the Heatmap uses. Regions with no value are hatched and
 * labelled "No data" in the legend, never drawn as zero. No zoom or pan: the map fits its width.
 */
import * as React from "react"
import { geoPath, geoEqualEarth, geoMercator, geoConicEqualArea, type GeoProjection, type ExtendedFeature, type GeoGeometryObjects } from "d3-geo"
import { feature } from "topojson-client"
import type { Topology, GeometryObject } from "topojson-specification"
import { cn } from "../lib/cn"
import { Button } from "./button"
import { fmt, pct, svgCls, useWidth, niceStep } from "../lib/chart-kit"

/* ---------------------------------------------------------------- types */

/** Any TopoJSON topology, such as world-atlas/countries-110m.json imported as JSON. */
export type MapTopology = { type: string; objects: Record<string, unknown>; arcs: unknown; transform?: unknown; bbox?: unknown }
/** One value per region, joined to the shape by feature id (world-atlas uses ISO 3166-1 numeric codes such as "826"). */
export type MapValue = { id: string; value: number; label?: string }
/** A point sized by its value: circle area is proportional to the value. */
export type MapMarker = { id: string; label: string; lon: number; lat: number; value: number }
export type MapProjection = "equal-earth" | "mercator" | "albers-uk" | (() => GeoProjection)
/** What onSelect receives: the region or marker the person chose. */
export type MapRegion = { id: string; label: string; value: number }

type Encoding = { values: MapValue[]; markers?: never } | { markers: MapMarker[]; values?: never }

export type MapChartProps = Encoding & {
  topology: MapTopology
  /** Name of the object in the topology, e.g. "countries". */
  object: string
  /** Feature ids to leave off the map and out of the fit, e.g. ["010"] for Antarctica. */
  exclude?: string[]
  projection?: MapProjection
  /** Fixed height in px. By default the height follows the shape of the map at the current width. */
  height?: number
  format?: (n: number) => string
  /** Four class breaks for the five colour steps. Default: equal, rounded steps from 0 to the highest value. */
  thresholds?: [number, number, number, number]
  /** Show share of total in the details and table. Turn off for rates and averages, where a share means nothing. */
  share?: boolean
  /** Noun for the value in the details, e.g. "Applicants" or "ARR". */
  valueLabel?: string
  /** Drill-down: a pinned region's details offer one button that calls this. */
  onSelect?: (region: MapRegion) => void
  /** Button text in the pinned details. Name the action and where it lands: "Filter page". */
  selectLabel?: string
  /** Field name shown in the pinned details before the drill-down: "Country is France". */
  filterField?: string
  "aria-label": string
  className?: string
}

type Feat = ExtendedFeature<GeoGeometryObjects | null, { name?: string } | null> & { id?: string | number }
type Shape = { id: string; name: string; d: string; at: [number, number] }

/* ---------------------------------------------------------------- helpers */

const STEPS = ["fill-q1", "fill-q2", "fill-q3", "fill-q4", "fill-q5"] as const
const SWATCH = ["bg-q1", "bg-q2", "bg-q3", "bg-q4", "bg-q5"] as const

function makeProjection(p: MapProjection): GeoProjection {
  if (typeof p === "function") return p()
  if (p === "mercator") return geoMercator()
  // Equal-area conic centred on Great Britain and Ireland.
  if (p === "albers-uk") return geoConicEqualArea().parallels([50, 60]).rotate([4.4, 0]).center([0, 55.4])
  return geoEqualEarth()
}

/** Equal, rounded steps from 0: four breaks for five classes. */
export function mapThresholds(max: number): [number, number, number, number] {
  const s = niceStep(Math.max(max, 1) / 5)
  return [s, s * 2, s * 3, s * 4]
}

const classOf = (v: number, t: readonly number[]) => t.filter((b) => v >= b).length

/** Table view: region, value and share, highest first. */
export const mapTable = (values: MapValue[], { format = fmt, share = true, first = "Region", valueLabel = "Value" }: { format?: (n: number) => string; share?: boolean; first?: string; valueLabel?: string } = {}) => {
  const sorted = [...values].sort((a, b) => b.value - a.value)
  const total = values.reduce((a, v) => a + v.value, 0)
  return {
    columns: share ? [first, valueLabel, "Share"] : [first, valueLabel],
    rows: sorted.map((v) => (share ? [v.label ?? v.id, format(v.value), pct(v.value, total)] : [v.label ?? v.id, format(v.value)])),
  }
}

/* ---------------------------------------------------------------- map chart */

/** Where something is matters: regions shaded by a rate, or circles sized by a count. One measure per map. */
export function MapChart({
  topology,
  object,
  values,
  markers,
  exclude = [],
  projection = "equal-earth",
  height: fixedHeight,
  format = fmt,
  thresholds,
  share = true,
  valueLabel = "Value",
  onSelect,
  selectLabel = "Filter page",
  filterField = "Region",
  "aria-label": label,
  className,
}: MapChartProps) {
  const [wrap, width] = useWidth<HTMLDivElement>()
  const svgRef = React.useRef<SVGSVGElement>(null)
  const hatch = `${React.useId().replace(/:/g, "")}-nodata`
  const [active, setActive] = React.useState<number | null>(null)
  const [pinned, setPinned] = React.useState(false)
  const [hoverEmpty, setHoverEmpty] = React.useState<string | null>(null)

  const features = React.useMemo(() => {
    const topo = topology as unknown as Topology
    const obj = topo.objects[object] as GeometryObject | undefined
    if (!obj) return [] as Feat[]
    const fc = feature(topo, obj) as unknown as { features: Feat[] }
    return fc.features.filter((f) => !exclude.includes(String(f.id ?? f.properties?.name)))
  }, [topology, object, exclude.join("|")])

  const { shapes, height, project } = React.useMemo(() => {
    if (!width || !features.length) return { shapes: [] as Shape[], height: fixedHeight ?? 0, project: null as GeoProjection | null }
    const proj = makeProjection(projection)
    const coll = { type: "FeatureCollection" as const, features }
    let h = fixedHeight ?? 0
    if (fixedHeight) proj.fitSize([width, fixedHeight], coll)
    else {
      proj.fitWidth(width, coll)
      h = Math.ceil(geoPath(proj).bounds(coll)[1][1])
    }
    const path = geoPath(proj)
    const out: Shape[] = features.map((f) => {
      // Centre the details on the largest part, so France sits in Europe and not off French Guiana.
      let at = path.centroid(f)
      if (f.geometry?.type === "MultiPolygon") {
        const parts = (f.geometry.coordinates as number[][][][]).map((c) => ({ type: "Polygon" as const, coordinates: c }))
        const big = parts.reduce((a, p) => (path.area(p) > path.area(a) ? p : a), parts[0])
        at = path.centroid(big)
      }
      return { id: String(f.id ?? f.properties?.name), name: f.properties?.name ?? String(f.id), d: path(f) ?? "", at }
    })
    return { shapes: out, height: h, project: proj }
  }, [width, features, projection, fixedHeight])

  const byId = React.useMemo(() => new Map(shapes.map((s) => [s.id, s])), [shapes])
  const isMarkers = !!markers
  // Keyboard order: highest value first, among items that are on the map.
  const items: MapRegion[] = React.useMemo(() => {
    const raw = isMarkers ? markers!.map((m) => ({ id: m.id, label: m.label, value: m.value })) : values!.map((v) => ({ id: v.id, label: v.label ?? byId.get(v.id)?.name ?? v.id, value: v.value }))
    return raw.sort((a, b) => b.value - a.value)
  }, [values, markers, byId, isMarkers])
  const total = items.reduce((a, v) => a + v.value, 0)
  const max = Math.max(0, ...items.map((i) => i.value))
  const t = thresholds ?? mapThresholds(max)
  const valueOf = React.useMemo(() => new Map(items.map((i) => [i.id, i.value])), [items])
  const onMap = (i: MapRegion) => (isMarkers ? true : byId.has(i.id))
  const navigable = items.filter(onMap)
  const offMap = items.filter((i) => !onMap(i))
  const noData = isMarkers ? 0 : shapes.filter((s) => !valueOf.has(s.id)).length

  const markerGeo = React.useMemo(() => {
    if (!isMarkers || !project) return new Map<string, { x: number; y: number; r: number }>()
    const rMax = Math.max(6, Math.min(22, width / 28))
    return new Map(markers!.map((m) => {
      const [x, y] = project([m.lon, m.lat]) ?? [0, 0]
      return [m.id, { x, y, r: Math.max(2, Math.sqrt(m.value / (max || 1)) * rMax) }]
    }))
  }, [isMarkers, markers, project, width, max])

  const cur = active === null ? null : navigable[active] ?? null
  const posOf = (id: string): [number, number] | null => {
    if (isMarkers) { const g = markerGeo.get(id); return g ? [g.x, g.y] : null }
    return byId.get(id)?.at ?? null
  }

  const clear = () => { setPinned(false); setActive(null) }
  const onKey = (e: React.KeyboardEvent) => {
    const n = navigable.length
    if (!n) return
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); setPinned(false); setActive((a) => (a === null ? 0 : Math.min(n - 1, a + 1))) }
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); setPinned(false); setActive((a) => (a === null ? 0 : Math.max(0, a - 1))) }
    else if (e.key === "Home") { e.preventDefault(); setPinned(false); setActive(0) }
    else if (e.key === "End") { e.preventDefault(); setPinned(false); setActive(n - 1) }
    else if (e.key === "Enter" && active !== null) { e.preventDefault(); setPinned(true) }
    else if (e.key === "Escape") clear()
  }
  const pick = (id: string) => {
    const i = navigable.findIndex((r) => r.id === id)
    if (i >= 0) { setActive(i); setPinned(true) }
  }
  const hover = (id: string) => {
    if (pinned) return
    const i = navigable.findIndex((r) => r.id === id)
    setHoverEmpty(i < 0 ? id : null)
    setActive(i < 0 ? null : i)
  }

  const top3 = navigable.slice(0, 3).map((r) => `${r.label} ${format(r.value)}`).join(", ")
  const summary = `${label}. ${isMarkers ? `${navigable.length} places sized by value` : `${navigable.length} regions shaded by value`}. Highest: ${top3 || "none"}.${noData ? ` ${noData} regions have no data.` : ""} Arrow keys move from highest to lowest; Enter shows details.`

  const ranges = [
    `Under ${format(t[0])}`,
    `${format(t[0])} to ${format(t[1])}`,
    `${format(t[1])} to ${format(t[2])}`,
    `${format(t[2])} to ${format(t[3])}`,
    `${format(t[3])} and over`,
  ]

  // Details box: kept inside the map's width and height, never covering the region it describes.
  const box = (p: [number, number]) => {
    const w = 208
    const left = p[0] + 14 + w > width ? Math.max(0, p[0] - 14 - w) : p[0] + 14
    return { "--x": `${left}px`, "--y": `${Math.max(0, Math.min(p[1] - 24, height - 96))}px` } as React.CSSProperties
  }
  const curPos = cur ? posOf(cur.id) : null
  // On a narrow map the details would cover it, so they sit under the map instead.
  const narrow = width < 480
  const boxCls = (float: boolean) => cn("z-10 grid gap-1 rounded-md border border-line bg-surface px-2 py-2 text-sm shadow-pop", narrow ? "mt-2 w-full" : "absolute w-52 left-(--x) top-(--y)", !float && "pointer-events-none")
  const emptyShape = hoverEmpty ? byId.get(hoverEmpty) : null

  return (
    <div className={cn("grid gap-3", className)}>
      <div ref={wrap} className="relative w-full">
        {width > 0 && height > 0 && (
          <svg
            ref={svgRef}
            width={width}
            height={height}
            role="group"
            tabIndex={0}
            aria-roledescription="map"
            aria-label={summary}
            onKeyDown={onKey}
            onMouseLeave={() => { setHoverEmpty(null); if (!pinned) setActive(null) }}
            className={svgCls}
          >
            <defs>
              <pattern id={hatch} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="5" height="5" className="fill-surface-2" />
                <line x1="0" y1="0" x2="0" y2="5" strokeWidth="1.25" strokeOpacity={0.45} className="stroke-ink-3" />
              </pattern>
            </defs>
            {shapes.map((s) => {
              const v = valueOf.get(s.id)
              const has = !isMarkers && v !== undefined
              return (
                <path
                  key={s.id}
                  d={s.d}
                  fill={isMarkers ? "var(--color-hover)" : has ? undefined : `url(#${hatch})`}
                  strokeWidth={0.5}
                  className={cn("stroke-surface", has && STEPS[classOf(v!, t)], !isMarkers && "cursor-pointer")}
                  onMouseEnter={isMarkers ? undefined : () => hover(s.id)}
                  onClick={isMarkers ? undefined : () => pick(s.id)}
                />
              )
            })}
            {!isMarkers && cur && byId.get(cur.id) && <path d={byId.get(cur.id)!.d} fill="none" strokeWidth={1.5} className="pointer-events-none stroke-ink" />}
            {isMarkers && [...markers!].sort((a, b) => b.value - a.value).map((m) => {
              const g = markerGeo.get(m.id)!
              const on = cur?.id === m.id
              return (
                <circle
                  key={m.id}
                  cx={g.x}
                  cy={g.y}
                  r={g.r}
                  fill="var(--color-c1)"
                  fillOpacity={on ? 0.85 : 0.5}
                  strokeWidth={on ? 1.5 : 1}
                  className={cn("cursor-pointer", on ? "stroke-ink" : "stroke-surface")}
                  onMouseEnter={() => hover(m.id)}
                  onClick={() => pick(m.id)}
                />
              )
            })}
          </svg>
        )}
        {cur && curPos && (
          <div
            role={pinned ? "dialog" : "status"}
            aria-label={pinned ? cur.label : undefined}
            onKeyDown={(e) => { if (e.key === "Escape") { e.stopPropagation(); clear(); svgRef.current?.focus() } }}
            className={boxCls(pinned)}
            style={narrow ? undefined : box(curPos)}
          >
            <span className="font-medium text-ink">{cur.label}</span>
            <span className="flex justify-between gap-3 text-ink-2">{valueLabel}<span className="tabular font-medium text-ink">{format(cur.value)}</span></span>
            {share && <span className="flex justify-between gap-3 text-ink-2">Share of total<span className="tabular font-medium text-ink">{pct(cur.value, total)}</span></span>}
            <span className="flex justify-between gap-3 text-ink-2">Rank<span className="tabular font-medium text-ink">{items.indexOf(cur) + 1} of {items.length}</span></span>
            {pinned && onSelect && (
              <div className="mt-1 grid gap-2 border-t border-line pt-2">
                <span className="text-xs text-ink-3">{filterField} is {cur.label}</span>
                <Button size="xs" variant="outline" autoFocus onClick={() => { onSelect(cur); clear(); svgRef.current?.focus() }}>{selectLabel}</Button>
              </div>
            )}
          </div>
        )}
        {!cur && emptyShape && (
          <div role="status" className={boxCls(false)} style={narrow ? undefined : box(emptyShape.at)}>
            <span className="font-medium text-ink">{emptyShape.name}</span>
            <span className="text-ink-2">No data</span>
          </div>
        )}
      </div>
      {!isMarkers && (
        <ul className="flex flex-wrap gap-x-4 gap-y-1" aria-label={`Legend: ${valueLabel}`}>
          {ranges.map((r, i) => (
            <li key={r} className="inline-flex items-center gap-control text-sm text-ink-2">
              <span aria-hidden="true" className={cn("size-2.5 shrink-0 rounded-xs", SWATCH[i])} />
              <span className="tabular">{r}</span>
            </li>
          ))}
          {noData > 0 && (
            <li className="inline-flex items-center gap-control text-sm text-ink-2">
              <svg aria-hidden="true" width="10" height="10" className="shrink-0 overflow-hidden rounded-xs"><rect width="10" height="10" fill={`url(#${hatch})`} /></svg>
              No data
            </li>
          )}
        </ul>
      )}
      {isMarkers && max > 0 && (
        <p className="text-sm text-ink-2">Circle area shows {valueLabel}. Largest: {navigable[0]?.label} {format(max)}.</p>
      )}
      {offMap.length > 0 && (
        <p className="text-sm text-ink-3">Not on this map: {offMap.map((r) => r.label).join(", ")}. See the table view.</p>
      )}
    </div>
  )
}
