const greeting: string = 'Hello from TypeScript ^_^';
console.log('My greeting:', greeting);

// -----------------------------------------------------------------------------
// ВИД:
// -----------------------------------------------------------------------------
const appContainer: HTMLDivElement | null =
  document.querySelector('.app-page__fetch');

const appPageWrapper: HTMLDivElement | null = document.querySelector(
  '.fetch-users-app__wrapper'
);

const fetchUsersCard: HTMLDivElement | null = document.querySelector(
  '.fetch-users-app__card'
);

const actionBtnsContainer: HTMLDivElement | null = document.querySelector(
  '.fetch-users-app__action-btns'
);

// -----------------------------------------------------------------------------
// СОСТОЯНИЕ ПРИЛОЖЕНИЯ:
// -----------------------------------------------------------------------------
let usersData: usersData_API_response[] | null = null;
let isDataLoaded: boolean = false;

let userDataCounter: number = 0;

let currentUserDetailedCompanyInfo: detailedCompanyData_API_response | null =
  null;

let currentUserDetailedAdressInfo: detailedAdressData_API_response | null =
  null;

let currentUserDetailedInfo: // для рендера
detailedCompanyData_API_response | detailedAdressData_API_response | null =
  null;

const API_URL: string = 'https://jsonplaceholder.typicode.com/users';

// -----------------------------------------------------------------------------
// ИНТЕРФЕЙСЫ (ТИПЫ):
// -----------------------------------------------------------------------------

interface userData_adress {
  city: string;
  geo: { lat: string; lng: string };
  street: string;
  suite: string;
  zipcode: string;
}

interface userData_company {
  bs: string;
  catchPhrase: string;
  name: string;
}

interface usersData_API_response {
  address: userData_adress;
  company: userData_company;
  email: string;
  id: number;
  name: string;
  phone: string;
  username: string;
  website: string;
}

interface detailedCompanyData_API_response {
  bs: string;
  catchPhrase: string;
  name: string;
}

interface detailedAdressData_API_response {
  city: string;
  geo: { lat: string; lng: string };
  street: string;
  suite: string;
  zipcode: string;
}

// Получение данных о пользователях:
const fetchUsersData = async (): Promise<usersData_API_response[]> => {
  const fetchResponse: Response = await fetch(API_URL);
  console.log('fetchResponse:', fetchResponse);

  const responseUsersData: usersData_API_response[] =
    await fetchResponse.json();

  return responseUsersData;
};

// Функция хэндлер-обработчик (получения данных о пользователях):
async function handleFetchUsersData(
  btnElem: HTMLButtonElement | null
): Promise<void> {
  try {
    if (!btnElem) return;

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
  } catch (error: unknown) {
    if (!btnElem) return;
    btnElem.disabled = false;
    console.log('error:', error);
  }
}

// Рендер тела карточки пользователя: fetchUsersCard
function renderUserCardBody(cardContainer: HTMLDivElement | null) {
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

    const selectedUserData: HTMLUListElement | null = document.querySelector(
      '.user-card__user-info'
    );
    renderUserInfo(selectedUserData, usersData, userDataCounter);

    renderActionBtns(actionBtnsContainer, isDataLoaded);

    const resetAppBtn = cardContainer.querySelector('.card-header__close-btn');
    resetAppBtn?.addEventListener('click', resetUsersCardApp);
  }
}

// Рендер информации о пользователе:
const renderUserInfo = (
  userDataListElem: HTMLUListElement | null,
  usersInfo: usersData_API_response[] | null,
  counter: number
): void => {
  if (!userDataListElem || !usersInfo) return;

  userDataListElem.innerHTML = `
    <li class="user-info__elem username">Username: ${usersInfo[counter].name}</li>
    <li class="user-info__elem id">Id: ${usersInfo[counter].id}</li>

    <li class="user-info__elem company">      
      <span class="company__name">Company: ${usersInfo[counter].company.name}</span>

      <div class="company__details company-details">
        <button class="company-details__btn details-btn" data-details="company">More</button>        
      </div>
    </li>    

    <li class="user-info__elem adress">
    <span class="adress__city">City: ${usersInfo[counter].address.city}</span>

      <div class="adress__details adress-details">
        <button class="adress-details__btn details-btn" data-details="address">More</button>        
      </div>
    </li>   

    <li class="user-info__elem phone">Phone: ${usersInfo[counter].phone}</li>
    <li class="user-info__elem email">E-mail: ${usersInfo[counter].email}</li>
    <li class="user-info__elem website">Website: ${usersInfo[counter].website}</li>
    `;

  const currentUserDetailsBtns: NodeListOf<HTMLButtonElement> =
    userDataListElem.querySelectorAll('.details-btn');

  Array.from(currentUserDetailsBtns).forEach((button) => {
    button.addEventListener('click', handleRenderCurrentUserDetailedInfo);
  });
};

