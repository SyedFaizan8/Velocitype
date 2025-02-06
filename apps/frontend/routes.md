- {{server}} = https://localhost:8000/api

# check username

GET {{server}}/check-username?username=kidahr;

```bash
{
    "statusCode":200,
    "data":{
    "available":false
    },
    "message":"Username availability check successful",
    "success":true
}
```

# register user

POST {{server}}/register/

```bash
#input
{
    "fullname": "John Doe",
    "username": "johndoe123",
    "email": "johndoe@example.com",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123"
}

#output
{
    "statusCode":200,
    "data":{
        "user_id":1,
        "fullname":"John Doe",
        "username":"johndoe123",
        "email":"johndoe@example.com",
        "bio":null,
        "twitter":null,
        "instagram":null,
        "website":null,
        "created_at":"2025-02-06T20:02:57.612Z"
    },
    "message":"User registered Successfully",
    "success":true
}
```

# login user

POST {{server}}/login

```bash
#input
{
  "email": "johndoe@example.com",
  "password": "SecurePass123"
}

#output
{
    "statusCode":200,
    "data":{
        "user":{
            "user_id":1,
            "fullname":"John Doe",
            "username":"johndoe123",
            "email":"johndoe@example.com",
            "bio":null,
            "twitter":null,
            "instagram":null,
            "website":null,
            "created_at":"2025-02-06T20:02:57.612Z"
            },
        "accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTczODg3NDc3MSwiZXhwIjoxNzM4OTYxMTcxfQ.IRa5Pvad82psYSRGie2yEu5R0Hei2akLYO3p4WHhE9c",
        "refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTczODg3NDc3MSwiZXhwIjoxNzM5NzM4NzcxfQ.VqeUh5Fu-hnde58p1Di8k94o4iDos1pOc7uSfLqMn-w"
    },
    "message":"User logged in successfully",
    "success":true
}
```

# logout user
