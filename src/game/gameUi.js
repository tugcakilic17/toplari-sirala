import titleUrl from '../assets/ui/title.png'
import targetPanelUrl from '../assets/ui/target_panel.png'
import tubeUrl from '../assets/ui/tube.png'
import ball1Url from '../assets/ui/ball_1.png'
import ball2Url from '../assets/ui/ball_2.png'
import statPanelUrl from '../assets/ui/ui_stat_panel.png'
import timeIconUrl from '../assets/ui/ui_icon_time.webp'
import mascotNormalUrl from '../assets/ui/mascot_normal.png'
import mascotCorrectUrl from '../assets/ui/mascot_correct.png'
import {
  isCompactPhoneViewport,
  isTabletLandscapeViewport,
  isTabletPortraitViewport,
} from './viewport.js'

const TUBE_X = [585, 752, 920, 1088]
const INITIAL_TUBES = [[1, 1], [2], [2, 1, 2], []]
const MAIN_TUBE_WIDTH = 216
const MAIN_TUBE_HEIGHT = 330
const MAIN_BALL_SIZE = 76
const SELECTED_TUBE_LIFT = 10
const SELECTED_BALL_LIFT = 7
const ROUND_DURATION_SECONDS = 180
const TARGET_BALLS_PER_TUBE = 3
const TIMER_PANEL_WIDTH = 300
const TIMER_PANEL_HEIGHT = 105
const TIMER_ICON_SIZE = 70
const MASCOT_X = 255
const MASCOT_FOOT_Y = 800
const MASCOT_NORMAL_WIDTH = 295
const MASCOT_NORMAL_HEIGHT = 440
const MASCOT_CORRECT_SIZE = 360

const cloneTubes = (tubes) => tubes.map((tube) => [...tube])
const isTubeComplete = (tube) =>
  tube.length === TARGET_BALLS_PER_TUBE && tube.every((value) => value === tube[0])

