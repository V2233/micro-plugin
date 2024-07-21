export default class Pager {
    $list: any[];
    $pageNum: number;
    $pageSize: number;
    constructor(list: any[], pageNum: number, pageSize: number);
    get pageNum(): number;
    set pageNum(pageNum: number);
    get pageSize(): number;
    set pageSize(pageSize: number);
    get records(): any[];
    get offset(): number;
    get maxNum(): number;
    get total(): number;
    toJSON(): {
        pageNum: number;
        pageSize: number;
        total: number;
        maxNum: number;
        records: any[];
    };
}
