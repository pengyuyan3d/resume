import * as THREE from "three";

export interface Island3DOptions {
  canvas: HTMLCanvasElement;
  container: HTMLElement;
  markers: Map<string, HTMLElement>;
  onSelectZone: (zoneId: string) => void;
}

export function mountIsland3D({ canvas, container, markers, onSelectZone }: Island3DOptions) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const scene = new THREE.Scene();

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 120);
  camera.position.set(0, 12.2, 21.5);
  camera.lookAt(0, 0.4, 0);

  // --- Monument Valley / Stylized Diorama Lighting ---
  const hemiLight = new THREE.HemisphereLight(0xe4fbf8, 0xf8d9b4, 1.15);
  scene.add(hemiLight);

  const sunLight = new THREE.DirectionalLight(0xfff5e0, 1.75);
  sunLight.position.set(13, 19, 11);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(2048, 2048);
  sunLight.shadow.camera.near = 4;
  sunLight.shadow.camera.far = 45;
  const d = 11;
  sunLight.shadow.camera.left = -d;
  sunLight.shadow.camera.right = d;
  sunLight.shadow.camera.top = d;
  sunLight.shadow.camera.bottom = -d;
  sunLight.shadow.bias = -0.0005;
  scene.add(sunLight);

  const rimLight = new THREE.DirectionalLight(0x88e5e2, 0.52);
  rimLight.position.set(-14, 8, -10);
  scene.add(rimLight);

  // Root floating group
  const world = new THREE.Group();
  scene.add(world);

  const mat = (color: number, opts: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.78,
      metalness: 0.04,
      flatShading: true,
      ...opts,
    });

  // Helper to jitter vertices deterministically for organic low-poly facets
  function facetJitter(geo: THREE.BufferGeometry, ampX: number, ampY: number, seed = 1) {
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const vz = pos.getZ(i);
      const h = Math.sin(vx * 2.1 + vz * 1.7 + seed) * 0.5 + Math.cos(vy * 3.3 - vx * 1.3) * 0.5;
      pos.setX(i, vx + h * ampX);
      pos.setZ(i, vz + h * ampX);
      pos.setY(i, vy + h * ampY * 0.4);
    }
    geo.computeVertexNormals();
    return geo;
  }

  // 1. Crystal Lagoon Water Disc & Foam Ring
  const waterGeo = new THREE.CylinderGeometry(7.9, 7.3, 0.55, 24);
  const waterMat = new THREE.MeshPhysicalMaterial({
    color: 0x5fd3d0,
    roughness: 0.18,
    metalness: 0.05,
    transmission: 0.35,
    transparent: true,
    opacity: 0.88,
    flatShading: true,
  });
  const water = new THREE.Mesh(waterGeo, waterMat);
  water.position.y = -0.52;
  water.receiveShadow = true;
  world.add(water);

  const foamRingGeo = new THREE.RingGeometry(5.65, 6.02, 32);
  foamRingGeo.rotateX(-Math.PI / 2);
  const foamRing = new THREE.Mesh(
    foamRingGeo,
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55, side: THREE.DoubleSide }),
  );
  foamRing.position.y = -0.22;
  world.add(foamRing);

  // 2. Inverted Low-Poly Floating Cliff Base
  const cliffGeo = facetJitter(new THREE.ConeGeometry(6.9, 5.2, 11, 3), 0.22, 0.18, 3);
  cliffGeo.rotateX(Math.PI);
  const cliff = new THREE.Mesh(cliffGeo, mat(0xb8926a));
  cliff.position.y = -2.85;
  cliff.castShadow = true;
  cliff.receiveShadow = true;
  world.add(cliff);

  // Secondary floating mini rocks
  const subRockData = [
    { pos: [-7.4, -1.6, 2.0], r: 0.9, h: 1.6 },
    { pos: [7.3, -1.9, -1.8], r: 0.75, h: 1.4 },
    { pos: [-5.8, -2.6, -3.2], r: 0.55, h: 1.1 },
  ];
  const floatingRocks: THREE.Mesh[] = [];
  subRockData.forEach((sr, idx) => {
    const g = facetJitter(new THREE.ConeGeometry(sr.r, sr.h, 7), 0.1, 0.1, idx + 10);
    g.rotateX(Math.PI);
    const m = new THREE.Mesh(g, mat(0xc6a27b));
    m.position.set(sr.pos[0], sr.pos[1], sr.pos[2]);
    m.castShadow = true;
    world.add(m);
    floatingRocks.push(m);
  });

  // 3. Warm Sand Beach & Lush Dual-Tier Meadow
  const sandGeo = facetJitter(new THREE.CylinderGeometry(5.75, 6.25, 0.65, 16), 0.14, 0.06, 7);
  const sand = new THREE.Mesh(sandGeo, mat(0xf4dfb4));
  sand.position.y = -0.12;
  sand.receiveShadow = true;
  sand.castShadow = true;
  world.add(sand);

  const grassGeo = facetJitter(new THREE.CylinderGeometry(5.05, 5.45, 0.55, 16), 0.12, 0.06, 12);
  const grass = new THREE.Mesh(grassGeo, mat(0xa8cf78));
  grass.position.y = 0.32;
  grass.receiveShadow = true;
  grass.castShadow = true;
  world.add(grass);

  // North elevated terrace for Campus Lighthouse
  const northHillGeo = facetJitter(new THREE.CylinderGeometry(1.85, 2.35, 0.85, 9), 0.1, 0.05, 21);
  const northHill = new THREE.Mesh(northHillGeo, mat(0x98c269));
  northHill.position.set(-0.6, 0.88, -2.35);
  northHill.receiveShadow = true;
  northHill.castShadow = true;
  world.add(northHill);

  // Stepping stone pathways
  const stoneMat = mat(0xeaddbe);
  const pathPoints = [
    [-2.4, 1.5], [-1.5, 1.2], [-0.6, 0.9], [0.3, 0.7], [1.2, 0.55], [2.1, 0.4],
    [-0.5, 0.2], [-0.55, -0.6], [-0.6, -1.3],
    [1.4, 1.2], [1.8, 1.9],
  ];
  pathPoints.forEach(([px, pz], i) => {
    const st = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.27, 0.08, 6), stoneMat);
    st.position.set(px, 0.61, pz);
    st.rotation.y = i * 0.7;
    st.receiveShadow = true;
    world.add(st);
  });

  // --- Interactive Landmark Groups ---
  const landmarkGroups = new Map<string, THREE.Group>();
  const anchorPoints = new Map<string, THREE.Vector3>();
  const pickMeshes: THREE.Object3D[] = [];

  function registerLandmark(id: string, group: THREE.Group, anchorOffset: THREE.Vector3) {
    group.userData.zoneId = id;
    group.traverse((child) => {
      child.userData.zoneId = id;
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        pickMeshes.push(child);
      }
    });
    world.add(group);
    landmarkGroups.set(id, group);
    anchorPoints.set(id, group.position.clone().add(anchorOffset));
  }

  // [01] WORK HARBOR (Southwest coast + Pier + Sailboat)
  const harbor = new THREE.Group();
  harbor.position.set(-2.75, 0.6, 1.65);
  {
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.65, 1.15, 1.25), mat(0xfbf2df));
    body.position.y = 0.57;
    harbor.add(body);

    const roofGeo = new THREE.ConeGeometry(1.32, 0.82, 4);
    roofGeo.rotateY(Math.PI / 4);
    const roof = new THREE.Mesh(roofGeo, mat(0xd95f43));
    roof.scale.set(1.08, 1, 0.85);
    roof.position.y = 1.54;
    harbor.add(roof);

    // Side annex
    const wing = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.78, 0.9), mat(0xf3e4c8));
    wing.position.set(1.05, 0.39, 0.12);
    harbor.add(wing);
    const wingRoof = new THREE.Mesh(new THREE.ConeGeometry(0.74, 0.5, 4), mat(0xc44f35));
    wingRoof.rotation.y = Math.PI / 4;
    wingRoof.position.set(1.05, 1.02, 0.12);
    harbor.add(wingRoof);

    // Glowing round window & door
    const win = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.08, 12),
      mat(0xffdf8e, { emissive: 0xffb347, emissiveIntensity: 0.6 }),
    );
    win.rotation.x = Math.PI / 2;
    win.position.set(-0.25, 0.68, 0.63);
    harbor.add(win);

    const door = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.56, 0.08), mat(0x7c5333));
    door.position.set(0.35, 0.28, 0.63);
    harbor.add(door);

    // Wooden pier stretching out to sea
    const pier = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.12, 2.05), mat(0xd4ad73));
    pier.position.set(-0.85, -0.32, 1.55);
    pier.rotation.y = -0.35;
    harbor.add(pier);
  }
  registerLandmark("work", harbor, new THREE.Vector3(0, 2.25, 0));

  // Bobbing Sailboat near Harbor
  const boat = new THREE.Group();
  boat.position.set(-4.35, -0.18, 3.65);
  boat.rotation.y = 0.55;
  {
    const hull = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.26, 0.28, 6), mat(0xc9935b));
    hull.scale.set(1.6, 1, 0.78);
    hull.castShadow = true;
    boat.add(hull);
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 1.35, 6), mat(0x7c5333));
    mast.position.y = 0.72;
    boat.add(mast);
    const sailGeo = new THREE.ConeGeometry(0.52, 1.05, 3);
    const sail = new THREE.Mesh(sailGeo, mat(0xfffaf0));
    sail.scale.set(1, 1, 0.18);
    sail.position.set(0.16, 0.78, 0);
    sail.castShadow = true;
    boat.add(sail);
  }
  world.add(boat);

  // [02] BUILD LAB WORKSHOP (East plateau + Chimney + Gear + Smoke puffs)
  const workshop = new THREE.Group();
  workshop.position.set(2.55, 0.6, 0.15);
  let gearWheel: THREE.Mesh;
  {
    const mainBox = new THREE.Mesh(new THREE.BoxGeometry(1.75, 1.18, 1.35), mat(0xfaf0dc));
    mainBox.position.y = 0.59;
    workshop.add(mainBox);

    const roof = new THREE.Mesh(new THREE.ConeGeometry(1.42, 0.86, 4), mat(0xd45b3e));
    roof.rotation.y = Math.PI / 4;
    roof.scale.set(1.06, 1, 0.86);
    roof.position.y = 1.61;
    workshop.add(roof);

    // Skylight studio window
    const skylight = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.12, 0.48),
      mat(0x88e2ec, { emissive: 0x4cc9d8, emissiveIntensity: 0.35, roughness: 0.2 }),
    );
    skylight.position.set(-0.2, 1.56, 0.36);
    skylight.rotation.x = 0.62;
    workshop.add(skylight);

    // Tall stone chimney
    const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.38, 1.85, 0.38), mat(0xd8ddd6));
    chimney.position.set(0.62, 1.18, -0.35);
    workshop.add(chimney);

    // Rotating craft gear on side wall
    gearWheel = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.08, 6, 8), mat(0xe69d38));
    gearWheel.position.set(0.91, 0.62, 0.15);
    gearWheel.rotation.y = Math.PI / 2;
    workshop.add(gearWheel);
  }
  registerLandmark("build", workshop, new THREE.Vector3(0, 2.45, 0));

  // Puffing 3D smoke spheres above workshop chimney
  const smokePuffs: { mesh: THREE.Mesh; phase: number }[] = [];
  const smokeMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.9,
    transparent: true,
    opacity: 0.75,
    flatShading: true,
  });
  for (let i = 0; i < 4; i++) {
    const puff = new THREE.Mesh(new THREE.IcosahedronGeometry(0.18, 0), smokeMat.clone());
    world.add(puff);
    smokePuffs.push({ mesh: puff, phase: i * 0.25 });
  }

  // [03] CAMPUS LIGHTHOUSE (North high hill + Rotating Warm Beam)
  const lighthouse = new THREE.Group();
  lighthouse.position.set(-0.6, 1.3, -2.35);
  const beamGroup = new THREE.Group();
  {
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.82, 0.36, 8), mat(0xe5d4b3));
    base.position.y = 0.18;
    lighthouse.add(base);

    const t1 = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.62, 0.95, 8), mat(0xfffaf0));
    t1.position.y = 0.83;
    lighthouse.add(t1);

    const t2 = new THREE.Mesh(new THREE.CylinderGeometry(0.43, 0.52, 0.88, 8), mat(0xdf583a));
    t2.position.y = 1.74;
    lighthouse.add(t2);

    const t3 = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.43, 0.72, 8), mat(0xfffaf0));
    t3.position.y = 2.54;
    lighthouse.add(t3);

    const gallery = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.44, 0.16, 8), mat(0x37474f));
    gallery.position.y = 2.96;
    lighthouse.add(gallery);

    const lantern = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 0.44, 8),
      mat(0xffe89c, { emissive: 0xffc857, emissiveIntensity: 0.95 }),
    );
    lantern.position.y = 3.24;
    lighthouse.add(lantern);

    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.44, 0.52, 8), mat(0xd95338));
    cap.position.y = 3.72;
    lighthouse.add(cap);

    // Volumetric light cone
    beamGroup.position.set(0, 3.24, 0);
    const coneGeo = new THREE.ConeGeometry(0.85, 3.4, 12, 1, true);
    coneGeo.translate(0, -1.7, 0);
    coneGeo.rotateZ(Math.PI / 2);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0xffe9a3,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const cone1 = new THREE.Mesh(coneGeo, coneMat);
    const cone2 = cone1.clone();
    cone2.rotation.y = Math.PI;
    beamGroup.add(cone1, cone2);
    lighthouse.add(beamGroup);

    const lightPt = new THREE.PointLight(0xffd27d, 1.2, 6);
    lightPt.position.set(0, 3.25, 0);
    lighthouse.add(lightPt);
  }
  registerLandmark("campus", lighthouse, new THREE.Vector3(0, 4.25, 0));

  // [04] SIGNAL CAMP (Southeast tents + Warm Campfire + Flag)
  const camp = new THREE.Group();
  camp.position.set(1.85, 0.6, 2.55);
  let fireFlame: THREE.Mesh;
  let fireLight: THREE.PointLight;
  {
    const tent1Geo = new THREE.ConeGeometry(0.72, 1.05, 4);
    tent1Geo.rotateY(Math.PI / 4);
    const tent1 = new THREE.Mesh(tent1Geo, mat(0xfff6e5));
    tent1.position.set(-0.52, 0.52, -0.15);
    camp.add(tent1);

    const tent2Geo = new THREE.ConeGeometry(0.56, 0.84, 4);
    tent2Geo.rotateY(0.3);
    const tent2 = new THREE.Mesh(tent2Geo, mat(0x7fd4cc));
    tent2.position.set(0.55, 0.42, -0.32);
    camp.add(tent2);

    // Campfire logs & glowing flame
    const logRing = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.1, 7), mat(0x7c5333));
    logRing.position.set(0.08, 0.05, 0.55);
    camp.add(logRing);

    fireFlame = new THREE.Mesh(
      new THREE.ConeGeometry(0.17, 0.42, 5),
      mat(0xff9233, { emissive: 0xff6b1a, emissiveIntensity: 1.1 }),
    );
    fireFlame.position.set(0.08, 0.28, 0.55);
    camp.add(fireFlame);

    fireLight = new THREE.PointLight(0xff8c3b, 1.1, 4.2);
    fireLight.position.set(0.08, 0.55, 0.55);
    camp.add(fireLight);

    // Signal Flagpole
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 1.55, 6), mat(0x8d623f));
    pole.position.set(0.95, 0.77, 0.35);
    camp.add(pole);

    const flag = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.26, 0.04), mat(0xe05a3a));
    flag.position.set(1.18, 1.38, 0.35);
    camp.add(flag);
  }
  registerLandmark("camp", camp, new THREE.Vector3(0.45, 1.55, 0.65));

  // --- Stylized Low-Poly Trees & Rocks ---
  const treeColors = [0x6fb353, 0x82c262, 0x5da046];
  const treeSpots: [number, number, number, number][] = [
    [-3.7, 0.58, -0.8, 1.05], [-3.1, 0.58, -1.9, 0.85], [-2.1, 0.62, -2.9, 0.95],
    [1.1, 0.62, -3.1, 1.1], [2.2, 0.58, -2.2, 0.9], [3.4, 0.58, -1.3, 0.82],
    [3.8, 0.58, 1.4, 0.95], [-1.1, 0.58, 3.1, 0.88], [-0.2, 0.58, 3.5, 0.74],
    [-4.1, 0.55, 0.4, 0.78], [0.8, 0.58, -1.4, 0.76], [-1.8, 0.58, -0.3, 0.72],
  ];
  treeSpots.forEach(([tx, ty, tz, s], idx) => {
    const tg = new THREE.Group();
    tg.position.set(tx, ty, tz);
    tg.scale.setScalar(s);
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.45, 5), mat(0x8d623f));
    trunk.position.y = 0.22;
    trunk.castShadow = true;
    tg.add(trunk);

    const cMat = mat(treeColors[idx % treeColors.length]);
    if (idx % 2 === 0) {
      const c1 = new THREE.Mesh(new THREE.ConeGeometry(0.48, 0.82, 6), cMat);
      c1.position.y = 0.74;
      c1.castShadow = true;
      const c2 = new THREE.Mesh(new THREE.ConeGeometry(0.36, 0.68, 6), cMat);
      c2.position.y = 1.18;
      c2.castShadow = true;
      tg.add(c1, c2);
    } else {
      const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(0.46, 0), cMat);
      crown.position.y = 0.78;
      crown.castShadow = true;
      tg.add(crown);
    }
    world.add(tg);
  });

  // --- Fluffy Low-Poly Drifting Clouds ---
  const clouds: { group: THREE.Group; radius: number; angle: number; speed: number; y: number }[] = [];
  const cloudMat = mat(0xffffff, { roughness: 0.95 });
  [
    { radius: 7.4, angle: 0.4, speed: 0.055, y: 4.1, scale: 0.9 },
    { radius: 8.2, angle: 2.5, speed: 0.042, y: 3.5, scale: 0.75 },
    { radius: 6.8, angle: 4.4, speed: 0.06, y: 4.5, scale: 0.68 },
  ].forEach((cd) => {
    const cg = new THREE.Group();
    const p1 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 0), cloudMat);
    const p2 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 0), cloudMat);
    p2.position.set(0.48, -0.08, 0.1);
    const p3 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.38, 0), cloudMat);
    p3.position.set(-0.44, -0.1, -0.08);
    cg.add(p1, p2, p3);
    cg.scale.setScalar(cd.scale);
    scene.add(cg);
    clouds.push({ group: cg, ...cd });
  });

  // --- Pointer Drag / Hover Parallax & Raycasting ---
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(-99, -99);
  let targetRotY = -0.32;
  let curRotY = -0.32;
  let targetRotX = 0.02;
  let curRotX = 0.02;
  let isDragging = false;
  let dragMoved = false;
  let startX = 0;
  let hoveredZone: string | null = null;
  let externalHighlightZone: string | null = null;

  function updatePointer(e: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }

  canvas.addEventListener("pointerdown", (e) => {
    isDragging = true;
    dragMoved = false;
    startX = e.clientX;
    updatePointer(e);
  });

  window.addEventListener("pointermove", (e) => {
    const rect = canvas.getBoundingClientRect();
    if (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    ) {
      updatePointer(e);
    }
    if (isDragging) {
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) dragMoved = true;
      targetRotY += dx * 0.0065;
      startX = e.clientX;
    } else if (rect.width > 0) {
      const nx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
      const ny = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
      targetRotX = Math.max(-0.08, Math.min(0.1, ny * 0.08));
      targetRotY += (nx * 0.12 - (targetRotY % (Math.PI * 2)) * 0.002) * 0.02;
    }
  });

  window.addEventListener("pointerup", () => {
    if (isDragging && !dragMoved && hoveredZone) {
      onSelectZone(hoveredZone);
    }
    isDragging = false;
  });

  function resize() {
    const w = container.clientWidth || 640;
    const h = container.clientHeight || 520;
    camera.aspect = w / h;
    // Zoom slightly out on narrow mobile viewports so the full island breathes
    const distScale = w < 520 ? 1.22 : w < 820 ? 1.08 : 1.0;
    camera.position.set(0, 12.0 * distScale, 21.2 * distScale);
    camera.lookAt(0, 0.35, 0);
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  const projVec = new THREE.Vector3();
  const clock = new THREE.Clock();

  function tick() {
    requestAnimationFrame(tick);
    const t = clock.getElapsedTime();

    if (!reducedMotion) {
      if (!isDragging) {
        targetRotY += 0.0009;
      }
      world.position.y = Math.sin(t * 1.25) * 0.16;
      beamGroup.rotation.y = t * 0.55;
      gearWheel.rotation.z = -t * 0.9;
      boat.position.y = -0.18 + Math.sin(t * 2.1) * 0.06;
      boat.rotation.z = Math.sin(t * 1.7) * 0.06;
      foamRing.scale.setScalar(1 + Math.sin(t * 1.8) * 0.015);
      fireFlame.scale.y = 0.9 + Math.sin(t * 9.5) * 0.16;
      fireLight.intensity = 1.0 + Math.sin(t * 8.2) * 0.22;

      floatingRocks.forEach((rk, idx) => {
        rk.position.y += Math.sin(t * 1.6 + idx * 1.7) * 0.0015;
      });

      // Smoke puffs rising from workshop chimney
      const chimneyBaseX = workshop.position.x + 0.62;
      const chimneyBaseY = workshop.position.y + 2.15;
      const chimneyBaseZ = workshop.position.z - 0.35;
      smokePuffs.forEach((sp) => {
        const p = (t * 0.28 + sp.phase) % 1;
        sp.mesh.position.set(chimneyBaseX + p * 0.35, chimneyBaseY + p * 1.55, chimneyBaseZ - p * 0.2);
        sp.mesh.scale.setScalar(0.55 + p * 1.15);
        (sp.mesh.material as THREE.MeshStandardMaterial).opacity = Math.sin(p * Math.PI) * 0.62;
      });

      clouds.forEach((c) => {
        const ang = c.angle + t * c.speed;
        c.group.position.set(Math.cos(ang) * c.radius, c.y + Math.sin(t + c.angle) * 0.12, Math.sin(ang) * c.radius * 0.68);
        c.group.lookAt(0, c.y, 0);
      });
    }

    curRotY += (targetRotY - curRotY) * 0.075;
    curRotX += (targetRotX - curRotX) * 0.075;
    world.rotation.y = curRotY;
    world.rotation.x = curRotX;
    world.updateMatrixWorld();

    // Raycast hover check
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(pickMeshes, false);
    hoveredZone = hits.length > 0 ? (hits[0].object.userData.zoneId as string) : null;
    canvas.style.cursor = hoveredZone ? "pointer" : isDragging ? "grabbing" : "grab";

    const activeZone = hoveredZone || externalHighlightZone;
    landmarkGroups.forEach((grp, id) => {
      const targetScale = id === activeZone ? 1.08 : 1.0;
      grp.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.16);
    });

    // Project 3D anchors to frosted-glass HTML markers
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    anchorPoints.forEach((localPos, id) => {
      const el = markers.get(id);
      if (!el) return;
      projVec.copy(localPos).applyMatrix4(world.matrixWorld).project(camera);
      const sx = (projVec.x * 0.5 + 0.5) * cw;
      const sy = (-projVec.y * 0.5 + 0.5) * ch;
      el.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0) translate(-50%, -100%)`;
      el.classList.toggle("is-linked", id === activeZone);
    });

    renderer.render(scene, camera);
  }

  tick();

  return {
    setHighlightZone(zoneId: string | null) {
      externalHighlightZone = zoneId;
    },
  };
}
