import * as THREE from "three";

// One reusable GPU context. Text is composited separately for crisp Turkish glyphs.
export function createStage() {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    preserveDrawingBuffer: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  const room = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 16 / 9, 0.1, 80);
  const ambient = new THREE.HemisphereLight(0xfff5de, 0x344031, 2.8);
  room.add(ambient);
  const sun = new THREE.DirectionalLight(0xffe0a3, 4.3);
  sun.position.set(-3, 7, 5);
  room.add(sun);
  const fill = new THREE.DirectionalLight(0xd9ebff, 1.1);
  fill.position.set(6, 4, 0);
  room.add(fill);
  const wall = new THREE.MeshStandardMaterial({
    color: 0x657057,
    roughness: 0.95,
  });
  const floor = new THREE.MeshStandardMaterial({
    color: 0x9b947c,
    roughness: 0.9,
  });
  const wood = new THREE.MeshStandardMaterial({
    color: 0xd5ad72,
    roughness: 0.6,
  });
  const stone = new THREE.MeshStandardMaterial({
    color: 0xd5c9b0,
    roughness: 0.85,
  });
  const green = new THREE.MeshStandardMaterial({
    color: 0x5e754b,
    roughness: 0.8,
  });
  const glass = new THREE.MeshStandardMaterial({
    color: 0x9cbaa5,
    roughness: 0.3,
    metalness: 0.15,
  });
  function box(w, h, d, x, y, z, material) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(x, y, z);
    room.add(mesh);
    return mesh;
  }
  box(22, 0.2, 18, 0, -0.15, 0, floor);
  box(22, 9, 0.18, 0, 4.3, -3.7, wall);
  box(0.18, 9, 18, 7, 4.3, 0, wall);
  // Window frame on the back wall: a deliberate stylized set, not reconstructed architecture.
  box(2.8, 4.2, 0.12, 3.4, 3.3, -3.51, stone);
  box(2.5, 3.9, 0.16, 3.4, 3.3, -3.4, glass);
  box(0.06, 3.9, 0.21, 3.4, 3.3, -3.27, stone);
  box(2.5, 0.06, 0.21, 3.4, 3.3, -3.27, stone);
  const top = box(3.5, 0.18, 1.4, 2.5, 1.65, -0.2, wood);
  for (const x of [1.1, 3.9])
    for (const z of [-0.72, 0.32]) box(0.13, 1.6, 0.13, x, 0.77, z, wood);
  box(1.65, 0.35, 1.25, 5.4, 0.65, 0.6, stone);
  box(1.65, 0.9, 0.2, 5.4, 1.2, 0.05, stone);
  for (const x of [4.8, 6]) box(0.13, 0.5, 0.13, x, 0.25, 0.6, wood);
  const vase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.25, 0.9, 24),
    stone,
  );
  vase.position.set(3, 2.18, -0.2);
  room.add(vase);
  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 16), stone);
  orb.position.set(1.6, 1.98, -0.2);
  room.add(orb);
  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.35, 1, 24),
    stone,
  );
  pot.position.set(5.6, 0.5, -2.8);
  room.add(pot);
  for (let i = 0; i < 10; i++) {
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), green);
    leaf.scale.set(0.4, 0.75, 0.08);
    leaf.rotation.z = (i % 2 ? 1 : -1) * (0.4 + i * 0.035);
    leaf.position.set(
      5.6 + (i % 2 ? 0.3 : -0.3),
      1.1 + i * 0.23,
      -2.8 + Math.sin(i) * 0.15,
    );
    room.add(leaf);
  }
  const rug = new THREE.Mesh(
    new THREE.CircleGeometry(2.6, 64),
    new THREE.MeshStandardMaterial({ color: 0xb2ab8e, roughness: 1 }),
  );
  rug.rotation.x = -Math.PI / 2;
  rug.scale.y = 0.65;
  rug.position.set(2.6, -0.035, 0.6);
  room.add(rug);
  const picture = new THREE.Scene();
  const photoCamera = new THREE.PerspectiveCamera(40, 16 / 9, 0.1, 30);
  const photoMaterial = new THREE.MeshBasicMaterial({ toneMapped: false });
  const photoPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    photoMaterial,
  );
  picture.add(photoPlane);
  const textures = new Map();
  let lost = false;
  renderer.domElement.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    lost = true;
  });
  renderer.domElement.addEventListener("webglcontextrestored", () => {
    lost = false;
  });
  function render(c, width, height, plan, index, progress, image) {
    if (lost)
      throw new Error(
        "GPU bağlamı kayboldu. Sayfayı yenileyip 720p ile tekrar dene.",
      );
    if (
      renderer.domElement.width !== width ||
      renderer.domElement.height !== height
    )
      renderer.setSize(width, height, false);
    if (image) {
      if (!textures.has(image)) {
        const texture = new THREE.Texture(image);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.needsUpdate = true;
        textures.set(image, texture);
      }
      if (photoMaterial.map !== textures.get(image)) {
        photoMaterial.map = textures.get(image);
        photoMaterial.needsUpdate = true;
      }
      const aspect = image.width / image.height,
        frameAspect = width / height;
      const vh = 2 * Math.tan(THREE.MathUtils.degToRad(20)) * 3;
      const cover =
        Math.max(frameAspect / aspect, 1) * (1.04 + progress * 0.065);
      photoPlane.scale.set((vh * aspect * cover) / 2, (vh * cover) / 2, 1);
      photoCamera.aspect = frameAspect;
      photoCamera.updateProjectionMatrix();
      photoCamera.position.set((progress - 0.5) * 0.035, 0, 3);
      photoCamera.lookAt(0, 0, 0);
      renderer.render(picture, photoCamera);
    } else {
      const light = plan.style === "minimal";
      room.background = new THREE.Color(light ? "#d5d0bd" : "#394633");
      wall.color.set(light ? "#b5baa1" : "#59694d");
      floor.color.set(light ? "#c1b596" : "#7d8065");
      wood.color.set(plan.accent);
      top.rotation.y = Math.sin(index * 0.3) * 0.02;
      const glide = (progress - 0.5) * 0.45;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      camera.position.set(
        -0.5 + glide + index * 0.1,
        3.25 + Math.sin(progress * Math.PI) * 0.12,
        9.5 - progress * 0.45,
      );
      camera.lookAt(0.4, 2.1, -1.2);
      renderer.render(room, camera);
    }
    c.drawImage(renderer.domElement, 0, 0, 1280, 720);
  }
  function retain(images) {
    for (const [image, texture] of textures)
      if (!images.includes(image)) {
        texture.dispose();
        textures.delete(image);
      }
  }
  return { render, retain };
}
