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

  // --- コラムカードの左右送り(無限ループ) --------------------
  var columnScroller = document.querySelector('.js-column-scroller');
  var columnPrev = document.querySelector('.js-column-prev');
  var columnNext = document.querySelector('.js-column-next');
  var columnList = columnScroller && columnScroller.querySelector('.p-column__list');

  if (columnScroller && columnList && columnPrev && columnNext) {
    var originals = Array.prototype.slice.call(columnList.children);
    var count = originals.length;
    var jumping = false;
    var scrollTimer;

    if (count > 1 && !columnList.dataset.loopReady) {
      columnList.dataset.loopReady = '1';
      var copy = function () {
        originals.forEach(function (item) {
          var clone = item.cloneNode(true);
          clone.setAttribute('aria-hidden', 'true');
          columnList.appendChild(clone);
        });
      };
      copy();
      copy();
    }

    var columnGutter = function () {
      if (window.innerWidth <= 767) return 20;
      if (window.innerWidth <= 1199) return 24;
      return Math.max(24, (window.innerWidth - 1120) / 2);
    };

    var columnStep = function () {
      var item = columnList.querySelector('.p-column__item');
      if (!item) return 384;
      var gap = parseFloat(window.getComputedStyle(columnList).gap) || 32;
      return item.offsetWidth + gap;
    };

    var itemScroll = function (el) {
      return el.getBoundingClientRect().left - columnScroller.getBoundingClientRect().left + columnScroller.scrollLeft;
    };

    var alignTo = function (el, smooth) {
      columnScroller.scrollTo({
        left: itemScroll(el) - columnGutter(),
        behavior: smooth ? 'smooth' : 'auto'
      });
    };

    var middleFirst = function () {
      return columnList.children[count];
    };

    var loopIfNeeded = function () {
      if (jumping || count < 2) return;
      var set = columnStep() * count;
      var startLast = itemScroll(columnList.children[count * 2]) - columnGutter();
      var startFirst = itemScroll(columnList.children[0]) - columnGutter();

      if (columnScroller.scrollLeft >= startLast - 2) {
        jumping = true;
        columnScroller.scrollLeft -= set;
        jumping = false;
      } else if (columnScroller.scrollLeft <= startFirst + 2) {
        jumping = true;
        columnScroller.scrollLeft += set;
        jumping = false;
      }
    };

    if (middleFirst()) alignTo(middleFirst(), false);

    columnPrev.addEventListener('click', function () {
      columnScroller.scrollBy({ left: -columnStep(), behavior: 'smooth' });
    });
    columnNext.addEventListener('click', function () {
      columnScroller.scrollBy({ left: columnStep(), behavior: 'smooth' });
    });
    columnScroller.addEventListener('scroll', function () {
      if (jumping) return;
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(loopIfNeeded, 80);
    }, { passive: true });
    columnScroller.addEventListener('scrollend', loopIfNeeded);
    window.addEventListener('resize', loopIfNeeded);
  }
})();
