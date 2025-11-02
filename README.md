# RnDSaaS
General information about the project:
- This is the repository for a fitness SaaS application for students with social anxiety

How to run the (frontend of the) project locally:
- make sure node.js is installed (at least v18)
- open the frontend folder in your command prompt and run the following commands:
```cmd
npm install
npm run dev
```
- to test layout on a phone before deploying:
```cmd
npm run dev -- --host
```
- then browse to one of the ip addresses displayed, assuming phone and computer are on the same network
  
Component library:
- Component library documentation: https://ui.shadcn.com
- To add ui elements (for example Card)
  ```cmd
  npx shadcn@latest add card
  ```
  
How to contribute to the project:
- The main branch should always be deployable, use new branches for new features
- Always use develop branch to preview deployment on Vercel before pushing to main branch
