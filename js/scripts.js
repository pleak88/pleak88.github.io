//preloader//////////
window.onload = function () {
  document.body.classList.add('loaded_hiding');
  window.setTimeout(function () {
    document.body.classList.add('loaded');
    document.body.classList.remove('loaded_hiding');
  }, 500);
};

//burger//////////////////////////////////////////////////////////
const iconMenu = document.querySelector('.promo__menu-icon');
const menuBody = document.querySelector('.promo__nav');
if (iconMenu) {
    iconMenu.addEventListener("click", function(e) {
        document.body.classList.toggle('_lock');
        iconMenu.classList.toggle('_active');
        menuBody.classList.toggle('_active');
    });
}

//animation////////////////////////////////////////////////////
const animItems = document.querySelectorAll(`._anim-items`);
if (animItems.length > 0) {
    window.addEventListener(`scroll`, animOnScroll);

    function animOnScroll() {
        for (let index = 0; index < animItems.length; index++) {
            const animItem = animItems[index];
            const animItemHeight = animItem.offsetHeight;
            const animItemOffSet = offset(animItem).top;
            const animStart = 4;
            let animItemPoint = window.innerHeight - animItemHeight / animStart;
            if (animItemHeight > window.innerHeight) {
                animItemPoint = window.innerHeight - window.innerHeight / animStart;
            }
            if (( window.pageYOffset > animItemOffSet - animItemPoint) &&  window.pageYOffset < (animItemOffSet + animItemHeight)) {
                animItem.classList.add(`_active`);
            } else {
                if (!(animItem.classList.contains(`_anim-no-hide`))) {
                    animItem.classList.remove(`_active`);
                }
            }
        }
    }
    function offset(el) {
        const rect = el.getBoundingClientRect();
        let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return {top: rect.top + scrollTop, left: rect.left + scrollLeft};
    }
    setTimeout(() => {
        animOnScroll();
    }, 300);
}
//button tel//////////////////////////////////////////
let btn = document.querySelector('._button-right');
function btnRight() {
  if (window.pageYOffset > window.innerHeight) {
   btn.classList.add(`_active`);
 } else { btn.classList.remove(`_active`); }
}
window.onscroll = btnRight;

//modal//////////////////////////////////////////////
const myModal = new HystModal({
    linkAttributeName: "data-hystmodal",
});

//scroll///////////////////////////////////////////////////////
const menuLinks = document.querySelectorAll('.promo__list[data-goto], .footer__link[data-goto]');
if (menuLinks.length > 0) {
    menuLinks.forEach(menuLink => {
        menuLink.addEventListener("click", onMenuLinkClick);
    });

    function onMenuLinkClick(e) {
        const menuLink = e.target;
        if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)){
            const gotoBlock = document.querySelector(menuLink.dataset.goto);
            const gotoBlockValue = gotoBlock.getBoundingClientRect().top +  window.pageYOffset;

            if (iconMenu.classList.contains('_active')) {
                document.body.classList.remove('_lock');
                iconMenu.classList.remove('_active');
                menuBody.classList.remove('_active');
            }

            window.scrollTo({
                top: gotoBlockValue,
                behavior: "smooth"
            });
            e.preventDefault();
        }
    }
};
//slider///////////////////////
        // Swiper slider
        const swiper = new Swiper('.swiper', {
            // Optional parameters
            loop: true,
            simulateTouch: false,
            observer: true,
            observeParents: true,
            observeSlideChildren: true,

            // Disable preloading of all images
            preloadImages: false,
            // Enable lazy loading
            lazy: {
                loadOnTransitionStart: false,
            },
            // Navigation arrows
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },  
            // Медиа
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    spaceBetween: 20,

                },
                767: {
                    slidesPerView: 2,
                    slidesPerGroup: 2,
                    spaceBetween: 20,
                },
                929: {
                    slidesPerView: 3,
                    slidesPerGroup: 3,
                    spaceBetween: 0,
                },
            },
            // Автопрокрутка
            autoplay: {
                delay: 2300,
                disableOnInteraction: false,
            },
            // Скорость прокрутки
            speed: 1500,
            // Останавливаем при наведении мыши
            on: {
                init() {
                  this.el.addEventListener('mouseenter', () => {
                    this.autoplay.stop();
                  });
            
                  this.el.addEventListener('mouseleave', () => {
                    this.autoplay.start();
                  });
                }
            },
        });