function getUiLayout() {
  if (window.innerWidth >= window.innerHeight) {
    const isWideDesktop = window.innerWidth >= 1400
      && window.innerWidth / window.innerHeight >= 1.65
    const isTabletLandscape = isTabletLandscapeViewport()
    const is1366Viewport = window.innerWidth === 1366 && window.innerHeight === 768
    const is1536Viewport = window.innerWidth === 1536 && window.innerHeight === 864
    const tubeOffsetY = is1536Viewport ? 20 : isWideDesktop ? 75 : isTabletLandscape ? 60 : 0
    return {
      key: `landscape-${isWideDesktop}-${isTabletLandscape}-${is1366Viewport}-${is1536Viewport}`,
      title: { x: 836, y: 116, width: 510, height: 185 },
      target: { x: 836, y: 324, width: 420, height: 280 },
      targetTubeX: [784, 888], targetTubeY: 347,
      targetTubeWidth: 104, targetTubeHeight: 160,
      targetBallY: [381, 353, 325], targetBallSize: 35,
      tubeX: TUBE_X,
      tubeY: (isWideDesktop ? 590 : 610) + tubeOffsetY,
      tubeWidth: is1536Viewport ? 170 : isWideDesktop ? 196 : is1366Viewport ? 192 : MAIN_TUBE_WIDTH,
      tubeHeight: is1536Viewport ? 260 : isWideDesktop ? 298 : is1366Viewport ? 294 : MAIN_TUBE_HEIGHT,
      slotY: isWideDesktop
        ? [0, 1, 2, 3].map((slot) => 681 - slot * 58 + tubeOffsetY - (is1536Viewport ? 6 : 0))
        : [0, 1, 2, 3].map((slot) => 696 - slot * 60 + tubeOffsetY),
      ballSize: is1536Viewport ? 68 : isWideDesktop ? 72 : MAIN_BALL_SIZE,
      hitWidth: 113, selectedLift: SELECTED_TUBE_LIFT, selectedBallLift: SELECTED_BALL_LIFT,
      timerX: 1528, timerY: 107, timerWidth: TIMER_PANEL_WIDTH,
      timerHeight: TIMER_PANEL_HEIGHT,
      timerIconSize: TIMER_ICON_SIZE, timerFontSize: 32,
      mascotX: is1536Viewport ? 242 : isWideDesktop ? 145 : isTabletLandscape ? 155 : MASCOT_X,
      mascotFootY: is1536Viewport ? 810 : isWideDesktop ? 885 : isTabletLandscape ? 905 : MASCOT_FOOT_Y,
      mascotNormalWidth: is1536Viewport ? 250 : MASCOT_NORMAL_WIDTH,
      mascotNormalHeight: is1536Viewport ? 373 : MASCOT_NORMAL_HEIGHT,
      mascotCorrectSize: is1536Viewport ? 305 : MASCOT_CORRECT_SIZE,
    }
  }

  const visibleWidth = 941 * window.innerWidth / window.innerHeight
  const compactPhone = isCompactPhoneViewport()
  const tabletPortrait = isTabletPortraitViewport()
  const compactTimer = compactPhone || tabletPortrait
  const scale = Math.max(0.85, Math.min(1.4, visibleWidth / 435))
  const targetWidth = Math.min(420, 315 * scale)
  const targetScale = targetWidth / 420
  const tubeWidth = 96 * scale
  const tubeHeight = 146 * scale
  const tubeY = 650 + (scale - 1) * 70 - (tabletPortrait ? 45 : 0)
  const tubeSpacing = 105 * scale
  const slotBottom = tubeY + tubeHeight * 0.32
  const slotGap = (tabletPortrait ? 29.5 : 34) * scale
  const targetTubeY = 405 + 23 * targetScale
  const rightEdge = 836 + visibleWidth / 2
  const leftEdge = 836 - visibleWidth / 2

  return {
    key: `portrait-${Math.round(visibleWidth)}-${compactPhone}-${tabletPortrait}`,
    title: { x: 836, y: 175, width: 350 * scale, height: 127 * scale },
    target: { x: 836, y: 405, width: targetWidth, height: targetWidth * 2 / 3 },
    targetTubeX: [836 - 52 * targetScale, 836 + 52 * targetScale],
    targetTubeY, targetTubeWidth: 104 * targetScale, targetTubeHeight: 160 * targetScale,
    targetBallY: [34, 6, -22].map((offset) => targetTubeY + offset * targetScale),
    targetBallSize: 35 * targetScale,
    tubeX: [0, 1, 2, 3].map((index) => 836 + (index - 1.5) * tubeSpacing),
    tubeY, tubeWidth, tubeHeight,
    slotY: [0, 1, 2, 3].map((slot) => slotBottom - slot * slotGap),
    ballSize: (tabletPortrait ? 36 : 42) * scale, hitWidth: 90 * scale,
    selectedLift: 8 * scale, selectedBallLift: 6 * scale,
    timerX: rightEdge - (tabletPortrait ? 108 : compactPhone ? 104 : 95) * scale,
    timerY: 80,
    timerWidth: (compactTimer ? 200 : 250) * scale,
    timerHeight: (compactTimer ? 80 : 100) * scale,
    timerIconSize: (compactTimer ? 40 : 50) * scale,
    timerFontSize: (compactTimer ? 20 : 25) * scale,
    mascotX: leftEdge + 52 * scale, mascotFootY: 925,
    mascotNormalWidth: 110 * scale, mascotNormalHeight: 165 * scale,
    mascotCorrectSize: 140 * scale,
  }
}

export function preloadGameUi(scene) {
  scene.load.image('ui-title', titleUrl)
  scene.load.image('ui-target', targetPanelUrl)
  scene.load.image('ui-tube', tubeUrl)
  scene.load.image('ui-ball-1', ball1Url)
  scene.load.image('ui-ball-2', ball2Url)
  scene.load.image('ui-stat-panel', statPanelUrl)
  scene.load.image('ui-time-icon', timeIconUrl)
  scene.load.image('ui-mascot-normal', mascotNormalUrl)
  scene.load.image('ui-mascot-correct', mascotCorrectUrl)
}

