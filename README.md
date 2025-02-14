# PHIL331-webapp

# WARNING DO NOT TOUCH GH-PAGES BRANCH!!! Leave it alone!!!

To build and deploy:
First time:

ng add angular-cli-ghpages


Build:
```
ng build --configuration production --base-href /phil-webapp/
```
Deploy:

```
npx angular-cli-ghpages --dir=dist/phil-webapp

```