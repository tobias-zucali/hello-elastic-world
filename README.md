# Hello elastic world
A boilerplate for a scalable web app including the whole infrastructure, using docker-compose for local developement and aws elastic beanstalk to deploy for production.

## Feature list
* react web app
* node backend
    - hot reload in local dev environment
    - use `chrome://inspect/` to debug in local dev environment
* postgres db
    - dockerized for local dev environment
    - works out of the box with a aws rds postgres data tier set up in aws elastic beanstalk instance
* nginx proxy

## Pending features
* pubsub using postgres notification mechanism, redis & websockets
* some client side flux architecture using pubsub
* solid user management with single sign on

### Run local dev environment
``` bash
docker-compose up
```

### Setup production
* create amazon aws account (e.g. with free tier)
* create amazon IAM user
* Install and configure the AWS Command Line Interface http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html
* Install the Elastic Beanstalk Command Line Interface (EB CLI) https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html?icmpid=docs_elasticbeanstalk_console
``` bash
eb init
eb create CHOOSE_NAME
```

Setup postgres database 
### Deploy production
``` bash
git commit
eb deploy
```
