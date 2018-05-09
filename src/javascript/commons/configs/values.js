export const format = {
    FULL_DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
    DATETIME_FORMAT: 'YYYY-MM-DD HH:mm',
    DATE_FORMAT: 'YYYY-MM-DD',
    TIME_FORMAT: 'HH:mm',
    TIME_FORMAT_SEC : 'HH:mm:ss',
    DAY_FORMAT: 'ddd',
};

export const mock = {
    item : {
        id: '1',
        title : 'test1',
        src : 'https://picsum.photos/480/320',
        descript : '테스트 샘플 입니다. 테스트 샘플 입니다. 테스트 샘플 입니다. 테스트 샘플 입니다. 테스트 샘플 입니다.',
        auth : '마크 주커버그',
        price : {
            total : 1000000,
            present : 50000,
            count : 30,
        },
        mainList : true,
    },
    stories : Array(10).fill('').map(item => item),
}

export default {
    format,
    mock,
};
