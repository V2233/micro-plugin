class Pager {
    $list;
    $pageNum;
    $pageSize;
    constructor(list, pageNum, pageSize) {
        this.$list = list;
        this.$pageNum = pageNum;
        this.$pageSize = pageSize;
    }
    get pageNum() {
        return this.$pageNum;
    }
    set pageNum(pageNum) {
        this.$pageNum = pageNum;
    }
    get pageSize() {
        return this.$pageSize;
    }
    set pageSize(pageSize) {
        this.$pageSize = pageSize;
    }
    get records() {
        return [...this.$list].splice(this.offset, this.$pageSize);
    }
    get offset() {
        let current = this.$pageNum;
        if (current <= 1) {
            return 0;
        }
        return Math.max((current - 1) * this.$pageSize, 0);
    }
    get maxNum() {
        return Math.ceil(this.total / this.$pageSize);
    }
    get total() {
        return this.$list.length;
    }
    toJSON() {
        return {
            pageNum: this.$pageNum,
            pageSize: this.$pageSize,
            total: this.total,
            maxNum: this.maxNum,
            records: this.records,
        };
    }
}

export { Pager as default };