const uiTextureSizes = [
  ['ui-title', 'ui-title-sharp', 510, 185],
  ['ui-target', 'ui-target-sharp', 420, 280],
  ['ui-tube', 'ui-tube-main-sharp', MAIN_TUBE_WIDTH, MAIN_TUBE_HEIGHT],
  ['ui-tube', 'ui-tube-target-sharp', 104, 160],
  ['ui-ball-1', 'ui-ball-1-main-sharp', MAIN_BALL_SIZE, MAIN_BALL_SIZE],
  ['ui-ball-2', 'ui-ball-2-main-sharp', MAIN_BALL_SIZE, MAIN_BALL_SIZE],
  ['ui-ball-1', 'ui-ball-1-target-sharp', 35, 35],
  ['ui-ball-2', 'ui-ball-2-target-sharp', 35, 35],
  ['ui-stat-panel', 'ui-stat-panel-sharp', TIMER_PANEL_WIDTH, TIMER_PANEL_HEIGHT],
  ['ui-time-icon', 'ui-time-icon-sharp', TIMER_ICON_SIZE, TIMER_ICON_SIZE],
  ['ui-mascot-normal', 'ui-mascot-normal-sharp', MASCOT_NORMAL_WIDTH, MASCOT_NORMAL_HEIGHT],
  ['ui-mascot-correct', 'ui-mascot-correct-sharp', MASCOT_CORRECT_SIZE, MASCOT_CORRECT_SIZE],
]

function drawResized(source, width, height) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(source, 0, 0, width, height)
  return canvas
}

function prepareUiTextures(scene) {
  const renderScale = scene.cameras.main.zoom

  for (const [sourceKey, targetKey, displayWidth, displayHeight] of uiTextureSizes) {
    const source = scene.textures.get(sourceKey).getSourceImage()
    const targetWidth = Math.max(1, Math.round(displayWidth * renderScale))
    const targetHeight = Math.max(1, Math.round(displayHeight * renderScale))
    let current = source
    let width = source.naturalWidth || source.width
    let height = source.naturalHeight || source.height

    // Reduce in steps so the browser combines many source pixels instead of
    // letting WebGL sample only a few pixels from the oversized original PNG.
    while (width > targetWidth * 2 || height > targetHeight * 2) {
      width = Math.max(targetWidth, Math.round(width / 2))
      height = Math.max(targetHeight, Math.round(height / 2))
      current = drawResized(current, width, height)
    }

    scene.textures.addCanvas(targetKey, drawResized(current, targetWidth, targetHeight))
  }
}

function prepareTubeShadow(scene) {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const context = canvas.getContext('2d')
  const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128)
  gradient.addColorStop(0, 'rgba(74, 39, 20, 0.66)')
  gradient.addColorStop(0.38, 'rgba(104, 60, 30, 0.3)')
  gradient.addColorStop(1, 'rgba(104, 60, 30, 0)')
  context.fillStyle = gradient
  context.fillRect(0, 0, 256, 256)
  scene.textures.addCanvas('ui-tube-shadow', canvas)
}

function positionTubeShadow(shadow, x, tubeY, tubeHeight) {
  const baseY = tubeY + tubeHeight * 0.41
  shadow.broad.setPosition(x + 8, baseY + 4)
  shadow.contact.setPosition(x + 2, baseY + 1)
}

function addTubeShadow(scene, x, tubeY, tubeWidth, tubeHeight) {
  const shadow = {
    broad: scene.add.image(x, tubeY, 'ui-tube-shadow')
    .setDisplaySize(tubeWidth * 0.78, tubeWidth * 0.18)
    .setAlpha(0.6),
    contact: scene.add.image(x, tubeY, 'ui-tube-shadow')
    .setDisplaySize(tubeWidth * 0.48, tubeWidth * 0.065)
    .setAlpha(0.76),
  }
  positionTubeShadow(shadow, x, tubeY, tubeHeight)
  return shadow
}

function drawTarget(scene, layout) {
  const panel = scene.add.image(0, 0, 'ui-target-sharp')
  const tubes = [0, 1].map(() => scene.add.image(0, 0, 'ui-tube-target-sharp'))
  const balls = [0, 1].map((index) =>
    [0, 1, 2].map(() => scene.add.image(0, 0, `ui-ball-${index + 1}-target-sharp`)))

  function setLayout(next) {
    panel.setPosition(next.target.x, next.target.y)
      .setDisplaySize(next.target.width, next.target.height)
    tubes.forEach((tube, index) => {
      tube.setPosition(next.targetTubeX[index], next.targetTubeY)
        .setDisplaySize(next.targetTubeWidth, next.targetTubeHeight)
      balls[index].forEach((ball, slot) => {
        ball.setPosition(next.targetTubeX[index], next.targetBallY[slot])
          .setDisplaySize(next.targetBallSize, next.targetBallSize)
      })
    })
  }

  setLayout(layout)
  return { setLayout }
}

