<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Phaser from 'phaser'

import backgroundUrl from './assets/background/background_static.png'
import cornerBubblesUrl from './assets/background/layer_corner_bubbles.png'
import moleculesUrl from './assets/background/layer_molecules.png'
import { preloadGameUi, createGameUi } from './game/gameUi.js'
import { isCompactPhoneViewport, isTabletPortraitViewport } from './game/viewport.js'

const backgroundHost = ref(null)
const uiHost = ref(null)
const foregroundHost = ref(null)
let backgroundGame
let uiGame
let foregroundGame
let handleUiViewportResize

const SCENE_WIDTH = 1672
const SCENE_HEIGHT = 941

// Transparent bubble groups in the supplied full-size layer, cropped into
// individual Phaser frames so they can float independently.
const cornerBubbleRegions = [
  { x: 36, y: 641, width: 23, height: 22 },
  { x: 69, y: 671, width: 21, height: 20 },
  { x: 1597, y: 696, width: 33, height: 34 },
  { x: 67, y: 735, width: 25, height: 26 },
  { x: 1558, y: 745, width: 29, height: 29 },
  { x: 101, y: 764, width: 33, height: 33 },
  { x: 1605, y: 771, width: 19, height: 20 },
  { x: 1513, y: 797, width: 17, height: 17 },
  { x: 43, y: 802, width: 65, height: 65 },
  { x: 1614, y: 806, width: 22, height: 22 },
  { x: 1546, y: 823, width: 59, height: 60 },
  { x: 137, y: 832, width: 15, height: 14 },
  { x: 176, y: 843, width: 36, height: 36 },
  { x: 300, y: 858, width: 18, height: 18 },
  { x: 1436, y: 866, width: 28, height: 28 },
  { x: 242, y: 871, width: 34, height: 35 },
  { x: 1497, y: 871, width: 34, height: 33 },
  { x: 120, y: 875, width: 19, height: 20 },
  { x: 1366, y: 896, width: 20, height: 21 },
  { x: 1417, y: 906, width: 15, height: 16 },
]

// Each region is cut from the supplied transparent molecule layer so every
// molecule can drift independently while retaining the original artwork.
const moleculeRegions = [
  { x: 509, y: 307, width: 78, height: 74, driftX: 8, driftY: 7, angle: 4, duration: 4300 },
  { x: 336, y: 322, width: 77, height: 72, driftX: 7, driftY: 8, angle: -5, duration: 5200 },
  { x: 1185, y: 327, width: 32, height: 32, driftX: 4, driftY: 5, angle: 3, duration: 3600 },
  { x: 1270, y: 329, width: 62, height: 70, driftX: 7, driftY: 6, angle: -3, duration: 4700 },
  { x: 1159, y: 376, width: 31, height: 31, driftX: 4, driftY: 5, angle: 4, duration: 5500 },
  { x: 436, y: 388, width: 30, height: 30, driftX: 4, driftY: 5, angle: -4, duration: 4900 },
  { x: 347, y: 422, width: 30, height: 31, driftX: 4, driftY: 5, angle: 3, duration: 4100 },
  { x: 1228, y: 435, width: 74, height: 71, driftX: 8, driftY: 7, angle: -4, duration: 4600 },
  { x: 394, y: 467, width: 30, height: 30, driftX: 4, driftY: 5, angle: 5, duration: 5400 },
  { x: 362, y: 525, width: 65, height: 61, driftX: 7, driftY: 8, angle: -5, duration: 5800 },
  { x: 1282, y: 526, width: 31, height: 30, driftX: 4, driftY: 5, angle: 4, duration: 3900 },
  { x: 1304, y: 570, width: 31, height: 31, driftX: 4, driftY: 5, angle: -3, duration: 5100 },
]

// Keep the source crop regions unchanged; place the individual pieces on the
// quieter wall beside the game UI instead of over the shelves and plants.
const moleculeWallPositions = [
  { x: 565, y: 230 },
  { x: 585, y: 410 },
  { x: 1070, y: 230 },
  { x: 1120, y: 250 },
  { x: 1065, y: 305 },
  { x: 605, y: 295 },
  { x: 545, y: 320 },
  { x: 1088, y: 385 },
  { x: 610, y: 350 },
  { x: 1160, y: 445 },
  { x: 1150, y: 335 },
  { x: 550, y: 470 },
]

class BackgroundScene extends Phaser.Scene {
  constructor() {
    super('background')
  }

  preload() {
    this.load.image('background', backgroundUrl)
    this.load.image('molecules', moleculesUrl)
  }

