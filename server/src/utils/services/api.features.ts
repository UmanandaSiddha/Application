import { Query } from "mongoose";

class ApiFeatures<T> {
    private query: Query<T[], T>;
    private queryStr: Record<string, any>;

    constructor(query: Query<T[], T>, queryStr: Record<string, any>) {
        this.query = query;
        this.queryStr = queryStr;
    }

    public getQuery(): Query<T[], T> {
        return this.query;
    }

    search(): this {
        const keyword = this.queryStr.keyword
            ? {
                // "profile.email": { $regex: this.queryStr.keyword, $options: "i"},
                // $or: [
                //     { shortCode: { $regex: this.queryStr.keyword, $options: "i" } },
                //     { "data.name": { $regex: this.queryStr.keyword, $options: "i" } },
                // ],
                $or: [
                    { "profile.email": { $regex: this.queryStr.keyword, $options: "i" } },
                    { "profile.firstName": { $regex: this.queryStr.keyword, $options: "i" } },
                    { "profile.lastName": { $regex: this.queryStr.keyword, $options: "i" } },
                    {
                        $expr: {
                            $regexMatch: {
                                input: { $concat: ["$profile.firstName", " ", "$profile.lastName"] },
                                regex: this.queryStr.keyword,
                                options: "i",
                            },
                        },
                    },
                ],
            }
            : {};

        this.query = this.query.find({ ...keyword });
        return this;
    }

    searchCard(): this {
        const keyword = this.queryStr.keyword
            ? {
                $or: [
                    { shortCode: { $regex: this.queryStr.keyword, $options: "i" } },
                    { "data.name": { $regex: this.queryStr.keyword, $options: "i" } },
                ],
            }
            : {};

        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter(): this {
        const queryCopy = { ...this.queryStr };

        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach((key) => delete queryCopy[key]);

        const accountFilters: any = {};
        ["isVerified", "isBlocked", "isDeactivated"].forEach((key) => {
            if (queryCopy[key] !== undefined) {
                accountFilters[`account.${key}`] = queryCopy[key];
                delete queryCopy[key];
            }
        });

        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

        // this.query = this.query.find(JSON.parse(queryStr));
        this.query = this.query.find({ ...JSON.parse(queryStr), ...accountFilters });
        return this;
    }

    pagination(resultPerPage: number): this {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}

export default ApiFeatures;