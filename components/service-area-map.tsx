'use client'

import { useState, useCallback, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Map, { Source, Layer, type MapRef, type MapLayerMouseEvent } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Montserrat } from 'next/font/google'
import geoData from '@/lib/quebec-municipalities.json'

const montserrat = Montserrat({ subsets: ['latin'], display: 'swap', weight: ['700', '800'] })

const SLUG_MAP: Record<string, string> = {
  'Laval': 'laval',
  'Blainville': 'blainville',
  'Bois-des-Filion': 'bois-des-filion',
  'Boisbriand': 'boisbriand',
  'Deux-Montagnes': 'deux-montagnes',
  'Lorraine': 'lorraine',
  'Mirabel': 'mirabel',
  'Oka': 'oka',
  'Pointe-Calumet': 'pointe-calumet',
  'Rosemère': 'rosemere',
  'Saint-Eustache': 'saint-eustache',
  'Saint-Joseph-du-Lac': 'saint-joseph-du-lac',
  'Sainte-Anne-des-Plaines': 'sainte-anne-des-plaines',
  'Sainte-Marthe-sur-le-Lac': 'sainte-marthe-sur-le-lac',
  'Sainte-Thérèse': 'sainte-therese',
}

function ringCentroid(ring: number[][]): [number, number] {
  let lon = 0, lat = 0
  for (const [x, y] of ring) { lon += x; lat += y }
  return [lon / ring.length, lat / ring.length]
}

type Props = { locale?: 'en' | 'fr' }

export default function ServiceAreaMap({ locale = 'en' }: Props) {
  const isFrench = locale === 'fr'
  const router = useRouter()
  const mapRef = useRef<MapRef>(null)
  const hoveredIdRef = useRef<number | string | null>(null)
  const [hoveredName, setHoveredName] = useState<string | null>(null)
  const [cursor, setCursor] = useState('grab')

  // Build a point FeatureCollection for city name labels (centroid of each polygon)
  const labelData = useMemo(() => ({
    type: 'FeatureCollection' as const,
    features: (geoData as any).features.map((f: any) => {
      const ring =
        f.geometry.type === 'Polygon'
          ? f.geometry.coordinates[0]
          : f.geometry.coordinates[0][0]
      const [lon, lat] = ringCentroid(ring)
      return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [lon, lat] },
        properties: { name: f.properties.name },
      }
    }),
  }), [])

  const onMouseMove = useCallback((e: MapLayerMouseEvent) => {
    const map = mapRef.current?.getMap()
    if (!map) return
    const features = map.queryRenderedFeatures(e.point, { layers: ['muni-fill'] })
    if (features.length > 0) {
      const { id } = features[0]
      const name = features[0].properties?.name as string
      if (hoveredIdRef.current !== null && hoveredIdRef.current !== id) {
        map.setFeatureState({ source: 'munis', id: hoveredIdRef.current }, { hover: false })
      }
      if (id !== undefined) {
        map.setFeatureState({ source: 'munis', id }, { hover: true })
        hoveredIdRef.current = id
      }
      setHoveredName(name)
      setCursor('pointer')
    } else {
      if (hoveredIdRef.current !== null) {
        map.setFeatureState({ source: 'munis', id: hoveredIdRef.current }, { hover: false })
        hoveredIdRef.current = null
      }
      setHoveredName(null)
      setCursor('grab')
    }
  }, [])

  const onMouseLeave = useCallback(() => {
    const map = mapRef.current?.getMap()
    if (map && hoveredIdRef.current !== null) {
      map.setFeatureState({ source: 'munis', id: hoveredIdRef.current }, { hover: false })
      hoveredIdRef.current = null
    }
    setHoveredName(null)
    setCursor('grab')
  }, [])

  const onClick = useCallback((e: MapLayerMouseEvent) => {
    const map = mapRef.current?.getMap()
    if (!map) return
    const features = map.queryRenderedFeatures(e.point, { layers: ['muni-fill'] })
    if (features.length > 0) {
      const name = features[0].properties?.name as string
      const slug = SLUG_MAP[name]
      if (slug) {
        router.push(isFrench ? `/fr/ramassage-dejections/${slug}` : `/dog-poop-cleanup/${slug}`)
      }
    }
  }, [isFrench, router])

  return (
    <section className="bg-white py-14 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        <div className="mb-8 text-center">
          <h2 className={`mb-3 text-3xl font-bold text-gray-900 md:text-4xl ${montserrat.className}`}>
            {isFrench ? 'Notre zone de service' : 'Our service area'}
          </h2>
          <p className="text-gray-500">
            {isFrench
              ? 'Cliquez sur votre ville pour voir les détails du service.'
              : 'Click your city to see service details.'}
          </p>
        </div>

        {/* Hover info bar */}
        <div className="mb-3 flex h-10 items-center justify-center">
          {hoveredName ? (
            <div className="flex items-center gap-2 rounded-full bg-[#307944] px-5 py-2 text-sm font-semibold text-white shadow-md transition-all">
              <span>{hoveredName}</span>
              <span className="opacity-50">—</span>
              <span className="opacity-75">
                {isFrench ? 'Voir le service →' : 'View service →'}
              </span>
            </div>
          ) : (
            <p className="text-sm text-gray-400">
              {isFrench ? "Survolez une ville pour l'identifier" : 'Hover a city to identify it'}
            </p>
          )}
        </div>

        <div
          className="overflow-hidden rounded-2xl border border-[#d7e6da] shadow-[0_20px_50px_rgba(48,121,68,0.12)]"
          style={{ height: 'clamp(320px, 55vw, 540px)' }}
        >
          <Map
            ref={mapRef}
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            initialViewState={{ longitude: -73.92, latitude: 45.635, zoom: 9.5 }}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/light-v11"
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            cursor={cursor}
          >
            {/* Municipality polygons */}
            <Source id="munis" type="geojson" data={geoData as any} generateId>
              <Layer
                id="muni-fill"
                type="fill"
                paint={{
                  'fill-color': '#307944',
                  'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    0.55,
                    0.28,
                  ],
                }}
              />
              <Layer
                id="muni-line"
                type="line"
                paint={{
                  'line-color': '#307944',
                  'line-width': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    2.5,
                    1.5,
                  ],
                  'line-opacity': 0.75,
                }}
              />
            </Source>

            {/* City name labels */}
            <Source id="labels" type="geojson" data={labelData}>
              <Layer
                id="muni-labels"
                type="symbol"
                layout={{
                  'text-field': ['get', 'name'],
                  'text-font': ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
                  'text-size': 11,
                  'text-max-width': 8,
                  'text-anchor': 'center',
                  'text-allow-overlap': false,
                }}
                paint={{
                  'text-color': '#1a4d28',
                  'text-halo-color': 'rgba(255,255,255,0.95)',
                  'text-halo-width': 2,
                }}
              />
            </Source>
          </Map>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-5 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-[#307944] opacity-50" />
            <span className="text-gray-500">{isFrench ? 'Zone desservie' : 'Service area'}</span>
          </div>
          <span>·</span>
          <span>{isFrench ? 'Données © OpenStreetMap' : 'Data © OpenStreetMap'}</span>
        </div>
      </div>
    </section>
  )
}