// Выбор карточки пользователя (вперед, назад):
function selectAnotherUser(e: Event) {
  if (!usersData) return;

  const { currentTarget } = e;
  const currentTargetElement: HTMLElement = currentTarget as HTMLElement;

  if (!currentTarget) return;

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
function handleSetUserDetailedInfoAndCardRender(
  counter: number,
  userCard: HTMLDivElement | null
): void {
  setCurrentUserDetailedCompanyInfo(counter);
  setCurrentUserDetailedAdressInfo(counter);
  renderUserCardBody(userCard);
}

// ----------------------------------------------------------------------------------------------------
// Получение детальной информации о компании текущего пользователя:
function setCurrentUserDetailedCompanyInfo(counter: number) {
  if (!usersData) {
    console.log('usersData:', usersData);
    return;
  }

  currentUserDetailedCompanyInfo = usersData[counter].company;
  console.log(
    'currentUserDetailedCompanyInfo:',
    currentUserDetailedCompanyInfo
  );
}

// ----------------------------------------------------------------------------------------------------
// Получение детальной информации об адресе текущего пользователя:
function setCurrentUserDetailedAdressInfo(counter: number) {
  if (!usersData) {
    console.log('usersData:', usersData);
    return;
  }

  currentUserDetailedAdressInfo = usersData[counter].address;

  console.log('currentUserDetailedAdressInfo:', currentUserDetailedAdressInfo);
}

// ----------------------------------------------------------------------------------------------------
// Рендер детальной информации о пользователе (адрес, компания):

// Выбор опции (адрес или компания) для рендера:
function setCurrentUserDetailedDataOption(optionData: string) {
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
function renderCurrentUserDetailedInfo(
  wrapperElem: HTMLDivElement | null,
  currentUserDetailedData:
    | detailedCompanyData_API_response
    | detailedAdressData_API_response
    | null
) {
  if (!wrapperElem || !currentUserDetailedData) {
    console.log('wrapperElem:', wrapperElem);
    console.log('currentUserDetailedData:', currentUserDetailedData);
    return;
  }

  let optionalInnerHTML: string = '';

  if ('bs' in currentUserDetailedData) {
    optionalInnerHTML = `
      <ul class="company-details__list">
        <li class="company-details__list__elem">bs: ${currentUserDetailedData.bs}</li>
        <li class="company-details__list__elem">
          Catch Phrase: ${currentUserDetailedData.catchPhrase}
        </li>
      </ul>
    `;
  }

  if ('street' in currentUserDetailedData) {
    optionalInnerHTML = `<ul class="adress-details__list">
      <li class="adress-details__list__elem">Street: ${currentUserDetailedData.street}</li>
      <li class="adress-details__list__elem">Suite: ${currentUserDetailedData.suite}</li>
      <li class="adress-details__list__elem">Zipcode: ${currentUserDetailedData.zipcode}</li>
    </ul>`;
  }

  wrapperElem.innerHTML = optionalInnerHTML;

  wrapperElem.classList.add('active-elem');

  const handleClick = (): void => {
    if (wrapperElem.classList.contains('active-elem')) {
      wrapperElem.classList.remove('active-elem');
      wrapperElem.removeEventListener('click', handleClick);
    }
  };

  wrapperElem.addEventListener('click', handleClick);
}

// Функция-хэндлер рендера детальной информации о пользователе:
function handleRenderCurrentUserDetailedInfo(e: Event) {
  const currentTarget = e.currentTarget as HTMLButtonElement;

  const currentUserOptionData: string | undefined =
    currentTarget.dataset.details; // компания или адрес
  console.log('currentUserOptionData:', currentUserOptionData);

  if (!currentUserOptionData) {
    console.log('currentUserOptionData:', currentUserOptionData);
    return;
  }

  setCurrentUserDetailedDataOption(currentUserOptionData);

  renderCurrentUserDetailedInfo(appPageWrapper, currentUserDetailedInfo);
}

// Таймер для задержки загрузки и отображения анимации:
function myFetchTimer(): Promise<unknown> {
  console.log('Waiting ^_^');

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('');
    }, 2000);
  });
}

// Анимация и лоадер загрузки:
function renderLoader(userCardContainer: HTMLDivElement | null) {
  if (!userCardContainer) {
    return;
  }

  userCardContainer.innerHTML = `    
      <div class="loading-container">
        <span class="loading-container__title">Loading</span>
        <div class="loading-container__label"></div>
      </div>
  `;

  const loaderTitle: HTMLSpanElement | null = userCardContainer.querySelector(
    '.loading-container__title'
  );

  loaderTitleAnimation(loaderTitle);
}

// Анимация загрузки (отображение точек):
async function loaderTitleAnimation(titleElem: HTMLSpanElement | null) {
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
function renderActionBtns(
  containerElem: HTMLDivElement | null,
  dataLoaded: boolean
) {
  if (containerElem) {
    const emptyDataInnerHTML: string = `
      <button class="action-btns__get-data-btn">Get Users Data</button>
    `;

    const dataLoadedInnerHTML: string = `
      <button class="action-btns__select-user-btn" data-prev="prev user">
        <i class="fa-solid fa-chevron-left"></i> Previous
      </button>

      <button class="action-btns__select-user-btn" data-next="next user">
        Next <i class="fa-solid fa-chevron-right"></i>
      </button>
    `;

    containerElem.innerHTML = dataLoaded
      ? dataLoadedInnerHTML
      : emptyDataInnerHTML;

    // Навешивание обработчиков на кнопки после отрисовки структуры контейнера:
    const selectUserBtns: NodeListOf<HTMLButtonElement> =
      document.querySelectorAll('.action-btns__select-user-btn');

    Array.from(selectUserBtns).forEach((btn) => {
      btn.addEventListener('click', selectAnotherUser);
    });

    const getUsersDataBtn: HTMLButtonElement | null =
      containerElem.querySelector('.action-btns__get-data-btn');

    getUsersDataBtn?.addEventListener('click', () => {
      handleFetchUsersData(getUsersDataBtn);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderActionBtns(actionBtnsContainer, isDataLoaded);
});

// Ресет всего приложения:
function resetUsersCardApp(): void {
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
