(function () {
  if (typeof window.L === 'undefined') return

  // Create map container inside .coverage-inner (spans both grid columns)
  var inner = document.querySelector('.coverage-inner')
  if (!inner) return

  var container = document.createElement('div')
  container.id = 'coverage-map'
  container.style.height = '360px'
  inner.appendChild(container)

  var L = window.L

  var map = L.map('coverage-map', {
    center:             [39.5, -98.35],
    zoom:               4,
    zoomControl:        false,
    scrollWheelZoom:    false,
    doubleClickZoom:    false,
    dragging:           false,
    touchZoom:          false,
    keyboard:           false,
    attributionControl: false,
  })

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map)

  // Nationwide tint
  L.rectangle(
    [[24.5, -125], [49.5, -66.5]],
    { color: 'transparent', fillColor: '#3b82f6', fillOpacity: 0.07, weight: 0 }
  ).addTo(map)

  // Tri-state dense coverage glow
  L.circle([40.886, -74.044], {
    radius:      200000,
    color:       '#60a5fa',
    fillColor:   '#3b82f6',
    fillOpacity: 0.15,
    weight:      1,
    opacity:     0.4,
  }).addTo(map)

  // Pulse keyframe
  if (!document.getElementById('dp-pulse-style')) {
    var s = document.createElement('style')
    s.id = 'dp-pulse-style'
    s.textContent = '@keyframes dp-pulse{0%,100%{box-shadow:0 0 0 4px rgba(96,165,250,0.35)}50%{box-shadow:0 0 0 10px rgba(96,165,250,0.08)}}'
    document.head.appendChild(s)
  }

  var pulseIcon = L.divIcon({
    className: '',
    html: '<div style="width:12px;height:12px;border-radius:50%;background:#60a5fa;border:2px solid #fff;box-shadow:0 0 0 4px rgba(96,165,250,0.35);animation:dp-pulse 2s infinite;"></div>',
    iconSize:   [12, 12],
    iconAnchor: [6, 6],
  })

  L.marker([40.886, -74.044], { icon: pulseIcon })
    .addTo(map)
    .bindPopup(
      '<div style="font-size:13px;line-height:1.6;">' +
      '<strong>Doctors Place</strong><br>' +
      '75 Summit Ave, Ste 200<br>Hackensack, NJ<br>' +
      '<span style="color:#2563eb;font-weight:600;">Headquarters</span>' +
      '</div>',
      { maxWidth: 200 }
    )

  // Bottom label
  var label = document.createElement('div')
  label.style.cssText = 'position:absolute;bottom:12px;left:50%;transform:translateX(-50%);z-index:800;background:rgba(12,27,58,0.85);color:rgba(255,255,255,0.9);font-family:Arial,sans-serif;font-size:12px;font-weight:500;padding:6px 16px;border-radius:100px;border:1px solid rgba(255,255,255,0.12);pointer-events:none;white-space:nowrap;'
  label.textContent = '10,000+ collection sites · All 50 states · Coordinated through Doctors Place'
  container.style.position = 'relative'
  container.appendChild(label)
})()
