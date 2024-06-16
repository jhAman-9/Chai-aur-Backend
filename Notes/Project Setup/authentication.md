# Authentication

## 1) StateFull - (Session, Cookies)

- Session Id 1 ---- > [user1,email1,name1, pass1]

- Session Id 2 ---- > [user2,email2,name2, pass2]

- Session Id 3 ---- > [user3,email3,name3, pass3]

#### we can store these data in server or in Redis
#### used in banking website where short term authentication need

### Distadvantage :
-  less Scalabel

- if server restart the all user session resert or lost

### ServerLess :
- advantange price effective

- Don't have state


## 2) StateLess (JWT tokens)

- User giver [username,pass] to server and then server rcheck to DB.
if user Exist then generate a token having [id, name, email, roll] and sign to the secret key which is only known by Server and token return the user 

- Next time when user want the data from the server he just req data with token


### Advantage :
- No memory used
- fit with ServerLess architecture
- long long authentication

### Disadvantage :
- token less secure
- hard to validate ( need track of token )
