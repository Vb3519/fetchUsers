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

// Обработчики:
getUsersDataBtn?.addEventListener('click', handleFetchUsersData);

Array.from(selectUserBtns).forEach((btn) => {
  btn.addEventListener('click', selectAnotherUser);
});

// Состояние приложения:
let usersData: usersData_API_response[] | null = null;
let userDataCounter: number = 0;

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

let testData = null;

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
    <li class="user-info__elem company">Company: ${usersInfo[counter].company.name}</li>
    <li class="user-info__elem adress"> City: ${usersInfo[counter].address.city}</li>
    <li class="user-info__elem phone">Phone: ${usersInfo[counter].phone}</li>
    <li class="user-info__elem email">E-mail: ${usersInfo[counter].email}</li>
    <li class="user-info__elem website">Website: ${usersInfo[counter].website}</li>
    `;
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

    renderUserInfo(usersData, userDataCounter);
  }

  if (currentTargetElement.dataset.next) {
    userDataCounter >= usersData.length - 1
      ? (userDataCounter = 0)
      : ++userDataCounter;

    renderUserInfo(usersData, userDataCounter);
  }
}
