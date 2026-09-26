/**
 * Re:アビリティ main.js
 * - ハンバーガーメニューの開閉(aria-expanded / スクロールロック / Esc / リンククリックで閉じる)
 * - スクロール時にヘッダーの背景を少し濃くする
 * - data-anim 要素を画面に入ったとき .is-inview にする
 * フレームワーク・ライブラリ不使用。
 */
(function () {
  'use strict';

  var BREAKPOINT_TB = 1199;

  // --- ドロワーナビ -------------------------------------------
  var header = document.querySelector('.js-header');
  var toggle = document.querySelector('.js-nav-toggle');
  var drawer = document.querySelector('.js-nav-drawer');

  function setDrawer(open) {
    if (!toggle || !drawer) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.u-visually-hidden').textContent = open ? 'メニューを閉じる' : 'メニューを開く';
    drawer.classList.toggle('is-open', open);
    document.body.classList.toggle('is-drawer-open', open);
  }

  if (toggle && drawer) {
    toggle.addEventListener('click', function () {
      setDrawer(toggle.getAttribute('aria-expanded') !== 'true');
    });

    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) setDrawer(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setDrawer(false);
    });

    // PC 幅に戻ったらドロワーを閉じる
    window.addEventListener('resize', function () {
      if (window.innerWidth > BREAKPOINT_TB) setDrawer(false);
    });
  }

  // --- ヘッダーのスクロール状態 --------------------------------
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // --- data-anim(画面内に入ったら .is-inview) -----------------
  var animTargets = document.querySelectorAll('[data-anim]');
  if (animTargets.length) {
    var reveal = function (el) {
      el.classList.add('is-inview');
      var hero = el.closest('.p-hero');
      if (hero) hero.classList.add('is-revealed');
    };

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              reveal(entry.target);
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
      );
      animTargets.forEach(function (el) {
        io.observe(el);
      });
    } else {
      animTargets.forEach(reveal);
    }
  }

  // --- コラムカードの左右送り --------------------------------
  var columnScroller = document.querySelector('.js-column-scroller');
  var columnPrev = document.querySelector('.js-column-prev');
  var columnNext = document.querySelector('.js-column-next');

  if (columnScroller && columnPrev && columnNext) {
    var columnStep = function () {
      var item = columnScroller.querySelector('.p-column__item');
      var list = columnScroller.querySelector('.p-column__list');
      if (!item || !list) return 384;
      var gap = parseFloat(window.getComputedStyle(list).gap) || 32;
      return item.offsetWidth + gap;
    };

    var updateColumnNav = function () {
      var max = columnScroller.scrollWidth - columnScroller.clientWidth;
      columnPrev.disabled = columnScroller.scrollLeft <= 2;
      columnNext.disabled = columnScroller.scrollLeft >= max - 2;
    };

    columnPrev.addEventListener('click', function () {
      columnScroller.scrollBy({ left: -columnStep(), behavior: 'smooth' });
    });
    columnNext.addEventListener('click', function () {
      columnScroller.scrollBy({ left: columnStep(), behavior: 'smooth' });
    });
    columnScroller.addEventListener('scroll', updateColumnNav, { passive: true });
    window.addEventListener('resize', updateColumnNav);
    updateColumnNav();
  }
})();
