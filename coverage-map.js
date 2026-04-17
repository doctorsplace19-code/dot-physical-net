(function () {
  var inner = document.querySelector('.coverage-inner')
  if (!inner) return

  if (!document.getElementById('dp-anim')) {
    var s = document.createElement('style')
    s.id = 'dp-anim'
    s.textContent = '@keyframes dp-pulse{0%,100%{r:6}50%{r:10}}'
    document.head.appendChild(s)
  }

  var wrap = document.createElement('div')
  wrap.id = 'coverage-map'
  wrap.style.cssText = 'grid-column:1/-1;border-radius:12px;overflow:hidden;position:relative;border:1px solid rgba(255,255,255,0.1);background:#06101f;'
  inner.appendChild(wrap)

  var NS = 'http://www.w3.org/2000/svg'
  var svg = document.createElementNS(NS, 'svg')
  svg.setAttribute('viewBox', '0 0 960 600')
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
  svg.style.cssText = 'width:100%;height:340px;display:block;'
  wrap.appendChild(svg)

  function mk(tag, attrs) {
    var e = document.createElementNS(NS, tag)
    for (var k in attrs) e.setAttribute(k, attrs[k])
    return e
  }

  // Background
  svg.appendChild(mk('rect', {width:960, height:600, fill:'#06101f'}))

  // Defs
  var defs = document.createElementNS(NS, 'defs')
  var grad = document.createElementNS(NS, 'radialGradient')
  grad.id = 'hqglow'; grad.setAttribute('cx','50%'); grad.setAttribute('cy','50%'); grad.setAttribute('r','50%')
  ;[['0%','#3b82f6','0.5'],['100%','#3b82f6','0']].forEach(function(s){
    var stop = document.createElementNS(NS,'stop')
    stop.setAttribute('offset',s[0]); stop.setAttribute('stop-color',s[1]); stop.setAttribute('stop-opacity',s[2])
    grad.appendChild(stop)
  })
  defs.appendChild(grad); svg.appendChild(defs)

  // Continental US — proper simplified outline filling the viewBox
  // Pacific NW → Canada border → Great Lakes → Atlantic → Gulf → Mexico border → Pacific
  svg.appendChild(mk('path', {
    d: 'M80,80 L200,55 L340,55 L460,55 L530,80 L610,60 L700,75 L780,55 L860,55 L920,80 ' +
       'L920,110 L880,150 L890,180 L855,190 L840,170 L810,185 L810,210 L790,270 L800,310 ' +
       'L760,355 L730,395 L715,435 L730,480 L720,545 L700,580 L685,510 L650,440 L610,445 ' +
       'L565,455 L490,468 L445,500 L448,540 L415,505 L300,415 L245,420 L130,395 ' +
       'L75,345 L40,265 L30,180 L50,120 Z',
    fill: 'rgba(30,60,130,0.35)',
    stroke: 'rgba(99,155,255,0.35)',
    'stroke-width': '1.5',
    'stroke-linejoin': 'round',
    'stroke-linecap': 'round',
  }))

  // Coverage dots — major metros spread across the country
  var metros = [
    [95,130],   // Seattle
    [75,235],   // Portland
    [55,310],   // San Francisco
    [110,355],  // Los Angeles
    [155,390],  // San Diego
    [205,370],  // Phoenix
    [225,285],  // Salt Lake City
    [315,215],  // Denver
    [360,370],  // Albuquerque
    [460,380],  // Dallas
    [480,455],  // Houston
    [510,290],  // Kansas City
    [515,175],  // Minneapolis
    [575,210],  // Milwaukee
    [605,195],  // Chicago
    [655,245],  // Indianapolis
    [660,165],  // Detroit
    [685,280],  // Louisville
    [660,335],  // Nashville
    [660,370],  // Atlanta
    [720,530],  // Miami
    [700,460],  // Tampa
    [735,370],  // Charlotte
    [755,310],  // Richmond
    [760,280],  // Washington DC
    [790,255],  // Philadelphia
    [820,230],  // New York
    [870,195],  // Boston
    [555,345],  // Memphis
    [430,290],  // Wichita
  ]
  metros.forEach(function(m){
    svg.appendChild(mk('circle',{cx:m[0],cy:m[1],r:2.8,fill:'rgba(96,165,250,0.45)'}))
  })

  // HQ glow (Hackensack NJ ≈ 820,230 in this coordinate space)
  svg.appendChild(mk('circle',{cx:820,cy:230,r:70,fill:'url(#hqglow)'}))

  // Pulse ring
  var pulseRing = document.createElementNS(NS, 'circle')
  pulseRing.setAttribute('cx','820'); pulseRing.setAttribute('cy','230'); pulseRing.setAttribute('r','8')
  pulseRing.setAttribute('fill','none'); pulseRing.setAttribute('stroke','rgba(96,165,250,0.6)'); pulseRing.setAttribute('stroke-width','2')
  pulseRing.style.cssText = 'animation:dp-ring 2s ease-out infinite'
  if (!document.getElementById('dp-ring-style')) {
    var rs = document.createElement('style'); rs.id='dp-ring-style'
    rs.textContent = '@keyframes dp-ring{0%{r:8;opacity:0.8}100%{r:24;opacity:0}}'
    document.head.appendChild(rs)
  }
  svg.appendChild(pulseRing)

  // HQ dot
  svg.appendChild(mk('circle',{cx:820,cy:230,r:5,fill:'#60a5fa',stroke:'#fff','stroke-width':'2'}))

  // HQ label
  var hqLabel = document.createElementNS(NS,'text')
  hqLabel.setAttribute('x','831'); hqLabel.setAttribute('y','226')
  hqLabel.setAttribute('fill','rgba(255,255,255,0.9)'); hqLabel.setAttribute('font-size','11')
  hqLabel.setAttribute('font-family','Arial,sans-serif'); hqLabel.setAttribute('font-weight','600')
  hqLabel.textContent = 'Hackensack, NJ'
  svg.appendChild(hqLabel)

  // Bottom label overlay
  var label = document.createElement('div')
  label.style.cssText = 'position:absolute;bottom:12px;left:50%;transform:translateX(-50%);background:rgba(6,16,31,0.88);color:rgba(255,255,255,0.88);font-family:Arial,sans-serif;font-size:12px;font-weight:500;padding:6px 16px;border-radius:100px;border:1px solid rgba(255,255,255,0.12);white-space:nowrap;pointer-events:none;z-index:2;'
  label.textContent = '10,000+ collection sites \u00b7 All 50 states \u00b7 Coordinated through Doctors Place'
  wrap.appendChild(label)
})()
