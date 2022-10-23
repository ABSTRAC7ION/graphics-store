# graphics-store

Ecommerce store that gives graphic designers a chance to make money online through selling there designs in form of posters or other products (still not incorperated).
![alt text](https://github.com/ABSTRAC7ION/graphics-store/blob/master/documentation/product-on-hover.png?raw=true)

- If you have any suggestions that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". Don't forget to give the project a star!
## How to contribute

**1.**  Fork [this](https://github.com/ABSTRAC7ION/graphics-store) repository.


**2.**  Clone your forked copy of the project.

```
git clone https://github.com/<your_username>/graphics-store.git
```

**3.** Navigate to the project directory :file_folder: .

```
cd graphics-store
```

**4.** Add a reference (remote) to the original repository.

```
git remote add upstream https://github.com/ABSTRAC7ION/graphics-store.git
```

**5.** Check the remotes for this repository.

```
git remote -v
```

**6.** Always take a pull from the upstream repository to your master branch to keep it at par with the main project (updated repository).

```
git pull upstream main
```

**7.** Create a new branch.

```
git checkout -b <your_branch_name>
```

**8.** Perfom your desired changes to the code base.

**9.** Track your changes ✔. 

```
git add . 
```

**10.** Commit your changes.

```
git commit -m "Relevant message"
```

**11.** Push the committed changes in your feature branch to your remote repo.

```
git push -u origin <your_branch_name>
```

**12.** To create a pull request, click on `Compare & pull requests`.

**13.** Add appropriate title and description to your pull request explaining your changes and efforts done.

**14.** Click on `Create pull request`.


**15.** Voilà! You have made a PR to Originals. Wait for your submission to be accepted and your PR to be merged.

## How to setup the project
1. npm run install
2. create an .env file and paste the following variables in it
### env variables
```
ALGOLIA_APP_ID=48MTIZMRSA
ALGOLIA_API_KEY=92a07b76cb350b688fd971c89ceda9b7
ALGOLIA_INDEX_NAME=search-engine
MONGO_DB="mongodb+srv://local-admin:EcX3VkqOgGtqfnPH@cluster0.qqxjj.mongodb.net/inventory-manager?retryWrites=true&w=majority"
SECRET="mysupersecret69"
PORT="4000"
```
3. npm run start
4. That's it!!

## Scripts
1. npm run start (start the project)
2. npm run lint (lint the project)
3. npm run prettier (run prettier)

