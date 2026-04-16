(function () {
  // Inject Leaflet CSS
  var css = document.createElement('link')
  css.rel = 'stylesheet'
  css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
  document.head.appendChild(css)

  // Inject Leaflet JS then init map
  var script = document.createElement('script')
  script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
  script.onload = initMap
  document.head.appendChild(script)

  function initMap() {
    var L = window.L

    // Create map container — will span both columns inside .coverage-inner
    var container = document.createElement('div')
    container.id = 'coverage-map'
    container.style.cssText = [
      'height:360px',
      'border-radius:12px',
      'overflow:hidden',
      'border:1px solid rgba(255,255,255,0.15)',
      'grid-column:1 / -1',      // span both grid columns
      'position:relative',
    ].join(';')

    // Insert as last child of .coverage-inner (inside the dark card, full width)
    var inner = document.querySelector('.coverage-inner')
    if (!inner) return
    inner.appendChild(container)

    // Init map — static, no interaction
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

    // Dark-friendly light gray no-label tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom:    19,
    }).addTo(map)

    // Nationwide subtle coverage tint
    L.rectangle(
      [[24.5, -125], [49.5, -66.5]],
      { color: 'transparent', fillColor: '#3b82f6', fillOpacity: 0.08, weight: 0 }
    ).addTo(map)

    // Dense-coverage glow around NJ/NY/CT tri-state
    L.circle([40.886, -74.044], {
      radius:      180000,
      color:       '#60a5fa',
      fillColor:   '#3b82f6',
      fillOpacity: 0.14,
      weight:      1,
      opacity:     0.4,
    }).addTo(map)

    // Pulsing HQ marker
    if (!document.getElementById('dp-pulse-style')) {
      var style = document.createElement('style')
      style.id = 'dp-pulse-style'
      style.textContent = '@keyframes dp-pulse{0%,100%{box-shadow:0 0 0 4px rgba(96,165,250,0.35)}50%{box-shadow:0 0 0 10px rgba(96,165,250,0.08)}}'
      document.head.appendChild(style)
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
        '<div style="font-family:Arial,sans-serif;font-size:13px;line-height:1.6;">' +
        '<strong>Doctors Place</strong><br>' +
        '75 Summit Ave, Ste 200<br>Hackensack, NJ 07601<br>' +
        '<span style="color:#2563eb;font-weight:600;">Headquarters</span>' +
        '</div>',
        { maxWidth: 200 }
      )

    // Bottom label overlay
    var label = document.createElement('div')
    label.style.cssText = [
      'position:absolute',
      'bottom:12px',
      'left:50%',
      'transform:translateX(-50%)',
      'z-index:800',
      'background:rgba(12,27,58,0.82)',
      'color:rgba(255,255,255,0.9)',
      'font-family:Arial,sans-serif',
      'font-size:12px',
      'font-weight:500',
      'padding:6px 16px',
      'border-radius:100px',
      'border:1px solid rgba(255,255,255,0.12)',
      'pointer-events:none',
      'white-space:nowrap',
    ].join(';')
    label.textContent = '10,000+ collection sites · All 50 states · Coordinated through Doctors Place'
    container.appendChild(label)
  }
})()
