import { Page } from "@spotify/web-api-ts-sdk";

// functions to help with paginated responses from the spotify api

export const defaultPageLength = 50;

export function getItemsFromPages<T>(pages: Page<T>[]): T[] {
  return pages.flatMap((page) => page.items);
}

// a fuction to start on page 0 and get all pages until there are no more pages
export async function getAllPages<T>(
  getPage: (page: number) => Promise<Page<T>>,
): Promise<T[]> {
  let page = 0;

  // get first page, we can get the total number of pages from this
  const firstPage = await getPage(page);
  let pages: Page<T>[] = [firstPage];

  // get the total number of pages
  const totalPages = Math.ceil(firstPage.total / defaultPageLength);

  // get rest of the pages
  pages = [
    ...pages,
    ...(await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, i) => getPage(i + 1)),
    )),
  ];

  return getItemsFromPages(pages);
}
