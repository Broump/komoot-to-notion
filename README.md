# komoot-to-notion
a simple script which sends tour data from komoot to your notion database

## Description:
I tried to accomplish a simple solution to get tour data from komoot in a database from Notion. The difficulty was to get the tour data from komoot because there is no public API. Thankfully i found a very good Article by Jakob S. on how to achieve this goal using the existing API URL, sessions and cookies. Here is the [link](https://python.plainenglish.io/get-komoot-tour-data-without-api-143df64e51fa).
The easy part was it to get right data out of the large JSON file and bring those data using the Notion API in my database.

I hope that I could help you with this python script, and feel free to use it for your own.

## How to set up:

1. Sign up in your notion account in your browser
2. Go to [My integrations](https://www.notion.so/my-integrations) and create a new integration
3. Copy the Internal Integration Token to the script
4. Head over to the notion database which you want to add items to and copy the databaseID to the script: it should look like: ```notion.so/{databaseID}?v=05ec34ed86cf48909d9e38f2e75af478```
5. Share your database to the integration
6. Enter your Komoot Email, Password and clientID: ```komoot.com/user/{clientID}```
7. Now run the script and after a few seconds your notion database should have your tour data

### Note: you can customize the script so that you get the data you are looking for
