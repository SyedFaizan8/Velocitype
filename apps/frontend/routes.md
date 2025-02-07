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

# Refresh token

POST {{server}}/refresh-token

require refresh token
no need of access token
no need of user_id

# logout user

POST {{server}}/logout
require refresh token, accesstoken and user_id

# result

POST {{server}}/result

```bash
#output
{
    "statusCode":200,
    "data":null,
    "message":"Result successfully recorded",
    "success":true
}
```

# profile

GET {{server}}/:username

```bash
{
    "statusCode":200,
    "data":{
        "user":{
            "fullname":"John Doe",
            "username":"hello",
            "created_at":"2025-02-07T17:11:34.610Z",
            "bio":null,
            "twitter":null,
            "instagram":null,
            "website":null,
            "stats":{
                "total_tests_taken":31,
                "total_letters_typed":14105,
                "total_words_typed":14012
            },
            "leaderboard":{
                "highest_wpm":129,
                "highest_accuracy":"92",
                "achieved_at":"2025-02-07T17:13:15.086Z"
            },
            "history":[
            {"wpm":129,"date":"2025-02-07T17:14:06.718Z"},
            {"wpm":129,"date":"2025-02-07T17:14:06.110Z"},
            {"wpm":129,"date":"2025-02-07T17:14:05.367Z"},
            {"wpm":129,"date":"2025-02-07T17:14:04.614Z"},
            {"wpm":129,"date":"2025-02-07T17:14:02.168Z"},
            {"wpm":129,"date":"2025-02-07T17:14:01.560Z"},
            {"wpm":129,"date":"2025-02-07T17:14:00.921Z"},
            {"wpm":129,"date":"2025-02-07T17:14:00.267Z"},
            {"wpm":129,"date":"2025-02-07T17:13:59.485Z"},
            {"wpm":129,"date":"2025-02-07T17:13:58.667Z"},
            {"wpm":129,"date":"2025-02-07T17:13:57.484Z"},
            {"wpm":129,"date":"2025-02-07T17:13:56.476Z"}
            ]
        },
        "userRank":1
    },
    "message":"Profile found successfull",
    "success":true
}
```

# leaderboard

GET //{{server}}/leaderboard

```bash
{
    "statusCode":200,
    "data":[
        {
            "user":
                { "username":"hello" },
                "highest_wpm":129,
                "highest_accuracy":"92",
                "achieved_at":"2025-02-07T17:13:15.086Z"
        }
    ],
    "message":"Leaderboard data found",
    "success":true
}
```
