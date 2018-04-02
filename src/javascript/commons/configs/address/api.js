export const api = {
    address: (address) => {
        return `https://api.poesis.kr/post/search.php?pc=5&q=${address}`;
    },
};

export default api;
