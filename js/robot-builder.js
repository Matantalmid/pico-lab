/* The free-build workshop: the 3D editor.
   It draws the design held by `store`, and turns the pointer into edits:
   - with a tool active, a ghost of the new part follows the pointer and
     turns green where it may be placed, red where it may not;
   - with a part selected, arrows appear only along the directions that
     part can really move, and dragging one moves it;
   - anything else rotates, pans or zooms the camera.
   Every edit goes through store, which asks robotDesign whether it is allowed. */
(function (P) {
  'use strict';
  var D = P.robotDesign, RB = P.robot;
  var AXC = [0xe5484d, 0x30a46c, 0x3e63dd];

  P.robotBuilder = function (THREE, host, store) {
    host.innerHTML = '';
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
    host.appendChild(renderer.domElement);
    var el = renderer.domElement, scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(38, 1, 2, 14000), kit = P.robotKit(THREE);
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    scene.fog = new THREE.Fog(0xdcebf3, 1500, 5600);
    scene.add(new THREE.HemisphereLight(0xeaf4ff, 0x8a7a5a, 0.62));
    var sun = new THREE.DirectionalLight(0xfff4dd, 0.72); sun.position.set(190, 340, 250); scene.add(sun);
    sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0012; sun.shadow.normalBias = 0.6;
    var sc = sun.shadow.camera; sc.left = -300; sc.right = 300; sc.top = 300; sc.bottom = -300; sc.near = 10; sc.far = 1100; sc.updateProjectionMatrix();
    var fill = new THREE.DirectionalLight(0xffffff, 0.2); fill.position.set(-160, 80, -120); scene.add(fill);

    /* ---------- the place: a work pad in a field, crop rows, a barn, trees, hills and sky ---------- */
    var PAD = 220, bed = new THREE.Group();
    (function () {
      function S(color) { return new THREE.MeshStandardMaterial({ color: color, roughness: 1 }); }
      function add(geo, mat, x, y, z, parent) { var m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); (parent || scene).add(m); return m; }
      function flat(w, d, mat, y) { var m = add(new THREE.PlaneGeometry(w, d), mat, 0, y, 0); m.rotation.x = -Math.PI / 2; m.receiveShadow = true; return m; }
      var rnd = (function (s) { return function () { s = (s * 16807) % 2147483647; return s / 2147483647; }; })(7919);
      /* sky: a gradient dome, a sun and a few clouds */
      var cv = document.createElement('canvas'), cx = cv.getContext('2d'), gr;
      cv.width = 8; cv.height = 512; gr = cx.createLinearGradient(0, 0, 0, 512);
      [[0, '#2f78c8'], [0.3, '#6fb0e6'], [0.46, '#c4e2f5'], [0.5, '#eaf5fa'], [0.503, '#b4c08f'], [1, '#8f9a6c']].forEach(function (q) { gr.addColorStop(q[0], q[1]); });
      cx.fillStyle = gr; cx.fillRect(0, 0, 8, 512);
      var skyTex = new THREE.CanvasTexture(cv);
      if (THREE.sRGBEncoding) skyTex.encoding = THREE.sRGBEncoding;
      add(new THREE.SphereGeometry(6500, 32, 24), new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, fog: false, depthWrite: false }), 0, 0, 0).renderOrder = -10;
      add(new THREE.SphereGeometry(210, 20, 14), new THREE.MeshBasicMaterial({ color: 0xfff6cf, fog: false }), 2500, 4500, 3300);
      var cloudMat = new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false, transparent: true, opacity: 0.92 }), puff = new THREE.SphereGeometry(1, 12, 9);
      for (var ci = 0; ci < 11; ci++) {
        var ca = ci / 11 * Math.PI * 2 + rnd(), cr = 3000 + rnd() * 1800, cg = new THREE.Group();
        for (var cj = 0; cj < 4; cj++) { var pf = add(puff, cloudMat, (cj - 1.5) * 190 + rnd() * 60, rnd() * 40, rnd() * 120, cg); pf.scale.set(200 + rnd() * 120, 70 + rnd() * 50, 150 + rnd() * 80); }
        cg.position.set(Math.cos(ca) * cr, 1300 + rnd() * 700, Math.sin(ca) * cr); scene.add(cg);
      }
      /* ground: meadow, a ploughed field, and the packed-earth pad the robot is built on */
      flat(16000, 16000, S(0x86a85c), -1.2);
      flat(2500, 1900, S(0x8c6a45), -0.8);
      flat(PAD * 2 + 14, PAD * 2 + 14, S(0xa98d5c), -0.4);          // flat sheets, so that looking up from below the floor still shows the robot
      flat(PAD * 2, PAD * 2, S(0xd0b27c), -0.06);
      var grid = new THREE.GridHelper(PAD * 2, PAD * 2 / 5, 0x8a6f3c, 0xb5935a); grid.position.y = 0.02; grid.material.transparent = true; grid.material.opacity = 0.5; scene.add(grid);
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-PAD, 0.06, 0), new THREE.Vector3(PAD, 0.06, 0)]), new THREE.LineBasicMaterial({ color: 0xff4d6d })));
      /* crop rows across the field; the middle row is the bed the robot drives over */
      var soil = S(0x6b4a2c), leafGeo = new THREE.IcosahedronGeometry(1, 0), leafMat = S(0xffffff), moundGeo = new THREE.BoxGeometry(1, 1, 1), zs = [], dm = new THREE.Object3D(), col = new THREE.Color(), n = 0, zi;
      for (zi = 4; zi <= 12; zi++) { zs.push(zi * 70 - 10); zs.push(-(zi * 70 - 10)); }
      var plants = new THREE.InstancedMesh(leafGeo, leafMat, zs.length * 96);
      zs.forEach(function (z) {
        var m = add(moundGeo, soil, 0, 2, z); m.scale.set(2400, 6, 26); m.receiveShadow = true;
        for (var q = 0; q < 96; q++) {
          var sz = 7 + rnd() * 5;
          dm.position.set(-1190 + q * 25 + rnd() * 6, 5 + sz * 0.6, z + (rnd() - 0.5) * 6); dm.scale.set(sz, sz * (0.8 + rnd() * 0.5), sz); dm.rotation.y = rnd() * 3; dm.updateMatrix();
          plants.setMatrixAt(n, dm.matrix); plants.setColorAt(n, col.setHSL(0.29 + rnd() * 0.06, 0.5, 0.26 + rnd() * 0.1)); n++;
        }
      });
      scene.add(plants);
      var bedMound = add(moundGeo, soil, 0, 3.5, 0, bed); bedMound.scale.set(2400, 7, 22); bedMound.receiveShadow = true;
      var bedPlants = new THREE.InstancedMesh(new THREE.ConeGeometry(5, 13, 7), S(0x2f7d3a), 110);
      for (zi = 0; zi < 110; zi++) { dm.position.set(-1190 + zi * 21.8, 13.5, (zi % 2) * 2 - 1); dm.scale.set(1, 1, 1); dm.rotation.y = 0; dm.updateMatrix(); bedPlants.setMatrixAt(zi, dm.matrix); }
      bedPlants.castShadow = true; bed.add(bedPlants);
      var tunnel = add(new THREE.BoxGeometry(360, D.BED.h, D.BED.w), new THREE.MeshBasicMaterial({ color: 0x3fb950, transparent: true, opacity: 0.13, depthWrite: false }), 0, D.BED.h / 2, 0, bed);
      tunnel.renderOrder = 5; scene.add(bed);
      /* a fence around the field */
      var wood = S(0x8a6a44), posts = new THREE.InstancedMesh(new THREE.BoxGeometry(7, 70, 7), wood, 120), pn = 0;
      [[-1250, -950, 1, 0, 2500], [-1250, 950, 1, 0, 2500], [-1250, -950, 0, 1, 1900], [1250, -950, 0, 1, 1900]].forEach(function (f) {
        for (var q = 0; q <= f[4]; q += 100) { dm.position.set(f[0] + f[2] * q, 33, f[1] + f[3] * q); dm.scale.set(1, 1, 1); dm.rotation.y = 0; dm.updateMatrix(); if (pn < 120) posts.setMatrixAt(pn++, dm.matrix); }
        [28, 52].forEach(function (h) { var r = add(moundGeo, wood, f[0] + f[2] * f[4] / 2, h, f[1] + f[3] * f[4] / 2); r.scale.set(f[2] ? f[4] : 3, 6, f[3] ? f[4] : 3); });
      });
      posts.count = pn; scene.add(posts);
      /* a barn with a silo, a greenhouse, trees, far hills */
      var barn = new THREE.Group(), red = S(0xa8402f), roofM = S(0x5a4a44), white = S(0xf1ece2);
      add(new THREE.BoxGeometry(420, 230, 300), red, 0, 115, 0, barn);
      var roof = add(new THREE.CylinderGeometry(190, 190, 440, 3), roofM, 0, 325, 0, barn); roof.rotation.z = Math.PI / 2; roof.rotation.x = -Math.PI / 2; roof.scale.set(1, 1, 0.92);
      add(new THREE.BoxGeometry(110, 150, 6), white, 0, 75, 152, barn);
      add(new THREE.CylinderGeometry(70, 70, 380, 20), S(0xb9bfc4), 320, 190, -40, barn);
      add(new THREE.SphereGeometry(70, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), S(0x9aa1a6), 320, 380, -40, barn);
      barn.position.set(-1500, 0, -1350); barn.rotation.y = 0.5; scene.add(barn);
      var gh = add(new THREE.CylinderGeometry(160, 160, 640, 24, 1, true, 0, Math.PI), new THREE.MeshStandardMaterial({ color: 0xe9f3f1, roughness: 0.4, transparent: true, opacity: 0.6, side: THREE.DoubleSide }), 1500, 0, -1300);
      gh.rotation.z = Math.PI / 2; gh.rotation.y = 0.3;
      var trunkGeo = new THREE.CylinderGeometry(9, 13, 130, 7), crownGeo = new THREE.IcosahedronGeometry(1, 1), trunkM = S(0x6a4a2e), crowns = [S(0x3d7a3a), S(0x4c8f45), S(0x2f6b34)];
      [[-1400, 300], [-1480, 620], [-1380, 1050], [-900, 1150], [-300, 1200], [420, 1130], [1050, 1180], [1420, 760], [1500, 200], [1440, -420], [800, -1250], [200, -1320], [-500, -1300], [-2000, -300], [2100, 900], [1900, -1500], [-2300, 1400]].forEach(function (t) {
        var s = 0.9 + rnd() * 0.9, g = new THREE.Group();
        add(trunkGeo, trunkM, 0, 65, 0, g);
        var c1 = add(crownGeo, crowns[Math.floor(rnd() * 3)], 0, 190, 0, g); c1.scale.set(95, 85, 95);
        var c2 = add(crownGeo, crowns[Math.floor(rnd() * 3)], 30, 255, -15, g); c2.scale.set(65, 60, 65);
        g.position.set(t[0], 0, t[1]); g.scale.setScalar(s); g.rotation.y = rnd() * 6; scene.add(g);
      });
      var hillGeo = new THREE.SphereGeometry(1, 24, 12), hills = [S(0x7fa37a), S(0x8fb08a), S(0x9dbba0)];
      for (var hi = 0; hi < 14; hi++) {
        var ha = hi / 14 * Math.PI * 2 + rnd() * 0.3, hr = 3900 + rnd() * 1300, h = add(hillGeo, hills[hi % 3], Math.cos(ha) * hr, -40, Math.sin(ha) * hr);
        h.scale.set(1100 + rnd() * 900, 380 + rnd() * 420, 1100 + rnd() * 900);
      }
    })();

    var partsG = new THREE.Group(), ghostG = new THREE.Group(), marksG = new THREE.Group(), handlesG = new THREE.Group(), measureG = new THREE.Group();
    scene.add(partsG); scene.add(ghostG); scene.add(marksG); scene.add(handlesG); scene.add(measureG);
    var ghostOk = new THREE.MeshBasicMaterial({ color: 0x2ecc71, transparent: true, opacity: 0.55, depthWrite: false, side: THREE.DoubleSide });
    var ghostBad = new THREE.MeshBasicMaterial({ color: 0xe5484d, transparent: true, opacity: 0.55, depthWrite: false, side: THREE.DoubleSide });
    var edgeGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1)), coneGeo = new THREE.ConeGeometry(1.5, 4.2, 14), cubeGeo = new THREE.BoxGeometry(3, 3, 3);
    var selMat = new THREE.LineBasicMaterial({ color: 0x1f6feb, depthTest: false }), badMat = new THREE.LineBasicMaterial({ color: 0xe5484d, depthTest: false }), pickMat = new THREE.LineBasicMaterial({ color: 0xf2c230, depthTest: false });
    var handleMats = AXC.map(function (c) { return new THREE.MeshBasicMaterial({ color: c, depthTest: false, transparent: true, opacity: 0.95 }); });
    var stretchMat = new THREE.MeshBasicMaterial({ color: 0xf2994a, depthTest: false, transparent: true, opacity: 0.95 });

    var arcMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, depthTest: false }), rotGeos = [];
    var dirty = true, theta = 0, focusIds = [], chainFirst = null, measurePts = [], handles = [], byId = {};
    function hScale() { var hs = Math.max(0.7, Math.min(3, orb.r / 260)); handles.forEach(function (m) { if (!m.userData.fix) m.scale.setScalar(hs); }); }
    function clear(group) { while (group.children.length) group.remove(group.children[0]); }

    /* ---------- drawing the design ---------- */
    function boxFor(g, A) {
      if (g.box) return g.box;
      if (g.type === 'chain') { var a = g.A.box, b = g.B.box; return { min: a.min.map(function (v, k) { return Math.min(v, b.min[k]); }), max: a.max.map(function (v, k) { return Math.max(v, b.max[k]); }) }; }
      if (g.c) return { min: g.c.map(function (v) { return v - 3; }), max: g.c.map(function (v) { return v + 3; }) };
      return null;
    }
    function outline(g, material) {
      var b = boxFor(g, store.A);
      if (!b) return;
      var l = new THREE.LineSegments(edgeGeo, material);
      l.position.set((b.min[0] + b.max[0]) / 2, (b.min[1] + b.max[1]) / 2, (b.min[2] + b.max[2]) / 2);
      l.scale.set(b.max[0] - b.min[0] + 0.5, b.max[1] - b.min[1] + 0.5, b.max[2] - b.min[2] + 0.5);
      l.renderOrder = 20; marksG.add(l);
    }
    function refresh() {
      var A = store.A;
      clear(partsG); byId = {};
      store.d.parts.forEach(function (p) {
        var g = A.G[p.id];
        if (!g || g.bad) return;
        var m = kit.mesh(g);
        m.traverse(function (o) { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
        byId[p.id] = m; partsG.add(m);
      });
      clear(marksG);
      focusIds.forEach(function (id) { if (A.G[id] && !A.G[id].bad && id !== store.sel) outline(A.G[id], badMat); });
      if (chainFirst && A.G[chainFirst] && !A.G[chainFirst].bad) outline(A.G[chainFirst], pickMat);
      var sg = store.sel && A.G[store.sel];
      if (sg && !sg.bad) outline(sg, selMat);
      buildHandles(sg && !sg.bad ? sg : null);
      hScale();
      bed.visible = !!store.bed;
      scene.updateMatrixWorld(true);                 // so the very next pointer event hits the new meshes
      if (store.run) spin();
      dirty = true;
    }

    /* ---------- arrows on the selected part: only the ways it can really move ---------- */
    function buildHandles(g) {
      clear(handlesG); handles = [];
      rotGeos.forEach(function (q) { q.dispose(); }); rotGeos = [];
      if (!g || store.tool) return;
      var p = g.part, b = boxFor(g, store.A), c = [(b.min[0] + b.max[0]) / 2, (b.min[1] + b.max[1]) / 2, (b.min[2] + b.max[2]) / 2];
      /* a curved double arrow: click it for a quarter turn about axis k */
      function turner(k) {
        var i = (k + 1) % 3, j = (k + 2) % 3, rad = Math.hypot(b.max[i] - b.min[i], b.max[j] - b.min[j]) / 2 + 7, a0 = 0.42, a1 = 1.15, grp = new THREE.Group();
        var thin = new THREE.TorusGeometry(rad, Math.max(0.6, Math.min(2.4, orb.r / 330)), 8, 18, a1 - a0), fat = new THREE.TorusGeometry(rad, 4, 6, 12, a1 - a0);
        rotGeos.push(thin); rotGeos.push(fat);
        grp.position.set(c[0], c[1], c[2]);
        if (k === 0) grp.rotation.y = Math.PI / 2; else if (k === 1) grp.rotation.x = -Math.PI / 2;
        [[thin, handleMats[k]], [fat, arcMat]].forEach(function (q) { var m = new THREE.Mesh(q[0], q[1]); m.rotation.z = a0; m.renderOrder = 30; m.userData.fix = true; m.userData.h = { kind: 'rot', k: k }; grp.add(m); handles.push(m); });
        [[a1, 0], [a0, Math.PI]].forEach(function (q) {
          var m = new THREE.Mesh(coneGeo, handleMats[k]);
          m.position.set(rad * Math.cos(q[0]), rad * Math.sin(q[0]), 0); m.rotation.z = q[0] + q[1];
          m.renderOrder = 31; m.userData.h = { kind: 'rot', k: k }; grp.add(m); handles.push(m);
        });
        handlesG.add(grp);
      }
      if (g.type === 'profile') [0, 1, 2].forEach(turner); else if (g.type === 'deck') turner(1); else if (D.SLOT[g.type]) turner(g.a);
      function arrows(k, kind, field) {
        var half = (b.max[k] - b.min[k]) / 2 + 5;
        [1, -1].forEach(function (sgn) {
          var m = new THREE.Mesh(coneGeo, handleMats[k]), pos = c.slice();
          pos[k] += sgn * half; m.position.set(pos[0], pos[1], pos[2]);
          if (k === 0) m.rotation.z = -sgn * Math.PI / 2; else if (k === 2) m.rotation.x = sgn * Math.PI / 2; else if (sgn < 0) m.rotation.x = Math.PI;
          m.renderOrder = 30; m.userData.h = { k: k, kind: kind, field: field, o: c };
          handlesG.add(m); handles.push(m);
        });
      }
      if (g.type === 'profile') {
        [0, 1, 2].forEach(function (k) { arrows(k, 'move'); });
        if (!g.cube) [1, -1].forEach(function (end) {
          var m = new THREE.Mesh(cubeGeo, stretchMat), pos = g.c.slice();
          pos[g.ax] += end * (g.len / 2 + 2.5); m.position.set(pos[0], pos[1], pos[2]);
          m.renderOrder = 30; m.userData.h = { k: g.ax, kind: 'stretch', end: end, o: pos };
          handlesG.add(m); handles.push(m);
        });
      } else if (g.type === 'deck') { arrows(0, 'move'); arrows(2, 'move'); }
      else if (D.SLOT[g.type]) {
        arrows(g.a, 's');
        if (g.type === 'motor') arrows(g.axis, 'prop', 'u');
        if (g.type === 'battery' || g.type === 'control' || g.type === 'plate') arrows(g.t, 'prop', 'v');
      } else if ((g.type === 'shaft' && !g.coup) || (g.type === 'sprocket' && store.A.G[g.body].type === 'shaft')) arrows(g.axis, 's');
    }
    function applyHandle(h, delta) {                 // one step of a drag, tried on a copy of the design as it was when the drag began
      var id = store.sel;
      return store.dragTo(function (n, A0) {
        var p = D.find(n, id), v = [0, 0, 0];
        if (h.kind === 'move') {
          var ids = p.type === 'profile' ? D.component(n, id) : [id];
          v[h.k] = delta;
          D.moveProfiles(n, ids, D.snapDelta(A0, ids, v));
        } else if (h.kind === 'stretch') {
          var by = D.snap(h.end * delta);
          if (p.len + by < 4) by = 4 - p.len;
          D.stretch(n, id, h.end, by);
        } else {
          var step = D.snap(delta), g0 = A0.G[id];
          if (p.type === 'sprocket' || (p.type === 'motor' && h.kind === 'prop')) {        // fall into the plane of a nearby sprocket
            var body = p.type === 'sprocket' ? A0.G[p.on.id] : g0;
            step = D.alignPlane(A0, body, g0.c[g0.axis] + step) - g0.c[g0.axis];
          }
          if (h.kind === 's') p.on.s = Math.round(D.slideSnap(A0, id, p.on.s + step) * 1000) / 1000;
          else p[h.field] = Math.round(((p[h.field] || 0) + step) * 1000) / 1000;
        }
      });
    }

    /* ---------- camera ---------- */
    var target = new THREE.Vector3(0, 36, 0), orb = { th: 0.9, ph: 1.18, r: 300 };
    function placeCam() {
      cam.position.set(target.x + orb.r * Math.sin(orb.ph) * Math.sin(orb.th), target.y + orb.r * Math.cos(orb.ph), target.z + orb.r * Math.sin(orb.ph) * Math.cos(orb.th));
      cam.lookAt(target); cam.updateMatrixWorld(); dirty = true;
      hScale();
      if (store.camMoved) store.camMoved(orb.th, orb.ph);
    }
    function fit() {
      var lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity], any = false;
      store.d.parts.forEach(function (p) { var g = store.A.G[p.id]; if (g && g.box) { any = true; for (var k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], g.box.min[k]); hi[k] = Math.max(hi[k], g.box.max[k]); } } });
      if (!any) { target.set(0, 20, 0); orb.r = 220; return; }
      target.set((lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2, (lo[2] + hi[2]) / 2);
      orb.r = Math.max(150, Math.min(900, Math.hypot(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]) * 1.9));
    }
    function setView(name) {
      var v = { iso: [0.9, 1.18], front: [Math.PI / 2, 1.5], side: [0, 1.5], top: [0, 0.02] }[name] || [0.9, 1.18];
      orb.th = v[0]; orb.ph = v[1]; fit(); placeCam();
    }
    function focus(ids) {
      focusIds = ids || [];
      var g = focusIds.length && store.A.G[focusIds[0]], b = g && !g.bad && boxFor(g, store.A);
      if (b) { target.set((b.min[0] + b.max[0]) / 2, (b.min[1] + b.max[1]) / 2, (b.min[2] + b.max[2]) / 2); orb.r = Math.min(orb.r, 190); placeCam(); }
      refresh();
    }

    /* ---------- what the pointer is on ---------- */
    var ray = new THREE.Raycaster(), groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), tmp = new THREE.Vector3();
    function aim(e) {
      var r = el.getBoundingClientRect();
      ray.setFromCamera(new THREE.Vector2((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), cam);
    }
    function hitPart() {
      var hit = ray.intersectObjects(partsG.children, true)[0];
      if (hit) {
        var o = hit.object;
        while (o && !o.userData.id) o = o.parent;
        if (o) return { id: o.userData.id, pt: [hit.point.x, hit.point.y, hit.point.z] };
      }
      return ray.ray.intersectPlane(groundPlane, tmp) && Math.max(Math.abs(tmp.x), Math.abs(tmp.z)) < PAD ? { id: null, pt: [tmp.x, 0, tmp.z] } : null;
    }
    function hitHandle() { var h = ray.intersectObjects(handles, false)[0]; return h ? h.object.userData.h : null; }
    function alongAxis(h) {                           // where on the handle's axis the pointer ray passes closest
      var dir = new THREE.Vector3(); dir.setComponent(h.k, 1);
      var o = new THREE.Vector3(h.o[0], h.o[1], h.o[2]), w = o.clone().sub(ray.ray.origin), b = dir.dot(ray.ray.direction), dd = dir.dot(w), e = ray.ray.direction.dot(w), den = 1 - b * b;
      return den < 1e-4 ? null : (b * e - dd) / den;
    }

    /* ---------- the ghost of a part about to be placed ---------- */
    var lastTry = null;
    function showGhost(e) {
      clear(ghostG); lastTry = null;
      var t = store.tool;
      if (!t || t.type === 'measure') return;
      aim(e);
      var hit = hitPart();
      if (!hit) { store.hint(null); dirty = true; return; }
      if (t.type === 'chain') {
        var g = hit.id && store.A.G[hit.id];
        store.hint(g && g.type === 'sprocket' ? null : D.MSG.needSprocket, false);
        dirty = true; return;
      }
      var res = store.tryAdd(t.type, hit, t.opts);
      lastTry = res;
      if (res.newId && res.A.G[res.newId] && !res.A.G[res.newId].bad) ghostG.add(kit.mesh(res.A.G[res.newId], { mat: res.ok ? ghostOk : ghostBad }));
      store.hint(res.ok ? null : res.t, res.ok);
      dirty = true;
    }
    function clickTool(e) {
      var t = store.tool;
      aim(e);
      var hit = hitPart();
      if (t.type === 'measure') {
        if (!hit) return;
        if (measurePts.length >= 2) measurePts = [];
        measurePts.push(hit.pt); drawMeasure(); return;
      }
      /* one part per click: after placing it, or after a click where it cannot go, the hand is empty again */
      if (!hit) { clear(ghostG); return store.toolDone(); }
      if (t.type === 'chain') {
        var g = hit.id && store.A.G[hit.id];
        if (!g || g.type !== 'sprocket') { var half = chainFirst; chainFirst = null; return store.toolDone(half ? D.MSG.needSprocket : null); }
        if (!chainFirst) { chainFirst = g.id; store.hint(null); return refresh(); }
        if (chainFirst === g.id) { chainFirst = null; return refresh(); }
        var first = chainFirst;
        chainFirst = null;
        var rc = store.addChain(first, g.id);
        return store.toolDone(rc.ok ? null : rc.t);
      }
      var res = store.tryAdd(t.type, hit, t.opts);
      clear(ghostG);
      if (res.ok) store.apply(res, res.newId);
      store.toolDone(res.ok ? null : res.t);
      return res.ok;
    }
    function sprite(text) {
      var c = document.createElement('canvas'), g = c.getContext('2d');
      c.width = 256; c.height = 80;
      g.fillStyle = 'rgba(20,24,27,.9)'; g.beginPath();
      if (g.roundRect) g.roundRect(4, 8, 248, 64, 16); else g.rect(4, 8, 248, 64);
      g.fill();
      g.fillStyle = '#fff'; g.font = '700 38px system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 128, 42);
      var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), depthTest: false }));
      s.scale.set(24, 7.5, 1); s.renderOrder = 40;
      return s;
    }
    function drawMeasure() {
      clear(measureG);
      measurePts.forEach(function (p) { var m = new THREE.Mesh(new THREE.SphereGeometry(0.9, 12, 10), handleMats[0]); m.position.set(p[0], p[1], p[2]); m.renderOrder = 35; measureG.add(m); });
      if (measurePts.length === 2) {
        var a = measurePts[0], b = measurePts[1];
        var line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(a[0], a[1], a[2]), new THREE.Vector3(b[0], b[1], b[2])]), new THREE.LineBasicMaterial({ color: 0xff4d6d, depthTest: false }));
        line.renderOrder = 34; measureG.add(line);
        var s = sprite((Math.round(Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) * 10) / 10) + ' cm');
        s.position.set((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 4, (a[2] + b[2]) / 2); measureG.add(s);
        store.measured([Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]), Math.abs(a[2] - b[2])]);
      }
      dirty = true;
    }

    /* ---------- pointer ---------- */
    var ptrs = {}, moved = 0, pinch = 0, drag = null, downAt = [0, 0];
    el.style.touchAction = 'none';
    el.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    el.addEventListener('mousedown', function (e) { if (e.button === 1) e.preventDefault(); });      // no browser auto-scroll on the wheel press
    el.addEventListener('auxclick', function (e) { if (e.button === 1) e.preventDefault(); });
    el.addEventListener('pointerdown', function (e) {
      ptrs[e.pointerId] = [e.clientX, e.clientY]; moved = 0; downAt = [e.clientX, e.clientY];
      try { el.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      if (Object.keys(ptrs).length > 1) { if (drag && drag.live) store.dragEnd(); drag = { mode: 'pinch' }; return; }
      /* right button turns the view, the pressed wheel (or Shift) moves it; the left button is for parts. One finger on a touch screen turns the view */
      drag = { mode: e.button === 2 ? 'orbit' : e.button === 1 || e.shiftKey ? 'pan' : e.pointerType === 'touch' ? 'orbit' : 'none' };
      if (e.button === 1) e.preventDefault();
      if (store.tool || e.button !== 0) return;
      aim(e);
      var h = hitHandle();
      if (h && h.kind === 'rot') { drag = { mode: 'rot', h: h }; return; }
      if (h) { var t0 = alongAxis(h); if (t0 !== null) { drag = { mode: 'handle', h: h, t0: t0 }; store.dragStart(); drag.live = true; } return; }
      var hit = hitPart(), g = hit && hit.id && store.A.G[hit.id];
      if (g && hit.id === store.sel && (g.type === 'profile' || g.type === 'deck')) drag = { mode: 'plane', y: hit.pt[1], p0: hit.pt, plane: new THREE.Plane(new THREE.Vector3(0, 1, 0), -hit.pt[1]) };
    });
    el.addEventListener('pointermove', function (e) {
      var p = ptrs[e.pointerId];
      if (!p) { if (store.tool) showGhost(e); return; }
      var dx = e.clientX - p[0], dy = e.clientY - p[1], ids = Object.keys(ptrs);
      moved = Math.max(moved, Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]));     // how far from where the press began, so a shaky click still counts as a click
      ptrs[e.pointerId] = [e.clientX, e.clientY];
      if (ids.length === 2) {
        var a = ptrs[ids[0]], b = ptrs[ids[1]], dist = Math.hypot(a[0] - b[0], a[1] - b[1]);
        if (pinch) orb.r = Math.max(60, Math.min(1200, orb.r * pinch / dist));
        pinch = dist; pan(dx / 2, dy / 2); placeCam(); return;
      }
      if (!drag) return;
      if (drag.mode === 'handle') {
        aim(e);
        var t = alongAxis(drag.h);
        if (t !== null) { var r = applyHandle(drag.h, t - drag.t0); store.hint(r.ok ? null : r.t, r.ok); }
      } else if (drag.mode === 'plane') {
        if (moved < 5) return;
        if (!drag.live) { store.dragStart(); drag.live = true; }
        aim(e);
        if (ray.ray.intersectPlane(drag.plane, tmp)) {
          var id = store.sel, v = [tmp.x - drag.p0[0], 0, tmp.z - drag.p0[2]];
          var res = store.dragTo(function (n, A0) { var q = D.find(n, id), set = q.type === 'profile' ? D.component(n, id) : [id]; D.moveProfiles(n, set, D.snapDelta(A0, set, v)); });
          store.hint(res.ok ? null : res.t, res.ok);
        }
      } else if (drag.mode === 'pan') { pan(dx, dy); placeCam(); }
      else if (drag.mode === 'orbit') { orb.th -= dx * 0.008; orb.ph = Math.max(0.02, Math.min(2.3, orb.ph - dy * 0.006)); placeCam(); }
    });
    function pan(dx, dy) {
      var k = orb.r * 0.0012, right = new THREE.Vector3().setFromMatrixColumn(cam.matrix, 0), up = new THREE.Vector3().setFromMatrixColumn(cam.matrix, 1);
      target.addScaledVector(right, -dx * k).addScaledVector(up, dy * k);
      target.y = Math.max(0, target.y);
    }
    function up(e) {
      var had = ptrs[e.pointerId];
      delete ptrs[e.pointerId]; pinch = 0;
      if (!had) return;
      if (drag && drag.live) { store.dragEnd(); store.hint(null); }
      else if (drag && drag.mode === 'rot') { if (moved < 10) store.rotate(drag.h.k, e.shiftKey ? -1 : 1); }
      else if (moved < 8 && (!drag || drag.mode !== 'pinch') && e.button === 0) {
        if (store.tool) clickTool(e);
        else { aim(e); var hit = hitPart(); focusIds = []; store.select(hit && hit.id ? hit.id : null); }
      }
      drag = null;
    }
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', function (e) { delete ptrs[e.pointerId]; pinch = 0; if (drag && drag.live) store.dragEnd(); drag = null; });
    el.addEventListener('pointerleave', function () { if (store.tool) { clear(ghostG); dirty = true; } });
    el.addEventListener('wheel', function (e) { e.preventDefault(); orb.r = Math.max(60, Math.min(1200, orb.r * (e.deltaY > 0 ? 1.1 : 0.9))); placeCam(); }, { passive: false });

    /* ---------- turning ---------- */
    function spin() {
      var A = store.A, bodies = A.drive.bodies;
      function ratio(body) { var b = bodies[body]; return b && b.rpm ? b.rpm / RB.MOTOR_RPM : 0; }
      Object.keys(byId).forEach(function (id) {
        var m = byId[id];
        m.userData.spins.forEach(function (s) {
          var r = s.body ? ratio(s.body) : 0;
          if (s.chain) { var cg = A.G[s.chain]; r = cg && !cg.bad ? -ratio(cg.A.body) * cg.A.rp / A.G[id].rp : 0; }
          s.obj.rotation.z = -theta * r * s.sgn;
        });
        if (m.userData.chain) m.userData.chain.lay(theta * ratio(m.userData.chain.body) * m.userData.chain.rp);
      });
    }

    function size() {
      var w = host.clientWidth, h = host.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); dirty = true;
    }
    if (window.ResizeObserver) new ResizeObserver(size).observe(host); else window.addEventListener('resize', size);

    var last = performance.now();
    function frame(now) {
      if (!host.isConnected) { kit.dispose(); renderer.dispose(); return; }       // the page was left
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (store.run) { theta += dt * 3.2; spin(); dirty = true; }
      if (dirty) { renderer.render(scene, cam); dirty = false; }
      requestAnimationFrame(frame);
    }
    size(); refresh(); fit(); placeCam(); requestAnimationFrame(frame);

    return {
      refresh: refresh, setView: setView, focus: focus, fit: function () { fit(); placeCam(); },
      look: function (f) {                             // a face of the view cube
        if (f === 'py') orb.ph = 0.02; else if (f === 'ny') orb.ph = 2.3; else { orb.ph = 1.5; orb.th = { px: Math.PI / 2, nx: -Math.PI / 2, pz: 0, nz: Math.PI }[f]; }
        placeCam();
      },
      zoom: function (f) { orb.r = Math.max(60, Math.min(1200, orb.r * f)); placeCam(); },
      over: function (x, y) { return document.elementFromPoint(x, y) === el; },
      ghostAt: showGhost, dropAt: clickTool, clearGhost: function () { clear(ghostG); dirty = true; },
      chainPicked: function () { return chainFirst; },
      toolChanged: function () { chainFirst = null; measurePts = []; clear(ghostG); clear(measureG); refresh(); },
      snapshot: function () { renderer.render(scene, cam); return el.toDataURL('image/png'); },
      _dbg: { scene: scene, cam: cam, orb: orb, target: target, place: placeCam, el: el, byId: function () { return byId; } }
    };
  };
})(window.PICO);
