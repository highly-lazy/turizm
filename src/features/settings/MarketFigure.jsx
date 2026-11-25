/** Mavzu chizmasi: bozor (TAM) ichidan maqsadli segment va unga yetkazuvchi kanallar. */
export function MarketFigure() {
  return (
    <svg className="hero__figure" viewBox="0 0 420 340" role="img" aria-label="TAM ichida SAM, uning ichida SOM; uchta kanal maqsadli segmentga olib boradi">
      <circle cx="170" cy="175" r="150" fill="#14404a" />
      <path d="M170 175V25A150 150 0 0 1 300 100Z" fill="#1d5560" />
      <path d="M170 175L40 250A150 150 0 0 1 40 100Z" fill="#194a54" />
      <circle cx="170" cy="195" r="104" fill="#0f8b83" />
      <circle cx="170" cy="222" r="56" fill="#ff6b4a" />
      <g fill="#fff" textAnchor="middle" fontWeight="700">
        <text x="170" y="62" fontSize="17">TAM</text>
        <text x="170" y="81" fontSize="12" fontWeight="500" opacity=".85">butun bozor</text>
        <text x="170" y="124" fontSize="17">SAM</text>
        <text x="170" y="143" fontSize="12" fontWeight="500" opacity=".9">mos bozor</text>
        <text x="170" y="220" fontSize="17" fill="#2b0d05">SOM</text>
        <text x="170" y="238" fontSize="12" fontWeight="600" fill="#2b0d05">maqsad</text>
      </g>
      <g fill="none" stroke="#ffb627" strokeWidth="2.5" strokeDasharray="5 6" strokeLinecap="round">
        <path d="M330 92C280 92 262 170 222 204" />
        <path d="M330 176C290 176 262 204 230 216" />
        <path d="M330 260C290 260 262 244 228 234" />
      </g>
      <g fontWeight="700" fontSize="14" textAnchor="middle" fill="#0d2b33">
        {['SEO', 'SMM', 'Email'].map((label, i) => (
          <g key={label}>
            <rect x="328" y={74 + i * 84} width="84" height="36" rx="18" fill="#ffb627" />
            <text x="370" y={97 + i * 84}>{label}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}
