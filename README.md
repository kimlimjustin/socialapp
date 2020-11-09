# socialapp

#### Warning: although this project has some basics security such as hashed user password and others, this project is NOT secure enough in production. (Contribute to this project by making a pull request will be appreciated)

![Socialapp demo](https://drive.google.com/uc?export=view&id=1FHvzmU4P6MFYquD2zoevnJbvR3v0l4Bv)

How to run:
- Clone this repository or fork it.
  `git clone https://github.com/kimlimjustin/socialapp.git` or `git clone https://github.com/<your username>/socialapp.git`
 
- Inside `server` directory, create a new file called `.env` which stores your ATLAS_URI information
  Example: `ATLAS_URI =mongodb+srv://admin:<password>@cluster0.8aezk.gcp.mongodb.net/socialapp?retryWrites=true&w=majority`

- Inside `client` directory, create a new file called `.env` which stores your server url information inside `REACT_APP_BACKEND_URL` variable
  Example: `REACT_APP_BACKEND_URL = http://localhost:5000`

- install all dependencies.
  - Client side:
    on the `client` directory type `npm install`
  - Server side:
    on the `server` directory type `npm install`
    
- Run it on node js:
  - Client side:
    on the `client` directory type `npm start`
  - Server side:
    on the `server` directory type `npm start`
