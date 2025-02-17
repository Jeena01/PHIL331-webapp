## Deployment Guide

Assuming you  have Node.js Angular etc etc downloaded.

```
cd app
```


Build the app for deployment

```
ng build --configuration=production --base-href "/PHIL331-webapp/"
```

Deploy to gh-pages

```
npx angular-cli-ghpages --dir=dist/app/browser
```

## WARNING

Please don't touch gh-pages branch, that's where the files that are deployed are. Develop on you own branch and deploy to gh-pages branch.
