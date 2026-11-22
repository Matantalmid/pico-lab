/* The free-build workshop: the 3D model of each part.
   kit.mesh(g) takes one resolved part (from robotDesign.analyse) and returns
   a THREE.Group in world coordinates. Geometries and materials are shared
   between parts, so rebuilding the whole scene after every edit is cheap.
   Turning parts list themselves in group.userData.spins. */
(function (P) {
  'use strict';
  var RB = P.robot, R = RB.R, BEAR_H = RB.BEAR_H, pd = RB.pd;

  P.robotKit = function (THREE) {
    function M(color, metal, rough) { return new THREE.MeshStandardMaterial({ color: color, metalness: metal, roughness: rough, side: THREE.DoubleSide }); }
    var mat = {
      alu: M(0xc9ced3, 0.55, 0.42), slot: M(0x3a4247, 0.3, 0.7), steel: M(0xaab2b8, 0.8, 0.3), dark: M(0x2a3136, 0.5, 0.5),
      cast: M(0x2c4a5e, 0.35, 0.6), rubber: M(0x17191b, 0.0, 0.95), rim: M(0xbfc5ca, 0.7, 0.35), chain: M(0x6f777d, 0.8, 0.35),
      motor: M(0x1d2023, 0.4, 0.5), black: M(0x15171a, 0.1, 0.7), red: M(0xd9262c, 0.1, 0.5), yellow: M(0xf2c230, 0.1, 0.6),
      grey: M(0x7d868c, 0.2, 0.7), wood: M(0x9a7748, 0.0, 0.9), woodD: M(0x6e5332, 0.0, 0.9), green: M(0x3fb950, 0.0, 0.6)
    };
    var unitBox = new THREE.BoxGeometry(1, 1, 1), unitCyl = new THREE.CylinderGeometry(1, 1, 1, 24), hex = new THREE.CylinderGeometry(1, 1, 1, 6);
    var tri = new THREE.Shape(); tri.moveTo(0, 0); tri.lineTo(3.6, 0); tri.lineTo(0, 3.6); tri.lineTo(0, 0);
    var triGeo = new THREE.ExtrudeGeometry(tri, { depth: 3.4, bevelEnabled: false }); triGeo.translate(0, 0, -1.7);
    var tirePts = [[8.6, -6.2], [10.5, -6.9], [R - 2.2, -7.25], [R - 0.5, -6], [R, -3.5], [R, 3.5], [R - 0.5, 6], [R - 2.2, 7.25], [10.5, 6.9], [8.6, 6.2]].map(function (p) { return new THREE.Vector2(p[0], p[1]); });
    var tireGeo = new THREE.LatheGeometry(tirePts, 40); tireGeo.rotateX(Math.PI / 2);
    var knobGeo = new THREE.BoxGeometry(2.4, 1.3, 3.4), linkGeo = new THREE.BoxGeometry(1.05, 0.5, 0.9), sprGeo = {};
    function sprocketGeo(n) {
      if (sprGeo[n]) return sprGeo[n];
      var rp = pd(n) / 2, tip = rp + 0.32, root = rp - 0.42, s = new THREE.Shape(), step = 2 * Math.PI / n;
      for (var i = 0; i < n; i++) {
        var a = i * step, pts = [[root, a - step * 0.30], [tip, a - step * 0.12], [tip, a + step * 0.12], [root, a + step * 0.30]];
        for (var k = 0; k < 4; k++) { var X = pts[k][0] * Math.cos(pts[k][1]), Y = pts[k][0] * Math.sin(pts[k][1]); if (i === 0 && k === 0) s.moveTo(X, Y); else s.lineTo(X, Y); }
      }
      s.closePath();
      var hole = new THREE.Path(); hole.absarc(0, 0, 1.0, 0, Math.PI * 2, true); s.holes.push(hole);
      if (n >= 20) for (var q = 0; q < 5; q++) { var lh = new THREE.Path(); lh.absarc((rp * 0.58) * Math.cos(q * 1.2566), (rp * 0.58) * Math.sin(q * 1.2566), rp * 0.17, 0, Math.PI * 2, true); s.holes.push(lh); }
      var g = new THREE.ExtrudeGeometry(s, { depth: 0.72, bevelEnabled: false, curveSegments: 12 }); g.translate(0, 0, -0.36);
      return (sprGeo[n] = g);
    }

    function mesh(g, opts) {
      opts = opts || {};
      var grp = new THREE.Group(), over = opts.mat, p = g.part, spins = [];
      grp.userData.id = g.id; grp.userData.spins = spins;
      function m(name) { return over || mat[name]; }
      function put(geo, name, x, y, z, parent) { var me = new THREE.Mesh(geo, m(name)); me.position.set(x || 0, y || 0, z || 0); (parent || grp).add(me); return me; }
      function box(w, h, dp, name, x, y, z, parent) { var me = put(unitBox, name, x, y, z, parent); me.scale.set(w, h, dp); return me; }
      function cylY(r, len, name, x, y, z, parent, geo) { var me = put(geo || unitCyl, name, x, y, z, parent); me.scale.set(r, len, r); return me; }
      function cylZ(r, len, name, x, y, z, parent, geo) { var me = cylY(r, len, name, x, y, z, parent, geo); me.rotation.x = Math.PI / 2; return me; }
      function vec(k, s) { var v = new THREE.Vector3(); v.setComponent(k, s); return v; }
      /* stand the group at `o`, with its local y and z along the given world axes */
      function place(o, yk, ys, zk, zs) {
        var Y = vec(yk, ys), Z = vec(zk, zs), X = new THREE.Vector3().crossVectors(Y, Z);
        grp.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(X, Y, Z));
        grp.position.set(o[0], o[1], o[2]);
        return zs;
      }
      function spinner(sgn, body, ratio) { var s = new THREE.Group(); grp.add(s); spins.push({ obj: s, sgn: sgn, body: body, chain: ratio }); return s; }
      function sprocket(n, parent) { put(sprocketGeo(n), 'dark', 0, 0, 0, parent); cylZ(1.9, 2.0, 'dark', 0, 0, 0, parent); }

      var t = g.type, c = g.c, s, i;
      if (t === 'profile') {
        place(c, (g.ax + 1) % 3, 1, (g.ax + 2) % 3, 1);
        box(g.len, 4, 4, 'alu');
        box(g.len - 0.1, 0.03, 0.9, 'slot', 0, 2.01, 0); box(g.len - 0.1, 0.03, 0.9, 'slot', 0, -2.01, 0);
        box(g.len - 0.1, 0.9, 0.03, 'slot', 0, 0, 2.01); box(g.len - 0.1, 0.9, 0.03, 'slot', 0, 0, -2.01);
      } else if (t === 'bracket') {
        var d1 = vec(g.d1.k, g.d1.sg), d2 = vec(g.d2.k, g.d2.sg), d3 = new THREE.Vector3().crossVectors(d1, d2);
        grp.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(d1, d2, d3)); grp.position.set(c[0], c[1], c[2]);
        put(triGeo, 'grey');
        cylY(0.55, 0.5, 'steel', 1.9, 0.25, 0, null, hex);
        var b2 = cylY(0.55, 0.5, 'steel', 0.25, 1.9, 0, null, hex); b2.rotation.z = Math.PI / 2;
      } else if (t === 'bearing') {
        place(c, g.k, g.sg, g.axis, 1);            // local y points away from the profile, so the base is at -y
        box(12.7, 1.4, 3.8, 'cast', 0, -BEAR_H + 0.7, 0);
        if (p.lift > 0) box(12.7, p.lift, 3.8, 'alu', 0, -BEAR_H - p.lift / 2, 0);      // spacer plates
        box(6.4, BEAR_H, 3.4, 'cast', 0, -BEAR_H / 2, 0);
        cylZ(3.3, 3.2, 'cast'); cylZ(2.0, 3.5, 'steel');
        cylY(0.6, 0.8, 'steel', -4.8, -BEAR_H + 1.7, 0, null, hex); cylY(0.6, 0.8, 'steel', 4.8, -BEAR_H + 1.7, 0, null, hex);
      } else if (t === 'shaft') {
        place(c, (g.axis + 2) % 3, 1, g.axis, 1);
        s = spinner(1, g.id);
        cylZ(1.0, g.len, 'steel', 0, 0, 0, s);
        box(0.5, 0.25, g.len - 2, 'dark', 0, 0.95, 0, s);          // the keyway, so the turning shows
      } else if (t === 'sprocket') {
        place(c, (g.axis + 2) % 3, 1, g.axis, 1);
        sprocket(g.n, spinner(1, g.body));
      } else if (t === 'coupling') {               // a jaw coupling: two hubs and a rubber spider between them
        place(c, (g.axis + 2) % 3, 1, g.axis, g.out);
        s = spinner(1, g.motor);
        cylZ(2.0, 2.2, 'alu', 0, 0, -1.4, s); cylZ(2.0, 2.2, 'alu', 0, 0, 1.4, s);
        cylZ(2.05, 0.6, 'red', 0, 0, 0, s);
        for (i = 0; i < 3; i++) { var jw = box(1.2, 1.0, 1.1, 'alu', 1.4 * Math.cos(i * 2.094), 1.4 * Math.sin(i * 2.094), -0.25, s); jw.rotation.z = i * 2.094; }
        cylY(0.35, 0.8, 'dark', 0, 2.1, -1.6, s); cylY(0.35, 0.8, 'dark', 0, 2.1, 1.6, s);
      } else if (t === 'idler') {
        place(c, (g.axis + 2) % 3, 1, g.axis, 1);
        sprocket(12, spinner(1, null, g.chain));
        var arm = put(unitCyl, 'grey', c[0] + g.nv[0] * 3.2, c[1] + g.nv[1] * 3.2, c[2] + g.nv[2] * 3.2, opts.loose);
        arm.scale.set(0.45, 6.4, 0.45); arm.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(g.nv[0], g.nv[1], g.nv[2]));
        if (!opts.loose) { grp.remove(arm); var holder = new THREE.Group(); holder.add(grp); holder.add(arm); holder.userData = grp.userData; return holder; }
      } else if (t === 'wheel') {
        place(c, (g.axis + 2) % 3, 1, g.axis, g.end);
        s = spinner(g.end, g.body);
        put(tireGeo, 'rubber', 0, 0, 0, s);
        cylZ(8.8, 11.5, 'rim', 0, 0, 0, s); cylZ(6.2, 11.9, 'dark', 0, 0, 0, s);
        cylZ(4.6, 1.6, 'steel', 0, 0, 6.4, s); cylZ(2.2, 5, 'steel', 0, 0, -3.6, s);
        for (i = 0; i < 3; i++) cylZ(0.55, 0.8, 'dark', 3.1 * Math.cos(i * 2.094), 3.1 * Math.sin(i * 2.094), 7.3, s, hex);
        var kn = new THREE.InstancedMesh(knobGeo, m('rubber'), 44), dm = new THREE.Object3D();
        for (i = 0; i < 44; i++) {
          var a = i / 22 * Math.PI * 2 + (i >= 22 ? 0.143 : 0);
          dm.position.set((R + 0.35) * Math.cos(a), (R + 0.35) * Math.sin(a), i >= 22 ? 3.1 : -3.1); dm.rotation.set(0, 0, a + Math.PI / 2 + (i >= 22 ? 0.35 : -0.35)); dm.updateMatrix();
          kn.setMatrixAt(i, dm.matrix);
        }
        s.add(kn);
      } else if (t === 'motor') {
        place(c, g.k, g.sg, g.axis, g.out);        // local z is the way the shaft points
        var zp = (g.pz - c[g.axis]) * g.out, z0 = Math.min(zp - 2, -7), z1 = Math.max(zp + 2, -2);
        box(13, 0.6, z1 - z0, 'grey', 0, -5.2, (z0 + z1) / 2);
        if (p.lift > 0) box(11, p.lift, z1 - z0 - 1, 'alu', 0, -5.5 - p.lift / 2, (z0 + z1) / 2);      // spacer plates under the motor
        box(9.5, 9.5, 5, 'motor', 0, 0, -4.5);
        cylZ(4.9, 11, 'motor', 0, 0, -12.5); cylZ(5.05, 1.2, 'steel', 0, 0, -18.4);
        cylZ(0.85, 4, 'steel', 0, 0, -0.5);
      } else if (t === 'battery' || t === 'control') {
        place(c, g.k, g.sg, g.t, 1);
        var D = g.dims;
        if (t === 'battery') {
          box(D[0], D[1], D[2], 'black'); box(D[0] + 0.8, D[1] + 0.8, 2.4, 'motor');
          box(3, D[1] + 1.2, D[2] + 1.2, 'grey', -D[0] / 2 + 4, 0, 0); box(3, D[1] + 1.2, D[2] + 1.2, 'grey', D[0] / 2 - 4, 0, 0);
          box(3, 1.2, 2, 'yellow', 0, D[1] / 2 + 0.6, D[2] / 2 - 3);
        } else {
          box(D[0], D[1], D[2], 'grey'); box(D[0] + 0.6, 1, D[2] + 0.6, 'dark', 0, D[1] / 2, 0);
          box(5, 0.4, 3.5, 'black', 4, D[1] / 2 + 0.7, 0); put(new THREE.SphereGeometry(0.6, 10, 8), 'green', -6, D[1] / 2 + 0.6, 2);
          cylY(0.15, 9, 'black', -8, D[1] / 2 + 5, -3);
        }
      } else if (t === 'estop') {
        place(c, g.k, g.sg, g.a, 1);
        cylY(2.4, 1.2, 'yellow', 0, -1.0, 0); cylY(1.9, 1.8, 'red', 0, 0.5, 0); cylY(2.3, 0.5, 'red', 0, 1.35, 0);
      } else if (t === 'deck') {
        grp.position.set(c[0], c[1], c[2]);
        box(p.lx, 0.8, p.lz, 'alu');
        var n = Math.max(0, Math.min(4, p.crates | 0)), cw = Math.min(36, p.lz / Math.max(1, n) - 3), cl = Math.min(46, p.lx - 6);
        for (i = 0; i < n; i++) {
          var cg = new THREE.Group();
          for (var k = 0; k < 3; k++) {
            box(cl, 5.4, 1, 'wood', 0, 3 + k * 6.6, cw / 2, cg); box(cl, 5.4, 1, 'wood', 0, 3 + k * 6.6, -cw / 2, cg);
            box(1, 5.4, cw, 'wood', cl / 2, 3 + k * 6.6, 0, cg); box(1, 5.4, cw, 'wood', -cl / 2, 3 + k * 6.6, 0, cg);
          }
          box(cl, 0.8, cw, 'woodD', 0, 0.4, 0, cg);
          cg.position.set(0, 0.4, (i - (n - 1) / 2) * (cw + 3));
          grp.add(cg);
        }
      } else if (t === 'chain') {
        var im = new THREE.InstancedMesh(linkGeo, m('chain'), g.n), dummy = new THREE.Object3D(), mx = new THREE.Matrix4();
        var zv = vec(g.axis, 1), xv = new THREE.Vector3(), yv = new THREE.Vector3();
        var lay = function (off) {
          for (var q = 0; q < g.n; q++) {
            var pt = g.pt(off + q * g.belt.len / g.n);
            xv.set(0, 0, 0); xv.setComponent(g.i, Math.cos(pt.ang)); xv.setComponent(g.j, Math.sin(pt.ang));
            yv.crossVectors(zv, xv);
            dummy.position.set(pt.p[0], pt.p[1], pt.p[2]); dummy.quaternion.setFromRotationMatrix(mx.makeBasis(xv, yv, zv));
            dummy.scale.set(1, 1, q % 2 ? 1 : 0.62); dummy.updateMatrix();
            im.setMatrixAt(q, dummy.matrix);
          }
          im.instanceMatrix.needsUpdate = true;
        };
        lay(0);
        grp.add(im);
        grp.userData.chain = { lay: lay, body: g.A.body, rp: g.A.rp };
      }
      return grp;
    }
    function dispose() {
      Object.keys(mat).forEach(function (k) { mat[k].dispose(); });
      [unitBox, unitCyl, hex, triGeo, tireGeo, knobGeo, linkGeo].forEach(function (g) { g.dispose(); });
      Object.keys(sprGeo).forEach(function (k) { sprGeo[k].dispose(); });
    }
    return { mesh: mesh, dispose: dispose, mat: mat };
  };
})(window.PICO);
