// Bottom bar tab icons: custom cartoon SVGs drawn with react-native-svg.
// shop = shopping cart, cards = fanned cards, home = house,
// upgrade = yellow arrow, minigames = game controller.
// Every gradient / clip id is prefixed per icon so ids never collide
// when several icons are on screen at the same time.
import React from 'react';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  ClipPath,
  G,
  Path,
  Rect,
  Circle,
  Ellipse,
} from 'react-native-svg';

/* ───────────────────────── Minigames (controller) ───────────────────────── */
function ControllerIcon({ size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 512 512">
      <Defs>
        <LinearGradient id="ctl-body" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#7fdcff" />
          <Stop offset="0.55" stopColor="#3b9cff" />
          <Stop offset="1" stopColor="#2a63e8" />
        </LinearGradient>
        <LinearGradient id="ctl-dpad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#ffffff" />
          <Stop offset="1" stopColor="#c9d6ff" />
        </LinearGradient>
        <RadialGradient id="ctl-shine" cx="0.5" cy="0.5" r="0.5" fx="0.35" fy="0.28">
          <Stop offset="0" stopColor="#fff" stopOpacity="0.75" />
          <Stop offset="0.45" stopColor="#fff" stopOpacity="0" />
          <Stop offset="1" stopColor="#000" stopOpacity="0.22" />
        </RadialGradient>
        <ClipPath id="ctl-clip">
          <Rect x="40" y="170" width="432" height="172" rx="86" />
        </ClipPath>
      </Defs>

      {/* capsule body */}
      <Rect
        x="40" y="170" width="432" height="172" rx="86"
        fill="url(#ctl-body)" stroke="#1d1b4d" strokeWidth="14" strokeLinejoin="round"
      />
      <G clipPath="url(#ctl-clip)">
        <Ellipse cx="256" cy="360" rx="260" ry="52" fill="#1b2a9c" opacity="0.28" />
        <Rect x="60" y="178" width="392" height="26" rx="13" fill="#fff" opacity="0.45" />
        <Circle cx="448" cy="196" r="6" fill="#fff" opacity="0.6" />
      </G>
      <Rect
        x="40" y="170" width="432" height="172" rx="86"
        fill="none" stroke="#1d1b4d" strokeWidth="14"
      />

      {/* D-pad outline layer */}
      <G fill="#1d1b4d" stroke="#1d1b4d" strokeWidth="14" strokeLinejoin="round">
        <Rect x="95" y="236" width="110" height="40" rx="10" />
        <Rect x="130" y="201" width="40" height="110" rx="10" />
      </G>
      {/* D-pad fill layer */}
      <G fill="url(#ctl-dpad)">
        <Rect x="95" y="236" width="110" height="40" rx="10" />
        <Rect x="130" y="201" width="40" height="110" rx="10" />
      </G>
      <Rect x="136" y="207" width="12" height="38" rx="6" fill="#fff" opacity="0.9" />
      <Rect x="101" y="242" width="38" height="10" rx="5" fill="#fff" opacity="0.9" />

      {/* Face buttons */}
      <G stroke="#1d1b4d" strokeWidth="9">
        <Circle cx="362" cy="216" r="22" fill="#ffd93b" />
        <Circle cx="324" cy="256" r="22" fill="#3ddc84" />
        <Circle cx="400" cy="256" r="22" fill="#ff5c7a" />
        <Circle cx="362" cy="296" r="22" fill="#4d6bff" />
      </G>

      {/* Button gloss overlays */}
      <G fill="url(#ctl-shine)">
        <Circle cx="362" cy="216" r="18" />
        <Circle cx="324" cy="256" r="18" />
        <Circle cx="400" cy="256" r="18" />
        <Circle cx="362" cy="296" r="18" />
      </G>

      {/* Button highlights */}
      <G fill="#fff" opacity="0.9">
        <Ellipse cx="355" cy="208" rx="5" ry="3" rotation={-30} origin="355, 208" />
        <Ellipse cx="317" cy="248" rx="5" ry="3" rotation={-30} origin="317, 248" />
        <Ellipse cx="393" cy="248" rx="5" ry="3" rotation={-30} origin="393, 248" />
        <Ellipse cx="355" cy="288" rx="5" ry="3" rotation={-30} origin="355, 288" />
      </G>
    </Svg>
  );
}

/* ───────────────────────────── Upgrade (arrow) ───────────────────────────── */
function ArrowIcon({ size }) {
  return (
    <Svg width={size} height={size} viewBox="40 0 340 352">
      <Defs>
        <LinearGradient id="arw-bevel" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FFD43B" />
          <Stop offset="1" stopColor="#FFA800" />
        </LinearGradient>
      </Defs>

      {/* arrow body */}
      <Path
        d="M210 18 Q219 18 229 28 L347 132 Q361 146 353 166 Q347 188 323 188 L290 188 L290 322 Q290 330 282 330 L138 330 Q130 330 130 322 L130 188 L97 188 Q73 188 67 166 Q59 146 73 132 L191 28 Q201 18 210 18 Z"
        fill="url(#arw-bevel)"
        stroke="#E27A0C"
        strokeWidth={9}
        strokeLinejoin="round"
      />

      {/* shine line */}
      <Path
        d="M94 148 L202 53"
        stroke="#FFFFFF"
        strokeWidth={16}
        strokeLinecap="round"
        opacity={0.9}
      />
    </Svg>
  );
}

