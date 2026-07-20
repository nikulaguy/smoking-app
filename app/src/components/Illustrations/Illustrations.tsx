import { cx } from "class-variance-authority";
import type { SVGAttributes } from "react";
import styles from "./Illustrations.module.css";

/**
 * Illustrations animées en boucle des écrans de jalon (SVG inline, sources
 * Figma : rocket 8:196, idea 28:286, thumb-up 64:999, trophy 32:323,
 * medal 65:1020). Chaque illustration raconte son micro-scénario en boucle
 * (voir Illustrations.module.css) ; purement décoratives (aria-hidden) et
 * figées avec prefers-reduced-motion.
 */
type IlluProps = SVGAttributes<SVGSVGElement> & { size?: number };

/** Fusée : décollage en diagonale avec fumée, retour avec rebond. */
export const Rocket = ({ size = 92, className, ...props }: IlluProps) => (
  <svg
    aria-hidden
    width={size}
    height={size}
    viewBox="0 0 93 93"
    fill="none"
    className={cx(styles.rocket, className)}
    {...props}
  >
    {/* traînées de vitesse au sol : scintillent pendant le vol */}
    <g className={styles.rocketLines} stroke="#282839" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.7972 52.0748L12.7036 61.1685" />
      <path d="M6.48409 67.3901L0.5 73.3743" />
      <path d="M34.1792 64.3972L21.1538 77.4844" />
      <path d="M40.9236 71.2034L20.3872 91.7955" />
    </g>
    {/* volutes de fumée au décollage et à l'atterrissage */}
    <g fill="#CCCCDB">
      <circle className={styles.smokeA} cx="34" cy="60" r="4.5" />
      <circle className={styles.smokeB} cx="28" cy="66" r="3.5" />
      <circle className={styles.smokeC} cx="38" cy="66" r="3" />
    </g>
    {/* le vaisseau complet voyage d'un bloc */}
    <g className={styles.rocketShip}>
      <path className={styles.rocketFlame} d="M45.3247 66.92L51.0183 52.0771L40.3977 41.5121L26.1421 47.7373L45.3247 66.92Z" fill="#F3F4F7" stroke="#282839" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M59.4697 61.4595L64.9222 56.007C68.3284 52.6007 68.3284 47.1482 64.9222 43.7419L64.3967 43.3339L52.6016 54.5975L53.3063 55.3022L59.4697 61.4595Z" fill="#F3F4F7" stroke="#282839" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M31.54 33.5356L36.9988 28.0769C40.3988 24.6706 45.8575 24.6706 49.2575 28.0769L49.7892 28.4849L38.229 40.1627L37.6973 39.6372L31.54 33.5356Z" fill="#F3F4F7" stroke="#282839" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M75.7776 32.8331L83.1156 25.4951L67.5062 9.89185L37.6968 39.6951L53.3062 55.3046L71.4379 37.1729L75.7776 32.8331Z" fill="#4B4B66" stroke="#282839" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M83.1152 25.4927L85.7549 7.24969L67.5058 9.8894L66.6279 10.7672L81.9406 26.7291L83.1152 25.4927Z" fill="#4B4B66" stroke="#282839" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M60.4643 38.4028C57.225 38.4028 54.5977 35.7755 54.5977 32.5361C54.5977 29.2968 57.225 26.6694 60.4643 26.6694C63.7037 26.6694 66.331 29.2968 66.331 32.5361C66.331 35.7755 63.7037 38.4028 60.4643 38.4028Z" fill="#E7E7EE" stroke="#282839" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M85.7554 7.25071L92.4998 0.5" stroke="#282839" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

/** Ampoule : s'allume en scintillant, brille, s'éteint, se rallume. */
export const Idea = ({ size = 110, className, ...props }: IlluProps) => (
  <svg
    aria-hidden
    width={size}
    height={size}
    viewBox="0 0 101 101"
    fill="none"
    className={cx(styles.idea, className)}
    {...props}
  >
    <path d="M50.5 100.5C78.1149 100.5 100.5 78.1149 100.5 50.5C100.5 22.8851 78.1149 0.5 50.5 0.5C22.8851 0.5 0.5 22.8851 0.5 50.5C0.5 78.1149 22.8851 100.5 50.5 100.5Z" fill="#E7E7EE" stroke="#282839" strokeLinecap="round" strokeLinejoin="round" />
    {/* halo derrière le verre quand la lampe est allumée */}
    <circle className={styles.ideaGlow} cx="50.5" cy="40.4" r="27" />
    {/* rayons courts autour du verre */}
    <g className={styles.ideaRays} strokeWidth="1.5" strokeLinecap="round">
      <path d="M50.5 12.5V6.5" />
      <path d="M30.7 20.5L26.5 16.3" />
      <path d="M70.3 20.5L74.5 16.3" />
      <path d="M23 40.4H17" />
      <path d="M78 40.4H84" />
    </g>
    {/* verre : sa teinte s'anime (blanc → jaune) */}
    <path className={styles.ideaGlass} d="M50.5 59.8417C61.2541 59.8417 69.9659 51.1298 69.9659 40.3758C69.9659 29.6283 61.2541 20.9099 50.5 20.9099C39.746 20.9099 31.0342 29.6283 31.0342 40.3758C31.0342 51.1298 39.746 59.8417 50.5 59.8417Z" stroke="#282839" strokeLinecap="round" />
    <path d="M56.0309 76.1257H45.0216C42.6194 76.1257 40.6362 74.1424 40.6362 71.7403V57.1311H60.4163V71.7403C60.4163 74.1424 58.433 76.1257 56.0309 76.1257Z" fill="#7D7D9B" stroke="#282839" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M54.5188 76.1261C54.5188 78.3188 52.745 80.0926 50.5523 80.0926C48.3596 80.0926 46.5858 78.3188 46.5858 76.1261H54.5188Z" fill="#7D7D9B" stroke="#282839" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M40.6362 71.5819H54.7807" stroke="#282839" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M40.6362 66.6286H60.4163" stroke="#282839" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M40.6362 61.665H51.5408" stroke="#282839" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M56.5546 61.665H60.4164" stroke="#282839" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M55.3564 57.1314H45.6954L43.7122 41.6778H57.3396L55.3564 57.1314Z" stroke="#282839" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M41.4742 41.6778H59.5787" stroke="#282839" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Pouce : la main arrive pouce couché, puis le lève avec un ressort. */
export const ThumbUp = ({ size = 110, className, ...props }: IlluProps) => (
  <svg
    aria-hidden
    width={size}
    height={size}
    viewBox="0 0 101 102"
    fill="none"
    className={cx(styles.thumb, className)}
    {...props}
  >
    <path d="M50.5 100.62C78.1133 100.62 100.5 78.2067 100.5 50.5602C100.5 22.9137 78.1133 0.5 50.5 0.5C22.8867 0.5 0.5 22.9137 0.5 50.5602C0.5 78.2067 22.8867 100.62 50.5 100.62Z" fill="#E7E7EE" stroke="#282839" strokeLinecap="round" strokeLinejoin="round" />
    <g className={styles.thumbHand}>
      <path d="M40.4464 75.8878H69.2362V42.5196H49.6909L56.8864 25.3708H45.673L38.4775 42.5196H24.6868V75.8878H34.3795" fill="#A5A4BC" />
      <path d="M40.4464 75.8878H69.2362V42.5196H49.6909L56.8864 25.3708H45.673L38.4775 42.5196H24.6868V75.8878H34.3795" stroke="#282839" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M49.691 42.5218C53.701 42.5218 56.9585 45.7833 56.9585 49.7981" stroke="#282839" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M49.691 57.079C51.2038 57.079 52.5644 56.6222 53.781 55.869C55.7499 54.5788 56.9585 52.3751 56.9585 49.7947" stroke="#282839" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M76.8882 42.5218H61.6569V50.8639H76.8882V42.5218Z" fill="#A5A4BC" stroke="#282839" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M76.8882 50.8606H61.6569V59.2026H76.8882V50.8606Z" fill="#A5A4BC" stroke="#282839" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M76.8882 59.2047H61.6569V67.5467H76.8882V59.2047Z" fill="#A5A4BC" stroke="#282839" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M76.8882 67.5474H61.6569V75.8894H76.8882V67.5474Z" fill="#A5A4BC" stroke="#282839" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

/** Trophée : tremble, le couvercle saute, des confettis s'échappent. */
export const Trophy = ({ size = 110, className, ...props }: IlluProps) => (
  <svg
    aria-hidden
    width={size}
    height={size}
    viewBox="0 0 100 101"
    fill="none"
    className={cx(styles.trophy, className)}
    {...props}
  >
    {/* confettis : jaillissent de la coupe quand le couvercle saute */}
    <g className={styles.trophyConfetti}>
      <rect className={styles.confetti1} x="46" y="12" width="3" height="6" rx="1" fill="#F5D96B" />
      <rect className={styles.confetti2} x="52" y="12" width="3" height="6" rx="1" fill="#7D7D9B" />
      <circle className={styles.confetti3} cx="44" cy="15" r="2" fill="#CCCCDB" />
      <circle className={styles.confetti4} cx="57" cy="14" r="2" fill="#F5D96B" />
      <rect className={styles.confetti5} x="49" y="10" width="3" height="6" rx="1" fill="#4B4B66" />
      <circle className={styles.confetti6} cx="50" cy="16" r="2" fill="#7D7D9B" />
    </g>
    {/* couvercle : plaque haute + antenne */}
    <g className={styles.trophyLid}>
      <path d="M59.2622 5.79076H40.8034V13.0952H59.2622V5.79076Z" fill="#CCCCDB" stroke="#7D7D9B" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M49.9901 5.79114V0.5" stroke="#7D7D9B" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    {/* corps du trophée : tremble avant l'ouverture */}
    <g className={styles.trophyCup}>
      <path d="M66.7549 11.7412H69.2961V19.5939H30.6844V11.7412H62.7963" fill="#CCCCDB" stroke="#7D7D9B" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M73.1471 17.6465H26.7879V46.4992C26.7879 59.3069 37.1393 69.6583 49.9471 69.6583C62.7532 69.6583 73.1063 59.3069 73.1063 46.4992V17.6465H73.1471Z" fill="#CCCCDB" stroke="#7D7D9B" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M58.8373 94.5519H41.1407C37.839 94.5519 35.1926 97.1984 35.1926 100.5H64.7447C64.7871 97.1984 62.0982 94.5519 58.8373 94.5519Z" fill="#7D7D9B" stroke="#7D7D9B" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20.7977 44.8896C14.7002 44.8896 9.70444 39.9362 9.70444 33.798C9.70444 27.7006 14.6595 22.7048 20.7977 22.7048H26.8527" stroke="#7D7D9B" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M79.2023 44.8896C85.2998 44.8896 90.2956 39.9362 90.2956 33.798C90.2956 27.7006 85.3405 22.7048 79.2023 22.7048H73.1473" stroke="#7D7D9B" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M66.7552 22.7472V32.8881" stroke="#7D7D9B" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M66.7552 36.4856V41.5458" stroke="#7D7D9B" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21.6873 17.6465H78.2926" stroke="#7D7D9B" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M49.9901 69.7004V94.552" stroke="#7D7D9B" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

/** Médaille : les rubans se déroulent comme des rideaux puis flottent au vent. */
export const Medal = ({ size = 110, className, ...props }: IlluProps) => (
  <svg
    aria-hidden
    width={size}
    height={size}
    viewBox="0 0 100 101"
    fill="none"
    className={cx(styles.medal, className)}
    {...props}
  >
    {/* rubans : déroulé rideau (groupe), puis balancement déphasé (sous-groupes) */}
    <g className={styles.medalRibbons}>
      <g className={styles.medalRibbonL}>
        <path d="M35.6263 100.5L25.3891 83.7107L7.53499 91.9818L24.8967 34.7344L52.9081 43.169L35.6263 100.5Z" fill="#4B4B66" stroke="#282839" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className={styles.medalRibbonR}>
        <path d="M82.8022 59.9603L75.1034 34.7344L47.092 43.169L64.3738 100.5L74.6927 83.7107L92.4651 91.9818L87.7972 76.5044" fill="#4B4B66" stroke="#282839" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M86.4051 71.835L84.1938 64.7105" stroke="#282839" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
    {/* disque : léger balancement, comme suspendu */}
    <g className={styles.medalDisc}>
      <path d="M50.041 53.8989C64.7826 53.8989 76.7405 41.941 76.7405 27.1995C76.7405 12.4579 64.7826 0.5 50.041 0.5C35.2901 0.5 23.3415 12.4579 23.3415 27.1995C23.3415 41.941 35.2901 53.8989 50.041 53.8989Z" fill="#E7E7EE" stroke="#282839" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M50.0409 11.9662C58.4774 11.9662 65.2749 18.7637 65.2749 27.2002C65.2749 35.6367 58.4774 42.4342 50.0409 42.4342C46.356 42.4342 42.9163 41.1241 40.2943 38.9128" fill="#E7E7EE" />
      <path d="M50.0409 11.9662C58.4774 11.9662 65.2749 18.7637 65.2749 27.2002C65.2749 35.6367 58.4774 42.4342 50.0409 42.4342C46.356 42.4342 42.9163 41.1241 40.2943 38.9128" stroke="#282839" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M34.725 27.1997C34.725 22.1211 37.1816 17.6167 41.0319 14.833" stroke="#282839" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);
