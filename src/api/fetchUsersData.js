const fetchUsersData = async () => {
    const usersData = await fetch('https://jsonplaceholder.typicode.com/users');
    console.log(usersData);
};
export default fetchUsersData;