/* ─────────────────────────────── Home (house) ────────────────────────────── */
function HouseIcon({ size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 380 330">
      <Defs>
        <ClipPath id="hse-clip">
          <Path d="M82 290 V160 L190 72 L298 160 V290 Z" />
        </ClipPath>
      </Defs>

      <Ellipse cx="190" cy="296" rx="125" ry="8" fill="#2B2B3A" opacity="0.13" />

      <G strokeLinejoin="round" strokeLinecap="round">
        {/* chimney */}
        <Rect x="258" y="56" width="40" height="94" fill="#E8402F" stroke="#9E2217" strokeWidth="3" />
        <Rect x="286" y="58" width="11" height="90" fill="#C73222" />
        <Rect x="250" y="30" width="56" height="28" rx="10" fill="#F5E6CC" stroke="#C9AE85" strokeWidth="3" />
        <Rect x="258" y="35" width="22" height="6" rx="3" fill="#FFFFFF" opacity="0.7" />

        {/* wall */}
        <Path
          d="M82 290 V160 L190 72 L298 160 V290 Z"
          fill="#FBE8CC"
          stroke="#D9B98A"
          strokeWidth="3"
        />
        <G clipPath="url(#hse-clip)">
          <Path
            d="M64 160 L190 50 L316 160"
            fill="none"
            stroke="#EBCF9F"
            strokeWidth="38"
            transform="translate(0 22)"
          />
        </G>
        <Rect x="90" y="190" width="8" height="80" rx="4" fill="#FFFFFF" opacity="0.5" />

        {/* roof */}
        <Path
          d="M64 160 L190 50 L316 160"
          fill="none"
          stroke="#9E2217"
          strokeWidth="46"
          transform="translate(0 3)"
        />
        <Path d="M64 160 L190 50 L316 160" fill="none" stroke="#E8402F" strokeWidth="38" />
        <Path
          d="M64 160 L190 50 L316 160"
          fill="none"
          stroke="#FF8A75"
          strokeWidth="8"
          opacity="0.75"
          transform="translate(0 -9)"
        />
        <Path
          d="M116 93 L138 117 M160 55 L182 79 M264 93 L242 117 M220 55 L198 79"
          fill="none"
          stroke="#B92A1E"
          strokeWidth="3"
          opacity="0.6"
        />

        {/* round window */}
        <Circle cx="190" cy="132" r="26" fill="#35A7F5" stroke="#A5622F" strokeWidth="8" />
        <Path d="M190 106 V158 M164 132 H216" fill="none" stroke="#A5622F" strokeWidth="5" />

        {/* left window */}
        <Rect x="96" y="190" width="40" height="44" rx="4" fill="#A5622F" stroke="#7A3E1A" strokeWidth="3" />
        <Rect x="102" y="196" width="28" height="32" fill="#35A7F5" />
        <Path d="M116 196 V228 M102 212 H130" fill="none" stroke="#A5622F" strokeWidth="3" />

        {/* right window */}
        <Rect x="244" y="190" width="40" height="44" rx="4" fill="#A5622F" stroke="#7A3E1A" strokeWidth="3" />
        <Rect x="250" y="196" width="28" height="32" fill="#35A7F5" />
        <Path d="M264 196 V228 M250 212 H278" fill="none" stroke="#A5622F" strokeWidth="3" />

        {/* door */}
        <Path
          d="M152 290 V215 Q152 178 190 178 Q228 178 228 215 V290 Z"
          fill="#C77A3A"
          stroke="#7A3E1A"
          strokeWidth="3"
        />
        <Path
          d="M162 290 V218 Q162 188 190 188 Q218 188 218 218 V290 Z"
          fill="#A9581F"
          stroke="#7A3E1A"
          strokeWidth="2"
        />
        <Path
          d="M176 190 V290 M190 188 V290 M204 190 V290"
          fill="none"
          stroke="#7A3E1A"
          strokeWidth="2"
          opacity="0.7"
        />
        <Circle cx="210" cy="242" r="6" fill="#FFD43B" stroke="#C9A000" strokeWidth="2" />
      </G>
    </Svg>
  );
}

