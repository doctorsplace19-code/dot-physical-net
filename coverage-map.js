(function () {
  var inner = document.querySelector('.coverage-inner')
  if (!inner) return

  // Pulse keyframe for HQ marker
  if (!document.getElementById('dp-anim')) {
    var s = document.createElement('style')
    s.id = 'dp-anim'
    s.textContent = '@keyframes dp-pulse{0%,100%{box-shadow:0 0 0 0 rgba(96,165,250,0.7)}70%{box-shadow:0 0 0 14px rgba(96,165,250,0)}}'
    document.head.appendChild(s)
  }

  // Wrapper
  var wrap = document.createElement('div')
  wrap.id = 'coverage-map'
  wrap.style.cssText = 'grid-column:1/-1;border-radius:12px;overflow:hidden;position:relative;border:1px solid rgba(255,255,255,0.1);'
  inner.appendChild(wrap)

  // ── SVG map ──────────────────────────────────────────────
  // Coordinate formula for 960×600 viewBox:
  //   x = (lng + 125) / 59 * 960   (lng in degrees W, negative)
  //   y = (49 - lat)  / 25 * 600   (lat in degrees N)
  // HQ Hackensack NJ (40.886°N, 74.044°W) → x≈829, y≈195

  var NS = 'http://www.w3.org/2000/svg'
  var svg = document.createElementNS(NS, 'svg')
  svg.setAttribute('viewBox', '0 0 960 600')
  svg.style.cssText = 'width:100%;height:340px;display:block;'
  wrap.appendChild(svg)

  function mk(tag, attrs) {
    var e = document.createElementNS(NS, tag)
    for (var k in attrs) e.setAttribute(k, attrs[k])
    return e
  }

  // Background
  svg.appendChild(mk('rect', { width: 960, height: 600, fill: '#06101f' }))

  // Defs: radial glow gradient
  var defs = document.createElementNS(NS, 'defs')
  var grad = document.createElementNS(NS, 'radialGradient')
  grad.id = 'dp-hq-glow'
  grad.setAttribute('cx', '50%'); grad.setAttribute('cy', '50%'); grad.setAttribute('r', '50%')
  ;[['0%', '#3b82f6', '0.45'], ['100%', '#3b82f6', '0']].forEach(function (s) {
    var stop = document.createElementNS(NS, 'stop')
    stop.setAttribute('offset', s[0])
    stop.setAttribute('stop-color', s[1])
    stop.setAttribute('stop-opacity', s[2])
    grad.appendChild(stop)
  })
  defs.appendChild(grad)
  svg.appendChild(defs)

  // Continental US outline (clockwise from WA northwest)
  // Boundary traced via lat/lng → SVG coordinate formula above
  svg.appendChild(mk('path', {
    d: [
      'M5,12',
      // Canada border east
      'L73,0 227,0 343,0 456,0',
      // Great Lakes dip then back north
      'L537,60 663,72 749,168 797,120 838,96 892,36',
      // Atlantic coast south
      'L944,101 895,168 871,185 830,206 799,288 806,324',
      'L749,367 716,408 704,446 722,492 729,557 703,588',
      // Florida west coast + Gulf
      'L691,506 649,440 613,449 568,458 491,470 449,504 451,542',
      // Mexico border west
      'L422,510 303,414 247,420 131,396',
      // Pacific coast north
      'L73,348 41,267 13,168 8,102 Z',
    ].join(' '),
    fill: 'rgba(30,60,120,0.32)',
    stroke: 'rgba(99,155,255,0.28)',
    'stroke-width': '1.5',
    'stroke-linejoin': 'round',
  }))

  // Glow circle behind HQ
  svg.appendChild(mk('circle', { cx: 829, cy: 195, r: 85, fill: 'url(#dp-hq-glow)' }))

  // Network dots — major metro areas (no names, just shows national coverage)
  var metros = [
    [44, 34],    // Seattle
    [111, 360],  // Los Angeles
    [41, 267],   // San Francisco
    [212, 372],  // Phoenix
    [327, 223],  // Denver
    [458, 389],  // Dallas
    [481, 461],  // Houston
    [517, 98],   // Minneapolis
    [608, 170],  // Chicago
    [660, 367],  // Atlanta
    [683, 161],  // Detroit
    [729, 557],  // Miami
    [750, 200],  // Philadelphia area
    [820, 200],  // NYC area (near HQ)
    [878, 158],  // Boston
    [370, 175],  // Kansas City
    [590, 290],  // Memphis/Nashville
  ]
  metros.forEach(function (m) {
    svg.appendChild(mk('circle', { cx: m[0], cy: m[1], r: 2.5, fill: 'rgba(96,165,250,0.4)' }))
  })

  // ── HQ marker (HTML positioned over SVG) ─────────────────
  // SVG coords (829,195) in 960×600 → percentages: 86.4%, 32.5%
  var dot = document.createElement('div')
  dot.style.cssText = [
    'position:absolute', 'left:86.4%', 'top:32.5%',
    'width:12px', 'height:12px',
    'background:#60a5fa', 'border:2px solid #fff', 'border-radius:50%',
    'transform:translate(-50%,-50%)',
    'animation:dp-pulse 2s infinite',
    'z-index:2',
  ].join(';')
  dot.title = 'Doctors Place — Hackensack, NJ (Headquarters)'
  wrap.appendChild(dot)

  // ── Bottom label ──────────────────────────────────────────
  var label = document.createElement('div')
  label.style.cssText = [
    'position:absolute', 'bottom:12px', 'left:50%', 'transform:translateX(-50%)',
    'background:rgba(6,16,31,0.88)', 'color:rgba(255,255,255,0.88)',
    'font-family:Arial,sans-serif', 'font-size:12px', 'font-weight:500',
    'padding:6px 16px', 'border-radius:100px',
    'border:1px solid rgba(255,255,255,0.12)',
    'white-space:nowrap', 'pointer-events:none', 'z-index:2',
  ].join(';')
  label.textContent = '10,000+ collection sites \u00b7 All 50 states \u00b7 Coordinated through Doctors Place'
  wrap.appendChild(label)
})()
