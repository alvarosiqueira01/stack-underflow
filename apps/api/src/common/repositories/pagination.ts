export type PaginationOptions = {
  page?: number;
  pageSize?: number;
};

export function getPagination(options: PaginationOptions = {}) {
  const page = Math.max(options.page ?? 1, 1);
  const pageSize = Math.min(Math.max(options.pageSize ?? 15, 1), 100);

  return {
    limit: pageSize,
    skip: (page - 1) * pageSize,
    page,
    pageSize,
  };
}
