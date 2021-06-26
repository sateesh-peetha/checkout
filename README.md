# checkout
AWS Server less checkout system to implement solution for below problem.
### Tech Stack
 AWS lambda, API gateway, and DynamoDB.

# Problem Statement

To build a listings ads checkout system. 
We want to offer different products to property developers:
#### (i) Standard Ad : Offers the most basic level of advertisement
#### (ii) Featured Ad : Allows advertisers to use a company logo and use a longer presentation text
#### (iii) Premium Ad : Same benefits as Featured Ad, but also puts the advertisement at the top of

the results, allowing higher visibility
Each of the product is billed as follows:
#### ID Name Price
Standard Ad 269.99 RM
Featured Ad 322.99 RM
Premium Ad 394.99 RM

We established a number of special pricing rules for a small number of privileged customers:
#### (i) UEM Sunrise
- Gets a “3 for 2” deal on Standard Ads
#### (ii) Sime Darby Property Bhd.
- Gets a discount on Featured Ads where the price drops to 299.99 RM per ad
#### (iii) IGB Berhad
- Gets a discount on Premium Ads where 4 or more are purchased. The price drops to
379.99 RM per ad
#### (iv) Mah Sing Group
- Gets a “5 for 4” deal on Standard Ads
- Gets a discount on Featured Ads where the price drops to 309.99 RM per ad - Gets
a discount on Premium Ads

# DB Model illustration just for checkout
![checkout](https://github.com/sateesh-peetha/checkout/blob/main/checkout%20db%20example%20illustration.PNG?raw=true)

# Running locally
### prerequisite ( below list of softwares are needed to run locally )
 * AWS SAM CLI - [Install the AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html).
 * Node.js - [Install Node.js 14](https://nodejs.org/en/), including the npm package management tool.
 * Docker - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community).
#### To start api server: run below command in powershell
* sam local start-api --debug -l logs.txt

#### Just invoke lambda function with different request:

* sam local invoke checkout --event events/customer1.json
* sam local invoke checkout --event events/uem-sunrise.json

#### To deploy to aws servers:  
sam deploy -g

#### Just to test plain javascript using node
* run the file node src/test.js

 
