import React, { useState, useEffect, useRef } from 'react';
import { ComposableMap, ZoomableGroup, Geographies, Geography } from 'react-simple-maps';
import { Link } from 'react-router-dom';

interface GlobeProps { size?: number; className?: string; linkTo?: string; speed?: number; }

const WORLD_TOPO_JSON = 'https://unpkg.com/world-atlas@2.0.2/land-110m.json';

const Globe: React.FC<GlobeProps> = ({ size = 320, className = '', linkTo = '/dashboard', speed = 0.18 }) => {
  const [angle, setAngle] = useState(0);
  const [worldData, setWorldData] = useState<any | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(WORLD_TOPO_JSON)
      .then(r => r.json())
      .then(data => { if (!cancelled) setWorldData(data); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let last = performance.now();
    const interval = 1000 / 60;
    const animate = (now: number) => {
      if (now - last >= interval) {
        setAngle(a => a + speed);
        last = now;
      }
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [speed]);

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => linkTo ? (
    <Link to={linkTo} aria-label="Explore Dashboard via interactive globe">{children}</Link>
  ) : <>{children}</>;

  return (
    <div
      className={[
        'relative rounded-full p-3 border border-gray-700/60 bg-gray-900/40',
        'transition-colors duration-300 hover:bg-gray-900/60',
        'shadow-md hover:shadow-lg',
        className,
      ].join(' ')}
      style={{ width: size, height: size }}
    >
      <Wrapper>
        {worldData && (
          <ComposableMap
            projection="geoOrthographic"
            projectionConfig={{ scale: (size / 2) - 10, rotate: [angle, 0, 0] }}
            width={size}
            height={size}
            style={{ width: '100%', height: '100%' }}
          >
            <ZoomableGroup disablePanning>
              <Geographies geography={worldData}>
                {({ geographies }: { geographies: any[] }) => (
                  geographies.map((geo: any) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      style={{
                        default: { fill: '#374151', stroke: '#475569', strokeWidth: 0.4, outline: 'none' },
                        hover: { fill: '#4b5563', stroke: '#64748b', strokeWidth: 0.5, outline: 'none' },
                        pressed: { fill: '#4b5563', stroke: '#64748b', strokeWidth: 0.5, outline: 'none' },
                      }}
                    />
                  ))
                )}
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        )}
        {!worldData && (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">Loading…</div>
        )}
      </Wrapper>
    </div>
  );
};

export default Globe;
