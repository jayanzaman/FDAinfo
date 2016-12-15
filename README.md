# OpenFDA

OpenFDA is an API that serves public FDA data about things like drugs, devices, and foods. For this project, I have used it to find out certain information about drugs of interest. Along with finding out information about a particular drug, a user can also save all of their prescriptions in a database. 

##Scope of the Project
There were several things that I wanted to accomplish with this projects. While each component of the website showcases a special skill that I deployed, they do all work together.

###Log In
The website can be used even without logging in. However, user does have to sign in to save their list of prescriptions to the databage. 

* In order to log in, user must sign up first

    * During sign up, I ask them to provide their name, email address and a password
    * I encrypt the password using bcryptjs before saving the hash on to my table of users in the database
    * When logging in, user's email and hashed password are being checked against the database to make sure the user exists
    * A session is created for user once they log in. They can travel between different pages of the websites within the same session. 

###CRUD App
The projects has all four components of a CRUD app

* Create
In the dashboard section of the website, user can add new prescriptions. 

* Read 
All of user's prescriptions are presented to the dashboard.

* Update
User can update their prescription

* Delete
User can delete their prescription

###Ajax calls
both logged in and non-logged in user can serach for specific drugs 

* In the Drug Info tab, only certain information about a particular drug is shown
* In the Professionals tab, all relevant information about a particular drug is shown

https://fdainfo.herokuapp.com/