function createRoundTimer(scene, layout) {
  const panel = scene.add.image(0, 0, 'ui-stat-panel-sharp').setDepth(20)
  const icon = scene.add.image(0, 0, 'ui-time-icon-sharp').setDepth(21)

  const countdown = scene.add.text(0, 0, '03:00', {
    fontFamily: '"Arial Rounded MT Bold", "Trebuchet MS", Arial, sans-serif',
    fontSize: '32px',
    fontStyle: 'bold',
    color: '#a04d27',
  }).setOrigin(0.5).setResolution(scene.cameras.main.zoom).setDepth(21)

  function setLayout(next) {
    const scale = next.timerIconSize / TIMER_ICON_SIZE
    panel.setPosition(next.timerX, next.timerY)
      .setDisplaySize(next.timerWidth, next.timerHeight)
    icon.setPosition(next.timerX - 55 * scale, next.timerY)
      .setDisplaySize(next.timerIconSize, next.timerIconSize)
    countdown.setPosition(next.timerX + 37 * scale, next.timerY)
      .setFontSize(Math.round(next.timerFontSize))
  }
  setLayout(layout)

  const endsAt = performance.now() + ROUND_DURATION_SECONDS * 1000
  let displayedSeconds = -1
  const updateCountdown = () => {
    const remaining = Math.max(0, Math.ceil((endsAt - performance.now()) / 1000))
    if (remaining === displayedSeconds) return
    displayedSeconds = remaining
    const minutes = String(Math.floor(remaining / 60)).padStart(2, '0')
    const seconds = String(remaining % 60).padStart(2, '0')
    countdown.setText(`${minutes}:${seconds}`)
    countdown.setColor(remaining <= 30 ? '#c43d2b' : '#a04d27')
    if (remaining === 0) timerEvent.remove()
  }
  const timerEvent = scene.time.addEvent({ delay: 200, loop: true, callback: updateCountdown })
  updateCountdown()
  return { setLayout }
}

function createMascot(scene, layout) {
  let currentLayout = layout
  const normal = scene.add.image(0, 0, 'ui-mascot-normal-sharp')
    .setOrigin(0.5, 1)
  const correct = scene.add.image(0, 0, 'ui-mascot-correct-sharp')
    .setOrigin(0.5, 1)
    .setAlpha(0)
  let restoreEvent
  const correctFootY = () => currentLayout.mascotFootY
    - 8 * currentLayout.mascotCorrectSize / MASCOT_CORRECT_SIZE

  function setLayout(next) {
    currentLayout = next
    normal.setPosition(next.mascotX, next.mascotFootY)
      .setDisplaySize(next.mascotNormalWidth, next.mascotNormalHeight)
    correct.setPosition(next.mascotX, correctFootY())
      .setDisplaySize(next.mascotCorrectSize, next.mascotCorrectSize)
  }
  setLayout(layout)

  function celebrate() {
    restoreEvent?.remove()
    scene.tweens.killTweensOf([normal, correct])
    scene.tweens.add({ targets: normal, alpha: 0, duration: 240, ease: 'Sine.easeInOut' })
    correct.setY(correctFootY() + 10)
    scene.tweens.add({
      targets: correct,
      alpha: 1,
      y: correctFootY(),
      duration: 300,
      ease: 'Sine.easeOut',
    })
    restoreEvent = scene.time.delayedCall(1700, () => {
      scene.tweens.add({
        targets: correct,
        alpha: 0,
        y: correctFootY() + 8,
        duration: 280,
        ease: 'Sine.easeInOut',
      })
      scene.tweens.add({ targets: normal, alpha: 1, duration: 280, ease: 'Sine.easeInOut' })
    })
  }

  return { celebrate, setLayout }
}

