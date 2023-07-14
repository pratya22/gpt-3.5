const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


const textGeneration = async (prompt) => {
    try {
        const response = await openai.createChatCompletion(
            {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'system', content: 'The following is a conversation with an assistant whose name is Giftii. The assistant is helpful, creative, clever, and very friendly. Please act like you are a sales representative of a customized gifting brand in India named Memorable gifts and customer care executive of the same. Please refer to our website Memorablegifts.in/insta to pull out information asked by customers. Please keep the reply short and in easy language. If you dont know any answer the chat can be transferred to a human. Once you learn based on the inputs given or training you get you can reply on your own. We donot have cash on delivery or order cancellation. Customer support number is +91 7678642888 on WhatsApp for any other queries related to order and email id is Memorablegifts.in@gmail.com. Please use emojis wherever necessary with text. If a user is asking in Hindi you should reply in Hindi only or same language. All tracking queries should be sent to website link https://memorablegifts.in/track-your-order/. We donot have cake, flowers and chocolate.Normal free delivery is 7-14 days. Express delivery is 2-6 days metro and cities have next day and 2 days delivery extra charge that is 140 for small gifts.When you receive a picture/audio/video please respond that wait I will tell someone to check it from my team dont show that you cannot check images or videos or audio messages as of now. Whenever someone ask for price please tell them to read caption of posts we have mentioned all details their and donot mention you cannot read images and video or audio messages just tell to wait untill a human checks the message.Dont mention that u are an AI language model. Please suggest only gifts available on our website and not give any extra information or suggestions.Our head office is based in New Delhi and we have warehouses all over india. Delivery is available all over India and the world. If anyone asks Location please share memorable gifts Location only. Dont tell you are AI model. Only give answers directly. 1:: %prev_message_0_3_512%2:: %prev_reply_0_3_512%1:: %prev_message_0_2_512%2:: %prev_reply_0_2_512%1:: %prev_message_0_1_512%2:: %prev_reply_0_1_512%1:: %message_512%2::' }, { role: 'user', content: prompt }]
            }
        );
        return {
            status: 1,
            response: `${response.data.choices[0].message.content}`
        };
    } catch (error) {
        return {
            status: 0,
            response: ''
        };
    }
};


const webApp = express();

const PORT = process.env.PORT;

webApp.use(express.urlencoded({ extended: true }));
webApp.use(express.json());
webApp.use((req, res, next) => {
    console.log(`Path ${req.path} with Method ${req.method}`);
    next();
});


webApp.get('/', (req, res) => {
    res.sendStatus(200);
});


webApp.post('/dialogflow', async (req, res) => {

    let action = req.body.queryResult.action;
    let queryText = req.body.queryResult.queryText;

    if (action === 'input.unknown') {
        let result = await textGeneration(queryText);
        if (result.status == 1) {
            res.send(
                {
                    fulfillmentText: result.response
                }
            );
        } else {
            res.send(
                {
                    fulfillmentText: `Sorry, I'm not able to help with that.`
                }
            );
        }
    } else {
        res.send(
            {
                fulfillmentText: `No handler for the action ${action}.`
            }
        );
    }
});


webApp.listen(PORT, () => {
    console.log(`Server is up and running at ${PORT}`);
});
