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
    // Create map container
    var container = document.createElement('div')
    container.id = 'coverage-map'
    container.style.cssText = [
      'height:380px',
      'border-radius:16px',
      'overflow:hidden',
      'border:1px solid rgba(255,255,255,0.12)',
      'margin-top:2.5rem',
      'box-shadow:0 4px 32px rgba(0,0,0,0.18)',
      'position:relative',
    ].join(';')

    // Insert after the coverage-inner div inside #coverage
    var section = document.getElementById('coverage')
    if (!section) return
    var inner = section.querySelector('.coverage-inner')
    if (inner && inner.parentNode) {
      inner.parentNode.insertBefore(container, inner.nextSibling)
    } else {
      section.appendChild(container)
    }

    var L = window.L

    // Init map — static, no interaction
    var map = L.map('coverage-map', {
      center:           [39.5, -98.35],
      zoom:             4,
      zoomControl:      false,
      scrollWheelZoom:  false,
      doubleClickZoom:  false,
      dragging:         false,
      touchZoom:        false,
      keyboard:         false,
      attributionControl: false,
    })

    // Light gray, no-label tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)

    // Subtle nationwide coverage overlay — low opacity blue fill on US bounds
    L.rectangle(
      [[24.5, -125], [49.5, -66.5]],
      { color: 'transparent', fillColor: '#2563eb', fillOpacity: 0.06, weight: 0 }
    ).addTo(map)

    // Dense-coverage circle around HQ (NJ/NY tri-state)
    L.circle([40.886, -74.044], {
      radius:      160000,
      color:       '#2563eb',
      fillColor:   '#2563eb',
      fillOpacity: 0.10,
      weight:      1.5,
      opacity:     0.3,
    }).addTo(map)

    // HQ marker — pulsing blue dot
    var pulseIcon = L.divIcon({
      className: '',
      html: '<div style="width:14px;height:14px;border-radius:50%;background:#2563eb;border:2px solid #fff;box-shadow:0 0 0 4px rgba(37,99,235,0.3);animation:dp-pulse 2s infinite;"></div>',
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    })

    // Inject pulse keyframe once
    if (!document.getElementById('dp-pulse-style')) {
      var style = document.createElement('style')
      style.id = 'dp-pulse-style'
      style.textContent = '@keyframes dp-pulse{0%,100%{box-shadow:0 0 0 4px rgba(37,99,235,0.3)}50%{box-shadow:0 0 0 8px rgba(37,99,235,0.1)}}'
      document.head.appendChild(style)
    }

    L.marker([40.886, -74.044], { icon: pulseIcon })
      .addTo(map)
      .bindPopup(
        '<div style="font-family:Arial,sans-serif;font-size:13px;line-height:1.5;">' +
        '<strong style="color:#0f2347;">Doctors Place</strong><br>' +
        '75 Summit Ave, Ste 200<br>Hackensack, NJ 07601<br>' +
        '<span style="color:#2563eb;font-weight:600;">Headquarters</span>' +
        '</div>',
        { maxWidth: 200 }
      )

    // Attribution bottom-right
    L.control.attribution({ position: 'bottomright', prefix: false })
      .addAttribution('&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>')
      .addTo(map)

    // "Coverage available nationwide" label overlay
    var label = document.createElement('div')
    label.style.cssText = [
      'position:absolute',
      'bottom:12px',
      'left:12px',
      'z-index:800',
      'background:rgba(15,35,71,0.85)',
      'color:#fff',
      'font-family:Arial,sans-serif',
      'font-size:12px',
      'font-weight:500',
      'padding:6px 12px',
      'border-radius:100px',
      'pointer-events:none',
    ].join(';')
    label.textContent = '10,000+ collection sites · All 50 states'
    container.style.position = 'relative'
    container.appendChild(label)
  }
})()
