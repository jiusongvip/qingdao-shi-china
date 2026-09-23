(function() {
  function setupFilters(filterId, gridId) {
    var fc = document.getElementById(filterId), grid = document.getElementById(gridId);
    if (!fc || !grid) return;
    var btns = fc.querySelectorAll("button[data-filter]");
    var items = grid.querySelectorAll("[data-type]");
    btns.forEach(function(btn) {
      btn.addEventListener("click", function() {
        btns.forEach(function(b) { b.classList.remove("active-tab"); });
        btn.classList.add("active-tab");
        var f = btn.dataset.filter;
        items.forEach(function(item) {
          item.style.display = (f === "all" || item.dataset.type === f) ? "" : "none";
        });
      });
    });
  }
  setupFilters("attr-filters", "attr-grid");
  setupFilters("food-filters", "food-grid");

  var budgetBtns = document.querySelectorAll("#cost-tabs button");
  budgetBtns.forEach(function(btn) {
    btn.addEventListener("click", function() {
      budgetBtns.forEach(function(b) { b.classList.remove("active-tab"); });
      btn.classList.add("active-tab");
      var b = btn.dataset.b;
      document.querySelectorAll('[id^="budget-"]').forEach(function(el) { el.classList.add("hidden"); });
      var t = document.getElementById("budget-" + b);
      if (t) t.classList.remove("hidden");
    });
  });

  var packingData = {
    Jan: { clothes: ["Heavy down jacket (-5 to 3\u00B0C)", "Thermal underwear", "Wool scarf and gloves", "Warm beanie", "Thick socks", "Waterproof boots"], gear: ["Lip balm (wind is harsh)", "Moisturizer", "Hand warmers", "Thermos for hot drinks"] },
    Feb: { clothes: ["Heavy down jacket (-1 to 5\u00B0C)", "Thermal underwear", "Wool scarf and gloves", "Warm hat", "Thick socks"], gear: ["Lip balm", "Moisturizer", "Hand warmers"] },
    Mar: { clothes: ["Light down jacket (3 to 9\u00B0C)", "Sweaters", "Long pants", "Comfortable walking shoes"], gear: ["Umbrella", "Light scarf", "Camera"] },
    Apr: { clothes: ["Light jacket (8 to 15\u00B0C)", "Long sleeve shirts", "Light sweater", "Comfortable walking shoes"], gear: ["Umbrella", "Sunglasses", "Camera"] },
    May: { clothes: ["Light jacket (13 to 20\u00B0C)", "T-shirts and light pants", "One warm layer", "Comfortable shoes"], gear: ["Sunscreen", "Sunglasses", "Hat", "Camera"] },
    Jun: { clothes: ["Light breathable (18 to 24\u00B0C)", "Swimsuit and beach towel", "Shorts and t-shirts", "Light rain jacket"], gear: ["Mosquito repellent", "Sunscreen", "Portable fan", "Umbrella"] },
    Jul: { clothes: ["Light breathable (22 to 27\u00B0C)", "Swimsuit (2x)", "Shorts", "Sandals"], gear: ["Mosquito repellent", "Sunscreen SPF50+", "Cooling towel", "Portable fan", "Umbrella"] },
    Aug: { clothes: ["Light clothing (23 to 28\u00B0C)", "Swimsuit (2x)", "Shorts", "Sandals", "Light jacket (AC)"], gear: ["Mosquito repellent", "Sunscreen SPF50+", "Portable fan", "Umbrella"] },
    Sep: { clothes: ["Light layers (19 to 25\u00B0C)", "T-shirts", "Swimsuit (still warm)", "Light jacket"], gear: ["Sunscreen", "Camera", "Umbrella"] },
    Oct: { clothes: ["Sweater (13 to 19\u00B0C)", "Long pants", "Light jacket", "Walking shoes"], gear: ["Camera", "Sunglasses", "Light scarf"] },
    Nov: { clothes: ["Warm jacket (6 to 12\u00B0C)", "Sweaters", "Long pants", "Warm socks"], gear: ["Lip balm", "Moisturizer", "Gloves"] },
    Dec: { clothes: ["Heavy coat (0 to 6\u00B0C)", "Sweaters", "Thermal layers", "Scarf and gloves", "Hat"], gear: ["Lip balm", "Moisturizer", "Hand warmers"] }
  };

  document.querySelectorAll("#packing-months button").forEach(function(btn) {
    btn.addEventListener("click", function() {
      document.querySelectorAll("#packing-months button").forEach(function(b) { b.classList.remove("active-tab"); });
      btn.classList.add("active-tab");
      var data = packingData[btn.dataset.month];
      if (data) {
        var cl = document.getElementById("packing-clothes-list");
        var gl = document.getElementById("packing-gear-list");
        if (cl) cl.innerHTML = data.clothes.map(function(i) { return "<li>" + i + "</li>"; }).join("");
        if (gl) gl.innerHTML = data.gear.map(function(i) { return "<li>" + i + "</li>"; }).join("");
      }
    });
  });

  var navLinks = document.querySelectorAll("#quick-nav a[data-nav]");
  var sectionIds = [];
  navLinks.forEach(function(l) { var h = l.getAttribute("href"); if (h) sectionIds.push(h.replace("#", "")); });

  function updateActiveNav() {
    var cur = sectionIds[0];
    for (var i = 0; i < sectionIds.length; i++) {
      var el = document.getElementById(sectionIds[i]);
      if (el && el.getBoundingClientRect().top <= 180) cur = sectionIds[i];
    }
    navLinks.forEach(function(link) {
      var active = link.getAttribute("href") === "#" + cur;
      link.classList.toggle("bg-[var(--color-accent-subtle)]", active);
      link.classList.toggle("text-[var(--color-accent)]", active);
      link.classList.toggle("font-medium", active);
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  navLinks.forEach(function(link) {
    link.addEventListener("click", function(e) {
      e.preventDefault();
      var id = (link.getAttribute("href") || "").replace("#", "");
      var el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();



// Map on homepage
if (document.getElementById("homepage-map") && typeof L !== "undefined") {
  var map = L.map("homepage-map").setView([36.067, 120.383], 12);
  var mapEl = document.getElementById("homepage-map");
  if (mapEl) { mapEl.setAttribute("role", "region"); mapEl.setAttribute("aria-label", "Interactive map of Qingdao attractions, food and hotels"); }
  map.on("tileload", function (e) { e.tile.alt = "Qingdao street map tile"; });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap", maxZoom: 18 }).addTo(map);

  function makeIcon(color) {
    return L.divIcon({ className: "", html: '<div style="width:28px;height:28px;border-radius:50%;background:' + color + ';border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>', iconSize: [28, 28], iconAnchor: [14, 14], popupAnchor: [0, -14] });
  }

  function addMarkers(data, color) {
    var group = L.layerGroup();
    data.forEach(function(item) {
      L.marker([item.lat, item.lng], { icon: makeIcon(color), title: item.name, alt: item.name })
        .bindPopup("<strong class='popup-title'>" + item.name + "</strong><p>" + item.desc + "</p>")
        .addTo(group);
    });
    group.addTo(map);
    group.eachLayer(function (l) {
      var el = l.getElement();
      if (el) { el.setAttribute('aria-label', l.options.title || 'Map marker'); el.setAttribute('role', 'button'); }
    });
    return group;
  }

  addMarkers([{ name: "Zhanqiao Pier", lat: 36.0625, lng: 120.3151, desc: "Iconic 440m pier" },{ name: "St. Michael Cathedral", lat: 36.0674, lng: 120.3158, desc: "Neo-Romanesque, 1934" },{ name: "Badaguan", lat: 36.0528, lng: 120.3456, desc: "German villas, tree-lined streets" },{ name: "May Fourth Square", lat: 36.0597, lng: 120.3789, desc: "Modern square, red sculpture" },{ name: "Laoshan Mountain", lat: 36.1389, lng: 120.6239, desc: "Taoist mountain, sea views" },{ name: "Golden Beach", lat: 35.9619, lng: 120.2356, desc: "Best sand beach in Qingdao" },{ name: "Olympic Sailing Center", lat: 36.0575, lng: 120.3903, desc: "2008 Olympic marina" }], "#dc2626");
  addMarkers([{ name: "Chunhelou Restaurant", lat: 36.0653, lng: 120.3186, desc: "Classic Shandong cuisine" },{ name: "Yunxiao Road Food Street", lat: 36.0711, lng: 120.3882, desc: "Seafood street" },{ name: "Beer Street", lat: 36.0805, lng: 120.3532, desc: "Fresh Tsingtao on tap" },{ name: "Pichai Yuan", lat: 36.0656, lng: 120.3125, desc: "Historic food court" }], "#f97316");
  addMarkers([{ name: "Shangri-La", lat: 36.0622, lng: 120.3817, desc: "Luxury, rating 9.2" },{ name: "Old Town Hostel", lat: 36.0667, lng: 120.3139, desc: "Backpackers, 5min to beach" },{ name: "Holiday Inn", lat: 36.0639, lng: 120.3533, desc: "Mid-range, couples" },{ name: "Laoshan B&B", lat: 36.1283, lng: 120.6069, desc: "Nature lovers, beachfront" }], "#2563eb");
  addMarkers([{ name: "Qingdao Railway Station", lat: 36.0644, lng: 120.3078, desc: "Old Town station" },{ name: "Qingdao North Station", lat: 36.1789, lng: 120.3802, desc: "More high-speed routes" },{ name: "Airport Metro Line 8", lat: 36.2667, lng: 120.3751, desc: "40 min to city" }], "#16a34a");
  setTimeout(function() { map.invalidateSize(); }, 300);
}
