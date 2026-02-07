Structure of db and general documentation about db

Data Base is the storage to keep aplication data. It needs to be structure in the way that can be accessed easly with minimal risk of bugs.

The structure of objects are:

Calledar / Sale results / lot details

```
const calendarMonth = {
  month: "February",
  year: 2026,
  scrapedAt: "2026-02-07T12:00:00.000Z",
  totalAuctions: 1,
  auctions: [{
  location: "Warsaw, PL",
  saleDate: "2026-02-15",
  saleTime: "10:00",
  viewSalesLink: "https://example.com/auctions/123",
  numberOnSale: 1,
  saleList: [
    {
      title: "2018 Honda Civic EX",
      lotNr: "12345",
      odometr: "56,200",
      odometrStatus: "actual",
      currentBid: "3200",
      buyItNow: "9500",
      details: {
        title: "2018 Honda Civic EX",
        year: 2018,
        make: "Honda",
        model: "Civic",
        trim: "EX",
        vin: "2HGFC2F79JH000000",
        runAndDrive: true,
        lotNumber: 12345,
        saleName: "Weekly Auction",
        location: "Warsaw, PL",
        odometer: 56200,
        odometerUnit: "km",
        primaryDamage: "Front end",
        color: "Blue",
        hasKey: true,
        drivetrain: "FWD",
        fuel: "Petrol",
        highlights: ["Run & Drive"],
        images: ["https://example.com/imgs/12345-1.jpg"]
      }
    },]
};
```

The scraper should scrape calendar first and then save it to Mongo DB. Then scraper should scrape the sale results with lots detail and then save it to DB.

Scrape calendar                    ------ > Data Base Calendar object
Scrape sale list with lots deteils ------ > Data Base Calendar nested objects

Data from database should be fetch directly to calendar component and eather saved to redux or contect.
