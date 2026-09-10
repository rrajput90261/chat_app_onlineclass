import React from 'react';

const CuteLamp = ({ isOn, onToggle, isPulling, theme = 'green' }) => {
  const isBlue = theme === 'blue';

  return (
    <div className={`cute-lamp-container ${isOn ? 'is-on' : 'is-off'} theme-${theme}`}>
      <svg
        viewBox="0 0 280 400"
        className="cute-lamp-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* ================= LIGHT BEAM GRADIENTS ================= */}
          {/* GREEN Light Cone (Sign In) */}
          <linearGradient id="lightConeGradGreen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 220, 0.45)" />
            <stop offset="35%" stopColor="rgba(167, 243, 208, 0.25)" />
            <stop offset="70%" stopColor="rgba(34, 197, 94, 0.08)" />
            <stop offset="100%" stopColor="rgba(34, 197, 94, 0)" />
          </linearGradient>

          {/* BLUE Light Cone (Sign Up) */}
          <linearGradient id="lightConeGradBlue" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(224, 242, 254, 0.55)" />
            <stop offset="35%" stopColor="rgba(147, 197, 253, 0.28)" />
            <stop offset="70%" stopColor="rgba(59, 130, 246, 0.1)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
          </linearGradient>

          {/* ================= LAMP SHADE GRADIENTS (ON) ================= */}
          {/* GREEN Lamp Shade (Sign In) */}
          <linearGradient id="shadeGradOnGreen" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#648b71" />
            <stop offset="45%" stopColor="#87b293" />
            <stop offset="85%" stopColor="#759d81" />
            <stop offset="100%" stopColor="#557760" />
          </linearGradient>

          {/* BLUE Lamp Shade (Sign Up) */}
          <linearGradient id="shadeGradOnBlue" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1d4ed8" />
            <stop offset="45%" stopColor="#3b82f6" />
            <stop offset="85%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#1e40af" />
          </linearGradient>

          {/* ================= LAMP SHADE GRADIENTS (OFF) ================= */}
          <linearGradient id="shadeGradOffGreen" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3c5344" />
            <stop offset="50%" stopColor="#4f6c59" />
            <stop offset="100%" stopColor="#324438" />
          </linearGradient>

          <linearGradient id="shadeGradOffBlue" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e3a5f" />
            <stop offset="50%" stopColor="#254875" />
            <stop offset="100%" stopColor="#172b47" />
          </linearGradient>

          {/* Metallic Stem Gradient */}
          <linearGradient id="stemGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="50%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>

          {/* Base Gradient */}
          <radialGradient id="baseGrad" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="60%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </radialGradient>

          {/* Ambient Glow Filter */}
          <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ================= LIGHT CONE BEAM ================= */}
        {isOn && (
          <g className="light-cone-group">
            <polygon
              points="54,195 206,195 275,396 -10,396"
              fill={isBlue ? 'url(#lightConeGradBlue)' : 'url(#lightConeGradGreen)'}
              style={{ transition: 'fill 0.5s ease' }}
            />
          </g>
        )}

        {/* ================= LAMP STEM ================= */}
        <rect
          x="124"
          y="192"
          width="12"
          height="158"
          rx="6"
          fill="url(#stemGrad)"
        />

        {/* ================= LAMP BASE ================= */}
        <g className="lamp-base">
          <ellipse cx="130" cy="354" rx="64" ry="18" fill="#64748b" opacity="0.4" />
          <ellipse cx="130" cy="350" rx="60" ry="16" fill="#94a3b8" />
          <ellipse cx="130" cy="347" rx="58" ry="14" fill="url(#baseGrad)" />
          <ellipse cx="130" cy="345" rx="46" ry="9" fill="#e2e8f0" opacity="0.6" />
        </g>

        {/* ================= PULL CORD ================= */}
        <g
          className={`lamp-cord ${isPulling ? 'pulling' : ''}`}
          onClick={onToggle}
          style={{ cursor: 'pointer' }}
        >
          {/* Transparent hit area for easy clicking */}
          <rect x="74" y="195" width="30" height="90" fill="transparent" />

          {/* Cord string */}
          <line
            x1="88"
            y1="195"
            x2="88"
            y2={isPulling ? 275 : 248}
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            className="cord-line"
          />

          {/* Pull knob / handle at end */}
          <circle
            cx="88"
            cy={isPulling ? 282 : 255}
            r="7"
            fill="#ffffff"
            stroke="#94a3b8"
            strokeWidth="1.5"
            className="cord-bead"
          />
        </g>

        {/* ================= INNER LAMP BULB RIM ================= */}
        <ellipse
          cx="130"
          cy="195"
          rx="76"
          ry="15"
          fill={isOn ? (isBlue ? '#bfdbfe' : '#fef08a') : '#2d3748'}
          filter={isOn ? 'url(#glowEffect)' : undefined}
          style={{ transition: 'fill 0.5s ease' }}
        />

        {/* ================= LAMP SHADE ================= */}
        <path
          d="M 54 195 Q 130 208 206 195 L 180 75 Q 130 68 80 75 Z"
          fill={
            isOn
              ? (isBlue ? 'url(#shadeGradOnBlue)' : 'url(#shadeGradOnGreen)')
              : (isBlue ? 'url(#shadeGradOffBlue)' : 'url(#shadeGradOffGreen)')
          }
          stroke={
            isOn
              ? (isBlue ? '#60a5fa' : '#9bc4a7')
              : (isBlue ? '#254875' : '#405747')
          }
          strokeWidth="1.5"
          style={{ transition: 'all 0.5s ease' }}
        />

        {/* ================= CUTE EYES & MOUTH ================= */}
        {isOn ? (
          /* AWAKE & HAPPY FACE */
          <g className="lamp-face awake">
            {/* Left eye happy arch */}
            <path
              d="M 88 126 Q 97 114 106 126"
              stroke="#0f172a"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            {/* Right eye happy arch */}
            <path
              d="M 154 126 Q 163 114 172 126"
              stroke="#0f172a"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />

            {/* Cute Rosy Cheeks */}
            <ellipse cx="84" cy="135" rx="7" ry="4" fill="#f43f5e" opacity="0.4" />
            <ellipse cx="176" cy="135" rx="7" ry="4" fill="#f43f5e" opacity="0.4" />

            {/* Open Happy Mouth with Tongue */}
            <g>
              <path
                d="M 115 130 Q 130 130 145 130 Q 145 152 130 152 Q 115 152 115 130 Z"
                fill="#0f172a"
              />
              {/* Pink tongue */}
              <path
                d="M 121 144 Q 130 140 139 144 Q 139 152 130 152 Q 121 152 121 144 Z"
                fill="#fb7185"
              />
            </g>
          </g>
        ) : (
          /* SLEEPING / DORMANT FACE */
          <g className="lamp-face asleep">
            {/* Left sleeping eye */}
            <path
              d="M 88 128 Q 97 134 106 128"
              stroke="#0f172a"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            {/* Right sleeping eye */}
            <path
              d="M 154 128 Q 163 134 172 128"
              stroke="#0f172a"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            {/* Tiny cute resting mouth */}
            <path
              d="M 125 138 Q 130 142 135 138"
              stroke="#0f172a"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        )}
      </svg>
    </div>
  );
};

export default CuteLamp;
