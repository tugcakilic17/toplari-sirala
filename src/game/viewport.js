export function isCompactPhoneViewport() {
  return (window.innerWidth === 390 && window.innerHeight === 844)
    || (window.innerWidth === 430 && window.innerHeight === 932)
}

export function isTabletLandscapeViewport() {
  return window.innerWidth === 1024 && window.innerHeight === 768
}

export function isTabletPortraitViewport() {
  return window.innerWidth === 768 && window.innerHeight === 1024
}