  create() {
    this.add.image(SCENE_WIDTH / 2, SCENE_HEIGHT / 2, 'background')

    const moleculeTexture = this.textures.get('molecules')

    const moleculeAnchors = []
    moleculeRegions.forEach((region, index) => {
      const frameName = `molecule-${index}`
      moleculeTexture.add(frameName, 0, region.x, region.y, region.width, region.height)

      const isLargeMolecule = region.width >= 60
      const motionDuration = Math.round(region.duration * (isLargeMolecule ? 1.1 : 0.78))
      const driftScale = isLargeMolecule ? 1.25 : 1.5

      const anchor = this.add.container(moleculeWallPositions[index].x, moleculeWallPositions[index].y)
      const molecule = this.add.image(0, 0, 'molecules', frameName)
        .setAlpha(isLargeMolecule ? 0.88 : 0.92)
      anchor.add(molecule)
      moleculeAnchors.push(anchor)

      const phase = index % 2 === 0 ? 1 : -1

      this.tweens.add({
        targets: molecule,
        x: molecule.x + region.driftX * driftScale * phase,
        y: molecule.y - region.driftY * driftScale,
        angle: region.angle * (isLargeMolecule ? 1 : 1.15) * phase,
        duration: motionDuration,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
        delay: index * 110,
      })

      this.tweens.add({
        targets: molecule,
        scaleX: isLargeMolecule ? 1.03 : 1.045,
        scaleY: isLargeMolecule ? 1.03 : 1.045,
        duration: motionDuration * 0.72,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
        delay: 300 + index * 80,
      })
    })

    const updateMoleculePositions = () => {
      const showMolecules = !isCompactPhoneViewport()
      const portrait = window.innerHeight > window.innerWidth
      const visibleWidth = SCENE_HEIGHT * window.innerWidth / window.innerHeight
      const margin = Math.min(65, visibleWidth * 0.1)
      moleculeAnchors.forEach((anchor, index) => {
        anchor.setVisible(showMolecules)
        const position = moleculeWallPositions[index]
        if (!portrait) {
          anchor.setPosition(position.x, position.y)
          return
        }
        const onLeft = position.x < SCENE_WIDTH / 2
        const edgeX = SCENE_WIDTH / 2 + (onLeft ? -visibleWidth / 2 + margin : visibleWidth / 2 - margin)
        const clusterCenter = onLeft ? 565 : 1110
        anchor.setPosition(edgeX + (position.x - clusterCenter) * 0.55, position.y)
      })
    }
    updateMoleculePositions()
    window.addEventListener('resize', updateMoleculePositions)
    this.events.once('shutdown', () => window.removeEventListener('resize', updateMoleculePositions))
  }
}

function createCornerBubbles(scene) {
  const bubbleTexture = scene.textures.get('corner-bubbles')
  const bubbleAnchors = cornerBubbleRegions.map((region, index) => {
    const padding = 4
    const frameName = `corner-bubble-${index}`
    bubbleTexture.add(
      frameName, 0,
      region.x - padding, region.y - padding,
      region.width + padding * 2, region.height + padding * 2,
    )

    const anchor = scene.add.container(0, 0).setDepth(30)
    const bubble = scene.add.image(0, 0, 'corner-bubbles', frameName)
      .setAlpha(0.96)
    anchor.add(bubble)

    const side = region.x < SCENE_WIDTH / 2 ? 1 : -1
    const duration = 3100 + (index * 419) % 2200
    scene.tweens.add({
      targets: bubble,
      x: side * (5 + index % 4 * 2),
      y: -(12 + index % 5 * 3),
      angle: side * (index % 2 === 0 ? 4 : -4),
      duration,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
      delay: index * 95,
    })
    scene.tweens.add({
      targets: bubble,
      scale: region.width >= 50 ? 1.035 : 1.055,
      alpha: region.width >= 50 ? 0.9 : 0.84,
      duration: duration * 0.82,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
      delay: 340 + index * 70,
    })
    return anchor
  })

  const updateBubblePositions = () => {
    const showBubbles = !isCompactPhoneViewport() && !isTabletPortraitViewport()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const viewportRatio = viewportWidth / viewportHeight
    const visibleWidth = Math.min(SCENE_WIDTH, SCENE_HEIGHT * viewportRatio)
    const visibleHeight = Math.min(SCENE_HEIGHT, SCENE_WIDTH / viewportRatio)
    const leftEdge = (SCENE_WIDTH - visibleWidth) / 2
    const rightEdge = SCENE_WIDTH - leftEdge
    const bottomCrop = (SCENE_HEIGHT - visibleHeight) / 2
    const horizontalScale = Math.min(1, visibleWidth / 1000)

    bubbleAnchors.forEach((anchor, index) => {
      anchor.setVisible(showBubbles)
      const region = cornerBubbleRegions[index]
      const sourceX = region.x + region.width / 2
      const sourceY = region.y + region.height / 2
      let x = sourceX
      if (visibleWidth < SCENE_WIDTH) {
        x = sourceX < SCENE_WIDTH / 2
          ? leftEdge + 20 + sourceX * horizontalScale
          : rightEdge - 20 - (SCENE_WIDTH - sourceX) * horizontalScale
      }
      const y = sourceY - bottomCrop
      anchor.setPosition(x, y)
    })
  }
  updateBubblePositions()
  window.addEventListener('resize', updateBubblePositions)
  scene.events.once('shutdown', () => window.removeEventListener('resize', updateBubblePositions))
}

