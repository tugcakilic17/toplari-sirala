# toplari-sirala

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## GitHub Pages

1. Depoda **Settings → Pages → Build and deployment → Source** bölümünden **GitHub Actions** seçin.
2. **Actions → Deploy to GitHub Pages → Run workflow** ile varsayılan dalda yayını başlatın. Bundan sonraki push işlemlerinde yayın otomatik çalışır.
3. İş akışı tamamlanınca site bağlantısını **Settings → Pages** bölümünden açın.

İş akışı Node.js 24 ile `npm ci` ve `npm run build` çalıştırır, ardından `dist` klasörünü yayınlar. Derleme ve yayın ayrı işler olarak görünür; hata varsa **Actions** sekmesinden hangi adımda oluştuğunu görebilirsiniz.

Vite `base: './'` kullandığından site, depo adı ne olursa olsun GitHub Pages'in alt yolunda açılabilir.
