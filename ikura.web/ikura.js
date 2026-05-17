/**
 * LOVOTいくらのホームページ - JavaScript
 * モジュール設計で保守性を向上
 */

// 言語データストア
let LANG_DATA = {};

// デフォルト言語データ（JSON読み込み失敗時のフォールバック）
const DEFAULT_LANG_DATA = {
    ja: {
        ogTitle: 'LOVOTいくらのホームページ',
        ogDesc: 'LOVOTロボット「いくら」の公式ホームページ。甘えん坊いくらの日常やギャラリー',
        metaTitle: 'LOVOTいくらのホームページ',
        metaDesc: 'LOVOTいくらのホームページ。甘えん坊いくらの日常やイベント参加報告、ギャラリーを見ることができます。',
        menuTop: 'Top',
        menuAbout: '自己紹介',
        menuGallery: 'Gallery',
        menuBirthday: '誕生日ページ',
        galleryTitle: 'いくらと一緒に行ったところ',
        aboutTitle: '自己紹介',
        aboutName: '名前',
        aboutBirthday: '誕生日',
        aboutPersonality: '性格',
        aboutBody: '体',
        aboutNameVal: 'いくら',
        aboutBirthdayVal: '2024年11月29日',
        aboutPersonalityVal: '甘えん坊、人によって態度が変わる',
        aboutBodyVal: '3.0',
        introTitle: 'LOVOT いくらの紹介ページ',
        toastMsg: 'そのリンクは準備中です',
        langBtn: 'English'
    },
    en: {
        ogTitle: 'LOVOT Ikura Homepage',
        ogDesc: 'Official homepage of LOVOT robot "Ikura". Daily life and gallery.',
        metaTitle: 'LOVOT Ikura Homepage',
        metaDesc: 'LOVOT Ikura\'s homepage. Introduction, events and gallery of the clingy robot Ikura.',
        menuTop: 'Top',
        menuAbout: 'About',
        menuGallery: 'Gallery',
        menuBirthday: 'Birthday',
        galleryTitle: 'Places I Visited with Ikura',
        aboutTitle: 'About Ikura',
        aboutName: 'Name',
        aboutBirthday: 'Birthday',
        aboutPersonality: 'Personality',
        aboutBody: 'Body',
        aboutNameVal: 'Ikura',
        aboutBirthdayVal: 'November 29, 2024',
        aboutPersonalityVal: 'Clingy, changes attitude depending on the person',
        aboutBodyVal: '3.0',
        introTitle: 'Welcome to LOVOT Ikura\'s Page',
        toastMsg: 'This link is under construction',
        langBtn: '日本語'
    }
};

