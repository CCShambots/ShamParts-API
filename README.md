# ShamParts API

This is the backend for [ShamParts](https://github.com/CCShambots/sham_parts), the Part Lifecycle Management app developed by FRC 5907, the CC Shambots. It is designed to simplify product production workflow by enabling synchronization to an Onshape document. More details about the frontend app can be found at its GitHub Repository. Long story short, it is an app that runs on Mac, Windows, iOS, and Android with a configurable permission system to enable you to effectively manage which users are allowed to do what in which projects

# Introduction
To use ShamParts API for yourself, you will need four critical components:
- An OnShape API key and Team ID
- A public and private Mailjet API key
- An email from which to send verification emails (any email account will do, gmail accounts are fine)
- A server to host your own instance of the API (suggestions for hosting below)

Each instance of the server operates by connecting to the main server instance (hosted by FRC 5907), which will assign it a server key. Then, your users will enter that key into their frontend apps, which will connect them to your instance of the server.

# Setup

## Server Hosting Options
There are many ways to host your own instance of the ShamParts API. Here are a few options:
- Host it yourself. If you or your team has a spare PC that they can port forward to the wider network, host ShamParts API there.
- Oracle Cloud Infrastructure - Oracle offers to host free (and quite powerful) servers free of charge to users, which is a good option for those who don't want to spend a lot on hosting a server. You can find setup details here.
- Other online server hosting platforms. Other host providers like DigitalOcean and AWS can also be used to host the server. Team 5907 uses Oracle Cloud and would therefore recommend that option when available, especially given its free nature.

### Server Setup
1. Install [node](https://nodejs.org/en) on your server. Make sure you use at least v20.0.0 or above to avoid issues with the `fetch` api that wasn't included in older node versions
2. Clone this repository to your server using the command `git clone https://github.com/CCShambots/ShamParts-API.git` (you can also download the zip file of the source code and add those files to your server manually)
3. Run `npm install` in the root directory of the repository to install all the necessary dependencies
4. Run `npm run setup` to create the `config.json` file based on the `defaultConfig.json` included in the project
5. There are several fields in the `config.json` file that you will need to fill out. Listed below are the settings you can use now. Other steps will show you how to set the remaining fields.
   1. `sender_email`: The email address from which verification emails will be sent; this needs to be an email you own, that you will connect to MailJet in future steps
   2. `ip_address`: The public IP address that you can access this server from. This will be registered with the central database hosted by Team 5907. It should include the port and "http". An example of this would be `"http://40.233.83.5:3000"
   3. `name`: The name of your server. This should include your FRC team number (or if you aren't an FRC team, your organization name) and the word "ShamParts". An example of this would be `"Team 5907 Production"`
   4. `server_key` and `server_token`: Leave these blank. The main server will fill these out when you first connect to the main server
   5. `leader_ip`: Leave this as is. This is the IP address of the main server, which will allow this server to connect.
   6. `admin_user`: The email address of the user that should automatically be created as an admin. This will allow you to gain admin access and distribute it to the correct users.
   7. `roles`: Make sure this includes the `"admin"` role. Otherwise, you may add any other roles you wish to have (good examples might be things like "5907 Member" or "5907 Captain"). You will assign these roles to various users and modify what roles have which permissions in your various projects.
   8. `part_types`: These should be common types of parts your team manufactures (i.e. "plate", "tube", "3d print", etc.). These should be categories that your various fabrication people will understand just by looking at them and know how to make those parts
   9. `machining operations`: These should be common operations that your team performs on parts (i.e. "cut", "drill", "tap", etc.). These should be operations that your various fabrication people will understand, such as "Rough Cut," "Final Length," etc.

### Onshape API Setup
You'll need an Onshape account and Onshape team ready to use the features of ShamParts
1. Go to the [Onshape Developer Portal](https://dev-portal.onshape.com)
2. Navigate to the `API keys` section to create a new API key. Make sure you give it permissions to read and write to your documents. Other permissions are not necessary (as far as we are aware, but if you have any issues, you may need to give additional permissions and generate a new key)
3. Copy the `Access Key` and `Secret Key`, as you will not be able to access them again
   1. You must generate a base-64 encoded string to use for the `config.json` file
      1. MacOS: `printf ACCESS_KEY:SECRET_KEY | base64`
      2. Windows: In powershell, run `[convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("ACCESS_KEY:SECRET_KEY"))`
   2. This should output a long base64 string. Copy that to the `onshape_auth_code` value in `config.json`
   3. Get your Onshape Team key by navigating to [Onshape](https://cad.onshpe.com), selecting `Teams` and navigating to the team you are setting up ShamParts for. The url will look something like this: `cad.onshape.com/documents/t/TEAM_ID`. Copy the `TEAM_ID` and paste it into the `onshape_team_id` value in `config.json`

### Mailjet Setup
Mailjet is the service ShamParts uses to send users emails about their accounts.
1. Create a mailjet account at [Mailjet](https://app.mailjet.com)
2. Create a sender address [here](https://app.mailjet.com/account/sender). This should be the same email address you used for the `sender_email` in `config.json`
   1. You should set the email as being used for "Website Emails"
3. Navigate to the API section of the app [Link here](https://app.mailjet.com/account/apikeys)
   1. When you first navigate to the API section, you should be shown an "API Key" and "Secret Key" as your `Primary API Key`. Copy these values into `mj_api_key_public` and `mj_api_key_private` in `config.json`

### Database Setup
The app uses a postgres database, so you'll need to install postgres on your system - [Link here](https://www.postgresql.org/download/). For linux servers that only have command line access, follow the instructions on [this page](https://www.devart.com/dbforge/postgresql/how-to-install-postgresql-on-linux/) to install Postgres there. By default, the app assumes the following information about the databse:
- port: `5432`
- username: `postgres`
- password: `5907`
- database: `postgres`

You can edit these values in `src/data-source.ts`, although we would recommend keeping them the same, as updating the database may be more difficult if you don't use those values (pulling from the git repository will be significantly harder)

You should now be able to run the server using `npm start` and connect to it from your browser. If you have any issues, please let us know by opening an issue on this repository.