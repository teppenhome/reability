# Re:アビリティ トップページ(静的版)

- `index.html` をブラウザで直接開けば確認できます。
- SCSS のビルド: `npm install` → `npm run build`(`assets/css/style.css` を出力)/ `npm run watch`
- 画像は `assets/images/` に同名で差し替え(サイズは各ファイルの表示ラベルと同じ比率)。

## SCSS 構成
- foundation/ … variables, functions, mixins, icons, reset, base, animation(演出の足場)
- component/  … logo, heading, button, pill, photo, text, arrows, card, schedule-link
- layout/     … container, header, footer
- page/       … セクションごと(hero, worry, about, features, service, first-visit, studio, price, facility, howto, voice, faq, cta, access, instagram, column)

## 命名
`l-`レイアウト / `c-`共通部品 / `p-`ページ固有セクション / `js-`JS用フック / `is-`状態 / `data-anim`アニメ用フック
ブレークポイント: PC 1200px〜 / タブレット 768〜1199px / SP 〜767px(`foundation/_variables.scss`)
