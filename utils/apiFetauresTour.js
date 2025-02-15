class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    // filter and advanced filter
    filter() {
        const queryObj = { ...this.queryString };  // copy query object [here '...' this three dots is called spread operator]
        const execludeFiled = ['page', 'limit', 'sort', 'fields'];   // exelude fileds which i don't want to be query
        execludeFiled.forEach(el => delete queryObj[el]);   // delete the fields which i don't want to be query

        // 2 - Advanced filter
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, matche => `$${matche}`);

        // const query = Tour.find(JSON.parse(queryStr)); // for filtering
        this.query.find(JSON.parse(queryStr));  // for advance filtering

        return this;
    }

    // sorting
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' '); // for multiple sorting
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    // field limit selection
    fieldlimit() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');  // select all fields except __v
        }

        return this;
    }

    // pagination
    pagination() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 20;
        const skipValue = (page - 1) * limit;

        this.query = this.query.skip(skipValue).limit(limit);

        return this;
    }
}

module.exports = APIfeatures;