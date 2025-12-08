interface AbstractBackgroundProps {
  /**
   * Number of animated orbs to display
   * @default 3
   */
  orbCount?: number;
  /**
   * Opacity of the orbs (0-1)
   * @default 0.2
   */
  opacity?: number;
  /**
   * Animation duration in seconds
   * @default 3
   */
  animationDuration?: number;
}

interface OrbConfig {
  position: string;
  size: string;
  gradient: string;
  delay: string;
}

const DEFAULT_ORBS: OrbConfig[] = [
  {
    position: "-left-4 top-20",
    size: "h-72 w-72",
    gradient: "from-blue-400 to-indigo-400",
    delay: "0s",
  },
  {
    position: "right-10 top-40",
    size: "h-96 w-96",
    gradient: "from-purple-400 to-pink-400",
    delay: "1s",
  },
  {
    position: "-bottom-10 left-1/3",
    size: "h-80 w-80",
    gradient: "from-indigo-400 to-blue-400",
    delay: "2s",
  },
];

/**
 * Abstract animated background with floating gradient orbs
 * Used across authentication and application pages for visual consistency
 */
export function AbstractBackground({ orbCount = 3, opacity = 0.2, animationDuration = 3 }: AbstractBackgroundProps) {
  const orbs = DEFAULT_ORBS.slice(0, orbCount);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {orbs.map((orb, index) => (
        <div
          key={index}
          className={`absolute ${orb.position} ${orb.size} animate-pulse rounded-full bg-gradient-to-r ${orb.gradient} blur-3xl`}
          style={{
            opacity,
            animationDelay: orb.delay,
            animationDuration: `${animationDuration}s`,
          }}
        />
      ))}
    </div>
  );
}