export function createGameUi(scene) {
  prepareUiTextures(scene)
  prepareTubeShadow(scene)
  let tubes = cloneTubes(INITIAL_TUBES)
  let selected = -1
  let isMovingBall = false
  let ballSprites = []
  let layout = getUiLayout()

  const title = scene.add.image(layout.title.x, layout.title.y, 'ui-title-sharp')
    .setDisplaySize(layout.title.width, layout.title.height)

  const target = drawTarget(scene, layout)
  const timer = createRoundTimer(scene, layout)
  const mascot = createMascot(scene, layout)

  const mainTubes = layout.tubeX.map((x, index) => {
    const shadow = addTubeShadow(scene, x, layout.tubeY, layout.tubeWidth, layout.tubeHeight)
    const image = scene.add.image(x, layout.tubeY, 'ui-tube-main-sharp')
      .setDisplaySize(layout.tubeWidth, layout.tubeHeight)
    const hitArea = scene.add.zone(x, layout.tubeY, layout.hitWidth, layout.tubeHeight)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => selectTube(index))
    return { image, hitArea, shadow }
  })

  function renderBalls(previousSelected = selected, animateSelection = false) {
    ballSprites.forEach((sprite) => {
      scene.tweens.killTweensOf(sprite)
      sprite.destroy()
    })
    ballSprites = []
    tubes.forEach((tube, tubeIndex) => {
      tube.forEach((value, slotIndex) => {
        const isSelected = tubeIndex === selected && slotIndex === tube.length - 1
        const wasSelected = tubeIndex === previousSelected
        const baseY = layout.slotY[slotIndex]
        const targetY = baseY
          - (tubeIndex === selected ? layout.selectedLift : 0)
          - (isSelected ? layout.selectedBallLift : 0)
        const startY = animateSelection
          ? baseY - (wasSelected ? layout.selectedLift : 0)
            - (wasSelected && slotIndex === tube.length - 1 ? layout.selectedBallLift : 0)
          : targetY
        const ball = scene.add.image(
          layout.tubeX[tubeIndex],
          startY,
          `ui-ball-${value}-main-sharp`,
        ).setDisplaySize(layout.ballSize, layout.ballSize)
        ball.setData('tubeIndex', tubeIndex)
        ball.setData('slotIndex', slotIndex)
        if (isSelected) {
          ball.setScale(ball.scaleX * 1.04, ball.scaleY * 1.04)
        }
        const startSelectedBob = () => {
          if (isSelected && ball.active) {
            scene.tweens.add({ targets: ball, y: targetY - 3, duration: 620, yoyo: true, repeat: -1 })
          }
        }
        if (startY !== targetY) {
          scene.tweens.add({
            targets: ball,
            y: targetY,
            duration: 180,
            ease: 'Sine.easeOut',
            onComplete: startSelectedBob,
          })
        } else {
          startSelectedBob()
        }
        ballSprites.push(ball)
      })
    })
  }

  function updateSelectedTube() {
    const tubeY = layout.tubeY
    mainTubes.forEach(({ image, hitArea, shadow }, index) => {
      const lifted = index === selected
      scene.tweens.killTweensOf([image, hitArea, shadow.broad, shadow.contact])
      scene.tweens.add({
        targets: [image, hitArea],
        y: tubeY - (lifted ? layout.selectedLift : 0),
        duration: 180,
        ease: 'Sine.easeOut',
      })
      scene.tweens.add({
        targets: shadow.contact,
        alpha: lifted ? 0.52 : 0.76,
        duration: 180,
        ease: 'Sine.easeOut',
      })
    })
  }

  function selectTube(index) {
    if (isMovingBall) return
    if (selected === -1) {
      if (tubes[index].length === 0) return
      const previousSelected = selected
      selected = index
      updateSelectedTube()
      renderBalls(previousSelected, true)
      return
    }
    if (selected === index) {
      const previousSelected = selected
      selected = -1
      updateSelectedTube()
      renderBalls(previousSelected, true)
      return
    }
    if (tubes[index].length >= 4) return
    const wasTargetComplete = isTubeComplete(tubes[index])
    const sourceIndex = selected
    const sourceSlot = tubes[sourceIndex].length - 1
    const value = tubes[sourceIndex][sourceSlot]
    const movingBall = ballSprites.find((ball) =>
      ball.getData('tubeIndex') === sourceIndex && ball.getData('slotIndex') === sourceSlot)
    if (!movingBall) return

    isMovingBall = true
    scene.tweens.killTweensOf(movingBall)
    ballSprites = ballSprites.filter((ball) => ball !== movingBall)
    movingBall.setDepth(10)

    const startX = movingBall.x
    const startY = movingBall.y
    const endX = layout.tubeX[index]
    const endY = layout.slotY[tubes[index].length]
    const entryY = layout.tubeY - layout.tubeHeight / 2 - layout.ballSize * 0.42
    const exitY = entryY - layout.selectedLift
    const liftDuration = Math.round(140 + Math.abs(startY - exitY) * 0.22)
    const travelDuration = Math.round(220 + Math.abs(endX - startX) * 0.36)
    const dropDuration = Math.round(140 + Math.abs(endY - entryY) * 0.22)
    const motion = { t: 0 }

    selected = -1
    updateSelectedTube()
    ballSprites.forEach((ball) => {
      if (ball.getData('tubeIndex') === sourceIndex) {
        scene.tweens.killTweensOf(ball)
        scene.tweens.add({
          targets: ball,
          y: layout.slotY[ball.getData('slotIndex')],
          duration: 180,
          ease: 'Sine.easeOut',
        })
      }
    })

    scene.tweens.add({
      targets: movingBall,
      scaleX: movingBall.scaleX / 1.04,
      scaleY: movingBall.scaleY / 1.04,
      duration: liftDuration + travelDuration + dropDuration,
      ease: 'Sine.easeOut',
    })
    scene.tweens.add({
      targets: movingBall,
      y: exitY,
      duration: liftDuration,
      ease: 'Sine.easeOut',
      onComplete: () => {
        scene.tweens.add({
          targets: motion,
          t: 1,
          duration: travelDuration,
          ease: 'Sine.easeInOut',
          onUpdate: () => {
            const t = motion.t
            movingBall.setPosition(
              startX + (endX - startX) * t,
              exitY + (entryY - exitY) * t
                - 42 * layout.ballSize / 76 * Math.sin(Math.PI * t),
            )
          },
          onComplete: () => {
            scene.tweens.add({
              targets: movingBall,
              y: endY,
              duration: dropDuration,
              ease: 'Sine.easeIn',
              onComplete: () => {
                tubes[sourceIndex].pop()
                tubes[index].push(value)
                const justCompletedTube = !wasTargetComplete && isTubeComplete(tubes[index])
                movingBall.destroy()
                isMovingBall = false
                if (!updateResponsiveLayout()) renderBalls()
                if (justCompletedTube) mascot.celebrate()
              },
            })
          },
        })
      },
    })
  }

  function updateResponsiveLayout() {
    if (isMovingBall) return false
    const next = getUiLayout()
    if (next.key === layout.key) return false
    layout = next

    title.setPosition(layout.title.x, layout.title.y)
      .setDisplaySize(layout.title.width, layout.title.height)
    target.setLayout(layout)
    timer.setLayout(layout)
    mascot.setLayout(layout)

    mainTubes.forEach(({ image, hitArea, shadow }, index) => {
      const x = layout.tubeX[index]
      const selectedY = layout.tubeY - (index === selected ? layout.selectedLift : 0)
      scene.tweens.killTweensOf([image, hitArea, shadow.contact])
      image.setPosition(x, selectedY).setDisplaySize(layout.tubeWidth, layout.tubeHeight)
      hitArea.setPosition(x, selectedY).setSize(layout.hitWidth, layout.tubeHeight)
      hitArea.input?.hitArea?.setSize(layout.hitWidth, layout.tubeHeight)
      shadow.broad.setDisplaySize(layout.tubeWidth * 0.78, layout.tubeWidth * 0.18)
      shadow.contact.setDisplaySize(layout.tubeWidth * 0.48, layout.tubeWidth * 0.065)
        .setAlpha(index === selected ? 0.52 : 0.76)
      positionTubeShadow(shadow, x, layout.tubeY, layout.tubeHeight)
    })
    renderBalls()
    return true
  }

  window.addEventListener('resize', updateResponsiveLayout)
  scene.events.once('shutdown', () => window.removeEventListener('resize', updateResponsiveLayout))
  renderBalls()
}