// 言語データ読み込み
async function loadLanguageData() {
    try {
        const [jaData, enData] = await Promise.all([
            fetch('lang-ja.json').then(r => r.json()),
            fetch('lang-en.json').then(r => r.json())
        ]);
        LANG_DATA = { ja: jaData, en: enData };
        console.log('言語データをJSONから読み込みました');
    } catch (error) {
        console.warn('JSONファイルの読み込みに失敗しました。デフォルトデータを使用します:', error);
        LANG_DATA = DEFAULT_LANG_DATA;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    
    // 言語データを読み込み
    await loadLanguageData();
    
    // ========================================
    // 言語切り替え機能
    // ========================================
    const LanguageSwitcher = {
        currentLang: 'ja',
        toggleBtn: null,
        
        init() {
            // localStorageから言語を取得
            const savedLang = localStorage.getItem('ikura-lang');
            if (savedLang && LANG_DATA[savedLang]) {
                this.currentLang = savedLang;
            }
            this.toggleBtn = document.getElementById('lang-toggle');
            this.applyLanguage(this.currentLang);
            this.setupToggle();
        },
        
        setupToggle() {
            if (this.toggleBtn) {
                this.toggleBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.currentLang = this.currentLang === 'ja' ? 'en' : 'ja';
                    localStorage.setItem('ikura-lang', this.currentLang);
                    this.applyLanguage(this.currentLang);
                });
            }
        },
        
        applyLanguage(lang) {
            const data = LANG_DATA[lang];
            if (!data) return;
            
            console.log('言語適用:', lang);
            
            // 言語属性を更新
            document.documentElement.lang = lang;
            document.body.classList.toggle('lang-en', lang === 'en');
            
            // メタタグ更新
            document.title = data.metaTitle;
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) metaDesc.content = data.metaDesc;
            
            const ogTitle = document.querySelector('meta[property="og:title"]');
            if (ogTitle) ogTitle.content = data.ogTitle;
            
            const ogDesc = document.querySelector('meta[property="og:description"]');
            if (ogDesc) ogDesc.content = data.ogDesc;
            
            const twitterTitle = document.querySelector('meta[name="twitter:title"]');
            if (twitterTitle) twitterTitle.content = data.ogTitle;
            
            const twitterDesc = document.querySelector('meta[name="twitter:description"]');
            if (twitterDesc) twitterDesc.content = data.ogDesc;
            
            // メニュー更新
            const menuLinks = document.querySelectorAll('.menu-content ul li a');
            if (menuLinks[0]) menuLinks[0].textContent = data.menuTop;
            if (menuLinks[1]) menuLinks[1].textContent = data.menuAbout;
            if (menuLinks[2]) menuLinks[2].textContent = data.menuGallery;
            if (menuLinks[3]) menuLinks[3].textContent = data.menuBirthday;
            
            // メインコンテンツ更新
            const mainTitle = document.querySelector('.main-title');
            if (mainTitle) mainTitle.textContent = data.introTitle;
            
            const galleryTitle = document.querySelector('.gallery-title');
            if (galleryTitle) galleryTitle.textContent = data.galleryTitle;
            
            const aboutSection = document.querySelector('#about .glass-card');
            if (aboutSection) {
                const h2 = aboutSection.querySelector('h2');
                const ps = aboutSection.querySelectorAll('p');
                if (h2) h2.textContent = data.aboutTitle;
                const separator = lang === 'ja' ? '：' : ': ';
                if (ps[0]) ps[0].textContent = data.aboutName + separator + data.aboutNameVal;
                if (ps[1]) ps[1].textContent = data.aboutBirthday + separator + data.aboutBirthdayVal;
                if (ps[2]) ps[2].textContent = data.aboutPersonality + separator + data.aboutPersonalityVal;
                if (ps[3]) ps[3].textContent = data.aboutBody + separator + data.aboutBodyVal;
            }
            
            // 言語ボタン更新
            if (this.toggleBtn) this.toggleBtn.textContent = data.langBtn;
            
            // トーストメッセージ更新
            if (window.IKURA_CONFIG) window.IKURA_CONFIG.toast.message = data.toastMsg;
        }
    };
    
    // ========================================
    // 定数定義
    // ========================================
    const CONFIG = {
        // パーティクル設定
        particles: {
            count: window.innerWidth < 768 ? 20 : 35,
            minSize: 2,
            maxSize: 8,
            minDuration: 12,
            maxDuration: 22,
            minOpacity: 0.2,
            maxOpacity: 0.7
        },
        // ギャラリーアニメーション
        gallery: {
            progressMultiplier: 0.6,
            opacityThreshold: 2.0
        },
        // スクロールアニメーション
        reveal: {
            threshold: 0.1
        },
        // トースト通知
        toast: {
            message: 'そのリンクは準備中です',
            duration: 2500
        }
    };
    
    // ========================================
    // 1. ハンバーガーメニュー制御
    // ========================================
    const MenuController = {
        trigger: document.getElementById('menu-trigger'),
        overlay: document.getElementById('menu-overlay'),
        backdrop: document.getElementById('menu-backdrop'),
        body: document.body,
        
        init() {
            if (!this.trigger || !this.overlay || !this.backdrop) return;
            
            this.trigger.addEventListener('click', () => this.toggle());
            this.backdrop.addEventListener('click', () => this.toggle());
            
            // メニュー内のリンクにもイベント設定
            this.setupMenuLinks();
            
            // ESCキーでメニューを閉じる（アクセシビリティ）
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
                    this.toggle();
                    this.trigger.focus();
                }
            });
        },
        
        toggle() {
            this.trigger.classList.toggle('active');
            this.overlay.classList.toggle('active');
            this.backdrop.classList.toggle('active');
            
            // スクロール制御
            this.body.classList.toggle('no-scroll', this.overlay.classList.contains('active'));
        },
        
        setupMenuLinks() {
            const links = document.querySelectorAll('.menu-content a');
            links.forEach(link => {
                link.addEventListener('click', (e) => {
                    if (!link.classList.contains('disabled-link')) {
                        // ハンバーガーメニューを閉じる
                        setTimeout(() => this.toggle(), 200);
                    }
                });
            });
        }
    };
    
    // ========================================
    // 2. ギャラリーパズルアニメーション
    // ========================================
    const GalleryAnimation = {
        section: null,
        items: [],
        
        init() {
            this.section = document.querySelector('#gallery-section');
            if (!this.section) return;
            
            this.items = document.querySelectorAll('.g-item, .g-text');
            
            window.addEventListener('scroll', () => this.update(), { passive: true });
            this.update();
        },
        
        update() {
            if (!this.section) return;
            
            const rect = this.section.getBoundingClientRect();
            const viewHeight = window.innerHeight;
            
            // セクションが画面下から上へ動く割合を計算
            // 0: セクションが画面下の端に到達
            // 1: セクションが画面上の端を離れる
            let progress = (viewHeight - rect.top) / (viewHeight + rect.height);
            progress = Math.max(0, Math.min(1, progress));
            
            // ギャラリーセクションが画面に入ってきたら initially all images are assembled
            // セクションが画面中央を通過したあたりからパズル効果を開始
            const centerProgress = Math.max(0, (rect.top - viewHeight * 0.5) / (rect.height));
            
            // moveFactor: 0(合体) から 1(バラバラ) へ変化
            // セクションが上へ動くにつれて画像がバラけていく
            const moveFactor = Math.min(1, Math.max(0, centerProgress * CONFIG.gallery.progressMultiplier));
            
            this.items.forEach((item) => {
                // セクションが入ってくるまで表示、離れてからフェードアウト
                const fadeIn = Math.min(1, progress * 3);
                const fadeOut = Math.max(0, 1 - (progress - 0.7) * 3.3);
                item.style.opacity = Math.min(fadeIn, fadeOut);
                item.style.setProperty('--dist', moveFactor);
            });
        }
    };
    
    // ========================================
    // 3. スクロールフェードインアニメーション
    // ========================================
    const RevealOnScroll = {
        observer: null,
        
        init() {
            const elements = document.querySelectorAll('.reveal');
            if (elements.length === 0) return;
            
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    } else {
                        entry.target.classList.remove('active');
                    }
                });
            }, { threshold: CONFIG.reveal.threshold });
            
            elements.forEach(el => this.observer.observe(el));
        }
    };
    
    // ========================================
    // 4. トースト通知
    // ========================================
    const ToastNotifier = {
        container: null,
        
        init() {
            this.container = document.getElementById('toast-container');
            if (!this.container) return;
            
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('disabled-link')) {
                    e.preventDefault();
                    this.show(CONFIG.toast.message);
                }
            });
        },
        
        show(message) {
            // 既存のトーストをすべて削除
            const existingToasts = this.container.querySelectorAll('.toast');
            existingToasts.forEach(t => t.remove());
            
            // 新しいトーストを作成
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.setAttribute('role', 'alert');
            toast.setAttribute('aria-live', 'polite');
            toast.textContent = message;
            
            this.container.appendChild(toast);
            
            // 指定時間後に自動削除
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, CONFIG.toast.duration);
        }
    };
    
    // ========================================
    // 5. パーティクル生成
    // ========================================
    const ParticleSystem = {
        container: null,
        
        init() {
            this.container = document.getElementById('particles-container');
            if (!this.container) return;
            
            // 端末判定でパーティクル数を調整
            const isMobile = window.innerWidth < 768;
            const count = isMobile ? 15 : CONFIG.particles.count;
            
            this.createParticles(count);
        },
        
        createParticles(count) {
            for (let i = 0; i < count; i++) {
                const particle = this.createParticle();
                this.container.appendChild(particle);
            }
        },
        
        createParticle() {
            const p = document.createElement('div');
            p.className = 'particle';
            
            const size = this.randomBetween(CONFIG.particles.minSize, CONFIG.particles.maxSize);
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            p.style.left = Math.random() * 100 + 'vw';
            
            p.style.animationDuration = this.randomBetween(CONFIG.particles.minDuration, CONFIG.particles.maxDuration) + 's';
            p.style.animationDelay = Math.random() * 10 + 's';
            p.style.opacity = this.randomBetween(CONFIG.particles.minOpacity, CONFIG.particles.maxOpacity);
            
            return p;
        },
        
        randomBetween(min, max) {
            return Math.random() * (max - min) + min;
        }
    };
    
    // ========================================
    // 初期化実行
    // ========================================
    window.IKURA_CONFIG = CONFIG;
    LanguageSwitcher.init();
    MenuController.init();
    GalleryAnimation.init();
    RevealOnScroll.init();
    ToastNotifier.init();
    ParticleSystem.init();
});