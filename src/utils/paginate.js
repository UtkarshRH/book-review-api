module.exports = async (query, options = {}) => {
  const page = parseInt(options.page, 10) || 1;
  const limit = parseInt(options.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  const results = {};
  results.total = await query.countDocuments().exec();
  results.pages = Math.ceil(results.total / limit);

  if (startIndex > 0) {
    results.previous = page - 1;
  }

  if (startIndex + limit < results.total) {
    results.next = page + 1;
  }

  results.data = await query.skip(startIndex).limit(limit).exec();
  results.currentPage = page;

  return results;
};
