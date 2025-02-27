const heart = new NextParticle({
  renderer: 'webgl',
  image: document.querySelector('#valentines'),
  width: window.innerWidth,
  height: window.innerHeight,
  particleGap: settings.particleGap,
  particleSize: settings.particleSize,
  mouseForce: settings.mouseForce,
  noise: settings.noise,
  layerCount: settings.layerCount,
  layerDistance: settings.layerDistance
});