/* ─────────────────────────────── Cards (fan) ─────────────────────────────── */
function CardsIcon({ size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 380 310">
      <G stroke="#2B2B3A" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
        <G rotation={-30} origin="190, 275">
          <Rect x="140" y="130" width="100" height="140" rx="14" fill="#4DA3FF" />
          <Rect x="152" y="142" width="10" height="44" rx="5" fill="#FFFFFF" stroke="none" opacity="0.5" />
        </G>
        <G>
          <Rect x="140" y="130" width="100" height="140" rx="14" fill="#FFD43B" />
          <Rect x="152" y="142" width="10" height="44" rx="5" fill="#FFFFFF" stroke="none" opacity="0.5" />
        </G>
        <G rotation={30} origin="190, 275">
          <Rect x="140" y="130" width="100" height="140" rx="14" fill="#9B6BFF" />
          <Rect x="152" y="142" width="10" height="44" rx="5" fill="#FFFFFF" stroke="none" opacity="0.5" />
        </G>
      </G>
    </Svg>
  );
}

/* ───────────────────────────── Shop (cart) ───────────────────────────────── */
function ShoppingCartIcon({ size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 512 512">
      <Defs>
        <LinearGradient id="crt-body" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#4aa8ff" />
          <Stop offset="1" stopColor="#1668dc" />
        </LinearGradient>
        <LinearGradient id="crt-rim" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#8fd0ff" />
          <Stop offset="1" stopColor="#2f86f2" />
        </LinearGradient>
        <LinearGradient id="crt-grip" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#6fd0ff" />
          <Stop offset="1" stopColor="#1e88e5" />
        </LinearGradient>
        <LinearGradient id="crt-bar" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#eceef5" />
          <Stop offset="1" stopColor="#9a9db3" />
        </LinearGradient>
        <RadialGradient id="crt-wheel" cx="0.4" cy="0.35" r="0.8">
          <Stop offset="0" stopColor="#6a6d84" />
          <Stop offset="1" stopColor="#2b2d3e" />
        </RadialGradient>
        <RadialGradient id="crt-hub" cx="0.4" cy="0.35" r="0.8">
          <Stop offset="0" stopColor="#d6ecff" />
          <Stop offset="1" stopColor="#5aa8f5" />
        </RadialGradient>
      </Defs>

      <Ellipse cx="270" cy="492" rx="195" ry="12" fill="#000" opacity="0.1" />

      <G stroke="#000" strokeWidth="12" strokeLinejoin="round" strokeLinecap="round">
        <Path
          d="M125 185 L470 185 L432 348 Q429 360 416 360 L176 360 Q163 360 159 348 Z"
          fill="url(#crt-body)"
        />
        <Path
          d="M115 172 Q115 148 140 148 L457 148 Q484 148 484 174 Q484 200 457 200 L140 200 Q115 200 115 176 Z"
          fill="url(#crt-rim)"
        />
        <G rotation={-8} origin="209, 274">
          <Rect x="188" y="228" width="42" height="92" rx="21" fill="#1650b8" strokeWidth="9" />
        </G>
        <Rect x="271" y="228" width="42" height="92" rx="21" fill="#1650b8" strokeWidth="9" />
        <G rotation={8} origin="375, 274">
          <Rect x="354" y="228" width="42" height="92" rx="21" fill="#1650b8" strokeWidth="9" />
        </G>
        <Rect x="212" y="396" width="160" height="26" rx="13" fill="url(#crt-bar)" />
        <Path d="M82 88 C92 150 132 300 168 400" fill="none" strokeWidth="48" />
      </G>

      <Path
        d="M82 88 C92 150 132 300 168 400"
        fill="none"
        stroke="#b8bbce"
        strokeWidth="32"
        strokeLinecap="round"
      />
      <Path
        d="M72 92 C82 150 122 295 156 392"
        fill="none"
        stroke="#f2f3f8"
        strokeWidth="8"
        strokeLinecap="round"
      />

      <G stroke="#000" strokeWidth="12" strokeLinejoin="round" strokeLinecap="round">
        <Rect x="28" y="52" width="136" height="62" rx="31" fill="url(#crt-grip)" />
        <Circle cx="175" cy="430" r="50" fill="url(#crt-wheel)" />
        <Circle cx="375" cy="430" r="50" fill="url(#crt-wheel)" />
      </G>

      <G stroke="#000" strokeWidth="8">
        <Circle cx="175" cy="430" r="23" fill="url(#crt-hub)" />
        <Circle cx="375" cy="430" r="23" fill="url(#crt-hub)" />
      </G>

      <G fill="#fff" opacity="0.75">
        <Ellipse cx="168" cy="422" rx="8" ry="5" />
        <Ellipse cx="368" cy="422" rx="8" ry="5" />
      </G>

      <G fill="none" stroke="#fff" strokeLinecap="round" opacity="0.7">
        <Path d="M110 68 H59 A15 15 0 0 0 44 83" strokeWidth="10" />
        <Path d="M150 163 H440" strokeWidth="10" />
      </G>
    </Svg>
  );
}

const ICONS = {
  shop: ShoppingCartIcon,
  cards: CardsIcon,
  home: HouseIcon,
  upgrade: ArrowIcon,
  minigames: ControllerIcon,
};

export function TabIcon({ name, size = 40 }) {
  const Icon = ICONS[name];
  if (!Icon) return null;
  return <Icon size={size} />;
}
