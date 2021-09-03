import { Pagination } from "react-bootstrap";

const PageNums = ({ totalPages, currentPage, cbPageClick,pageNeighbours }) => {
    //const [pages,setPages] = useState();
    
    const LEFT_PAGE = "LEFT";
    const RIGHT_PAGE = "RIGHT";

/*     useEffect(() => {
        setPages(fetchPageNumbers())
    }, []) */

    /**
     * Helper method for creating a range of numbers
     * range(1, 5) => [1, 2, 3, 4, 5]
     */
    const range = (from, to, step = 1) => {
      let i = from;
      const range = [];

      while (i <= to) {
        range.push(i);
        i += step;
      }

      return range;
    };
  /**
   * Let's say we have 10 pages and we set pageNeighbours to 2
   * Given that the current page is 6
   * The pagination control will look like the following:
   *
   * (1) < {4 5} [6] {7 8} > (10)
   *
   * (x) => terminal pages: first and last page(always visible)
   * [x] => represents current page
   * {...x} => represents page neighbours
   */
   const fetchPageNumbers = () => {
           // pageNeighbours can be: 0, 1 or 2
    pageNeighbours = typeof pageNeighbours === 'number'
    ? Math.max(0, Math.min(pageNeighbours, 2))
    : 0;


    /**
     * totalNumbers: the total page numbers to show on the control
     * totalBlocks: totalNumbers + 2 to cover for the left(<) and right(>) controls
     */
    const totalNumbers = (pageNeighbours * 2) + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, currentPage - pageNeighbours);
      const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);
      let pages = range(startPage, endPage);

      /**
       * hasLeftSpill: has hidden pages to the left
       * hasRightSpill: has hidden pages to the right
       * spillOffset: number of hidden pages either to the left or to the right
       */
      const hasLeftSpill = startPage > 2;
      const hasRightSpill = (totalPages - endPage) > 1;
      const spillOffset = totalNumbers - (pages.length + 1);

      switch (true) {
        // handle: (1) < {5 6} [7] {8 9} (10)
        case (hasLeftSpill && !hasRightSpill): {
          const extraPages = range(startPage - spillOffset, startPage - 1);
          pages = [LEFT_PAGE, ...extraPages, ...pages];
          break;
        }

        // handle: (1) {2 3} [4] {5 6} > (10)
        case (!hasLeftSpill && hasRightSpill): {
          const extraPages = range(endPage + 1, endPage + spillOffset);
          pages = [...pages, ...extraPages, RIGHT_PAGE];
          break;
        }

        // handle: (1) < {4 5} [6] {7 8} > (10)
        case (hasLeftSpill && hasRightSpill):
        default: {
          pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
          break;
        }
      }

      return [1, ...pages, totalPages];
    }

    return range(1, totalPages);
  }
  const pages = fetchPageNumbers();

  if (totalPages === 1) return null;

  return (<Pagination>
    { pages.map((page, index) => {

        if (page === LEFT_PAGE) return (
/*           <li key={index} className="page-item">
            <a className="page-link" href="#" aria-label="Previous" onClick={this.handleMoveLeft}>
              <span aria-hidden="true">&laquo;</span>
              <span className="sr-only">Previous</span>
            </a>
          </li> */
          <Pagination.Prev onClick={()=>cbPageClick(currentPage-1)} />
        );

        if (page === RIGHT_PAGE) return (
/*           <li key={index} className="page-item">
            <a className="page-link" href="#" aria-label="Next" onClick={this.handleMoveRight}>
              <span aria-hidden="true">&raquo;</span>
              <span className="sr-only">Next</span>
            </a>
          </li> */
          <Pagination.Next onClick={()=>cbPageClick(currentPage+1)}  />
        );

        return (
/*           <li key={index} className={`page-item${ currentPage === page ? ' active' : ''}`}>
            <a className="page-link" href="#" onClick={ this.handleClick(page) }>{ page }</a>
          </li> */
          <Pagination.Item active={currentPage === page} onClick={()=>cbPageClick(page) }>{page}</Pagination.Item>
        );

      }) }

</Pagination>)
};

export default PageNums;
