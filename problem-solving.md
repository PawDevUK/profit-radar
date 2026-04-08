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

Database need to be connected and lot schema with moodel needs to be created with all data. Current lot type needs to be used to created schema.

### Problem 3

As the user might want to see visiulised repared car I need to implement AI API to automaticaly generate repaired image of the lot. There is few option to choose from but currenty the cheapest option is needed with medium quality. To mach these requirments, GPT Image 1 Mini (Low) tier. At roughly £5.00 for 1,000 images is the best option. Integration of this model is fairly strait forward.

In order to disply the visualy repaired images best bay is to stack them on top of eachother and use slider to revile the changes.
