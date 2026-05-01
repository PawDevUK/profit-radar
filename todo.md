# TODO

- [x] Create card to display lots. Card should be autotrader layout and style.
- [x] Add zustand state management to control data passed from search component to result. There will be more state like user or app settings so centralized state management is necessary.
- [x] Add quick filter buttons to filter and sort horizontal component.
- [x] Add selectOne function to checkBox component for search filter which need to select only one option.
- [x] update naming to follow conventions.
- [x] Improve performance by adding useCallback and useMemo
- [x] Add onClick to lot card so on click it should open new page with detailed info of the sinlge lot.
- [x] Add database for scraped lots
- [ ] CHANGE NAME TO "IMPORTEK"
- [ ] Add tokens to endpoints to authorise requests.
- [x] Scraper page pagination.
- [x] Add scraping data to db.
- [ ] Remove month and year form data base as it wont be used. Each sale list has own date and time which will be used to
    assign to right calendar day in calendar component.
- [ ] Flow for creating and updating database entries.

        Phase I
        Creation of the data base
        - Create data base object with _id, scrapedAt (it can be changed to createdAt), totalAuctions, auctions. I think there can be added few other key value elements to this document but at the moment lets keep it as it is.
        - Download csv file, convert it into lotDetails object and save it to data base
        - Scrape images for every lot and update lotDetails images.copart database field.

        Phase II
        Updating Database.
        - Download csv file, convert it into lotDetails object and compare it to existing saved in database. In case of additional lots or new lots add them to saleList and in case of different values in existing lotDetails database entries update them.
        
