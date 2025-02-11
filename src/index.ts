const greeting: string = 'Hello from TypeScript ^_^';
console.log('My greeting:', greeting);

let usersData: usersData_API_response[] | null | unknown = null;

interface usersData_API_response {
  adress: unknown;
  company: unknown;
  email: string;
  id: number;
  name: string;
  phone: string;
  username: string;
  website: string;
}

const fetchUsersData = async (): Promise<unknown> => {
  const fetchResponse: Response = await fetch(
    'https://jsonplaceholder.typicode.com/users'
  );

  const responseUsersData: unknown = await fetchResponse.json();

  return responseUsersData;
};

usersData = await fetchUsersData(); // await НЕ работает при настройке "module": "ES2020"
console.log(usersData);

export {}; // для того, чтоб index.ts был модулем
