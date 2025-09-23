module.exports = async (Model, query = {}, options = {}) => {
    const page = parseInt(options.page, 10) || 1;
    const limit = parseInt(options.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    try {
        const [total, data] = await Promise.all([
            Model.countDocuments(query),
            Model.find(query).skip(startIndex).limit(limit)
        ]);

        const results = {
            status: 'success',
            data,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                limit: limit
            }
        };

        if (startIndex > 0) {
            results.pagination.previousPage = page - 1;
        }

        if (startIndex + limit < total) {
            results.pagination.nextPage = page + 1;
        }

        return results;
    } catch (error) {
        throw error;
    }
};
