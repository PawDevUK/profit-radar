## Problem-Solving

This file contains all major problems during development in this project.
I this in this way everything can be clearly decribe and then with correct information, fixing the problem should be easier.

### Problem 1

The lot card component needs to be customised and section needs to be added or extended with the information that app provides. At the moment it is very basic with minimal information. I think starting point will be to list all info details rendered in lot compoonent. Then it need to be divided into grouped sections and then customised to match rest of the project.

How react/next js component should be design?
What principals I need to follow to make the best posible UX/UI ?

- Define data structure of the component
- Desighn layout with use of figma.
- Implement the desighn into jsx

List of main elements groups.
    - Images.
    - Main info. Most important information about the car. List of info from lot details type. These details are fetched from api or scraped.
        - Most important information about the car:
            -
    - Profit informations.
        - It needs to display amount of same cars in Poland.
        - Low and High prices.
        - Average price.
        - Suggested price for same year and milage(not sure if milage is what people care as it can be corrected).

    - Additional informations.

### Problem 2

Database need to be connected and lot schema with model needs to be created with all data. Current lot type needs to be used to created schema.

### Problem 3

As the user might want to see visualised repaired car I need to implement AI API to automatically generate repaired image of the lot. There is few option to choose from but currently the cheapest option is needed with medium quality. To mach these requirements, GPT Image 1 Mini (Low) tier. At roughly £5.00 for 1,000 images is the best option. Integration of this model is fairly strait forward.

In order to display the visually repaired images best bay is to stack them on top of each other and use slider to revile the changes.

### Problem 4

Using AI to find the correct data elements for web scraping

As some web pages are quite complex and difficult to scrape, due to IDs and classes changing or being dynamically added, locating the correct element can be challenging. Furthermore, a page's HTML structure often changes as elements are added, removed, or renamed.

To find the right element, AI can be a great tool for extracting the correct HTML element ID or class. To do this, a page snapshot containing only the HTML body section needs to be sent to the AI API, along with a clear and descriptive prompt specifying the information or section for which the class or ID needs to be found. Then, with the correct element identified, the scraper can finish extracting the information.

### Problem 5

Getting correct info and data from a page requires specifying correct element. To do that puppeteer has build in

page.$(selector) finds the first matching element and returns an ElementHandle or null.
page.$$(selector) finds all matching elements and returns an array of ElementHandles.
page.$eval(selector, fn) finds the first matching element, passes it into fn inside the browser page, and returns the result.
page.$$eval(selector, fn) finds all matching elements, passes them as an array into fn inside the browser page, and returns the result.

### Problem 6

Choosing the right AI model for image generation: Why cost/quality balance matters at scale

I recently built a system that uses AI to convert photos of damaged vehicles into realistic "pre-accident" repaired versions — perfect for insurance, repair estimates, or customer visuals.

While experimenting, I ran into some small issues with OpenAI's image generation:
The documentation listed gpt-image-1-mini as available, but it wasn't in practice.
Quality options felt binary (low or high) with little in between.
Actual costs were significantly higher than the pricing page suggested — for just 7 images, I was charged ~46p when I expected around 15p.
At a small scale, it seems minor, but when you're processing 150,000 images, even a few pence difference per image adds up to serious extra costs.

In contrast, switching to the xAI Grok Imagine API has been a much better experience. It's more flexible (better support for image-to-image editing and iterative refinement), offers clearer pricing, and is significantly cheaper to run at volume with the standard model at $0.02 per image.

### Problem 7

Getting sale information from csv file, converting it into correct data structure and saving it into database.

I have just realised that instead of scrapping data from the every lot for sale or even sale list I can download the csv file with all information required. This file is accessible on copart page.

- Problem is that this file is in csv format and need to be converted into json and then data structure need to be updated. Also make and model are not full. The urls for each lot have the make and model in it so I need to use ai or regex to sort it out.
- Another problem is the csv file is accessible after user login but it is already done. It took me around 2 days to set scraper flow to login (that was fairly easy) and to download the file. Process of downloading file was roadblock as the download button wasn't clicked and the download logic didn't work strait a way as expected. I'm glad that copart didn't ban me for countless test :)

I need the steps to follow.

1. Fetch sale list in csv format. (done)
2. Convert CSV into json. (done)
3. Convert key into camel case keys. At the moment key are with spacing. (done)

### Problem 8

The scraper works only locally as deployed to vercel can access browser window there fore it can works in the same way as the local machine. I need to add update button or functionality which will update calendar automatically  on some event like buton click or user entry (That is potentially problematic solution as users can triggers to meny requests). I think adding a button will be best option to do.
