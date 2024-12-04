import {data} from "./carts.js";
import {florariumCarts} from "./carts.js";

$(document).ready(function () {
    new WOW({
        animateClass: 'animate__animated'
    }).init();

    const body = $('body');
    const modalOrder = $('.modalOrder');
    const modalWrap = $('.modalWrap');
    const modalCall = $('.modalCall');
    const modalImg = $('.modalImg');
    const modalImage = $('.modalImg__img');
    const modalThanks = $('.modalThanks');
    const modalBtnCall = $('.modalBtnCall');
    const modalBtnThanks = $('.modalThanks__button');
    const btnOrderCall = $('.orderCall');
    const btnOrder = $('.modalOrder__button');
    const burger = $('.header__burger');
    const menuWrap = $('.header__menu-wrap');
    const headerLinks = $('.header__menu-link');
    const photo = $('.photo');
    const close = $('.close');
    const ourPlantsCarts = $('.ourPlants__carts');
    const florariumBtn = $('.ourPlants__florariums');
    const orhoidariumBtn = $('.ourPlants__orhoidariums');
    const feedbackNext = $('.feedback__arrow-next');
    const feedbackPrev = $('.feedback__arrow-prev');
    const orderBtn = $('.ourPlants__button');
    const error = $('.error');
    const errorOrderName = $('.errorOrderName');
    const errorOrderPhone = $('.errorOrderPhone');
    const errorOrderDetails = $('.errorOrderDetails');
    const arrowUp = $('.arrowUp');
    let modalCallInput = $('.modalCall__input');
    let modalOrderInputName = $('.modalOrder__input-name');
    let modalOrderInputPhone = $('.modalOrder__input-phone');
    let modalOrderInputDetails = $('.modalOrder__textArea');
    let florariums = $('.gallery__photos-flor');
    let err = false;
    let step = 390;
    let distance = 0;
    let count = 3;
    let carts = $('.feedback__carts');
    let paginations = $('.feedback__pagination');
    let size = window.innerWidth;
    let step2 = true;


    burger.on('click', function () {
        if (!burger.hasClass('open')) {
            modalWrap.css('display', 'block');
            menuWrap.addClass('open');
            burger.addClass('open');
            body.css('overflowY', 'hidden');
        } else {
            menuWrap.removeClass('open');
            burger.removeClass('open');
            modalWrap.css('display', 'none');
            body.css('overflowY', '');
        }
    })

    headerLinks.on('click', function () {
        menuWrap.removeClass('open');
        burger.removeClass('open');
        modalWrap.css('display', 'none');
        body.css('overflowY', '');
    })

    close.on('click', function () {
        modalWrap.css('display', 'none');
        modalImg.css('display', 'none');
        modalCall.css('display', 'none');
        modalThanks.css('display', 'none');
        modalOrder.css('display', 'none');
        error.css('display', 'none');
        body.css('overflowY', '');
        modalCall.find('.modalCall__text').html('<div>Пожалуйста, введите Ваш телефон</div>');
        modalCall.find('.modalCall__form').show();
        modalCall.find('.modalBtnCall').show();
        modalCall.find('img').css('width', '630px');
        modalCallInput.val('');
        modalOrderInputName.val('');
        modalOrderInputPhone.val('');
        modalOrderInputDetails.val('');
    })

    btnOrderCall.on('click', function () {
        modalWrap.css('display', 'block');
        modalCall.css('display', 'block');
        body.css('overflowY', 'hidden');
        menuWrap.removeClass('open');
        burger.removeClass('open');
    })

    modalBtnCall.on('click', function () {
        if (!modalCallInput.val()) {
            error.css('display', 'block');
            modalCallInput.css('border', '1px solid red');
            err = true;
        } else {
            error.css('display', 'none');
            modalCallInput.css('border', '1px solid rgb(39, 60, 17)');
            err = false;
        }

        if (!err) {
            $.ajax({
                method: "POST",
                url: "https://testologia.ru/checkout",
                data: {name: modalCallInput.val()}
            })
                .done(function (msg) {
                    if (msg.hasOwnProperty('success')) {
                        if (msg.success === 0) {
                            alert('Произошла ошибка! Подайте заявку повторно!');
                            modalWrap.css('display', 'none');
                            modalImg.css('display', 'none');
                            modalCall.css('display', 'none');
                            error.css('display', 'none');
                            body.css('overflowY', '');
                            modalCallInput.val('');
                        } else {
                            modalCall.find('.modalCall__text').html('<h2>Спасибо!<br> Мы перезвоним вам в течение нескольких минут.</h2>');
                            modalCall.find('.modalCall__form').hide();
                            modalCall.find('.modalBtnCall').hide();
                            modalCall.find('img').css('width', '400px');
                        }
                    } else {
                        alert('Произошла сетевая ошибка! Повторите попытку подачи заявки через 5 минут.');
                    }
                });
        }
    })

    // валидация на форму телефона
    // modalCallInput.on('input', function () {
    //     if(modalCallInput.val()) {
    //         modalCallInput.val(modalCallInput.val().replace(/[^0-9+]/g, ''));
    //     }
    // })

    orderBtn.on('click', function (e) {
        modalWrap.css('display', 'block');
        modalOrder.css('display', 'block');
        body.css('overflowY', 'hidden');
    })

    modalBtnThanks.on('click', function (e) {
        modalWrap.css('display', 'none');
        modalThanks.css('display', 'none');
        modalOrderInputName.val('');
        modalOrderInputPhone.val('');
        modalOrderInputDetails.val('');
    })

    btnOrder.on('click', function () {
        error.css('display', 'none');
        modalOrderInputName.css('border', '1px solid #273c11');
        modalOrderInputPhone.css('border', '1px solid #273c11');
        modalOrderInputDetails.css('border', '1px solid #273c11');
        err = false;

        if (!modalOrderInputName.val()) {
            errorOrderName.css('display', 'block');
            modalOrderInputName.css('border', '1px solid red');
            err = true;
        }
        if (!modalOrderInputPhone.val()) {
            errorOrderPhone.css('display', 'block');
            modalOrderInputPhone.css('border', '1px solid red');
            err = true;
        }

        if (!modalOrderInputDetails.val()) {
            errorOrderDetails.css('display', 'block');
            modalOrderInputDetails.css('border', '1px solid red');
            err = true;
        }

        if (!err) {
            $.ajax({
                method: "POST",
                url: "https://testologia.ru/checkout",
                data: {
                    name: modalOrderInputName.val(),
                    phone: modalOrderInputPhone.val(),
                    details: modalOrderInputDetails.val()
                },
            })
                .done(function (msg) {
                    if (msg.hasOwnProperty('success')) {
                        if (msg.success === 0) {
                            alert('Произошла ошибка! Оформите заказ повторно!');
                            modalWrap.css('display', 'none');
                            modalOrder.css('display', 'none');
                            modalOrderInputName.val('');
                            modalOrderInputPhone.val('');
                            modalOrderInputDetails.val('');
                            body.css('overflowY', '');
                        } else if (msg.success === 1) {
                            modalThanks.css('display', 'flex');
                            modalOrder.css('display', 'none');
                            body.css('overflowY', '');
                        }
                    } else {
                        alert('Произошла сетевая ошибка! Повторите попытку подачи заявки через 5 минут.');
                    }
                })
        }

    })


    function createCartsOurPaints(obj) {
        let ourPlantsCartBig = $('<div>', {
            class: 'ourPlants__cart-big'
        });

        let ourPlantsCartBigImg = $(`<img alt="plantBig" src=${obj[0].img}>`, {
            class: 'wow animate__flipInX',
            src: obj[0].img,
        });

        let ourPlantsCartBigTitle = $('<div>', {
            class: 'ourPlants__title-big ourPlants__title',
            text: obj[0].title,
        });

        let ourPlantsCartBigText = $('<div>', {
            class: 'ourPlants__text-big ourPlants__text',
            text: obj[0].text,
        });

        let ourPlantsCartBigPrice = $('<div>', {
            class: 'ourPlants__price-big ourPlants__price',
            text: obj[0].price,
        });

        ourPlantsCartBig.append(ourPlantsCartBigImg, ourPlantsCartBigTitle, ourPlantsCartBigText, ourPlantsCartBigPrice);

        let ourPlantsCartsSmall = $('<div>', {
            class: 'ourPlants__carts-small'
        });

        for (let i = 1; i < obj.length; i++) {

            let ourPlantsCartSmall = $('<div>', {
                class: 'ourPlants__cart',
            });

            let ourPlantsCartSmallImg = $(`<img alt="img" src=${obj[i].img}>`, {
                class: 'wow animate__bounce',
            });

            let ourPlantsCartSmallTitle = $('<div>', {
                class: 'ourPlants__title',
                text: obj[i].title,
            });

            let ourPlantsCartSmallPrice = $('<div>', {
                class: 'ourPlants__price',
                text: obj[i].price,
            });

            ourPlantsCartSmall.append(ourPlantsCartSmallImg, ourPlantsCartSmallTitle, ourPlantsCartSmallPrice);
            ourPlantsCartsSmall.append(ourPlantsCartSmall);
        }
        ourPlantsCarts.append(ourPlantsCartBig, ourPlantsCartsSmall)
    }

    createCartsOurPaints(data[0])


    florariumBtn.on('click', function () {
        florariumBtn.addClass('checked');
        orhoidariumBtn.removeClass('checked');
        ourPlantsCarts.children().remove();
        createCartsOurPaints(data[0]);
    })

    orhoidariumBtn.on('click', function () {
        florariumBtn.removeClass('checked');
        orhoidariumBtn.addClass('checked');
        ourPlantsCarts.children().remove();
        createCartsOurPaints(data[1]);
    })

    photo.on('click', function (e) {
        console.log(e.target.getAttribute('src'));
        modalWrap.css('display', 'block');
        modalImg.css('display', 'block');
        modalImage.attr('src', e.target.getAttribute('src'));
        body.css('overflowY', 'hidden');
    })


    window.onresize = function () {

        size = window.innerWidth;
        carts.css('transform', `translateX(0px)`);
        count = 3;
        distance = 0;
        paginations.removeClass('feedback__pagination-checked');
        paginations.eq(3).addClass('feedback__pagination-checked');
        feedbackPrev.removeClass('inactive');
        feedbackNext.removeClass('inactive');

        if (size < 1161) {
            carts.css('transform', `translateX(167.5px)`);
        }

        if (size < 1160 && size > 898) {
            step2 = true;
        }

        if (size < 899) {
            carts.css('transform', `translateX(0px)`);
        }

        if (size > 1438) {
            step = 390;
        } else if (size <= 1438) {
            step = 325;
        }
    }

    feedbackNext.on('click', function (e) {
        if (size > 1438) {
            step = 390;
        } else if (size <= 1438) {
            step = 325;
        } else if (size < 1160 && size > 898 && step2) {
            step2 = true;
        }

        if (size < 899 && count < 6) {
            distance -= step;
            carts.css('transform', `translateX(${distance}px)`);
            feedbackPrev.removeClass('inactive');
            paginations.removeClass('feedback__pagination-checked');
            paginations.eq(count + 1).addClass('feedback__pagination-checked');
            ++count;
        } else if (size < 1160 && size > 898 && step2) {
            distance -= 167.5;
            carts.css('transform', `translateX(${distance}px)`);
            feedbackPrev.removeClass('inactive');
            paginations.removeClass('feedback__pagination-checked');
            paginations.eq(count + 1).addClass('feedback__pagination-checked');
            ++count;
            step2 = false;
        } else if (count < 6 && size < 1160 && size > 898) {
            distance -= step;
            carts.css('transform', `translateX(${distance}px)`);
            feedbackPrev.removeClass('inactive');
            paginations.removeClass('feedback__pagination-checked');
            paginations.eq(count + 1).addClass('feedback__pagination-checked');
            ++count;
        } else if (count < 5 && size > 1160) {
            distance -= step;
            carts.css('transform', `translateX(${distance}px)`);
            feedbackPrev.removeClass('inactive');
            paginations.removeClass('feedback__pagination-checked');
            paginations.eq(count + 1).addClass('feedback__pagination-checked');
            ++count;
        }

        if (size < 899 && count === 6) {
            feedbackNext.addClass('inactive');
        } else if (count === 6 && size < 1160 && size > 898) {
            feedbackNext.addClass('inactive');
        } else if (count === 5 && size > 1159) {
            feedbackNext.addClass('inactive');
        }
    })


    feedbackPrev.on('click', function (e) {
        if (size > 1438) {
            step = 390;
        } else if (size <= 1438) {
            step = 325;
        }
        if (size < 1160 && size > 898 && step2) {
            step2 = true;
        }

        if (size < 898 && count > 0) {
            distance += step;
            carts.css('transform', `translateX(${distance}px)`);
            feedbackNext.removeClass('inactive');
            paginations.removeClass('feedback__pagination-checked');
            paginations.eq(count - 1).addClass('feedback__pagination-checked');
            --count;
        } else if (size < 1160 && size > 898 && step2) {
            distance += 492.5;
            carts.css('transform', `translateX(${distance}px)`);
            feedbackNext.removeClass('inactive');
            paginations.removeClass('feedback__pagination-checked');
            paginations.eq(count - 1).addClass('feedback__pagination-checked');
            --count;
            step2 = false;
        } else if (count > 1) {
            distance += step;
            carts.css('transform', `translateX(${distance}px)`);
            feedbackNext.removeClass('inactive');
            paginations.removeClass('feedback__pagination-checked');
            paginations.eq(count - 1).addClass('feedback__pagination-checked');
            --count;
        }

        if (size < 899 && count === 0) {
            feedbackPrev.addClass('inactive');
        } else if (count === 1 && size > 899) {
            feedbackPrev.addClass('inactive');
        }
    })

    let photoFlor = $('.photoFlor');

    function createFlorariumsCarts(obj) {
        for (let i = 0; i < obj.length; i++) {
            let img = $(`<img alt=florarius${i + 1} class="gallery__photo-small photoFlor photo wow animate__fadeInDown" src=${obj[i].src}>`
            );

            florariums.append(img);

            photoFlor = $('.photoFlor');
        }
    }

    createFlorariumsCarts(florariumCarts);

    photoFlor.on('click', function (e) {
        console.log(e.target.getAttribute('src'));
        modalWrap.css('display', 'block');
        modalImg.css('display', 'block');
        modalImage.attr('src', e.target.getAttribute('src'));
        body.css('overflowY', 'hidden');
    })


    window.addEventListener('scroll', function () {
        if (window.scrollY >= 300 && window.innerWidth < 769) {
            arrowUp.css('display', 'flex');
        } else {
            arrowUp.css('display', 'none');
        }
    })

    arrowUp.on('click', function () {
        window.scrollTo(0, 0)
    })
})

