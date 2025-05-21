# GatheringMIA

GatheringMia
[Click here to navigate to site](https://main.d3d9kolrqh2fvt.amplifyapp.com/)(intended to be viewed as a mobile web application)
A mobile web application that streamlines the process for volunteers that deliver meals from foodbanks to homebound individuals, providing orted list of recipients from any chosen foodbank. The application will given pickup and delivery instructions. Once Packages are picked up from food bank location the app will provide a list of all the dropoff locations of the recipients. The directions provided will be an optimal route to ensure the volunteer drives either the least amount of time or miles.

## Next.js Version

This application has been migrated from Create React App to Next.js. The application functionality remains the same, but now leverages the benefits of Next.js including improved performance, server-side rendering capabilities, and simplified routing.

### Running the Application

1. Install dependencies:
```
npm install
```

2. Create `.env.local` file with environment variables:
```
NEXT_PUBLIC_GOOGLE_API_KEY=your_google_api_key
```

3. Run the development server:
```
npm run dev
```

4. Build for production:
```
npm run build
```

5. Start production server:
```
npm start
```

## Project Backstory

This was a 2 week long project built during my fourth module at Brainstation Web Development Bootcamp. Project goals included using technologies learned up until this point and familiarizing myself with documentation for new features.

Originally I wanted to build an application that allowed users to find community gardens, get involved and plant and log fruit trees that were planted to create a crowdsourced database. After initial research I found a greater need to start with providing an application that would make a more streamlined process for volunteers that deliver meals from foodbanks to homebound individuals, and greatly increase the amount of individuals that may be reached. The design and initail layout was created in Figma, and I started this process by using the `create-react-app` boilerplate, then adding `react-router-5.3`.

## Project Status

TO-DO items include
Build the Backend
OAuth and user signup
Create a way to have the map provide directions within the apps map
Give user option between least amount of miles or driving duration for deliveries
Give user the option to change the order of deliveries
Ensure each delivery was dropped off
Once delivery was confirmed add delivery count to the recipient for the week.
Add tests using Cypress

#### Stage of Progress:

This project is currently in development.

## Installation and Setup Instructions

Clone down this repository. You will need `node` and `npm` installed globally on your machine.

Installation:

`npm install`

To Visit App:

View intented as a mobile web application

https://gathering-mia.live/

## Reflection

- It was an incredible experience having the opportunity to work on a project that I am so passionate about and to provide
  a solution that may have major impacts.
- The build captured more than I initially planned on and it was fun dreaming and designing as I continued to push for a more completed solution.
- Working with Google Maps api's within the react context was an interesting and new experience.
- Creating the algorithm for users distance was fun to work with and provided a challenge to ensure that I was providing optimal routes.
  Another challenge was creating a way to have the map provide directions within the apps map
- The technologies implemented in this project are React, React-Router-Dom 5.3, React-Google-Maps, Sass, JSX, Figma, and Github.

ChatGPT:

- # GatheringMIA: A Meal Delivery Assistance Mobile Web App

GatheringMIA is a [mobile web application](https://gathering-mia.live/) designed to assist volunteers in meal delivery efforts from foodbanks to homebound individuals. The application provides an assorted list of recipients from any chosen foodbank along with detailed pickup and delivery instructions. Once meals are collected from the food bank, the app presents an optimally routed list of all drop-off locations. The routing algorithm ensures minimal drive time or distance for volunteers.

## Project Context and Objectives

GatheringMIA originated during the fourth module of the Brainstation Web Development Bootcamp, where the primary goal was to apply the acquired skills while exploring new technologies. The initial concept revolved around a community garden locator and a crowdsourced fruit tree database. However, preliminary research revealed a more pressing need: optimizing the process for volunteers delivering meals from foodbanks. This motivated a shift in the project's direction towards developing GatheringMIA. The application's initial design and layout were created in Figma, with `create-react-app` serving as the project boilerplate and `react-router-5.3` for routing.

## Current Development Status

GatheringMIA is currently in development. Planned enhancements include:

- Backend development
- Implementing OAuth and user signup functionality
- Integrating in-app map directions
- Providing an option to choose the least time or distance-based routing for deliveries
- Allowing users to modify the order of deliveries
- Verifying each delivery drop-off
- Updating weekly delivery counts per recipient after each successful delivery
- Incorporating Cypress for testing

## Installation Guide

To setup GatheringMIA locally, ensure that `node` and `npm` are installed on your system. Clone the repository and execute `npm install` for the necessary dependencies.

To access the application, navigate to [GatheringMIA](https://gathering-mia.live/) (optimized for mobile web view).

## Retrospective

GatheringMIA has been an inspiring journey, providing an opportunity to develop a solution with significant potential societal impact. The project scope broadened as I continually added features, with the desire to create a more comprehensive solution. I thoroughly enjoyed the unique experience of integrating Google Maps APIs in a React context and creating the optimal routing algorithm. The key technologies implemented in this project include React, React-Router-Dom 5.3, React-Google-Maps, Sass, JSX, Figma, and GitHub.
