// await на верхних уровнях НЕ работает при настройке "module": "ES2020"

const greeting: string = 'Hello from TypeScript ^_^';
console.log('My greeting:', greeting);

const getUsersDataBtn: HTMLButtonElement | null = document.querySelector(
  '.action-btns__get-data-btn'
);

const fetchUsersDataContainer: HTMLDivElement | null =
  document.querySelector('.fetch-users-app');

const selectedUserData: HTMLUListElement | null = document.querySelector(
  '.user-card__user-info'
);

const selectUserBtns: NodeListOf<HTMLButtonElement> = document.querySelectorAll(
  '.action-btns__select-user-btn'
);

const appPageWrapper: HTMLDivElement | null = document.querySelector(
  '.fetch-users-app__wrapper'
);

// Обработчики:
getUsersDataBtn?.addEventListener('click', handleFetchUsersData);

Array.from(selectUserBtns).forEach((btn) => {
  btn.addEventListener('click', selectAnotherUser);
});

// Состояние приложения:
let usersData: usersData_API_response[] | null = null;

let userDataCounter: number = 0;

let currentUserDetailedCompanyInfo: detailedCompanyData_API_response | null =
  null;

let currentUserDetailedAdressInfo: detailedAdressData_API_response | null =
  null;

let currentUserDetailedInfo: // для рендера
detailedCompanyData_API_response | detailedAdressData_API_response | null =
  null;

const API_URL: string = 'https://jsonplaceholder.typicode.com/users';

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

// Получение данных о пользователях:
const fetchUsersData = async (): Promise<usersData_API_response[]> => {
  const fetchResponse: Response = await fetch(API_URL);
  console.log('fetchResponse:', fetchResponse);

  const responseUsersData: usersData_API_response[] =
    await fetchResponse.json();

  return responseUsersData;
};

// Функция хэндлер-обработчик (получения данных о пользователях):
async function handleFetchUsersData(): Promise<void> {
  try {
    if (!getUsersDataBtn) return;

    getUsersDataBtn.disabled = true;

    if (usersData) {
      console.log('Users data already fetched!');
      getUsersDataBtn.disabled = false;
      return;
    }

    usersData = await fetchUsersData();
    console.log('usersData:', usersData);

    setCurrentUserDetailedCompanyInfo(userDataCounter);
    setCurrentUserDetailedAdressInfo(userDataCounter);

    renderUserInfo(usersData, userDataCounter);

    getUsersDataBtn.disabled = false;
  } catch (error: unknown) {
    if (!getUsersDataBtn) return;

    getUsersDataBtn.disabled = false;
    console.log('error:', error);
  }
}

// Рендер информации о пользователе:
const renderUserInfo = (
  usersInfo: usersData_API_response[] | null,
  counter: number
): void => {
  if (!selectedUserData || !usersInfo) return;

  selectedUserData.innerHTML = `
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
    selectedUserData.querySelectorAll('.details-btn');

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

    setCurrentUserDetailedCompanyInfo(userDataCounter);
    setCurrentUserDetailedAdressInfo(userDataCounter);
    renderUserInfo(usersData, userDataCounter);
  }

  if (currentTargetElement.dataset.next) {
    userDataCounter >= usersData.length - 1
      ? (userDataCounter = 0)
      : ++userDataCounter;

    setCurrentUserDetailedCompanyInfo(userDataCounter);
    setCurrentUserDetailedAdressInfo(userDataCounter);
    renderUserInfo(usersData, userDataCounter);
  }
}

// ----------------------------------------------------------------------------------------------------
// Получение детальной информации о компании текущего пользователя:
interface detailedCompanyData_API_response {
  bs: string;
  catchPhrase: string;
  name: string;
}

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
interface detailedAdressData_API_response {
  city: string;
  geo: { lat: string; lng: string };
  street: string;
  suite: string;
  zipcode: string;
}

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