class ForegroundScene extends Phaser.Scene {
  constructor() {
    super('foreground')
  }

  preload() {
    this.load.image('corner-bubbles', cornerBubblesUrl)
  }

  create() {
    createCornerBubbles(this)
  }
}

class UiScene extends Phaser.Scene {
  constructor() {
    super('ui')
  }

  preload() {
    preloadGameUi(this)
  }

  create() {
    const renderScale = this.game.config.width / SCENE_WIDTH
    this.cameras.main.setZoom(renderScale)
    this.cameras.main.centerOn(SCENE_WIDTH / 2, SCENE_HEIGHT / 2)
    createGameUi(this)
  }
}

onMounted(() => {
  const uiRenderScale = Math.min(2, Math.max(1, window.devicePixelRatio || 1))

  backgroundGame = new Phaser.Game({
    type: Phaser.AUTO,
    parent: backgroundHost.value,
    width: SCENE_WIDTH,
    height: SCENE_HEIGHT,
    transparent: false,
    backgroundColor: '#f8d7b5',
    scene: BackgroundScene,
    render: {
      antialias: true,
      pixelArt: false,
      roundPixels: false,
    },
    scale: {
      mode: Phaser.Scale.ENVELOP,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: SCENE_WIDTH,
      height: SCENE_HEIGHT,
    },
  })

  uiGame = new Phaser.Game({
    type: Phaser.AUTO,
    parent: uiHost.value,
    width: Math.round(SCENE_WIDTH * uiRenderScale),
    height: Math.round(SCENE_HEIGHT * uiRenderScale),
    transparent: true,
    scene: UiScene,
    render: {
      antialias: true,
      pixelArt: false,
      roundPixels: false,
    },
    scale: {
      mode: window.innerHeight > window.innerWidth ? Phaser.Scale.ENVELOP : Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: Math.round(SCENE_WIDTH * uiRenderScale),
      height: Math.round(SCENE_HEIGHT * uiRenderScale),
    },
  })

  foregroundGame = new Phaser.Game({
    type: Phaser.AUTO,
    parent: foregroundHost.value,
    width: SCENE_WIDTH,
    height: SCENE_HEIGHT,
    transparent: true,
    scene: ForegroundScene,
    render: {
      antialias: true,
      pixelArt: false,
      roundPixels: false,
    },
    scale: {
      mode: Phaser.Scale.ENVELOP,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: SCENE_WIDTH,
      height: SCENE_HEIGHT,
    },
  })

  handleUiViewportResize = () => {
    if (!uiGame) return
    const nextMode = window.innerHeight > window.innerWidth ? Phaser.Scale.ENVELOP : Phaser.Scale.FIT
    if (uiGame.scale.scaleMode === nextMode) return
    uiGame.scale.scaleMode = nextMode
    uiGame.scale.displaySize.setAspectMode(nextMode)
    uiGame.scale.refresh()
  }
  window.addEventListener('resize', handleUiViewportResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleUiViewportResize)
  backgroundGame?.destroy(true)
  uiGame?.destroy(true)
  foregroundGame?.destroy(true)
  backgroundGame = undefined
  uiGame = undefined
  foregroundGame = undefined
})
</script>

<template>
  <main class="scene-shell" aria-label="Topları Sırala oyunu">
    <div ref="backgroundHost" class="background-host"></div>
    <div ref="uiHost" class="ui-host"></div>
    <div ref="foregroundHost" class="foreground-host"></div>
  </main>
</template>

<style>
:root {
  color-scheme: light;
  font-family: system-ui, sans-serif;
  background: #f8d7b5;
}

* {
  box-sizing: border-box;
}

html,
body,
#app,
.scene-shell,
.background-host,
.ui-host,
.foreground-host {
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden;
}

.scene-shell {
  position: fixed;
  inset: 0;
  background: #f8d7b5;
}

.background-host,
.ui-host,
.foreground-host {
  position: absolute;
  inset: 0;
}

.background-host,
.foreground-host {
  pointer-events: none;
}

.ui-host {
  pointer-events: auto;
}

.background-host canvas,
.ui-host canvas,
.foreground-host canvas {
  display: block;
}
</style>
