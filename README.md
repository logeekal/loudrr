1. [About Louder](#about-loudrr)
2. [Installng Louder](#installing-loudrr)
3. [FAQs](#faqs)
4. [Contributing to Loudrr](#contributing-to-loudrr)


## About Loudrr

Congratulations on reaching the documentation page of Loudrr. Since, you are here, we assume you know what Loudrr is and we will explain how you can use Loudrr in your own app. Honestly, there is not much to explain. IT IS PRETTY EASY.

Loudrr is currenly in alpha stage and hence, you will be one of the first users to use Loudrr and give direction to the product. Loudrr is a completely opensource application, which means three things :

1. You can raise issues your facing directly here.
2. You have a say in features this product will have.

3. You get a completely hosted solution and a very fast widget.

Currently, Loudrr is ONLY supported as React Component which can be used in your own website which is being developed in React. However, other plugins are coming soon. See the status of all the plugins below :

Status of Loudrr widgets availability: 


| Application       | Status     | 
|:------------- | :----------: | 
|  React |  Available  |
| Gatsby | In Progress |
| SquareSpace |  In Progress|
| Wordpress | In Progress |
| Shopify | In Progress |

----

## Installing Loudrr

Getting Started with Loudrr is pretty simple. All you need a domain key for a website in which you want to include Loudrr.

1.    Signup here to register your website and get a new domain key.
    Once you have the domain key. Simply install our React component using below command.
    With npm :

        ```bash
        npm i @loudrr-app/widget 
        ## OR
        yarn add @loudrr-app/widget
        ```


2. Now that you have all the required ingredients to embed Loudrr in your website. Include below commands to finally embed Loudrr in your code.
    ```javascript
        import Loudrr from '@loudrr-app/widget';

        const domainKey="123gads123-213sada" //a valid domainKey

        const Comments: FC<{}> = () => {
            return <Loudrr domainKey={domainKey}/>
        }

        export default Comments;
    ```
3.  Now this Comments component can be included anywhere in your app.
    That is it. We are done. Wasn't it simple. In case you face any issue. Don't forget us to Contact here. We will get back to you within a day. You can also find us on Twitter as @loudrr

## FAQs

- **When will Loudrr be available for other platform or as simple js bundle.**

- Our main emphasis is on quality and speed of the commenting widget so we will not rush the components for just the sake of it. But we do understand you needs and expect other platforms to be available in next 2 months. We will soon add a tracker were you will be able to see progress
----------------
- **Is Loudrr Free?**

- Yes, for a limited period of time Loudrr is absolutely free. After this free period ends. You will be limited to maximum of 2 domains per account with maximum of 100 comments per day combined for all the domains/websites. In case you did add more than 2 domains in your account during this free period, you will have those domains lifetime free even after this free period ends.

## Contributing to Loudrr
Contribution guide is in progress. You can vew the progress [here](app/CONTRIBUTION.md)
