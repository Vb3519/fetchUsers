"use strict";
// -----------------------------------------------------------------------------
// ВИД:
// -----------------------------------------------------------------------------
const appContainer = document.querySelector('.app-page__fetch');
const appPageWrapper = document.querySelector('.fetch-users-app__wrapper');
const fetchUsersCard = document.querySelector('.fetch-users-app__card');
const actionBtnsContainer = document.querySelector('.fetch-users-app__action-btns');
// -----------------------------------------------------------------------------
// СОСТОЯНИЕ ПРИЛОЖЕНИЯ:
// -----------------------------------------------------------------------------
let usersData = null;
let isDataLoaded = false;
let userDataCounter = 0;
let currentUserDetailedCompanyInfo = null;
let currentUserDetailedAdressInfo = null;
let currentUserDetailedInfo = null;
const API_URL = 'https://jsonplaceholder.typicode.com/users';
// Получение данных о пользователях:
const fetchUsersData = async () => {
    const fetchResponse = await fetch(API_URL);
    console.log('fetchResponse:', fetchResponse);
    const responseUsersData = await fetchResponse.json();
    return responseUsersData;
};
// Функция хэндлер-обработчик (получения данных о пользователях):
async function handleFetchUsersData(btnElem) {
    try {
        if (!btnElem)
            return;
        btnElem.disabled = true;
        if (usersData) {
            console.log('Users data already fetched!');
            btnElem.disabled = false;
            return;
        }
        renderLoader(fetchUsersCard);
        await myFetchTimer(); // Таймер для отображения анимации загрузки даты пользователей
        usersData = await fetchUsersData();
        console.log('usersData:', usersData);
        isDataLoaded = true;
        console.log('users data loaded:', isDataLoaded);
        // Общая функция по детальным данным пользователя и рендеру карточки:
        handleSetUserDetailedInfoAndCardRender(userDataCounter, fetchUsersCard);
    }
    catch (error) {
        if (!btnElem)
            return;
        renderFetchError(fetchUsersCard);
        btnElem.disabled = false;
        console.log('error:', error);
    }
}
// Рендер тела карточки пользователя: fetchUsersCard
function renderUserCardBody(cardContainer) {
    if (cardContainer) {
        cardContainer.innerHTML = `      
      <div class="user-card__header card-header">
        <h3 class="card-header__title">User Card:</h3>
        <button class="card-header__close-btn" title="Reset users data">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <ul class="user-card__user-info user-info">
      </ul>
    `;
        const selectedUserData = document.querySelector('.user-card__user-info');
        renderUserInfo(selectedUserData, usersData, userDataCounter);
        renderActionBtns(actionBtnsContainer, isDataLoaded);
        const resetAppBtn = cardContainer.querySelector('.card-header__close-btn');
        resetAppBtn?.addEventListener('click', resetUsersCardApp);
    }
}
// Рендер информации о пользователе:
const renderUserInfo = (userDataListElem, usersInfo, counter) => {
    if (!userDataListElem || !usersInfo)
        return;
    userDataListElem.innerHTML = `
    <li class="user-info__elem username"><span>Username:</span> ${usersInfo[counter].name}</li>
    <li class="user-info__elem id"><span>Id:</span> ${usersInfo[counter].id}</li>

    <li class="user-info__elem company">      
      <p class="company__name"><span>Company:</span> ${usersInfo[counter].company.name}</p>

      <div class="company__details company-details">
        <button class="company-details__btn details-btn" data-details="company">More</button>        
      </div>
    </li>    

    <li class="user-info__elem adress">
    <p class="adress__city"><span>City:</span> ${usersInfo[counter].address.city}</p>

      <div class="adress__details adress-details">
        <button class="adress-details__btn details-btn" data-details="address">More</button>        
      </div>
    </li>   

    <li class="user-info__elem phone"><span>Phone:</span> ${usersInfo[counter].phone}</li>
    <li class="user-info__elem email"><span>E-mail:</span> ${usersInfo[counter].email}</li>
    <li class="user-info__elem website"><span>Website:</span> ${usersInfo[counter].website}</li>
    `;
    const currentUserDetailsBtns = userDataListElem.querySelectorAll('.details-btn');
    Array.from(currentUserDetailsBtns).forEach((button) => {
        button.addEventListener('click', handleRenderCurrentUserDetailedInfo);
    });
};
// Выбор карточки пользователя (вперед, назад):
function selectAnotherUser(e) {
    if (!usersData)
        return;
    const { currentTarget } = e;
    const currentTargetElement = currentTarget;
    if (!currentTarget)
        return;
    if (currentTargetElement.dataset.prev) {
        userDataCounter === 0
            ? (userDataCounter = usersData.length - 1)
            : --userDataCounter;
        // Общая функция по детальным данным пользователя и рендеру карточки:
        handleSetUserDetailedInfoAndCardRender(userDataCounter, fetchUsersCard);
    }
    if (currentTargetElement.dataset.next) {
        userDataCounter >= usersData.length - 1
            ? (userDataCounter = 0)
            : ++userDataCounter;
        handleSetUserDetailedInfoAndCardRender(userDataCounter, fetchUsersCard);
    }
}
// Детальная информация об адресе и компании пользователя и рендер карточки:
function handleSetUserDetailedInfoAndCardRender(counter, userCard) {
    setCurrentUserDetailedCompanyInfo(counter);
    setCurrentUserDetailedAdressInfo(counter);
    renderUserCardBody(userCard);
}
// ----------------------------------------------------------------------------------------------------
// Получение детальной информации о компании текущего пользователя:
function setCurrentUserDetailedCompanyInfo(counter) {
    if (!usersData) {
        console.log('usersData:', usersData);
        return;
    }
    currentUserDetailedCompanyInfo = usersData[counter].company;
}
// ----------------------------------------------------------------------------------------------------
// Получение детальной информации об адресе текущего пользователя:
function setCurrentUserDetailedAdressInfo(counter) {
    if (!usersData) {
        console.log('usersData:', usersData);
        return;
    }
    currentUserDetailedAdressInfo = usersData[counter].address;
}
// ----------------------------------------------------------------------------------------------------
// Рендер детальной информации о пользователе (адрес, компания):
// Выбор опции (адрес или компания) для рендера:
function setCurrentUserDetailedDataOption(optionData) {
    if (!usersData) {
        console.log('usersData:', usersData);
        return;
    }
    if (optionData === 'address') {
        currentUserDetailedInfo = currentUserDetailedAdressInfo; // объект с данными для рендера
    }
    if (optionData === 'company') {
        currentUserDetailedInfo = currentUserDetailedCompanyInfo;
    }
}
// Рендер детальной информации о пользователе:
function renderCurrentUserDetailedInfo(wrapperElem, currentUserDetailedData) {
    if (!wrapperElem || !currentUserDetailedData) {
        console.log('wrapperElem:', wrapperElem);
        console.log('currentUserDetailedData:', currentUserDetailedData);
        return;
    }
    let optionalInnerHTML = '';
    if ('bs' in currentUserDetailedData) {
        optionalInnerHTML = `
      <ul class="company-details__list">
        <li class="company-details__list__elem"><span>bs:</span> ${currentUserDetailedData.bs}</li>
        <li class="company-details__list__elem">
          <span>Catch Phrase:</span> ${currentUserDetailedData.catchPhrase}
        </li>
      </ul>
    `;
    }
    if ('street' in currentUserDetailedData) {
        optionalInnerHTML = `<ul class="adress-details__list">
      <li class="adress-details__list__elem"><span>Street:</span> ${currentUserDetailedData.street}</li>
      <li class="adress-details__list__elem"><span>Suite:</span> ${currentUserDetailedData.suite}</li>
      <li class="adress-details__list__elem"><span>Zipcode:</span> ${currentUserDetailedData.zipcode}</li>
    </ul>`;
    }
    wrapperElem.innerHTML = optionalInnerHTML;
    wrapperElem.classList.add('active-elem');
    const handleClick = () => {
        if (wrapperElem.classList.contains('active-elem')) {
            wrapperElem.classList.remove('active-elem');
            wrapperElem.removeEventListener('click', handleClick);
        }
    };
    wrapperElem.addEventListener('click', handleClick);
}
// Функция-хэндлер рендера детальной информации о пользователе:
function handleRenderCurrentUserDetailedInfo(e) {
    const currentTarget = e.currentTarget;
    const currentUserOptionData = currentTarget.dataset.details; // компания или адрес
    if (!currentUserOptionData) {
        console.log('currentUserOptionData:', currentUserOptionData);
        return;
    }
    setCurrentUserDetailedDataOption(currentUserOptionData);
    renderCurrentUserDetailedInfo(appPageWrapper, currentUserDetailedInfo);
}
// Таймер для задержки загрузки и отображения анимации:
function myFetchTimer() {
    console.log('Waiting ^_^');
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('');
        }, 2000);
    });
}
// Анимация и лоадер загрузки:
function renderLoader(userCardContainer) {
    if (!userCardContainer) {
        return;
    }
    userCardContainer.innerHTML = `
      <div class="loading-container">
        <span class="loading-container__title">Loading</span>
        <div class="loading-container__label"></div>
      </div>
  `;
    const loaderTitle = userCardContainer.querySelector('.loading-container__title');
    loaderTitleAnimation(loaderTitle);
}
// Анимация загрузки (отображение точек):
async function loaderTitleAnimation(titleElem) {
    if (!titleElem) {
        console.log('titleElem:', titleElem);
        return;
    }
    const dots = '...';
    for (let i = 0; i < dots.length; i++) {
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                titleElem.innerText = titleElem.innerText + dots[i];
                resolve('');
            }, 500);
        });
    }
    setTimeout(() => {
        titleElem.innerText = titleElem.innerText.slice(0, -3);
        loaderTitleAnimation(titleElem);
    }, 1000);
}
// Рендер кнопок действий:
function renderActionBtns(containerElem, dataLoaded) {
    if (containerElem) {
        const emptyDataInnerHTML = `
      <button class="action-btns__get-data-btn">Get Users Data</button>
    `;
        const dataLoadedInnerHTML = `
      <button class="action-btns__select-user-btn" data-prev="prev user">
        <i class="fa-solid fa-chevron-left"></i> Prev
      </button>

      <button class="action-btns__select-user-btn" data-next="next user">
        Next <i class="fa-solid fa-chevron-right"></i>
      </button>
    `;
        containerElem.innerHTML = dataLoaded
            ? dataLoadedInnerHTML
            : emptyDataInnerHTML;
        // Навешивание обработчиков на кнопки после отрисовки структуры контейнера:
        const selectUserBtns = document.querySelectorAll('.action-btns__select-user-btn');
        Array.from(selectUserBtns).forEach((btn) => {
            btn.addEventListener('click', selectAnotherUser);
        });
        const getUsersDataBtn = containerElem.querySelector('.action-btns__get-data-btn');
        getUsersDataBtn?.addEventListener('click', () => {
            handleFetchUsersData(getUsersDataBtn);
        });
    }
}
document.addEventListener('DOMContentLoaded', () => {
    renderActionBtns(actionBtnsContainer, isDataLoaded);
});
// Ресет всего приложения:
function resetUsersCardApp() {
    if (appPageWrapper && fetchUsersCard) {
        appPageWrapper.innerHTML = ``;
        fetchUsersCard.innerHTML = ``;
    }
    usersData = null;
    isDataLoaded = false;
    userDataCounter = 0;
    currentUserDetailedCompanyInfo = null;
    currentUserDetailedAdressInfo = null;
    currentUserDetailedInfo = null;
    renderActionBtns(actionBtnsContainer, isDataLoaded);
}
// Рендер ошибки, при неправильной ссылке для скачивания информации о пользователях:
function renderFetchError(userCardContainer) {
    if (!userCardContainer) {
        return;
    }
    userCardContainer.innerHTML = `
      <div class="error-container">
        <span class="error-container__title">Ничего не нашлось...</span>        
      </div>
  `;
}
